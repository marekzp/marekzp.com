---
title: Senior Claude reviewer is not a good use of engineering talent
description: If engineers only review agent-generated diffs, they bear accountability with none of the agency. Ownership has to start before the coding workflow runs.
pubDate: 2026-05-19
original:
  venue: Photoroom blog
  url: https://www.photoroom.com/inside-photoroom/senior-claude-reviewer-is-not-a-good-use-of-engineering-talent
---

An engineer on the team recently changed their job title in Slack to Senior Claude Reviewer. It is less funny than it sounds. It is too close to home. If the future of software engineering is humans staring at agent-generated diffs until their souls leave their bodies, then we will have an exodus of the most talented and experienced people leave the profession.

But if the agent writes more of the code, what is the engineer for? There are plenty of discussions online about coding being only one of many things that a good software engineer does, but here I want to explore those discussions from our own working experience.

## What I think bad looks like

We no longer have to only imagine a world in which a product person writes a ticket and triggers a coding workflow. Coding agents make implementation look cheap. The agent reads the ticket, modifies the codebase, runs some tests, opens a pull request, and posts a cheerful summary. An engineer is then asked to review the result.

On paper, there is still a human engineer in the loop. Engineers are still protecting the code, right? In practice, the human has been moved to the least impactful part of the loop. By the time the pull request exists, many of the important decisions have already been made; that this feature should live here, that this abstraction should stretch a little further, that the system should absorb one more special case, etc. Those are not merely implementation details. They are engineering decisions. Moreover, the pressure will be on to just get it merged.

This is not an argument against product people using powerful tools, and Product should be able to explore ideas quickly. The problem starts when we pretend that a generated pull request is a neutral implementation detail, rather than a bundle of architectural decisions that someone has already made.

A pull request is too late to discover that the feature should not exist (yes, there are valid engineering reasons for this!). It is too late to discover that the boundary is wrong. It is too late to discover that the system is being bent into the wrong shape. You can still reject the PR, of course. But now you are not doing design, you are doing damage control.

## Sign-off is not ownership

Human review remains essential, but review is not the same thing as ownership. Sign-off is what happens at the end. Ownership starts much earlier.

Ownership means understanding why the change exists, why it was built this way, where it belongs in the system, how it will fail, how it will be observed, how it can be rolled back, and what future work it makes easier or harder. It means being able to explain the change without pointing at the agent. It means being able to debug it when it breaks. It means being willing to delete it later.

If an engineer is only asked for a PR approval, then in practise the engineer is no longer the owner of the stack but merely a quality gate for decisions made elsewhere, not unlike a lint rule. That may look efficient for a while. It may even be efficient for a while. But it is a bad operating model. It is also a miserable job.

This is a version of the agentic coding revolution where the interesting part of development is taken away and the engineer is left with review fatigue, accountability, and none of the agency.

That would waste an enormous amount of engineering talent.

## Could the agent be the Staff Engineer?

At this point, there is an obvious objection. If the issue is the risk of bad architecture and design, why only let agents solve that problem, too?

If an agent can write implementation code, why should it not also write the design doc, choose the abstraction, identify the migration path, spot the dependency risk, and make the architectural recommendation? Can the answer not be to provide those same non-engineers with better system design guidance? Perhaps at some point.

Agents can help with system design. Sometimes they will do this better than a human who is tired, rushed, or missing context. Often, they will do it faster. Often, they will do it worse. One recent example at Photoroom involved an agent which tried to rewrite our entire Django Redis middleware because our current one wasn't closing connections. We went with closing/shortening the lifespan of pods instead (though you may agree with the agent and not our approach). Agents will get better, though, so the argument that humans must move into system design because AI cannot go there does not hold. It can and will.

But even when they get better, the decision still has to be owned. An agent can recommend a design. It can draft the memo, argue for an approach, and find problems in the plan. It does not make the agent accountable for the decision. An agent can even explain the trade-offs, but understanding them and taking ownership of the decision requires experience and expertise.

The agent can be a very good design partner. It is not the owner of the stack.

## Accountability cannot be outsourced

When a non-engineer asked for the feature, the agent wrote the code, the engineer approved the PR, the tests passed, and the incident happened, who owned the decision? Everyone can point to the step before or after them. Product did not choose the implementation. The agent cannot explain itself in the sense that matters. The reviewing engineer did not shape the approach. Leadership wanted more throughput. The process worked exactly as designed.

Maybe it does not matter to you who made the decision, as long as the process is later optimised to avoid repeating the same mistakes. I think it matters not to apportion blame, but to ensure there are individuals who can pre-empt problems. Individuals who care, not just an agent who afterwards just says how very sorry they are and how they should not have done it. I also do not think most leadership teams are ready to run companies where the answer to "who is responsible for this system?" is "the workflow". When a serious system fails, when a customer asks why, when a regulator asks who approved it, the organisation will still look for a person or a team responsible for that workflow (process).

This is not only about blame, but also about ensuring lessons are learnt. Feedback has to land with someone who can change the system. If the engineer is accountable but only allowed to approve it at the end, then the development process will not improve. They would bear responsibility without having had control.

If someone is going to be held accountable for a decision, they need to be able to shape it. This is why ownership cannot be placed only at code review. By that time, an implementation exists, and rejecting the work feels like slowing everyone down. The accountable person needs to be involved when the ticket is refined, and the agent is instructed. In practice, ownership has to start before coding begins.

Organisations are already good at making accountability disappear, but an accountability sink will not make engineering teams more competitive, no matter how many lines of code are written every second.

## The workflow should make ownership obvious

The agent may author the diff, but if we want the engineer to own the code, the engineer needs to decide whether the ticket is ready for implementation, what the technical approach should be, what the constraints are, and what the agent should not touch. The agent may draft the technical approach, propose the test plan, identify existing code paths, or challenge the engineer's assumptions. But there should still be a moment where a human engineer owns the decision. Only then does the coding workflow run. The engineer reviews the result, not as a stranger inspecting a surprise package in the post, but as the owner of an approach they helped define.

This is still fast. It may be faster, because a well-shaped ticket avoids the slowest kind of review: discovering at the end that the entire approach is wrong.

There will be exceptions. Tiny changes. Prototypes. Internal tools. Safe experiments. I am not arguing for a heavy committee before every small diff. That would be another familiar way to ruin software.

The point is simpler. For meaningful changes to important systems, engineering judgement needs to enter before implementation starts.

Otherwise, we are not accelerating engineering. We are routing around it.

## Where we are, right now

So the answer is not to make engineers better reviewers of AI-generated code. Or rather, that is part of the answer, but it is the least interesting part. The answer is to keep engineers on the left and keep them involved early in the process, before the coding workflow starts. They should be shaping the ticket, not merely reviewing the diff. They should be asking whether the change is necessary. They should be deciding where the work belongs, what constraints matter, what should be left alone, and what the agent must not be allowed to casually reinterpret.

At Photoroom, at least in the part of the backend world I am describing, we are exploring what happens (good and bad) when agents can reliably produce reviewable or near-reviewable pull requests from tickets. As implementation becomes cheaper, engineering value has to stay on the left, not be edged to the right. They need to stay as owners.

If AI also helps with that upstream work, great! We should use it there too. We just should not confuse help with ownership.

The agent can write code. It can even write useful code. It can help design systems. It can draft the design doc, suggest the migration, and argue with the plan. But it cannot own the stack. It cannot decide what kind of system we need. That remains engineering work. And we should keep engineers there.
