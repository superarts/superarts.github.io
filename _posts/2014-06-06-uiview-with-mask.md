---
layout: post
title:  UIView with Mask
date:   2014-06-06 14:57:00
tags:
- Objective C
- UIKit
- LCategory
- Category & Extension
---

Can be used for rounded button or circle image, etc. It looks like:

![Mask](https://www.dropbox.com/s/jj82zassj964vqq/Screenshot%202014-06-06%2014.57.06.png?dl=1 "UIView")

Sample code:

{% highlight objc %}
[button_view_mask1 enable_mask_circle];
[button_view_mask2 enable_mask_circle];
[button_view_mask3 enable_mask_circle_width:1 color:[UIColor redColor]];
[label_view_mask enable_border_width:1 color:[UIColor blueColor] radius:5];
{% endhighlight %}

Part of [LCategory](https://github.com/superarts/LCategory)
