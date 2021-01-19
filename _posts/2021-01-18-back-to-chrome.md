---
layout: post
title:  "Switching back to Chrome from Safari"
date:   2021-01-18 20:23:00
tags:
- macOS
---

To summarize my experience with iMac and macOS in the past 4 years.

# Switching back to Chrome from Safari

Back in 2017, I brought my 3rd iMac (I usually sell my previous iMac before I move to a new country) with fusion drive. It is not notably slow in most of daily tasks, but it was impossible to install Windows using Boot Camp on a fusion drive. Eventually I ended up breaking it down to an 128GB SSD and a 2TB HDD, and install macOS on SSD with a bunch of `ln -s` all over the place. The setup was like:

- macOS, brew, Library, etc: SSD
- Movies, Pictures, etc: HDD
- Applications, Xcode derived data, simulators: a much slower external 256GB SSD
- Boot Camp Windows: HDD

It was quite painful to deal with occasional SSD storage shortage, so if you have a couple hundred bucks to spare, I definitely recommend you to buy an iMac with build-in SSD. Or if you are like me, you could also spend $80 on an external 1TB SSD with USB 3.1 (Thunderbolt 3 support will significantly increase the price). It is much slower than internal SSD, but you get what you paid for:

- Internal SSD: 2400 MB read, 600 MB write
- USB 3.1 SSD: 600 MB read, 400 MB write

In the recent few years, when I make significant changes to my system, usually I'll reinstall the whole macOS to get some random stuff that I installed and never used like `libusb`, `deepfake`, etc. And this time, I decided to switch from Google Chrome to Safari, mostly for the enhanced privacy protection, and the performance improvement Tim Cook promised almost every year.

Long story short, after less than a month, I decided to switch back to Google Chrome. Here are the good things about Safari:

- The `Dark Reader` extension is much better than Chrome's `Dark Mode`. It is not surprising because it is a paid software.
- Better system integration, for example Safari grabs SMS verification code most of the time. Also iCloud keychain sharing is generally better than Google's if you are using both macOS and iOS.

That's it. Sorry Tim, but all the good things you promised are lies. But before listing all the bad things about Safari, let me tell you its biggest issue: *MEMORY USAGE*. Yes, this is supposed to be the good thing about Safari, yet after using Safari, I occasionally get system hangout for half a minute or so. At first I blamed Xcode 12, but I just couldn't find any clue when I was looking at CPU usage in Activity Monitor. Until one day, I switched to Memory (I haven't been doing so for about 10 years as memory has never been a problem to me under OS X / macOS), and I found that...

SAFARI IS USING 35 GB MEMORY WITH ABOUT 10 TABS OPEN.

It's very normal for me to have 20+ tabs open in Chrome and it's never an issue. So bye bye Safari, and I'm pretty sure I will never, ever try it again with an X86 Mac. Even in an ARM mac, I'll make sure to always keep an eye on Safari. It's in my blacklist forever until it would redeem itself.

Anywhere, here are the other bad things about Safari:

- Memory management. Apart from super high memory usage, Safari clears tab contents more often than Chrome. This sounds to be physically impossible as it's using more memory, with less contents persist in memory, but this is my personal experience.
- UI responsiveness. Even Safari has less CPU usage, which I seriously doubt it's the other way around, it's not noticeable. But what is noticeable is that Safari is way less responsive than Chrome. It takes almost half a second longer than Chrome to render a webpage, which is killing my brain. It is so, so, so slow and I kept tell me "this is because it's using less memory and it helps battery drain". What a joke.
- Extensions. Even `Dark Reader` is better in Safari, other plugins are general worse, especially for Gmail notifier. Gmail's built-in notification doesn't really work, so I had to start using the Mail.app again, which is much worse than Gmail's web UI. In terms of emails, Gmail is still a better choice than others, even it's pricing model is becoming more and more annoying.
- Compatibility. I don't blame Apple for pushing privacy protection, even though it means things like Microsoft Teams refuses to work in Safari; I can accept the fact that I have to use Chrome for some tasks like Rakuten and Teams (BTW Microsoft Teams sucks, I won't explain it here but trust me it sucks). But the performance problem is unbearable.

Conclusion: I'll never trust Tim Cook again. He really should not destroy his reputation by lying about Safari every single year.
