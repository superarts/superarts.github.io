---
layout: post
title:  "Using Kotlinx_datetime in Swift"
date:   2020-12-24 00:19:00
tags:
- KMM
- Kotlin
- Swift
---

Everyone loves cross-platform solutions, and almost all platforms have a web engine that can parse JavaScript; however, some Swift/Kotlin lovers like me just don't like JavaScript itself for various reasons, for example it can result really, really bad code, mostly when you are in a team with developers of different skill levels. Thankfully we have 2 potential solutions: [Swift on Android](https://github.com/apple/swift/blob/main/docs/Android.md), and [Kotlin Multiplatform Mobile](https://kotlinlang.org/lp/mobile/). Today we are going to talk about a specific problem in KMM, and a potential solution.

# Using Kotlinx_datetime in Swift

There is a component [kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime) that works for both platform in KMM, but it is an actual implementation, i.e. it's not bridged to `Date` in iOS/Swift. So what if you want to pass it from/to a KMM library?

First solution is very straightforward: we only use `kotlinx-datetime` in KMM, and in APIs, we use timestamp instead. Depend on your use case, this may not be a bad approach.

Another solution is to use the Swift version `Kotlinx_datetime*` in your APIs. Of course, in Swift you mostly want to convert it from/to `Date`, as you don't want to write your code with `Kotlinx_datetime*`.

## KMM to Swift

This is very simple. Suppose we have:

```
object SharedTest {
    fun testOut(): Instant {
        val now = Clock.System.now()
        println("now: " + now)
        return now
    }
}
```

Which gives us a `Kotlinx_datetimeInstant` in Swift; and we can simply convert it like this:

```
let now = SharedTest().testOut()
let date = Date(timeIntervalSince1970: TimeInterval(now.epochSeconds))
```

## Swift to KMM

This is surprisingly more problematic then I expected. `Kotlinx_datetimeInstant()` doesn't compile, as there's no `init` in `Kotlinx_datetimeInstant`. The developer explained why it's like this [here](https://github.com/Kotlin/kotlinx-datetime/issues/78), and offered several solutions. I found the 3rd hacky one is the simplest:

```
Force the companion object to be included in the framework. For example, upon adding the following code to Platform.kt in iosMain in a sample KMM project, the companion object was included in the headers:

> fun Instant.Companion.dummy(): Nothing = TODO()
```

After doing this, you can keep writing your Swift sample code like this:

```
let dateX = Kotlinx_datetimeInstant.Companion().fromEpochMilliseconds(epochMilliseconds: Int64(date.timeIntervalSince1970) * 1000)
SharedTest().testIn(date: dateX)
```

And of course, you need to have this in your KMM `SharedTest`:

```
    fun testIn(date: Instant) {
        println("input: " + date)
    }
```

## One more thing

Since iOS is using Double as timestamp and Android is using Int64, some information may loss and it may affect the logic of your shared library. Please be careful.
