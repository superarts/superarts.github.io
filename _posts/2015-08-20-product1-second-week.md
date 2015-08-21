---
layout: post
title:  Second Week of Product1
date:   2015-08-17 15:40:00
tags: Marketing Product1
---

Technically it's not near the end of the 2nd week since the app launched, but since version 2.1 has been approved and online for more than a day, I'd like to do a little summarize.

Firstly, as soon as version 2.1 went live, I submitted version 2.2 with 2 big changes. The first one is updating icon and screenshot. As I said, currently the App Store visit / download conversion rate is about 50%, which is too low comparing with some other apps of mine. The proper way of improving this is to spend a small amount of money in A/B testing some different call to actions, but I'm not doing it since it's just a test. Anyway, previously the screenshots are the survey screens, and in the update I used a template from [LaunchKit.io](http://launchkit.io) with new screenshots with more texts. If this is not going to work, I'll do more study about screenshots ASO (App Store Optimization).

Secondly, there are totally 1.7k users and 19.3k votes now, so average votes went up to 10.9. It suggests that most user will not re-launch the app and the actual daily active user count is around 100-150. It shows that the concept of this app is not a very good one, but it's totally fine since with the minimal feature set there's no way for an app to have amazing retention rate at the beginning. However, increasing user engagement is not the first priority for now: relatively complex feature needs to be implemented, and as long as the basic of this concept of this app is not proven to be working, there doesn't make too much sense to add new features. So what's needed to be done now is to analyze how people are using this app:

### Overall

More tracking tools should be added for various reasons, for example, listing all events in `Parse analyze` is kind of painful. Perhaps I'll had `Flurry` in the incoming version 2.3.

### General

`app opens` are almost twice as `app launch`: user opens the app twice a day on average. **`app-launch-first` needs to be added.**

- app-opens: 357
- app-launch: 172

There's a small chance that ads banner is not loaded or tinder is not loaded.

- app-launch: 172
- tinder-load: 169
- gad-banner-init: 168
- gad-banner-error: 25

There's a little bit off here, but in general it's no big deal. Probably shouldn't pay attention to this.

- tinder-load: 169
- tinder-survey-load: 844

### Survey

- tinder-survey-next: 98
- tinder-survey-share: 29
- tinder-survey-share-done: 2

### New Users

I think 120 are the new users since users are not likely to logout, but probably I should add some tracking to see if that's the case.

- app-launch: 172
- user-loaded: 120 (email/password page)

`user-signup` needs to be separated. Conversion seems to be OK though.

- user-signin: 109
- user-signup: 152
- user-signup-success: 22
- user-signup-error: 5

- user-signin-success: 33
- user-signin-error: 100

### Tabs

Surprisingly, most users are not going to click through all the tabs to see what the app is able to do. **Home page needs to offer an integrated user experience.**

Only less than 1/3 users are checking settings tab, and they won't bother clicking the items.

- app-launch: 172
- setting-appear: 50
- setting-select: 14
- setting-select-show-rules: 7
- setting-update-nickname: 2

Only less than 1/4 users are checking leaderboard. about 10%+ users use the reload button.

- app-launch: 172
- leaderboard-loaded: 39
- leaderboard-reload: 46

### Answer

Users are not viewing answers? It needs optimization. Also, about 10% users click the reload button manually.

- app-launch: 172
- answer-loaded: 199
- answer-reload: 226
**I messed something up here: `answered-loaded` has been added as `asnwer-loaded` as well.**

Yes, most users are not viewing answers.

- tinder-answer-done: 368
- tinder-menu-skip: 238
- tinder-menu-check: 110
- tinder-menu-share: 0

### Misc

10% users are willing to submit question, but this part is tricky. I'll leave it for later.
- tinder-add: 26
- tinder-report: 8
- leaderboard-report: 1

- tinder-memory-warning: 14 - Performance appears to be OK.
- gad-banner-disabled: 0 - It works as intended.
- iap-charge1-success: 1 - IAP won't work like magic.
- iap-charge1-error: 2

### Conclusion

I was thinking about adding features like tagging to increase engagement, but according to the tracking results, the biggest problem could be the number of users who are viewing the result page. If they are not checking the results the app will be useless, so I need to improve this first. Better tracking will also be helpful.

{% highlight sh %}
wget https://itunes.apple.com/cn/app/wan-mei-xing-sheng-huo-for/id400075012?l=en&mt=8
{% endhighlight %}
