---
title: "Code review checklist: does it delete more than it adds?"
pubDate: 2024-11-13
time: "1:20 pm"
type: "note"
tags: ["code-review", "engineering", "best-practices"]
description: "The most valuable PRs often have negative line counts."
draft: false
---

The most valuable PRs often have negative line counts.

When reviewing code, I look for:
- Does it delete more than it adds?
- Does it reduce complexity?
- Does it remove a dependency?
- Does it eliminate a configuration option?

Adding features is easy. Removing complexity while maintaining functionality is mastery.

Every line of code is a liability. Every dependency is a future security patch waiting to happen. Every configuration option is a support ticket.
