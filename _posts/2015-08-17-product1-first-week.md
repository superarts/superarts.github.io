---
layout: post
title:  First Week of Product1
date:   2015-08-17 15:40:00
tags: Marketing Product1
---

I have launched a survey based app since last week in China. The performance has been awful in all the aspects you can count, but that's kind of what the purpose is: I was trying to release the product as an MVP, and optimize it little by little and see what helps and what's not.

Firstly, the app starts at v2.0 and is very simple: you download it, sign up with an email address and a password without verificatioin, and then you'll have a tinder-like lists about a bunch of surveys. In order to view the results, you'll have to participate first. There's also a virtual currency `gold` in the app. You obtain gold by registering and answering surveys, and spending it by viewing the results each time. There's also a leaderboard of users sorted by gold they earn, which does nothing meaningful at the moment. The app has admob and an IAP item that sells gold.

The app starts with 20+ surveys, and now it's 90+. I added all the surveys manually about 10 a day. A user answers averagely 7.8 surveys at start, and now it reaches 10.4.

I'm not sure why but from day 1 to day 7 the download decreased quite a lot. In parse dashboard, daily active installations went down from 431 to 238, while active users were 194 to 99. However, in `iTunesConnect` the download number was 221 to 114, while App Store views being 405 to 309. This is much worse than another app of mine, I think the reason is that the screenshots are not attractive enough.

Unfortunately, I messed up 2 important things: both admob and parse tracking don't work at all. To address these issues, v2.1 is in review. It also includes some bug fixing. The next release will have some new features which is under development.

{% highlight sh %}
wget https://itunes.apple.com/cn/app/wan-mei-xing-sheng-huo-for/id400075012?l=en&mt=8
{% endhighlight %}
