---
title: "Building a Clojure SLM - Part 1"
pubDate: 2024-11-17
time: "12:30 am"
type: "note"
tags: ["FP", "LLM"]
description: "Notes about building a Clojure SLM for code autocompletes"
draft: false
---

Biggest problem with AI assisted coding and Clojure is lack of quick feedback. Well, apart from dangling paranthesis. 

I started wondering: what if I train small language model that actually understood Clojure? This has many benefits the biggest one being latency. So one of the goal is to have latencies below 300ms for each inference.

A few assumption I am making while building the SLM. A Clojure snippet auto-complete must have balanced parens. An editor using this model could grab the topmost s-expression and autocomplete it. No dangling paranthesis.

In other words assume only balanced code to auto-completed. 

So this good:

```clojure
(defn █)
(defn sum █)
(defn sum [█])
```

But these are not valid:

```clojure
(defn sum
(defn
```


I started mapping out what good autocompletion would actually look like. Name-to-value completions, where the model finishes your thought:

```clojure
(let [total █])  ; Suggests: (+ x y), (reduce + numbers)
(defn squared [x] (let [squared █]))  ; Suggests: (* x x)
```

The inverse—value-to-name—is equally useful:

```clojure
(let [█ (filter even? numbers)]) ; Suggests: evens, even-numbers
(defn █ [x] (+ x 1))  ; Suggests: increment, add-one
```

And then there are the structural completions, like finishing a cond:

```clojure
(cond
  (< x 0) "negative"
  (= x 0) "zero"
  █)  ; Suggests: (> x 0) "positive"
```

This is where I hit a real wall. I don't know anything about how editors use LLMs for autocomplete.

The answer is something called Fill-In-the-Middle, or FIM. An editor sends your code split into three parts: what came before the cursor, what comes after, and a special token that says "fill this in."

Here's how it looks with Python code:

```python
<|fim_prefix|>def calculate_average(numbers):
    """Calculate the average of a list of numbers."""
    if not numbers:
        return 0
    
    <|fim_suffix|>
    
    return total / len(numbers)
<|fim_middle|>
;; LLM output
total = sum(numbers)
```

Now imagine the same thing in Clojure:

```clojure
<fim_prefix>(defn calculate-average
  "Calculate the average of a collection of numbers."
  [numbers]
  (if (empty? numbers)
    0
    <fim_suffix>
    ))
<fim_middle>
;;; LLM Output
(/ (reduce + numbers) (count numbers))
```

Instead of the fancy FIM tokens, what if I just use `<CURSOR>`:

```clojure
(defn calculate-average
  "Calculate the average of a collection of numbers."
  [numbers]
  (if (empty? numbers)
    0
    <CURSOR>
    ))
;;; LLM Output
(/ (reduce + numbers) (count numbers))
```

Next up is curating a dataset to validate if <CURSOR> approach really works.

---

## References

- https://github.blog/ai-and-ml/github-copilot/the-road-to-better-completions-building-a-faster-smarter-github-copilot-with-a-new-custom-model/
- https://sourcegraph.com/blog/the-lifecycle-of-a-code-ai-completion
- [Structure-Aware Fill-in-the-Middle Pretraining for Code](https://arxiv.org/html/2506.00204v1)
- [Evaluation of LLMs on Syntax-Aware Code Fill-in-the-Middle Tasks](https://arxiv.org/html/2403.04814v1)
- [Qwen2.5-Coder Technical Report](https://arxiv.org/pdf/2409.12186)
