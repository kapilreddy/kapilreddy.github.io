---
title: "Database migrations as a forcing function for good architecture"
pubDate: 2024-11-15
time: "2:30 pm"
type: "note"
tags: ["databases", "architecture", "migrations"]
description: "The best teams I've worked with treat database migrations as sacred. If a migration is painful, it's usually a sign that the architecture needs rethinking. The pain is the signal, not the problem."
draft: false
---

The best teams I've worked with treat database migrations as sacred. If a migration is painful, it's usually a sign that the architecture needs rethinking. The pain is the signal, not the problem.

When you find yourself writing a complex migration script with multiple steps and rollback logic, ask: why is this so hard? Often it's because the schema change touches too many things - a sign of tight coupling.

Good architecture makes migrations boring. And boring migrations mean you can move fast.
