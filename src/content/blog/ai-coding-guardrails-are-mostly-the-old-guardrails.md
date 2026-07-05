---
title: AI coding guardrails are mostly the old guardrails
description: The tools are new and the pace is faster, but the safety controls that make agent-written code shippable are the same unglamorous ones backend teams rely on.
pubDate: 2026-03-26
original:
  venue: Photoroom blog
  url: https://www.photoroom.com/inside-photoroom/ai-coding-guardrails-are-mostly-the-old-guardrails
---

We are increasingly using an `implement-ticket` style workflow where an engineer gives the coding agent a ticket, lets it work through the implementation process, and then reviews the result. That is a simplification, but only a slight one. The code is realised in a high-scale system; roughly 2.5k requests per second, around 10TB of data, and roughly 200 million users. Sloppiness is expensive. Our team is small (5 engineers), and we ship multiple times a day. So safety matters.

We are still learning. This is simply a description of where we are, right now, on the Photoroom Backend team. In six months, we will most likely disagree with bits of it. That is fine. The guardrails are still real, even if the paint is still drying.

> Plus ça change, plus c'est la même chose.

The tools are new. The pace of development can be faster. The actual safety controls are, for the most part, the same unglamorous ones backend teams have relied on for years. We have not discovered a new law of physics. We have mostly rediscovered the old ones with an LLM-powered coding agent attached.

## 1. Automated checks before review

The first guardrail is still the least glamorous. We run pre-commit hooks and the full test suite on every commit (we use atomic commits) and PR. This is our primary defence because it is cheap, repeatable, and hard-coded. We have high unit test coverage, around 85% at the moment, and PRs need more than 80% coverage to pass. The local `.claude` material adds a more specific point. We ask Claude to use that other rediscovered method of Test Driven Development (TDD) and provide a reference file with our testing strategies. That file tells it to prefer end-to-end tests over isolated unit tests, extend existing tests where possible, hard-code URLs rather than using `reverse()` (the URL is part of the contract), and use `django_assert_num_queries` when query counts matter.

The `run-tests` skill tells the agent to run `pytest -n auto` on every commit in worktrees to isolate itself with its own `COMPOSE_PROJECT_NAME` and Docker override so multiple branches and multiple agents do not tread on one another.

Taken together, linting and tests do a lot of the early mechanical filtering. They are not enough on their own, but they are one of the main reasons this workflow is usable rather than merely exciting.

## 2. Migration safety checks

This is the most backend-shaped item on the list, and perhaps the least negotiable. Our migration reference opens with a rather useful reminder that some of our tables have billions of rows. At our scale, a migration mistake is not an abstract quality concern, and we take zero-downtime deployments seriously. The local rules are correspondingly strict. `AddIndex` is out. `AddIndexConcurrently` is in. Migrations using concurrent operations must be `atomic = False`. Foreign keys on existing tables need `NOT VALID` and then validated later. Direct `RemoveField` is blocked; only `SeparateDatabaseAndState` can be used for that. Data backfills do not belong in migrations at all. They belong in management commands with batching, `--dry-run`, and progress logging.

The general point is simple enough. An LLM can otherwise quite happily generate a migration that would lock a table and ruin your afternoon. We prefer not to skip that bit.

## 3. Datadog monitoring

We also have the ancient and honourable guardrail known as "watching production carefully". We rely on Datadog for an ever-expanding collection of real-time alerts, performance tracking, and error visibility. As the number of releases per day increases ever higher, babysitting deployments becomes ever more unfeasible, and hence the alerts ever more essential.

## 4. Multiple rounds of automated review

The `implement-ticket` workflow does not just ask the agent to write code and hope for the best. It bakes in review stages. There is a `review-plan` step before coding. There is a `review-senior-dev` step afterwards, which spawns parallel specialised reviewers for requirements, security, general code quality, queries, translations, tests, DRF conventions, and migrations when needed. Then there is `review-claude`, which runs two further rounds of external Claude review from a fresh context.

I rather like this because the tooling is modern, but the logic is not. It is basically defence in depth applied to software delivery. Use repeated scrutiny. Use different kinds of checks. Stay suspicious of first impressions.

There is, of course, a risk of false reassurance if one starts treating stackable model reviews as proof (and actually, everything here risks false reassurance). But they are not identical checks either. Each review stage uses a different model, a separate sub-agent with its own prompt, and a fresh context. That does not make them independent in the way two human reviewers with different expertise are, but it does reduce the likelihood of correlated blind spots. They are another layer of scepticism. Used that way, they are helpful.

## 5. Atomic commit verification before shipping

We also verify commits before opening a PR. This is another deeply unfashionable safeguard that turns out to be quite sensible. The `verify-commits` skill checks that commits are still atomic after review changes, that they build and pass tests independently, that the commit messages follow the expected format, and that there are no orphaned "fix review feedback" style commits left hanging about like evidence.

That matters because agent-assisted work can become messy in a distinctive way. It is very easy to accrete corrections and tidy-ups until a branch stops making narrative sense. Commit verification is one way of insisting that the branch still tells a coherent story.

## 6. Human pull request review

Human review remains essential. Final approval still comes from backend team members. There is still no substitute for a human reading the change and asking whether it makes sense in the context of the system, the ticket, the deployment model, and the assorted bits of tacit knowledge that never quite make it into a prompt. This is also the point at which one has to admit the obvious: human review is a bottleneck. We feel that as well. Like many teams, we are looking for ways to reduce the strain without lowering the standard. More on that another time.

## 7. Permission settings as a guardrail

This is one of the newer-looking guardrails, though really it is just access control in a sharper suit. We keep a local `.claude/settings.local.json` file that defines what the tool is allowed to do. At the moment, it is fairly permissive. It has dozens of allow rules, no deny rules, no `defaultMode`, and no hooks. That does not mean it is wrong. It does mean one ought to be honest about what sort of setup that is.

The interesting part is that the local workflow already treats permission hygiene as work. The `tidy-up` skill explicitly tells engineers to remove stale ticket-specific permission entries, collapse over-specific rules back into general patterns where appropriate, and remove anything containing secrets. That is exactly the sort of procedural, faintly tedious housekeeping that real guardrails tend to involve.

## 8. Reviewing inherited access

This is the sharpest point, and the one most likely to puncture airy theorising. Our workflows run on developer laptops. So whatever access the developer has through local tools, local credentials, GitHub, Docker, `kubectl`, or MCP integrations is part of the practical trust boundary.

And the MCP surface is not imaginary. The local settings file includes access to things like Notion, Linear, Datadog, and Figma, alongside a broad set of shell capabilities. Again, that may be entirely justified for the work at hand. The point is simply that this is where the real safety conversation has to happen, in the grubby details of what the tool can actually reach from a real machine on a real Tuesday.

This, more than anything else, is why I am reluctant to speak as if we have solved the problem. We have a workflow. We have guardrails. The obvious next steps are tightening the defaults: introducing deny rules, narrowing MCP scopes per task rather than per developer, and moving toward least-privilege agent configurations that grant access to what a specific ticket requires and nothing more. We also plainly have more work to do here.

## 9. Basic secrets hygiene

This should not need saying, but it does. The security review prompt explicitly checks for hardcoded secrets, tokens, passwords, and sensitive settings committed instead of coming from the environment. Good. It should.

There is nothing terribly futuristic about this. Do not commit production passwords. Do not leave secrets lounging about in env files and scripts. An LLM-powered coding agent will heighten the risk and scale of secrets leaking.

## 10. Not making the change

One guardrail we do not talk about enough is restraint. Sometimes the safest change is a smaller one. Sometimes the safest outcome is no change at all. This sounds banal because it is banal. It is also true.

Today, there is ever-greater emphasis on the backend team approving all tickets and approaches before they reach a PR. Human PR reviews are expensive, and we want to ensure the WHY behind a PR is clear and justified.

No one has yet managed to turn "we wisely left it alone" into a thrilling keynote line. That is a pity, because it is often one of the better engineering decisions available.

## So what is actually new?

What is new is not that guardrails suddenly exist. It is that the set of things requiring guardrails has widened. Tool permissions, MCP access, local workstation reach, agent configuration, and instruction layers all now belong in the same conversation as tests, review, and production monitoring.

That is the real adjustment. We are not replacing the old controls. We are extending them into places they did not previously need to reach.

## Where we are, right now

So the honest version is this. Our safety guardrails are mostly traditional. That is a feature, not a failing. We trust linting, tests, migration discipline, monitoring, review, permissions, and basic secret hygiene because those things have earned the right to be trusted more than sweeping claims about autonomous software engineering.

We are also still learning. Some of this feels sturdy. Some of it still feels slightly improvised, in the way many real engineering workflows do when they are solving today's problem with tomorrow's vocabulary. But better an honest guard rail with visible scuffs than a glossy theory with no brakes attached.

The tools are new enough to attract fresh jargon and fresh anxiety. The actual safety work still looks suspiciously familiar. That may be a little deflating. It also happens to be where we are.
