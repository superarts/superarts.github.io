---
layout: post
title:  A Single Source of Truth in Real Life
date:   2020-09-29 13:35:00
categories: Management
tags: source code document
---

# A Single Source of Truth in Real Life

In computer science field, [Single Source of Truth](https://en.wikipedia.org/wiki/Single_source_of_truth) is pretty much a principle that applies everywhere related with source code. However, it almost [never works out](https://community.aras.com/b/english/posts/you-can-t-handle-the-single-source-of-truth) when we programmers work with other departments. Is there a solution? Or at least, is there a way to improve and make our life easier?

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Contents

- [The Situation](#the-situation)
- [The Problem](#the-problem)
- [The Impossible](#the-impossible)
- [What can be Improved](#what-can-be-improved)
- [A Solution](#a-solution)
- [The Process](#the-process)
- [Conclusion](#conclusion)
- [Update on 10/31](#update-on-1031)
- [References](#references)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The Situation

Workflows, processes, tools... All these vary between different organizations. Consider the following typical development scenario:

- Business level management people (decision maker, stakeholder, or just the Big Boss...) come up with some rough business vision. There may be some brainstorming sessions and so on, but at this point, developers are generally not involved.
- Product people (product manager, business owner, product owner...) groom these ideas into product documentation. It can be some Confluence page, GitHub repo with markdown files, Dropbox with word documents and spreadsheets, but in general, when developers have any doubt about the stories (in the section below), they would like to refer to these product documents.
- Project level management people (project manager, business analyst, or product people if there's no dedicated "management people") write user stories in whatever project management tool they use, from Asana to Jira. Developers and QA people must rely on these stories to work on the implementation.
- Developers write source code to actually implement the product.

In real life, there are more aspects that involve different parties, like designer, analytics, compliance, legal, security... They require input from their management, and produce output as documentation. We are not discussion all the dependencies here, but to developers, they are mostly upstream.

## The Problem

Developers don't deal with tons of stuff directly, but still, it's very hard to declare something as a single source of truth easily.

- Product document should definitely be considered as source of truth from the requirement point of view as they are on the highest level.
- User stories are the source of truth when we write our code, as product document can't be as detailed as stories.
- Source code is the source of truth when you want to figure out the current behavior of the product.

Of course, they are all the same things of they are completely aligned. But if they are managed differently, it never happens in agile world, because you don't have years to make the requirements fixed, and align all the things together. So the problem is not about what should be treated as the source of truth, as all of these items have their own importance. The question is: is there any way to align everything together?

## The Impossible

Firstly, it is not possible to align user stories with the other stuff, because the stories only have limited lifespan. In some rare cases, stories can be updated or amended, but it is almost always a bad practice to re-open a closed story, and it literally makes no sense to update the description of a closed story. When there's a bug, you create a new bug. When the requirement changes, you create a new story. So user stories can be treated as source of truth only when it's open and ready to develop / testing, and after that, they are out of date and you only look at them when you want to find some historical reason behind something.

Secondly, it still relies on people to keep documents and source code synchronized in most cases. Business people are not supposed to maintain source code, and developers are not hired to update all the documents.

The bottom line is: human makes mistake. And when they do, it's not the end of the world; we just fix the problem. Remember: in an agile world, conversation is always over documentation.

## What can be Improved

Only by accepting what's impossible, we can think about what can be improved. We already narrowed the problem to align product documents and source code together. Then the question is: what documents developers can help to align with our source code?

Different people have different mindsets here. To me, if some documents need to be constantly updated, developers should think about some way to help. Here are some examples:

- Analytics events. They are rarely updated, so that historical data won't be messed up, but new events are added from time to time.
- Error handling. Sometimes error messages need to be updated, and for new features, new error type/code may be introduced.
- Copy management. Display text, voice over etc. may be updated from time to time.

It is very common that there are some wiki style pages are supposed to be up-to-date with the implementation. But as we said before, how can they be synchronized with each other?

Please note: I'm not mentioning database scheme, back-end API etc. because they usually come with self-generated documentation, and that's actually what I'm proposing here.

## A Solution

Logically speaking, there are 3 ways to keep documents and source code synchronized:

1. Generate code from document;
2. Generate document from code;
3. Generate document and code from data.

I believe a lot of us have done some of all of them, more or less, in our development life. When you want to address some existing documentation syncing problem, you may have to go with code from document, or from some formalized data. But if you think all these options from the very beginning, only generating document from code makes the most sense, because this is the easiest way to parse the data:

- Firstly, even HTML pages are not that easy to parse, and if you have word documents or even PDFs, converting them to a parsable format itself may not be lossless. 
- Secondly, it's actually harder to manage data than source code. Even (perhaps) the most human-friendly data structure YAML is less than (even) PHP.

So when we start a project, or when we have bandwidth to address this kind issues, I would recommend start refactoring your code. Extract data to different files, and add them to a different CLI project that can reference them. Most languages support that with the simplest `import` functionality, and some of them support better dependency management system. For example, you can create a private and/or local gem / cocoapod to put data together, and add scripts to generate documents in your CI system. Again, I'm not talking a specific field or technology. Personally I've been working on mobile scene in recent years, but it's doable for web services and so on.

## The Process

There's no silver bullet in management; even for a concept as simple as this, it still relies on people to respect the process. For example:

1. People should be aligned. This sounds simple but it's especially important to explain to business people, that developers are not taking control away from them. Instead, all change requests should still come from them; this approach is primarily to same their time; and they need to define, or at least review the format of the generated documents.
2. When there a change request, make sure to cover all the details in user story. At this point, user stories are source of truth.
3. Once a code change is done, documents should be generated; ideally it's done by CI to avoid human mistakes.
4. The generated documents may not serve as formal documents. Instead of copy and paste the generated contents, it is recommended to use them as appendix of the formal documents.

Here some generated formats that is worth considering:

1. Markdown: very good to work with a lot of systems like GitHub or BitBucket. Also readable for human, and easy to edit.
2. HTML, CSV: looks good either in GitHub or to business people. A bit hard to read and edit.
3. PDF, Word document, Spreadsheet: business friendly, source code is almost not readable; can be edited with editors. Conversion with tools like `pandoc` may not be lossless.
4. XML, SQLite... Why?

I haven't developed with Confluence APIs myself, but that may help streamline the process.

## Conclusion

It is debatable whether this approach really saves time or not. It usually take quite some time to build the system, and for some start projects, they may quickly switch directly and document format may expire quickly. While developers always want to spend 1 hour to same 1 minute several times in the future, we always need to discuss with business people about what we are trying to do, and make sure everyone is fully onboard.

## Update on 10/31

Due to the complexity of real life codebase, generating document from code may not be trivia, especially when there are dependency problems within the codebase. I'll discuss some technical of handling this kind of problems in some future posts.

## References

- [Single Source of Truth](https://en.wikipedia.org/wiki/Single_source_of_truth)
- [You Can’t Handle the Single Source of Truth](https://community.aras.com/b/english/posts/you-can-t-handle-the-single-source-of-truth)
