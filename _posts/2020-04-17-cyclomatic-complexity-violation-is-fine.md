---
layout: post
title:  Cyclomatic Complexity Violation is Fine
date:   2020-04-17 18:43:00
categories: Swift
tags: Swift SwiftLint
---
 
# Cyclomatic Complexity Violation is Fine - But only in this Case

If you introduce [SwiftLint](https://github.com/realm/SwiftLint) into your existing project, it's likely to complain about a lot of coding problems. Some of them are extremely easy to address, even by autocorrect; however, some warnings may be harder to remove, for example "Cyclomatic Complexity Violation".

The idea of [cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity) is very simple: the more branching and jumping logic you have in your code, the more complex your code is. SwiftLint sets default cyclomatic complexity level to 10, and in my opinion, it is appropriate in most the cases: if a function's cyclomatic complexity level is 10, it must have a lot of branching and jumping logic already, that gets it hard to understand by others (or yourself after 3 months). You definitely don't want the situation to be worse.

However, there's one case that a lot of developers would encounter: what if you need to write an exhaustive `switch` for a really large `enumerate` that contains 20 items? It could be a list of analytics events, networking errors, or it's simply a state machine with a lot of keys and handlers. When you write a `switch` statement, surely there will be a lot of branching and jumping, which results high cyclomatic complexity level. Is there a way to address this issue?

It's easy to think of a couple of ways, for example, we can write a dictionary with keys and closures, and for a specific key, we can use subscript to get the closure. But of course it's a terrible idea. Why would we replace the native `switch` clause with a data structure? Remember: it's general a bad practice to handle logic in data.

Sometimes, it's better to answer a question with a question. Why would we have a large `enum` in the first place? We can [use `struct` to define analytics events instead of using `enum`](https://matt.diephouse.com/2017/12/when-not-to-use-an-enum/). We can categorize networking errors into multiple layers, for example `auth -> jwt -> invalid exp`. If possible, breaking down the big `enum` you are dealing with, and it generally is a good approach.

However, we may not have the luxury in real life. For example, we are already using a enum-based analytics framework like [Umbrella](https://github.com/devxoul/Umbrella). Or, you may need to stick with a "flat" list of networking errors defined by back-end. In this case, I would say: cyclomatic complexity violation is fine. As long as you keep your `cases` simple, it is pretty easy to go through the `cases`, even if there are 20 of them.

In my opinion, it would be good if we can write "extension" for a `switch` statement, so that we can break down a really large `switch`. But since we don't have that yet, it's perfectly fine to add `// swiftlint:disable:next cyclomatic_complexity` in front of your function.
