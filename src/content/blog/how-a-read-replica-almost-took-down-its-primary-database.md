---
title: How a read replica almost took down its primary database and other database tales
description: Six lessons from running PostgreSQL at scale, from a lagging replica threatening its primary to safer migrations, connection pools, and automated checks.
pubDate: 2026-10-26
---

I keep thinking we have finally covered all the ways we can get into trouble with our database. But then something completely unexpected goes wrong, and I learn about another way a database can surprise us.

At Photoroom, our backend handles roughly 2,500 requests per second, with around 10 TB of data. We run zero-downtime deployments and have availability SLOs of four or five nines, depending on the service. Yet some of our most surprising database problems have started with an ordinary change meeting a production condition we had not accounted for.

We now deploy hundreds of times a week, often with code written by agents and no human reviewing the change. We need systems that catch the mistakes we already understand, and enough visibility to recognise the ones we don’t. Here are six lessons that have helped us do that.

## 1. Batch and throttle backfills

During a large backfill, a lagging read replica threatened the primary database's disk capacity. The replica served only a few BI and ETL connections, but the backfill generated changes faster than it could apply them. To let the replica catch up, PostgreSQL retained the write-ahead logs (WAL) on the primary, where they grew from around 5 GB to 31.7 TB. Replica lag was increasing by roughly 0.7 days each day, so waiting was not going to fix it.

Ok, but how did this risk production? Well, as we looked into it, we saw automatic storage growth had taken provisioned disk to around 43 TB. Previously we’d never worried about disk space because Google automatically expanded it to our needs. And we had always fought hard to keep the amount of data we stored small. Now we were rushing towards a hard 60 TB limit. At the observed growth rate, the team estimated we had five to seven days before exhausting it, while the backfill was expected to run for several more weeks. We paused the transformation and enlarged the replica; WAL began draining and the database subsequently returned to normal. Phew!

Removing retained WAL reduced used space, but did not shrink the provisioned disk we were paying for. We were left using roughly 13 TB on a 43 TB disk, with the excess estimated to cost nearly $6,000 a month. Solving that did involve downtime sadly.

We also set a limit on the WAL retained by replication slots using [`max_slot_wal_keep_size`](https://www.postgresql.org/docs/current/runtime-config-replication.html). PostgreSQL applies this limit at checkpoints, so it is not an instantaneous ceiling on disk use. If it removes WAL that the replica still needs, the replica may be unable to catch up and need rebuilding. That trade-off requires knowing who depends on the replica, and what rebuilding it would involve.

[DoorDash describe checking replica lag between batches](https://careersatdoordash.com/blog/hot-swapping-production-data-tables/). Our own guidance now includes watching retained WAL alongside lag, limiting total concurrency, and making progress restartable. Small batches help, but the job also needs bounded transactions, safe retries, and a way to pause it without losing its place. The primary could process the writes, but the replica could not keep up: a backfill needs to be safe for the whole replication path, not just the database receiving its writes.

## 2. Set short lock timeouts and retry

One sunny Thursday lunchtime in Paris, we began a migration that introduced a new table. Sounds safe? Minutes later, alarms are going off. What gives?

It turned out that our new table had a foreign key to one of our busiest tables (yes, yes, foreign keys bad). During the migration, an anti-wraparound autovacuum started and held a lock the foreign-key operation needed. What lock on a new table, I hear you ask? The foreign key also needed a lock on the existing table it referenced. PostgreSQL normally interrupts an autovacuum when a conflicting lock is requested, but not when it is preventing transaction-ID wraparound. Our migration waited behind it, and writes then queued behind the migration's lock request. As requests backed up, the database ran out of connections. Even rolling back the application failed because the replacement processes could not connect. We eventually shut down the application pods to free connections, but the migration never completed.

Adding a foreign key takes a `SHARE ROW EXCLUSIVE` lock on both tables, which conflicts with writes; many other forms of `ALTER TABLE` need `ACCESS EXCLUSIVE`, which blocks even reads. While the migration waits for its lock, new queries queue behind it, so it can block production before changing anything. Doctolib explains this well in their [article on PostgreSQL migration locks](https://medium.com/doctolib/stop-worrying-about-postgresql-locks-in-your-rails-migrations-3426027e9cc9).

A Django migration can also conceal several operations behind what looks like a simple change. Django normally creates an index for a foreign key, and adding a constraint can involve validating existing rows. On a large table, these operations need care. Building an index without `CONCURRENTLY` can block writes until it finishes, while adding a foreign key can require a lengthy validation step. Our linter (more on that below) flags these patterns, though it cannot stop an anti-wraparound autovacuum from blocking a migration.

Our guidance for DDL on the busiest tables is now a sub-second lock timeout, roughly 250 ms to one second, with bounded retries, backoff, and jitter. The transaction must finish promptly once the lock is acquired, too. We want a migration to give up and let traffic through when it cannot find a safe window, with a clear stopping point if repeated attempts fail.

Also, don’t make a mistake I’ve made: `lock_timeout` bounds waiting, not how long an acquired lock is held!

## 3. Deploy schema changes in compatible stages

It is basic enough knowledge that one should stop using a column before dropping it. But an ORM can confuse even a good dev: with SQLAlchemy and Alembic, removing a field from the model leaves the column in place until you choose to drop it. Django is a bit different.

We dropped a column in Django that the features no longer referenced, only to find that the running application’s ORM still included it in queries. Every endpoint requiring that model started failing. It wasn’t until the deployment had fully completed that things settled down. A rollback certainly couldn’t have helped.

During a rolling deployment, old and new versions coexist, workers may roll out separately, and jobs started earlier may still be running. Removing a column therefore starts with deploying code that no longer refers to it, including through the ORM. In Django, [`SeparateDatabaseAndState`](https://docs.djangoproject.com/en/5.2/ref/migration-operations/#separatedatabaseandstate) lets us use a state-only `RemoveField`: the new ORM stops selecting the column, but the physical column remains available to older processes. We can drop it in a later migration, once no running version still expects it.

For larger changes, we add the new structure, migrate data while accounting for concurrent writes, switch readers and writers, and finally remove the old structure. Each stage needs a clear compatibility condition.

## 4. Budget connections for the transition, not the steady state

One autumn afternoon, we enabled driver-level connection pooling. Within a minute, requests were failing. We initiated a rollback, but traffic began recovering before it took effect. When the old version returned, things got worse again.

Load tests later showed why. During the switch, the pooler kept the old configuration’s idle server connections open for ten minutes while the new configuration opened its own. Connections peaked about 40% above where they eventually settled. We had sized the pool for its final state, but the outage happened during the transition.

Now we estimate peak demand as live processes × pool size, including background workers and rollout surge, plus old connections that haven’t drained yet. That estimate is client demand on the pooler; the pooler’s connections to PostgreSQL have their own budget. Connection creation rate matters too, because opening hundreds of connections at once can bottleneck before either limit is reached.

Autoscaling can make this worse. In one case, a migration’s lock slowed requests, autoscaling added pods, and each new pod opened more connections. That pushed an already struggling database to its connection limit. Adding application capacity made the database problem worse.

So pooling changes get staged rollouts and load tests that include cold starts, autoscaling, and enough time for the old configuration to drain.

## 5. Check query plans against realistic data

Late one showery morning in April, a subscription-query rewrite sent database CPU to 100%. We were checking subscriptions either against a user's identifier directly or through an alias, combining the two with an `OR` and an `IN (SELECT ...)` subquery. Against millions of subscriptions, PostgreSQL chose to scan the entire table. Each lookup consumed about 1.3 seconds of CPU even with warm buffers. At roughly twenty entitlement checks per second, that demanded about twenty-six CPU-seconds of work every second, before accounting for the rest of the application. All this in a service with a normal p95 response time of around 100 ms.

Tests passed against a near-empty database, where scanning a handful of rows is cheap. We also test query counts, and these looked reasonable. But these entitlement checks ran on authenticated requests and were invoked repeatedly by background tasks. We underestimated both the cost of each query and the number of calls generated by requests and background tasks. A plan checked with `EXPLAIN` against representative data could have exposed the scan before deployment. Counting queries on a tiny test database didn't tell us what those queries would cost in production.

Reverting restored service. The replacement being reviewed at the time resolved aliases separately, then looked up subscriptions using a simple predicate supported by an existing index. Plan checks against production data put those individual lookups at around a millisecond or less. That result was specific to our query and dataset; an `OR` does not imply a full-table scan in every PostgreSQL query.

For consequential changes, I want the generated SQL, a plan against representative data, and an understanding of how often a whole request or task invokes it. [GoCardless’s planner investigation](https://gocardless.com/blog/debugging-the-postgres-query-planner) is useful reading on how ordering and data distribution can make an ordinary-looking query expensive. How do you identify consequential changes? We're now exploring running `EXPLAIN` on all new database queries as part of CI, although we haven't implemented this yet.

## 6. Turn lessons into automated controls

After enough database surprises, we wanted to stop relying on engineers (and agents) remembering every rule. Some mistakes are predictable: building an index without `CONCURRENTLY`, removing a field too early, or putting incompatible changes in the same deployment. We built our [zero-downtime-migrations](https://github.com/Photoroom/zero-downtime-migrations) linter to catch these patterns with cheap, fast, deterministic checks before the code reaches production. It cannot guarantee that every migration is safe, but it can stop us repeating mistakes we already know how to recognise.

For the problems that only show up when the system is running, we rely on our Datadog dashboards and alerts. We watch query timings, PgBouncer queues, vacuum, replica lag, retained WAL, and disk growth. During the subscription-query regression, connections started queuing before database CPU hit 100%, which is why looking only at query latency can miss the real problem. And alerts need testing too: we once found monitors sending notifications to a channel that no longer existed. And do check that the fixes have actually made it into production. I am too embarrassed to explain why I need to add that particular piece of advice.

We've also learnt to audit timeouts across the whole system, not one setting at a time. PostgreSQL, PgBouncer, the applications, and individual API endpoints all have their own limits, and one layer may override or outlast another. And during a rollout, the schema, connection budgets and timeouts all have to work for the old and new versions at once.

This is consistent with what I argued in my [post about PR reviews](/blog/what-are-pr-reviews-good-for-anyway/): recurring, mechanically detectable mistakes belong in automated checks.

And there is a payoff to all this: these safeguards are what let us deploy hundreds of times a week, often with agent-written code and no human review.
