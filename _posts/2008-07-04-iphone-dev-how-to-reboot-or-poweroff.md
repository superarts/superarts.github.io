---
layout: post
title:  iPhone Dev - How to Reboot or Poweroff
date:   2008-07-04 12:00:00
tags:
- iOS
- Toolchain
---

Toolchain only, iPhone OS 1.x:

{% highlight objc %}
#import <sys/reboot.h>
...
reboot(RB_HALT); // poweroff
reboot(RB_BOOT); // reboot
{% endhighlight %}
