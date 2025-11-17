---
title: "Building a Clojure SLM - Part 1"
pubDate: 2024-11-17
time: "12:30 am"
type: "note"
tags: ["FP", "LLM"]
description: "Notes about building a Clojure SLM for code autocompletes"
draft: false
---

Can we make a LLM focused only on generating Clojure code?

Why? Because it let's me explore fine-tuning / pretraining Language model in an area I understand.

A particular problem I am trying to explore, Can we train Language Models to always generate valid s-expressions. In other words, can we get a Lanaguage Model to generate perfectly balanced parenthesis. This can prove to be a good foundation for auto-complete layer in AI-assisted coding.

But before going ahead we need to ask what does it mean to auto-complete Clojure code.

One assumption while building it, code is always perfectly balanced. 

So this is completely ok

```clojure
(defn)

(defn sum)

(defn sum [])
```

But this is not

```clojure
(defn sum

(defn
```

This gives the editor the ability to select the top most s-expression to auto-complete or suggest
Ideally the way it works should be

```clojure
(defn add) -> (defn add [x y] (+ x y))
```

Some more examples

name-to-value
```clojure
(let [total █])  ; Suggests: (+ x y), (reduce + numbers)
(defn squared [x] (let [squared █]))  ; Suggests: (* x x)
```

value-to-name
```clojure
(let [█ (filter even? numbers)]) ; Suggests: evens, even-numbers
(defn █ [x] (+ x 1))  ; Suggests: increment, add-one
```

complete a cond / case
```clojure
(cond
  (< x 0) "negative"
  (= x 0) "zero"
  █)  ; Suggests: (> x 0) "positive"
```

But, how do editors integrate with LLMs to do autocompletes?

Most standard to do this is FIM (Fill-In-the-Middle)




Now let's think about how an editor talks to LLM to get something autocompleted.

```python
def calculate_average(numbers):
    """Calculate the average of a list of numbers."""
    if not numbers:
        return 0
    
    |  # <-- CURSOR HERE
    
    return total / len(numbers)
```

This is how the prompt looks like

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

Now looking at Clojure code block
```clojure
(defn calculate-average
  "Calculate the average of a collection of numbers."
  [numbers]
  (if (empty? numbers)
    0
    |  # <-- CURSOR HERE
    ))
```

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

An alternative to produce training data quickly

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

Next up is to figure out data sources and see if <CURSOR> approach actually makes the training better.

## References
- https://github.blog/ai-and-ml/github-copilot/the-road-to-better-completions-building-a-faster-smarter-github-copilot-with-a-new-custom-model/
https://sourcegraph.com/blog/the-lifecycle-of-a-code-ai-completion
- [Structure-Aware Fill-in-the-Middle Pretraining for Code](https://arxiv.org/html/2506.00204v1)
- [Evaluation of LLMs on Syntax-Aware Code Fill-in-the-Middle Tasks](https://arxiv.org/html/2403.04814v1)
- [Qwen2.5-Coder Technical Report](https://arxiv.org/pdf/2409.12186)
