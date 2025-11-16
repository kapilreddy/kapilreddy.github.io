---
title: "The best API is no API"
pubDate: 2024-11-12
time: "4:45 pm"
type: "note"
tags: ["api", "design", "architecture"]
description: "Every API you expose is a promise you have to keep forever. The fewer promises, the more freedom to evolve."
draft: true
---

Every API you expose is a promise you have to keep forever. Or at least until you want to break your users' code.

This is why I'm increasingly drawn to systems that minimize surface area. Keep things internal until you absolutely must expose them. Each public function, each endpoint, each configuration option is technical debt.

The best API is the one you didn't have to create because you solved the problem a different way.
