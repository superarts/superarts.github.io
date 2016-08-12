---
layout: post
title:  "My First Ruby Gem"
date:   2016-08-12 22:48:00
tags:
- Mac
- OS X
- ruby
- gem
- swift
---

In the past few months, I was focusing on a pretty cool project. The downside was that it's purely based on `Objective-C` and I've been really busy, so I made very little progress of my [Swift library](https://github.com/superarts/LSwift). As I mentioned previously, it was not implemented as a `pod` since `dynamic framework` was not officially supported by `cocoapods`, and `iOS 7` was still a thing back then.

Actually, it's already used in a demo app [WeatherPOV](https://github.com/superarts/WeatherPOV). To start using it as a pod, simply referencing it from the `refactor/framework` branch:

```
	pod "LFramework", :git => 'https://github.com/superarts/LSwift.git', :branch => 'refactor/framework'
	pod "LFramework/LClient", :git => 'https://github.com/superarts/LSwift.git', :branch => 'refactor/framework'
```

But there are still a bunch of things to make it a proper `pod`. Firstly I'd like to start with [making everything public](https://github.com/superarts/swift-source-kit/blob/master/bin/swift-make-all-public). I was using `PHP` as a [scripting language](https://github.com/superarts/script) for a long time, and tried to switch to `Python` but eventually went with `Ruby` since last year. As you can see in [this Git repo](https://github.com/superarts/swift-source-kit), my attempt was still very immature, but I'm very happy to start doing it in a proper way: writing script using a decent language, and releasing scripts via standard way - currently I'm going with `Ruby` and of course `Ruby gems`.

In my first ruby gem [swift-source-kit](https://github.com/superarts/swift-source-kit), currently there's only one script: `swift-make-all-public`, which makes `classes`, `structs`, `protocols` etc. public.

```
# gem install swift-source-kit
# swift-make-all-public

Missing filename.
---
Usage: swift-make-all-public.rb [options]
    -i, --input-filename=NAME        Input filename
    -n, --not-replace                Input filename
    -h, --help                       Prints this help

```

The usage is very straight-forward, and it does jobs like [this](https://github.com/superarts/LSwift/commit/7215856f87bd3ce48d502b555810965b71f3696f) and [this](https://github.com/superarts/LSwift/commit/2563e290de0764c3cb5de27ecc314961ca9a4bf6). I know it's not very helpful since no one would start a `Swift` pod with local files anymore, but it worked for me, and I'm going to work on some other scripts later.