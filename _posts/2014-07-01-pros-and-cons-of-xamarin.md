---
layout: post
title:  Pros and Cons of Xamarin
date:   2014-07-01 09:18:00
tags:
- Xamarin
- Ionic
- Swift
- Hatching Lab
---

When I worked in [Hatching Lab][http://www.hatchinglab.com], I did some initial study of `Xamarin` and decided not to use it eventually. We did however, decide to use `Ionic` for a news app afterwards. Maybe I'll write something about it later.

Pros

- Cross-platform: the same code runs on both iOS and Android
- As a cross-platform solution, it's based on native UI compoentns so the performance is not as bad as PhoneGap etc.
- As an app oriented solution, an experienced Xamarin developer will be able to deliver an app faster than game based solutions like Cocos2d-js
- Best for a mockup apps since they don't require a lot of UI customisation, i.e. doing the most basic things

Cons

- As a cross-platform solution it doesn't support platforms as many as `Cocos2d-js` does
- Unlike Cocos2d-js which is free, Xamarin costs $999 a year for business plan
- Lastest support for each platform (iOS / Android) is always slow since Xamarin doesn't have a better channel to work with Apple & Google than any other native developers
- To become a good Xamarin developer, one needs to master C#, .NET, Xamarin SDK, Xamarin IDE / VS, so:
- An experienced Xamarin developer is hard to find and the eco system based on Xamarin is not as strong as native iOS / Android community, e.g. in stackoverflow tags
  - `android`: 603,241
  - `objective-c`: 211,677
  - `xamarin`: 13703
  - `swift`: 37441 (and it's only released less than half a year while xamarin is there for years)
- Smaller ecosystem means it's harder to find answers and will lead to longer time of problem solving
- Harder to integrate with open source iOS / Android libraries
- Harder to make an app with a well-designed UI
