---
title: "Integration tests are documentation that doesn't lie"
pubDate: 2024-11-11
time: "10:30 am"
type: "note"
tags: ["testing", "documentation"]
description: "Unlike docs, tests break when they become outdated."
draft: true
---

Unlike docs, tests break when they become outdated.

Your integration tests are the only documentation that:
1. Is guaranteed to be up-to-date (or the build fails)
2. Shows exactly how components work together
3. Demonstrates actual usage patterns, not theoretical ones

When onboarding new developers, I point them to the integration tests first. They'll learn more in 30 minutes than reading architecture docs for 3 hours.
