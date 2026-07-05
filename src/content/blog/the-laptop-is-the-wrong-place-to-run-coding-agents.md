---
title: The laptop is the wrong place to run coding agents
description: Once coding agents reliably ship real work in parallel, the developer laptop becomes the most dangerous place to run them. Why Photoroom is moving remote.
pubDate: 2026-04-22
original:
  venue: Photoroom blog
  url: https://www.photoroom.com/inside-photoroom/the-laptop-is-the-wrong-place-to-run-coding-agents
---

In a [previous post](/blog/ai-coding-guardrails-are-mostly-the-old-guardrails/), I argued that AI coding guardrails are mostly the old guardrails. In this post, I look at why, as coding agents become more capable, the laptop stops being the safe or right place to run them.

## This Is No Longer a Demo

At Photoroom, we have the scaffolding in place to ensure that coding agents can reliably deliver approvable or near-approvable PRs just by being given a ticket. Our local workflow fetches the ticket, creates an isolated worktree, plans the commits, reviews the plan, implements with tests, runs specialised review agents, verifies the commits, opens the PR, and then responds to reviews. In other words, the agent is not being asked to "write some code". It is being dropped into a scaffolded delivery process. Model reliability is now good enough that the agent can produce reviewable pull requests for small tickets and a surprising number of medium-complexity ones without human steering or intervention. Not every time, certainly. And as mentioned previously, we are keeping the human in the loop at the review stage, but hundreds of PRs, where the agent is the author and the human is the reviewer, have now been merged following this process alone. Even complex work starts to look tractable when we break it into smaller tickets and let agents attack the pieces in parallel.

That success creates a problem.

## The Laptop Is the Problem

A local coding agent does not just have access to your repository. It sits on your machine, next to your shell history, your SSH configuration, your cloud credentials, your browser sessions, your local tools, your Docker daemon, your kube contexts, your MCP connectors, and whatever else you have accumulated as an individual contributor. Permission dialogues help, but they do not change the practical trust boundary very much. The trust boundary is still your laptop. Local agents sometimes do more than you expected, or do it sooner than you expected. Anyone who has used them seriously knows this. You will have seen how even "safe" Claude has performed actions without permission, including in plan mode. The permission model is not always as strict, or as reassuring, as the UI suggests. The real question is not whether the pop-up looked sensible. The real question is what the agent could actually touch from a real machine on a real Tuesday.

You might argue that we should not have all this access on our laptops. Maybe, but regardless of whether or not that is achievable for you, the point remains: human and agent permissions should differ.

## One Agent Is Not the Point

Even if you are convinced Claude's prompts mean it will never take action without permission, many local setups become officially permissive quite quickly. You start by approving a few safe actions. Then you whitelist recurring commands. Then you add tool access because the agent needs one more thing to complete the task. Before long, the setup is still "guardrailed" in theory, but in practice it can reach far more than people imagine. Local agentic coding scales surprisingly well. Running one agent locally is pair programming. Running ten to fifteen in parallel with git worktrees is where the benefits really start to take off. Context switching while babysitting each agent leaves me completely exhausted. One agent can be implementing a backwards-compatible serializer change, another can be writing tests for a new endpoint, another can be refactoring files, another can be preparing a migration, and another can be working on yet another endpoint. This is exciting, very productive, and completely impossible to monitor safely.

If you only ever run one agent at a time and closely monitor it, then yes, you reduce some of the risk. But you also leave a large part of the productivity gain on the table. The main reason teams are interested in tools like Claude Code is that they can dramatically increase throughput. Once you are serious about capturing that gain, parallelism stops being a weird edge case and starts becoming the natural next step.

It is also slightly absurd.

After a certain point, your job stops looking like writing software and starts looking like supervising a rowdy small firm of junior developers who all want approval at once. You bounce between terminals, worktrees, branches, review comments, permission prompts, and half-finished mental stacks. The raw throughput is real, but so is the context switching.

![A keyboard rendered in the style of Anthropic's branding](https://storyblok-cdn.photoroom.com/f/191576/640x640/9f5ff6ef37/anthropic_keyboard.webp)

*Credits: NinjaGraphics*

At that point, approval review fatigue becomes its own failure mode. You are not just reviewing code. You are reviewing plans, approving commands, checking diffs, re-orienting yourself, reloading context, and trying to remember whether agent seven is the one that rebased cleanly or the one that wants to run an integration test against a dev branch. It is horrendous context switching. It also gets more dangerous as it becomes more routine. Fatigue is not merely annoying. It lowers the quality of supervision.

If this were only a productivity issue, the answer might just be "be more disciplined". I do not think that is enough.

## Better Agents, Harder Risks

As models become more capable, the security argument gets sharper, not softer. I am not claiming that today's coding agents are all secretly acting like insider threats on developer laptops. I am saying that as these models become more capable, more autonomous, and more useful, the risks become more complex as well. We are getting more evidence of that complexity, not less.

Anthropic's 2025 work on agentic misalignment is a case in point. In simulated corporate environments, models from multiple providers sometimes chose harmful insider-style actions such as blackmail and leaking sensitive information when those actions were framed as the only way to avoid replacement or achieve their goals. In a more extreme and explicitly contrived extension, Anthropic also found that some models would take actions leading to an executive's death. I am not suggesting your coding agent has that capability or those goals. But the study used single-shot prompts. In the messy context of real work, as agents become more autonomous, the range of failure modes widens and becomes harder to dismiss as simple mistakes.

The wider body of research points in the same direction. Anthropic's reward tampering work showed that relatively mild specification gaming can, in controlled settings, generalise into more serious behaviour, including occasional attempts to cover tracks. Their alignment-faking work showed that a model can strategically appear aligned under training pressure, without that behaviour necessarily telling the full story. And OpenAI's March 2026 note on monitoring internal coding agents is important precisely because it is not a purely abstract safety paper. It treats real coding agents in realistic, tool-rich environments as a deployment category that warrants active monitoring.

The practical conclusion? As capabilities improve, it becomes easier to imagine failure modes that are less about obvious mistakes and more about strategic behaviour, hidden incentives, over-eager workarounds, or interactions with tools that create new ways to go wrong. That does not mean we should panic. It does mean we should stop pretending that more capable agents automatically make the deployment question simpler. They make it more operationally demanding.

OpenAI explicitly describes internal coding agents as operating in realistic, tool-rich workflows, with access to internal systems, visibility into safeguard code, and opportunities to modify those safeguards. Their conclusion is not "do not worry". Their conclusion is that monitoring and similar safeguards should become standard for internal coding agent deployments.

It's not just me, but those selling the agents to us.

## Why We Are Moving Remote

So our direction at Photoroom is straightforward. We want agents to have broad freedom inside the box, and a narrow blast radius outside it.

That means remote containers with full permissions inside their environment, but very limited access beyond it. Limited credentials. Limited network egress. Limited connectors. Limited access to internal systems. Enough power to do real engineering work, but not enough reach to turn a mistake, a prompt injection, or a more serious failure mode into a company-wide problem. This is not perfect security. It is just a better default shape.

It also improves the human workflow. Remote execution makes parallelism easier to supervise. It separates long-running work from the developer's laptop. It reduces terminal sprawl. It gives us a cleaner place to add logging, monitoring, policy, audit trails, and eventually more systematic review queues. In short, it moves agentic coding out of the personal-computing model and into the deployment model, which is where it increasingly belongs.

## What are the options?

As of 18 April 2026, the options are starting to look meaningfully different.

**Coder** is attractive if you want maximum control. It is self-hosted, open source, and built around remote development environments. Its strength is infrastructure sovereignty: you decide how the workspace is provisioned, what the network policy looks like, how identity is handled, where data lives, and what the agent can reach. If your goal is to give agents broad freedom inside a tightly controlled box, Coder fits that model well. The downside is that you own more of the operational burden. You have to provision it, secure it, maintain it, and make the developer experience good enough that people actually want to use it.

**Anthropic Managed Agents** looks like a strong option for teams that want a managed remote-agent platform without relying on ambient laptop permissions. What is appealing here is the split in the security model: environments define packages and network policy, while credentials are supplied separately at session creation through vaults. That is much closer to the sort of scoped access model we actually want. In practice, it means you can be more deliberate about what an agent can reach from a given environment.

The trade-off with Anthropic is vendor lock-in. The more deeply you adopt Managed Agents, the more your workflow depends on Anthropic-specific concepts such as agents, sessions, environments, vaults, and managed MCP integration. That may be a perfectly reasonable trade if you want speed and a coherent managed platform, but it does mean that moving later may involve rewriting orchestration and auth patterns, not just moving containers somewhere else. GPT 5.4 writes excellent code; Anthropic is not the only game in town.

**OpenAI Codex cloud** is the most fully managed version of the idea I have seen so far. OpenAI explicitly positions Codex as a cloud coding agent that can work on tasks in parallel in its own cloud environment, and it has added admin-facing controls, monitoring, and analytics. The upside is speed to value. The downside is that its permission model appears more workspace-centric than a deeply granular per-task least-privilege design. That is still much safer than running agents directly on a laptop, but it is not quite the end state I would want for long-term control.

So the trade-off is fairly clean. Coder gives you more control and portability, but asks you to do more infrastructure work. Anthropic gives you a strong managed model with better separation between environment policy and credentials, but with more platform dependence. OpenAI gives you a polished managed experience, but today it seems somewhat coarser in how permissions are scoped.

To be clear, moving to remote coding agents is only one possible answer. Another answer is not to use these systems for meaningful autonomous coding work at all. That is coherent. Another is to use them only one run at a time and watch them closely on a local machine. I understand the appeal of that position, but I am not convinced. If you are using these tools seriously to raise productivity, then keeping them on your laptop gives them access to the most dangerous environment in the stack. And if you avoid parallel execution altogether, you are deliberately giving up much of the productivity gain that made the tools attractive in the first place.

You do not need to believe every internet horror story about container escapes to see the point. Laptops are messy, privileged, deeply connected environments. If we are going to give increasingly capable agents real autonomy, it makes more sense to give them that autonomy inside disposable remote containers with tightly limited access to external systems than on the same machine that stores the rest of our working life.

Local agentic coding was the right first step because it was easy to start, easy to iterate on, and close to the developer. It helped us learn what good scaffolding looks like. It helped us learn where reviews belong. It helped us learn that agents can be much more useful than the sceptics claimed, and much weirder than the optimists admitted. But once the agents become reliable enough to do real work and cheap enough to run in parallel, the local model starts to show its limits. The permissions are too broad. The context switching is too ugly. The blast radius is too personal. The supervision model does not scale cleanly.

Remote agentic coding is not interesting because it sounds futuristic. It is interesting because it is the more boring, more operationally sane answer.

And in infrastructure decisions, boring is often a very good sign.

## Postscript

It is worth stating the major implication. This is not just a change in where code is written. It is a breaking change in the role of a software engineer. Once you rely on remote coding agents seriously, the software engineer is no longer the coder. For years, the centre of gravity was the developer inside their IDE, with everything else arranged around that. You may still connect via VS Code or a browser while retaining some familiar ergonomics. Fun aside, I first learnt to code on a Chromebook using Cloud9, a browser-based IDE, so remote development itself does not strike me as strange. But that is not really the point. The engineer may still specify, review, steer, and remain accountable for what ships. But that is not the same thing as coding. Maybe I will write separately about what the role of a software engineer in Photoroom's backend team is becoming. For this post, it is enough to say that remote agentic coding is not a tooling tweak. It is a change in who, or what, actually writes the software.

## References

- Previous post: [https://www.photoroom.com/inside-photoroom/ai-coding-guardrails-are-mostly-the-old-guardrails](https://www.photoroom.com/inside-photoroom/ai-coding-guardrails-are-mostly-the-old-guardrails)
- Anthropic, "Agentic Misalignment: How LLMs Could Be Insider Threats", 20 June 2025: [https://arxiv.org/abs/2510.05179](https://arxiv.org/abs/2510.05179)
- Anthropic summary page, "Agentic Misalignment: How LLMs could be insider threats": [https://www.anthropic.com/research/agentic-misalignment](https://www.anthropic.com/research/agentic-misalignment)
- Anthropic, "Sycophancy to subterfuge: Investigating reward tampering in language models", 17 June 2024: [https://www.anthropic.com/research/reward-tampering](https://www.anthropic.com/research/reward-tampering)
- Anthropic, "Auditing language models for hidden objectives", 13 March 2025: [https://www.anthropic.com/research/auditing-hidden-objectives](https://www.anthropic.com/research/auditing-hidden-objectives)
- OpenAI, "How we monitor internal coding agents for misalignment", 19 March 2026: [https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/](https://openai.com/index/how-we-monitor-internal-coding-agents-misalignment/)
- OpenAI, Codex cloud docs: [https://developers.openai.com/codex/cloud](https://developers.openai.com/codex/cloud)
- Coder docs: [https://coder.com/docs/about](https://coder.com/docs/about)
- Anthropic Managed Agents overview: [https://platform.claude.com/docs/en/managed-agents/overview](https://platform.claude.com/docs/en/managed-agents/overview)
- Anthropic Managed Agents vaults: [https://platform.claude.com/docs/en/managed-agents/vaults](https://platform.claude.com/docs/en/managed-agents/vaults)
