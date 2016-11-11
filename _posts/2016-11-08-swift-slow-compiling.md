---
layout: post
title:  "Slow Compiling Problem in Swift"
date:   2016-11-08 18:26:00
categories: LSwift Compile
tags:
- LSwift
- Compile
---

We all know that `Swift` is evolving quickly, yet there are problems here and there. For example, a well known issue is about how slow the `Swift` compiling process may take. Although it's a strong typed language, `Swift` compiler seems to be a bit stubborn while figuring types: constants/variables like `let str = "A String"` and `var number = 1` are usually fine, but `let color = UIColor(rgb: 0x00ff00)` is much slower to compile than `let color: UIColor = UIColor(rgb: 0x00ff00)`. It's not that slow and I would prefer the "slow" way since writing cleaner code always feels good for me, but let's say if it's a helper `struct` that contains 32 different color constants, compiling becomes ridiculous slow and it would be good to optimize the code a bit. This has been widely discussed among various developer like [here](https://spin.atomicobject.com/2016/04/26/swift-long-compile-time/).

However, recently I ran into a different problem and wasn't able to find resolution on the internet. Firstly I tried to find if there's any suspecious literals mentioned above, but it was pretty hard to try to find any among more than 600 `Swift` files. So I tried to add the `-Xfrontend -debug-time-function-bodies` flag as described [here](https://thatthinginswift.com/debug-long-compile-times-swift/) in the hope of finding the part that slowed down the compiling process, and there wasn't really any part that takes more than 1 second to compile.

But I did find a pattern there. It seemed that the compiler processed with 4 source files together, and it took a second or two to compile these 4 files. The problem was that although it was not particularly slow to compile any single `Swift` file, the process did add up if there were, like more than 600 files. So this lead to a reasonable guess: would it be faster if we reduce the numbers of files?

So I did a simple `cat * > all.swift`, removed the old files, and added `all.swift`, which contained more than 400 files into the project. Previously a clean build time cost around 5-6 minutes, and after reducing file numbers from 641 to 213, compiling time became around 3 minutes. I pressed `command+8` and clicked on the spinning `Build` item to see how it looked. Compiling `all.swift` took around 15 seconds. It's not a short amount of time of course, but if there were 400 files, it would take more than 2 minutes. I'm not sure about you guys but definitely I would consider it as an improvement.

Of course, in real life you wouldn't merge source files together to reduce compiling time, since that's basically against almost every principle of software engineering. But in the other hand, if you're planning to create a project with more than 500 `Swift` source files, don't expect it can be done in an instant.