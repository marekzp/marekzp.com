---
title: How we made AI feature development self-service at Photoroom
description: How Alex used an AI assistant to update Videoroom, test a new workflow, and release it to customers without waiting for a backend engineer.
pubDate: 2026-11-19
---

![Hands fit a LEGO sound booth beside a camera operator filming a brick-built red trainer.](/media/videoroom/brick-built-film-set.webp)

Today at Photoroom, engineers and non-engineers alike can design AI features and release them to users in minutes, without changing application code. The platform sits behind endpoints handling tens of millions of generation requests each week, including existing product features connected through adapters.

We had more ideas for AI features than our backend team could support. During planning for the second half of the year, teams asked for eleven backend engineering seats. We had five people. Product managers could see what they wanted to try, and people across the company had ideas of their own. Their experiments competed for the engineers needed to build them.

Even changing a prompt could mean opening a pull request. We wanted someone with an idea to be able to test it while the idea was still fresh.

## Give authors something they can build with

We built a platform that lets authors assemble AI features from capabilities our engineers have already made available. The engineering work behind a model integration becomes something the next person can use without having to understand its implementation.

Three concepts make this possible.

- **Nodes** perform individual operations, such as constructing a prompt, calling a model, or transforming an image.
- **Modules** connect Nodes into reusable recipes.
- **Tools** package those recipes as features, with customer inputs, presentation, pricing, and access rules.

A Module describes its recipe as a graph, with connections showing how the output of one operation becomes the input of another. Those connections have types, so the platform can catch a connection that does not fit before the author publishes it.

The Node catalogue comes from the same Python definitions that describe the operations to our runtime. When an engineer adds a supported operation, it becomes another building block for authors. A feature still needs engineering when a building block is missing. Combining the ones we already have no longer requires a dedicated implementation. By mid-November, the catalogue contained 88 distinct Tools, including experiments and archived features.

## Case Study: Alex changed how Videoroom uses its references

A seller may have a photograph of their product without knowing how to turn it into a video advert. Videoroom helps them make that leap. Customers can run Tools like Videoroom through the Photoroom MCP. Inside Photoroom, we use a separate Admin MCP to build and update those Tools through an AI assistant. Alex Billington saw a way to improve Videoroom for the sellers using it.

Alex adapted Videoroom so sellers could give it more precise creative instructions. His version distinguished photographs of the product from images supplied as styling references, with instructions to preserve the product’s details. He also added control over the audio, including the option to supply an exact voice-over script.

Alex has no software engineering background. He used the Admin MCP to make these changes with his assistant, which saved them in an editable Draft.

He iterated over two days. After creating the final release Draft, he published it about twenty minutes later. His published Tool subsequently generated the ten-second portrait video selected for this article. No backend engineer was needed.

<video controls playsinline preload="metadata" width="360" style="max-width: 100%; height: auto" aria-label="Ten-second Videoroom product advert with voice-over" src="/media/videoroom/videoroom-sample.mp4"></video>

[Open the clip with sound](/media/videoroom/videoroom-sample.mp4)

## Make the workflow visible

When a seller supplies a voice-over script, a prompt-template Node puts their words into the audio instructions. A second Node folds those instructions into the prompt for the video model. Those Nodes work together inside the Videoroom Module. The Tool exposes the script as a field a seller can fill in.

Our Visual Workflows editor draws the saved execution graph. For a change like Alex’s, an author can follow a reference image through the workflow and see which model receives it. Opening a nested Module reveals the recipe inside.

![Videoroom’s model-selection branch in the Visual Workflows editor](/media/videoroom/videoroom-mcp-graph-detail.jpg)

Alex’s published Videoroom MCP graph in Visual Workflows, focused on the model-selection branch.

The editor also lets authors test a workflow using the same generation machinery that powers the product. They can inspect what happened along the way when an output surprises them. Comparing versions helps them connect a change in the result to a change in the recipe. All without a backend engineer.

When a promising model needs testing in the product, Content Admin lets authors set up a comparison and generate new Drafts for the Tools they choose to include. After those versions are reviewed and activated, Amplitude controls which users receive each variant and records their exposure so the team can assess the result.

## Publish the version you tested

Experimentation needs flexibility. A feature that other people depend on needs a stable definition. Across those 88 Tools, we now have 322 version records, including drafts and archived versions.

We have invested heavily in validation checks to ensure that all our workflows not only work but also that they don’t break production. Publication checks that the Tool’s inputs fit its workflow and that its dependencies are compatible. The published Tool carries its execution definition, including the exact versions of the Modules it uses. An edit to a shared Module therefore does not silently change a feature that is already live. The author adopts that edit through a new Tool version.

This also makes it easy to share recipes. Another team can build on it while choosing when to take later improvements. The decisions behind a successful workflow become a starting point for the next author.

Publication still requires judgement about whether the result is ready for customers. Authors need to check the experience through its intended entry point, including whether it is available to the right customers at the configured price. Structural validation cannot make those product decisions for them.

For features built from supported capabilities, releasing the reviewed version does not require a new AI Gateway deployment. That removes the engineering hand-off that used to sit between an experiment and a usable feature.

## What’s still hard

Suppose you change the voice-over instructions in Videoroom while I’m editing how it handles reference images. If we share a draft, I can publish your half-finished change along with mine. If we both edit the same instructions, one of us can overwrite the other’s work.

Separate branches in Git would let us work independently and review what we wanted to merge. We decided against asking everyone who edits a Tool to manage branches and merges. We’ve focused on making it clear what’s changed in the draft before someone publishes it. For some of our more critical Tools, we also have designated owners and a review process in Slack.

At least twenty people at Photoroom have already contributed changes to AI Tools, only three are from the backend team working on this area. Since the end of July, their work has produced 4,818 recorded authoring changes, excluding automated edits. Our engineers built the capabilities and the system that runs them. Non-engineers can make the creative decisions themselves.

The next idea can come from anyone. They can try it themselves.
