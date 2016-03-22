---
layout: post
title:  Do not Rely on Apple's Beta nor GM
date:   2015-09-25 12:58:00
tags: XCode Apple iOS Mac
---

Previously I didn't do app releases twice a months, so normally I don't have to install 2 OSes or Xcodes at the same time. Back in year 2010, I decided to try a beta version of iOS 4 with Xcode, and that was a nightmare. Since then I never bothered to try Apple's beta anymore. New features from a beta version are always cool but it takes too much additional time to deal with Apple's `s`, and I would start with GM versions since they are normally stable. GM used to be identical with the release version. Since several years ago it was not the case anymore (there were even something with GM2), but it didn't break things.

Until this year 2015. OS X 10.11 GM itself was fine, but it would try to wrongly update itself to 10.11.1 beta, which was a disaster because I didn't pay attention and installed it right away. I didn't releazed it until I was asked to submit a new version for review, and BAM Apple tells me it's an invalid binary since it came from a beta OS that runs a legit Xcode which uses a legit iOS SDK. Luckily I could revert to 10.11 GM just by re-downloading and re-installing it, but right after it's installed it prompted to apply the `10.11.1 beta` update again. So I need to stay awake and not reboot my OS and wait for 5 days to see it will be addressed when the public 10.11 is released.

![Mask](https://www.dropbox.com/s/489w82n65657q89/Screenshot%202015-09-25%2011.36.26.png?dl=1 "Screenshot")

So if you must install a beta or GM, don't replace your current environment with it. Due to the much shorter release cycle (a new OS X every year), GM is not safe anymore.