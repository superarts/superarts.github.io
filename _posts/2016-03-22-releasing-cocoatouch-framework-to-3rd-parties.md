---
layout: post
title:  Yet another Guide about Releasing CocoaTouch Frameworks to 3rd Parties
date:   2016-03-22 15:53:00
tags: XCode Apple iOS CocoaTouch Dynamic Framework
---

Since the end of last year, I've been doing little bits and pieces for iOS and Android development, mainly for existing projects. Although most of my tasks are based on a very specific business model, there are still some interesting stuff to share. For example, recently we're building a dynamic framework for 3rd party developers, and there are a couple of topics that we can talk about. But in this post I'll mainly discuss releasing a dynamic framework (CocoaTouch Framework).

Everyone loves open source, especially in year 2016, but sometimes there's still business decision to release some close source SDKs. I haven't been releasing compiled code for ages, but the idea remains almost the same, just the packaging tools are better (dynamic framework for iOS and AAR for Android). Anyway, there are just 3 things about this: building for different platforms (architectures), packaging, and publishing. Packaging relies on IDEs or toolchains Apple and Google provides, and you'll be creating your own scripts for publishing. Android is based on Java and platform is not a concern. So this post it's just about building iOS frameworks for multiple platforms.

Here's the situation we're facing: basically here are 2 things to worry about. Firstly, we'll be using both simulator and device during our development cycle, so "fat" binaries should be used. Secondly, fat binaries cannot be used for iTunesConnect submission since... some time ago. Anyway, normally people would add `run script` as `build phases` to combine binaries together during development, and strip i386/x86 out while releasing.

The problem I found is that when I searched for such scripts, I see a LOT of versions of them, all are different, and none of them work properly in my project. I'm not saying it's impossible to find a working one, but I started to think that it would be better to run line by line and understand how it actually works, so that if there's something goes wrong, I'll be able to fix that error. I'm pretty sure the following process may break when new version of Xcode is released, but as long as I know what they do I can always debug and fix the problem. The following steps work for Xcode 7.2.1 and are really straight forward.

### Build framework for device (arm)

- `xcodebuild -workspace MyFramework.xcworkspace -scheme AirServiceKit -sdk iphoneos9.2 -configuration release -derivedDataPath build > /dev/null`
- `cp -r build/Build/Products/Release-iphoneos/MyFramework.framework build/AirServiceDemo/framework/arm/

If it's build phase script you'll be able to use environment parameters. Doing it manually is less flexible, but hopefully it's easier to understand.

### Build framework for simulator (x86)

- `xcodebuild -workspace MyFramework.xcworkspace -scheme AirServiceKit -destination 'platform=iOS Simulator,name=iPhone 6s' -configuration debug -derivedDataPath build > /dev/null`
- `cp -r build/Build/Products/Release-iphonesimulator/MyFramework.framework build/AirServiceDemo/framework/x86/`

It's odd that `-sdk iphonesimulator9.2` does not work. `arm` and `x86` are created for the following step.

### Create fat framework

- `lipo -create -output fat/MyFramework.framework/MyFramework arm/MyFramework.framework/MyFramework x86/MyFramework.framework/MyFramework`
- `cp x86/MyFramework.framework/Modules/MyFramework.swiftmodule/\* fat/MyFramework.framework/Modules/MyFramework.swiftmodule/`

This fat framework can be used for both simulator and device development, but to submit your app to iTunesConnect, you'll have to use `arm`.