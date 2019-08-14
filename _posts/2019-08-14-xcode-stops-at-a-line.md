---
layout: post
title:  Xcode Stops at a Certain Line
date:   2019-08-14 14:39:00
categories: Xcode
tags: Xcode Swift iOS
---

# Xcode Stops at a Certain Line: What Happened?

While I always encourage non-technical people to run iOS code in simulator on `macOS` using Xcode, I don't mind people to use the word "crash" to describe the behavior that Xcode stops at a certain line. For examples, in certain scenarios, it would be helpful for QA to run the codebase directly in Xcode to help some verify some analytics issues.

However, I think it still helps if people can understand more about what exactly happens, if he sees Xcode stops at a certain line. At least it helps understand the importance of the issue.

## Break point

Setup by developers at a point they want, or when something non-critical happens (like conflicts UI constraints) to help debug; usually a QA doesn't need to worry about it, as break points should be disabled for them. But in case it happens, know that you can "resume" to continue using the app.

## Assertion Failure

Sometimes developers can "assert" something in the code to warn themselves. For example, Firebase doesn't support events with name that's longer than 40 characters. If there's an assertion, the app will stop to prompt developer to modify their code. But if the app goes to App Store for whatever reason, the app won't crash because of it. Unexpected behavior is likely to happen though, as in our example, we will never see that event in Firebase console. A message can be set to prompt develop what's wrong.

## Fatal Error / `exit()`

It works like assertion very much, expect for the fact that the app will terminate itself even it's in production. Usually developers don't use this for business logic in their code, but use it for something fundamental, for example dependency injection. There's no point to provide a mock resolution if it's not registered.

## An Unhandled Exception

This is what we usually refer as a "crash", which is something like divided by zero, or force unwrapping a `nil` object. It behaves like a fatal error, but develops don't set a message for them, because they are unhandled. There may or may not be useful message, and if there is not, developers would start hating themselves, especially if it's about concurrency.