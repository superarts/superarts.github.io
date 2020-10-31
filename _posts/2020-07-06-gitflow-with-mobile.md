---
layout: post
title:  Gitflow vs Mobile Development
date:   2020-07-06 15:53:00
categories: Git
tags: Git iOS Strategy
---
 
# Gitflow vs Mobile Development

I was writing an article to explain why gitflow may not work well for some mobile use cases. But after reading some articles, I figured it's already a known problem and most people are not blindly following gitflow, so I decided not to invent the wheel again. Some highlights about branching strategy in general:

## Master Branch

`master`, or `main` branch (PC warning: 英语并非我的母语所以master代表啥意思我一点也不感兴趣), doesn't provide much value in mobile development. It is different with web applications. For example, if you are requesting some "mywebsite.com", at least it will read some `my.js` libraries and some `my.css` style sheets, which should be there in the `master` branch. But for mobile apps, AppStore or Play Store binaries don't rely on a certain codebase. Of course, you could use `master` as "the latest prod tag", but again there is not much value.

## Live Branches

Branch should only be used for a purpose that it's "ongoing". In this sense, usually we have `develop` and `release`. But the tricky part of mobile app is that it could be deployed to different channels, for example dev, QA, and production. If the same codebase can be used, with flag(s) that defines different feature sets, behavior etc. then it is no difference with web applications. And there is an agile-based release strategy, it is OK to use Gitflow.

## Different Codebases

However, if you are like me and live in a world with more strict release strategy, just feel free to get rid of Gitflow. In my case, we need to maintain different codebases at the same time. Let's say Codebase A comes before Codebase B. We have a `release-a` branch, then have another `release-b` branch, and both of them are ongoing. Why? Doesn't everyone love the latest `release-b` with more bugfixing, better refactoring, and so on? Because `release-a` has been "verified" and "approved" at a time, and any attempts to apply changes other than specific bugfixing will invalidate those verifications and approvals. This is not "technical" technical at all, it's for the sake of documentation. And in this case, a bug fix for `release-a` may not be easily ported to `release-b` for obvious reason.

## Conclusion

Again, this is not an article, but just a summary about my current approach. All my points here are well discussed by others already.
