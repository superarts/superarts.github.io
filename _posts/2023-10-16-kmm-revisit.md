---
layout: post
title:  "Revisit KMM in 2023: is it a good cross-platform solution?"
date:   2023-10-16 18:25:00
tags:
- KMM
---

# Revisit KMM in 2023: is it a good cross-platform solution?

I talked about a very specific `KMM` issue 3 years ago. A lot of things have been changed since then, and this time, I'm going to share some of my thought about `KMM`, as well as a bit about myself. This post is not supposed to be an all-in-one textbook; instead, it should be considered as a single "data point" from a mobile solution architect. Due to my personal knowledge and experience about `KMM`, [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) is not covered.

## What is KMM, why it, and how it's done

This part can be easily Googled, so I'll keep it brief and make it personal. Basically [KMM](https://kotlinlang.org/docs/multiplatform-mobile-getting-started.html) allows you to write Kotlin code for multiple platforms, including iOS, Android, web, etc. It's good because Kotlin is a modem and well supported language, and even Google [doesn't have a very good reputation](https://killedbygoogle.com/) supporting their own technology, well, it's still powered by Google and it's open source. Worse case scenario, even if it's killed, hopefully it's still going to be supported by the open source community at the minimum degree, and you should have enough time to sunset it. I'll explain the technical reason below.

Basically `KMM` is not very complex technology; in fact, it could be considered as the bare-minimum of a cross-platform solution. I see it as a "plugin" part and some "platform" parts. The first "plugin" part is what you're seeing throughout the [official tutorial](https://kotlinlang.org/docs/multiplatform-mobile-setup.html): you install a `KMM` plugin in Android Studio, use it to create a project, and start working on it. The following "platform" parts allow you to build your Kotlin code into executables on different platforms.

As you can imagine, the "plugin" part is not a must-to-have. You can write all the project files in Emacs and run `gradle` in command-line. Your colleagues can clone the project and build the binary without the `KMM` plugin (Java and Android SDK are still needed). In future it may be more powerful, but for now you just use it for once to setup your project and then it's almost useless. And about the "platform" parts, again, it's very easy for you to guess that the Kotlin code will be compiled into Android code as if they are Android code (of course Kotlin codes based on Android SDK are 100% Android compatible codes). On the iOS part, Kotlin code will be compiled to native `x86` and/or `ARM64` code based on Objective-C runtime (you read it right, not Swift! they will be bridged to Swift though, so things like Direction.WEST in Kotlin will be like `.west` in Swift), supported by `kotlinx`, which is a limited set of platform support that's the true "Multiplatform" part of `KMM`. On the web part, Kotlin code will be compiled to JavaScript code, and you can use it in your front-end or back-end applications, after setting up your way to `import` the `KMM-JS` code.

## What have I done and how did I use `KMM`

We've been using `KMM` in our projects for a long time, and about an year ago, we made a technical decision to move some shared business logic from `JSON` (yes, `JSON`, not `JS`) to `KMM`. I could write more about it but it's different story, but anyway, we chose to use Kotlin to write cross-platform, non-UI business logic. Not surprisingly at all, after the rework, Kotlin code looks much better than the previous `JSON` data plus its Swift and Kotlin "engines" combined.

Recently I'm #LookingForJob (#OpenToWork hashtag time!) #iOS #mobile #Android #Swift #Kotlin #KMM #WhateverJustHireMe and I was asked to do a skill assessment project. The project [is here](https://github.com/superarts/KTPinBlock) if you are interested. I was asked to write a PIN block generator, and I further expanded the scope by adding support for more formats, adding decoder other than encoder, iOS support, and eventually web support. It is surprising to me, that it's actually not easy to find a free online PIN block coder for some very basic formats, and that's the main reason why I decided to make it useful for actual use case. The web version [is hosted as a GitHub page here](https://www.superarts.org/KTPinBlock/) and I hope it can help someone who's looking for something similar.

## Who should choose a cross-platform solution

I've always been cautious of choosing a cross-platform solution. To [quote myself](https://github.com/superarts/superarts.github.io/issues/17#issuecomment-1763493580):

```
Most of the projects I've been working on are native projects. Everyone loves the concept of reusing code and cross platform programming, but when it comes down to the actual projects, there is a fundamental issue that is literally unresolvable, which is the main reasons why building native apps are better for a lot of businesses.

What apps do, is essentially calling various frameworks / libraries to implement customized high level business logic. On iOS and Android, frameworks are updated regularly, and on a yearly basis we always expect a lot of major changes. You either adapt to these changes and taking the most advantages of the platform asap, or introduce another layer of framework to sacrifice the native technology and choose a platform solution, base on your business goal. There are also some middle ground that allows you to build certain modules in a cross-platform way, but for the UI part, using the native approach is generally preferred.
```

And it's from my own Angular/Ionic cross-platform solutions. It applies to `Xamarin` as well, and even for the popular `ReactNative` and `Flutter`, my opinion may stay the same. However, I do plan to start some `ReactNative` and `Flutter` projects to see if I should revise my opinion, and I'll use them as a typical use-case of these solutions: to build a POC app and test some ideas on the market. So to answer the question in the subtitle, the first answer is:

1. To build a POC/MVP that runs on multiple platforms, suppose you already have design/market/operation resources.
2. Another obvious answer is: you need some specific functionality provided by some cross-platform components, for example to embed a 3D view built with Unity (I've done it in 2016, and yea I know Unity is in trouble in 2023).

The last answer would be my own use cases. It's more like a why-not question. If some codes are:

- Do not depend on ANY platform specific features (remember, even DataTime, disk IO etc. are actually platform-dependent).
- Behave the same on different platforms (PIN block encoding/decoding is a good example).

Then why not write cross-platform code? An obvious answer would be "because our engineering team doesn't want to", which sometimes isn't a bad answer when you look at your backlog. Other than this, internal change request, dependency management policy etc. can also be valid reasons, i.e. the dev time you save should be more than the management time you need to spend. And of course, if you have a team lead with #vision and decent #CI/CD experience like me #hireme, it will be easier to push good changes forward #NoSlashS!

## Last but not least: is KMM a good cross-platform solution?

This is the most important question, and to be honest, I can't answer it without spending more time in `ReactNative` and `Flutter`. If we are talking about a whole app, my guess is "no". Google's own `Flutter` is more actively support, has more users, and Dart sounds like a language as good as Kotlin and Swift, and there are more TypeScript developers out there than Kotlin. So my guess is that these 2 are probably better than `KMM`.

And if we are talking about building a library (I didn't mention any bridging functions above, TL;DR: it's very easy to implement with `KMM`), I think `KMM` is a solid solution. Just look at my demo and see how easy the Kotlin code runs in the iOS simulator and in the browser. Other than that, from what I have used / evaluated, support of `JS` is everywhere, but using native web views to evaluate JavaScript code just feels hacky, and I still insist JavaScript is not a good, "modem" language comparing with Swift and Kotlin (and probably Dart, but to find a job maybe I should spend time in TypeScript at least). Scripting languages like Python, Ruby etc. are not popular choices on mobile platforms (even the very portable Lua, I see it more on embedded systems than mobile OSes). Xamarin is too heavy. Unity is too specific. I'm looking forward to seeing `ReactNative` and `Flutter` on this direction as well.

PS: I haven't mentioned my most used Swift. I did write Swift code that runs on Linux to generate some beautiful reports for our iOS and Android projects, but Swift on Linux is in a much better shape on Android. The reason is simple: Swift is driven by Apple, and Apple's business is based on hardware. So in the foreseeable future, I'd choose Kotlin over Swift for cross-platform code.