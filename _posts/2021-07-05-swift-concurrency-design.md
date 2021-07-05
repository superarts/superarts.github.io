---
layout: post
title:  "2 Designs of Swift Concurrency"
date:   2021-07-05 12:31:00
tags:
- Swift Architecture
---

# 2 Architecture designs to solve concurrency issues in Swift prior Swift 5.5

## About Swift 5.5 concurrency features

There's a significant change in Swift 5.5 in terms of concurrency: [the `async` `await` keywords, and the `actor` type](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html). The keywords would  greatly improve code quality, and the `actor` type would make components thread safe by default. But for projects that can't be moving to Swift 5.5 when it's available, we may need to stick with the current approaches.

## The problem of concurrency in general

To simplify the discussion, we define:

- A shared component: as "a reusable component that is depended on other functional components".
- A functional component: as "a component that focuses on business logic, and depends on shared components".

Let's say we have:

- Shared components x `m`, i.e. C1, C2, ... Cm
- Functional components x `n`, i.e. F1, F2, ... Fn
- To simplify the discussion, shared components don't depend on other shared components

So in theory, we could have:

- Any F depends on any C
- Any F could make async call

Which means all Cs needs to be thread-safe to avoid concurrency issues.

## Solution 1

We simply make `m` components to be implemented in the thread-safe way.

With the `actor` type in Swift 5.5, this can be easily achieved. But doing so would potentially impact performance (I haven't read about it myself, but in theory, more safety check would lower performance), and it is not a very good design because it doesn't reflect business logic at all. So when developers are looking at the code, they don't have any idea whether a C is supposed to be running in different threads or not.

## Solution 2

We introduce dependency injection and list dependencies explicitly, so that we know which F depends on which Cs. For example:

- F1: Ca, Cb...
- F2: Cx, Cy...
- And so on.

Furthermore, we explicitly list all Fs that make async calls, and what Cs are called. So we ended up with a subset of Cs (let's call it C') that needs to be implemented in the thread-safe way.

This is the best way, as to properly make the code reflect business logic, dependencies should be properly:

- Analyzed: before writing the code
- Designed: while writing interfaces of all components
- Implemented: while implementing the code
- Maintained: while a new component is introduced, and it goes from "Analyzing" again

The problem with this approach is that writing code properly comes a cost of time, and sometimes developers don't have the time they need to achieve some milestone.

## Solution 3

While solution 1 is about making all Cs thread-safe, this solution 3 is to just make one component M thread-safe, but M has a `dispatch` function that can execute any closure by putting it in a self contained queue. So that:

- In an `Fa`, instead calling `Cx.method`, we call `M.dispatch() { Cx.method }`;
- In an `Fb`, instead calling `Cy.method`, we call `M.dispatch() { Cy.method }`;
- And so on.

The performance of this approach is even lower than solution 1, as we are essentially making multi-threading non-existence.

## Conclusion

While solution 2 is always my go-to, I'm exploring the 3rd solution right now, because it would be useful if you are experiencing:

- Legacy codebase that is too big to properly get all dependencies analyzed and corrected with the time you have;
- Concurrency related crashes with no helpful stack-trace;
- Need to implement fully or partially non-blocking UI with a lot of networking, database, and other I/O calls, etc.

PS: Happy 4th of July 2021! Hope the pandemic will be over soon, and some evil country will be held responsible!
