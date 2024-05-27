---
author: "Kapil Reddy"
date: 2014-09-28
linktitle: "LLM for product managers : Part 1 - Why"
menu:
  main:
    parent: tutorials
next: /tutorials/github-pages-blog
prev: /tutorials/automated-deployments
title: "LLM for product managers : Part 1 - Why"
weight: 10
draft: true

---


# Intro

LLM is the hot topic and silver bullet for everything under the sun. There is so much hype but not enough clarity. It all boils down to do you really need an LLM in your product? This series will equip you to make informed decisions to incorporate LLMs into your product.

We will do this by asking questions in this order

Why - Capabilities, impact and risks

What - Techniques

How - Implementation



Mental models for LLMs

LLM’s only job is to guess the next token

LLM outputs are probabilistic

LLMs are general purpose models

Scaling laws apply to LLMs (So far)

Larger model ~= More capabilities

Language models are general purpose interfaces

What changed?

Scaling laws kicked in. In other words, Bigger models started showing newer capabilities. Emergent abilities.

Capabilities

Traditional NLP

There are models which are built specifically for following tasks. These models are not general purpose but a decent LLM can do almost all these tasks.

Comprehension

Summarisation

Translation

Conversational question answering

Classification

Extraction

So why LLMs are better here. A single LLM can do the work of four specialised models. The simplification has commoditised these NLP tasks. Although some traditional models still beat LLMs for mission critical work.

Logic, Math & Code

Reasoning

Truthfulness

Coding

Domain specific work

LegalBench

Legal bench

But how good are they?



Multi step reasoning

Grade School Math 8K

Commonsense reasoning

Hellaswag

winogrande

Question answering

Arc

TruthfulQA

Multi-task understanding

https://huggingface.co/datasets/lukaemon/mmlu

UX patterns

Chatbot - Text as interface

Risks

Cost

Hallucinations

Adversarial Prompting

References
