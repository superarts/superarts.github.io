---
layout: post
title:  Adding New Targets to a Xcode Project
date:   2015-09-02 10:46:00
tags: Xcode Target XCConfig
---

I've been working on a project with a lot of targets (10+) recently, and we're keep adding new targets when new customer comes. It was built by someone else and it uses a different approach I would use myself, but the good thing is that it makes sense in its own way. However, I noticed that in some targets things were not done properly, so while I'm adding new targets, I'd also like to fix these and write something down to note what the proper process should be to add new targets to a `Xcode project`. I'd assume this project is a part of a `Xcode workplace` managed by `Cocoapods`, and is managed by `Xcode 6` which is the current version whilst I'm writing this article.

My Way
===

If I'd do it in my way, it would be quite simple to describe: I'd create `C` / `Swift` compile flags in target settings to indicate which target it is, only put consts that I have to put (e.g. `Facebook` app ID`) in `info.plist` files, and use `#if ... #elif ... #endif` to manage all consts in code, with help of things like [App Profile](http://www.superarts.org/LSwift/lswift/lfprofile/parse/cloudkit/2015/07/20/introducing-app-config.html).

And that is not the way to go this time. Here's how it works:

Adding Target
===

Normally you start with duplicating one of your current targets, and here the pain starts. Instead of asking you for a new target name, Xcode names it as `OldTarget copy` and the first thing you need to do is Change it to `NewTarget`, and search for the string `copy` inside the target settings, then change them to something looks nice, especially the `Info.plist` file. You also need to actually locate the file and rename it, and maybe do something more if you use `xcconfig` with it.

Info.plist
===

In the Info.plist file, you can set your own key/value pairs in a hard-coded way, or define them in `xcconfig`s and set values to ${VALUE_NAME_IN_XCCONFIG}. Either way, you'll be getting these values from `NSBundle`:

{% highlight objc %}
NSDictionary* info = [[NSBundle mainBundle] infoDictionary];
NSString* value = info[@"KEY"]
{% endhighlight %}

XCConfig
===

You can set up different `xcconfig`s for different targets, and assign them to different targets in your project setting. The cool thing about `xcconfig` is that you can set up some sort of dependencies to make the values more organized, which makes better than writing everything in `Info.plist` directly. For example, you can have a NewTarget.xcconfig like this:

{% highlight objc %}
#include "BaseTarget.xcconfig"
KEY_OVERRIDE = NEW_VALUE
{% endhighlight %}

It's not really better than using code as I would do myself, but if someone who hates code need to do some management using `Xcode`, then this will make him feel much better than editing `#define KEY VALUE`. However, you'll need to be careful if you want to include multiple files that have the same keys, I'm not sure why but `Xcode` handles it in a werid way so I'd say avoid it. If you're using `Cocoapods`, it also worths to mention that the typical approach is to create a `NewTargetConfig.debug.xcconfig` and a `NewTargetConfig.release.xcconfig` with contents like:

{% highlight objc %}
//	debug
#include "../Pods/Target Support Files/Pods/Pods.debug.xcconfig"
#include "NewTarget.xcconfig"

//	release
#include "../Pods/Target Support Files/Pods/Pods.release.xcconfig"
#include "NewTarget.xcconfig"
{% endhighlight %}

And assign them to different targets instead of using `NewTarget.xcconfig` directly, which is obvious.

What's Next
===

I need to study more about automatic build solutions like `FastLane` to figure out the best practise of automating all these stuff later.
