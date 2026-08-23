---
title: What are PR reviews good for anyway?
description: PR review should focus on risks humans are best placed to judge, supported by automated checks and clear code ownership.
pubDate: 2026-08-18
---

A single engineer can now reliably ship well-scoped features in days that once took weeks. We run a high-volume application used by millions of subscribers to five 9s availability standards, which makes reliable controls and a sustainable review process especially important. But humans don’t read code as fast as the AI produces it. It’s hard work and talented engineers cannot spend all day reviewing them; that creates approval fatigue. Human scrutiny is a scarce resource. Applying it indiscriminately to every PR can make the system less safe, not more: attention gets diluted across routine changes instead of being concentrated on the changes where judgement matters most.

Some people argue that the answer is simply to slow down. Sometimes that may be right. But it misses a more useful question: what purpose does PR review serve, and which controls serve each purpose best?

We have already reduced the requirement that every PR receive human review. So far, we have seen no degradation in availability or latency and no increase in incidents, while time from idea to deployment has fallen substantially. This is an empirical question, not merely a philosophical one. I try to answer it from a Photoroom Backend perspective.

## Stop bad things breaking production

The obvious role of PR review is to catch bugs and logical errors before production. When we looked at our own data, however, the number of actual bugs caught in review was small. We are a team of senior developers. Obvious mistakes rarely make it into a PR, and many of those that do can be detected more reliably by automated checks.

By automated checks, I mean the collection of deterministic controls that gave us confidence before LLMs: formatting, type checking, static analysis, tests (go crazy and use mutation testing), CI policies, and specialised validations. These are different tools with different limits. A linter will not prove an API contract or a business rule correct. But a well-built suite of automated checks can catch a large and predictable class of failures before a human sees the change.

We have invested heavily in that suite. I am particularly pleased with one that checks database migrations follow our zero-downtime migration rules. If a repeatable failure can be caught by an automated check, it should be caught there, not by a human at 4pm on a Thursday.

LLMs can now cover some of the remaining gap. They can inspect a wider change, search for related code, compare an implementation with stated acceptance criteria, and flag patterns that are awkward to express as a deterministic rule. They do not cover all of it. A race condition, an implicit state invariant, or a change that is locally correct but incompatible with another service may still require deep context and careful human judgement.

LLMs are not perfect, but the question is not whether automation is perfect. It is whether the remaining gap between automated checks and human review justifies a mandatory review for this change. Each organisation will have its own comfort level, but it should be able to describe that gap and explain why more automation cannot close it further.

It should also go without saying that you need to have well-configured observability, so that when things do go wrong, you find out fast.

## Knowledge sharing is not best done in PR review

It matters that more than one person understands important code. If the author wins the lottery, goes on holiday, or leaves the company, the team should not be stranded.

PR review is one way to share knowledge, but it is a poor default mechanism. It happens after implementation, without all the original context, and usually shares knowledge with only one reviewer. We invest in better mechanisms: documentation, weekly demos, and bringing decisions to the team when they affect others. This works for us because the team is small enough to make it manageable.

PR reviews still contribute to knowledge sharing, but that is not enough on its own to justify reviewing every individual PR.

## Alternative implementations and codebase degradation

I have learned a great deal through review. Reviews are especially valuable for junior developers, both as contributors and as reviewers, because they expose different ways to solve a problem and explain local conventions. However, if LLMs generate much of the code, the relevant guidance needs to live in the agent's instructions, tools, examples, and checks. Coding skills may atrophy, while different skills become more important: specifying intent, designing guardrails, and recognising when the system is outside its competence.

Many architectural standards can be enforced automatically; for instance, we use Import Linter and heavy use of Ruff rules like TID251. Earlier this year, we saw LLMs introduce patterns we did not want, such as unnecessary private-method chains and a RequestFactory where Django REST Framework's APIClient was appropriate. Those patterns can become normalised as they proliferate. Improving our checks and guidance has greatly reduced them.

The claim that refactoring is cheaper applies to code degradation, not to bugs. AI may reduce the mechanical cost of restructuring code, but it does not make a risky migration, a breaking API change, or an incorrect business decision cheap. Those need their own controls.

If you like stats, from a Cyclomatic complexity standpoint, the hardest 5% of functions added to our main Django backend were indistinguishable from code written previous to our changes in review policies. Better yet, an LLM-enabled refactor replaced around 690 functions averaging 3.5 branches with 650 averaging 2.6, cutting the share above 10 in that code from 4.9% to 1.2%.

Removing mandatory review might still open gaps in architecture and code-quality guardrails, but it does not mean that humans should never read the code. Owners should inspect code, identify emerging patterns, and improve the system when the checks are insufficient. That work does not require a review gate on every individual PR, because whatever those gaps are, for us at least, at this point they are theoretical.

## Code ownership requires awareness

This is my second-largest concern. Developers can become protective of the parts of the codebase they own. I think that is healthy. Ownership should remain human, engineers should move left.

Every important area needs one or more code owners, who should know enough about an area to explain its purpose, architecture, trade-offs, dependencies, failure modes, operational risks, and sensitive boundaries. This is accountability for the health of an area, not permanent approval of every diff. They should be able to communicate the decisions and trade-offs to others, protect its quality, spot problems proactively, and respond quickly when something goes wrong.

A code owner must know what other people are changing in their area. Therefore, if someone who is not an owner changes that code, an owner should review the PR. The review is not merely a bug-catching ceremony: it is how the owner maintains awareness, assesses the trade-offs, and remains accountable.

The case is different when an owner directly prompts an agent to make the change. They already know the intended change, because they initiated it. Requiring them to approve their own PR does not create a second source of understanding. It does not, however, answer the harder question: did the agent do what the owner intended?

> ⚠️ It is not an excuse to say, “an agent wrote it”. Ownership of the outcome remains with the human who asked for the change.

## Did the LLM do what it was supposed to?

This is my largest concern, and I do not have a reliable answer yet.

I have seen organisations where bugs became so prevalent that business processes formed around them. Fixing the bug then breaks the process. If an LLM makes an unintended decision and nobody notices, we may create a future problem that is much harder to recognise and undo.

Clear intent helps. Time spent understanding the problem, why it matters, and what acceptance criteria should look like is valuable. Examples, executable tests, and end-to-end checks can make that intent more concrete. But none of them guarantees that we have remembered every subtle edge case, or that the LLM did not make a consequential decision we failed to specify.

Using the software helps, too. As a backend engineer, I can be overly reliant on tests that cover an API contract rather than checking the experience through the UI. An agent can run UI checks that I might not have run myself. That is a genuine improvement, but not a guarantee. Even a power user will miss some edge cases.

This is not a problem that I think we have solved. Ask me again in six months.

## A risk-based policy, rather than a universal gate

The choice is not between reviewing every PR and opening the floodgates. A practical policy can be:

- Require code-owner review whenever a non-owner changes an owned area.
- Require human review for explicitly designated sensitive areas, such as irreversible state changes, permissions, billing, public contracts, critical paths, and changes that span systems. These changes need a human to assess whether the outcome aligns with the intent.
- Review the approach before implementation when the risk is in the design rather than the diff.
- Keep measuring the policy through escaped defects, reverts, incidents, lead time, and review load, then tighten or relax it based on evidence.

Adding a dependency is not automatically a reason for human review. Deterministic policies can assess provenance, known vulnerabilities, licences, and allowed versions better than an approval ritual can. Human review is warranted when the dependency changes the system's behaviour or risk in a way that those policies cannot assess.

## Review the risk, not every diff

PR reviews do not catch all bugs or prevent all incidents; they never did. They are a final check on design and architectural standards, but if a contributor repeatedly produces code that fails those standards, review alone is not the solution.

If we do nothing, code owners will be overwhelmed by the growing volume of reviews. Conflict will emerge as PRs are blocked. Review quality will fall, weakening its real benefit while preserving its appearance.

Our approach has been to reduce our reliance on human review: strong deterministic checks, LLMs as an additional but measured control, and human review for sensitive areas. Even so, the hardest question remains unresolved: did the system do what we actually meant?

We no longer require PR reviews on every PR. It has not led to degraded availability or latency; it has not led to increases in reverts or incidents. It has led to a major decrease in the time it takes to get stuff shipped.
