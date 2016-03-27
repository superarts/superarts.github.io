---
layout: post
title:  "Moving Forward"
date:   2016-03-26 16:58:00
categories: LSwift LThemeManager LFLocalizable LFParseLocalizable Parse
---

## Moving forward - A brief history about LFramework and its future

`LSwift` hasn't been updated recently since my main focus was on existing projects, and in the end of last year, it seemed that it's time to move to iOS 8, which means I'll be able to take the advantage of dyanmic framework and make this library a proper `pod`.

Currently the development work is on the `refactor/framework` branch. It is still in progress, but can be checked out and used as a local pod. Changes include:

- Provided as a `pod` with `subspecs`.
- Added an example project.
- Added `tests` based on `Quick` and `Nimble`.
- Renamed to `LFramework`.

Here's a brief history about the last bit. I got my 1st gen iPhone in the May of year 2007, mainly because of the video that showed adding 3rd person to the current call and zooming in and out on the Map app. I've never seen any animation that smooth before, and the resolution is as high as 320x480 on a 3.5 inch screen, and it only takes 3 seconds to start an app... It was impossible to not have such a powerful device. BTW I still used it to jailbreak my `PlayStation 3` in 2010. But unlike `Android`, Apple thought web apps would be the future, so I just used it as a regular phone since I was mainly a firmware developer and more familiar with `C` and `C++` instead of `PHP` and `Javascript`.

I used to write homebrew applications for Nintendo DS and Sony PSP back then, and in the early 2008, unofficial toolchain of `iPhone OS` was released. The hardware of iPhone was much better than other handhold devices, and it provides a fully powered `*nix` OS - you can even `ssh` in and do cool things like `tcpdump`! It started to work on it since `1.1.2` until `iPhone OS 2.0` was released with the official SDK. I purchased my first `MacBook Pro` and became an independent iOS developer.

During 2008 to 2010, I came up with a bunch of apps of my own, and some other works jobs for banks and media companies in China, Singapore, and Australia. I built my personal shared library [MQKits](http://en.superarts.org/development/ios-development/lykits-documents), and in 2011 it was renamed to [LYKits](https://github.com/superarts/LYKits). I've been hosting it in `bitbucket` as a private repo, which was a huge mistake since I was quite early to start working on iOS development and should have contributed more to the scene. 

In year 2014, I found `LYKits` had grown too large with components hadn't been used for ages, and `cocoapods` had became an industrial standard. So I planned to rename it to [LFramework](https://github.com/superarts/lframework) that would contain components like `LCategory`, `LUIKit`, `LCocos2dx`, etc. It never happened though and the only component there was [LCategory](https://github.com/superarts/LCategory). The main reason is that I almost fully moved to [LSwift](https://github.com/superarts/LSwift) in the end of 2014, and that was where this blog began.

My current plan is to carry on with my old intention. `LSwift` was just a temporary solution and it was released as source files because iOS 7 was still a thing last year, and now it's time to move on. Other than the changes I mentioned in the beginning of this post, here are something I'd also like to do:

- Adopt to more commonly used naming convension. My plan was using things like `LFoundation`, `LClient` with prefix `LF`, `LC` etc. but it may not be the best idea.
- Stop using underscore. `iHatedCamelCase` and still hate it, but again it may not be the attitude.
- Scope change. A lot of classes are not made to public yet.
- More tests.

The changes may affect how the repos are structured. I'll be making things functional first, and at the same time, when I'm writing new posts about `LSwift` and its descendants, they will be publised to my [main blog](www.superarts.org/blog) as well.

[lswift]:      http://superarts.github.io/LSwift/
[superarts]:   http://www.superarts.org/blog