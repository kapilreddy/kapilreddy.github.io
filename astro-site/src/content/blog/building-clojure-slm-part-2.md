---
title: "Building a Clojure SLM - Part 2"
pubDate: 2024-11-17
time: "12:30 am"
type: "note"
tags: ["FP", "LLM"]
description: "Notes about building a Clojure SLM for code autocompletes"
draft: true
---

So an outline of the process. Generate data, train a model and test the inference.

## Tokenising s-expressions
But, the data needs tokenisation. Tokens are usually generated sequentially. But that doesn't seem like a good approach for Clojure code. 

There is literature available to do Tree based pre training. 
[TreeBERT: A Tree-Based Pre-Trained Model for Programming Language](https://arxiv.org/abs/2105.12485)

Does it make the inference better? 

But first what does it mean to auto complete or predict the next token in this approach?

A few assumptions I am making. The editor or user never sends an invalid s-expression to the Language Model

So this is completely ok

(defn)

(defn sum)

(defn sum [])

But this is not

(defn sum

(defn

This gives the editor the ability to select the top most s-expression to auto-complete or suggest
Ideally the way it works should be

(defn add) -> (defn add [x y] (+ x y))

## Are diffusion models better for s-expressions?
