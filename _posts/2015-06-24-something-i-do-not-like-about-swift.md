---
layout: post
title:  Something I Don't Like about Swift
date:   2015-06-24 10:37:00
tags: Swift Closure Range
---

It can be easily figured out that I like `Swift` very much from my activities, but nothing is perfect. However, this post is not about the disadvantages of Swift (it surely has), instead it's more about some of my personal preference.

Firstly, I don't like the fact that in `closures` you have to use `self.` to access class variables and functions. I understand there's some advantage in doing so, but my argument is that when you use closures you would emotionally think them part of the currently class, thus they should be able to access class variables and functions, and technically they surely can, and the compiler is even able to tell you `self` is missing when you try to access it. So if I was designing it, I would put class as a teriary scope inside the closures, which means if we try to access a `variable` inside a closure, it firstly looks for definition inside the closure itself, then the function that defines the closure, then the class that contains the function and so on. There should be no technical problem in it, and as I said, I think it's natural to use it in the way I described.

Another thing I don't like is the way `Swift` handles range. If you write something like this:

{% highlight swift %}
for i in 1 ... self.last_loaded {
	self.items.removeLast()
}
{% endhighlight %}

You'll have a `fatal error` if `self.last_loaded` is less than 1. Maybe it has something to do with `NSRage` in which `length` is `unsigned`, but it doesn't make to much sense: `NSRange` is just a `C struct`, and `Swift Range` is part of a language feature. So I would assume it's not due to the implementation, but is more about how it's designed. In this case, even I really like the attempt `Swift` wants to be a "strict" language and I'm enjoying features like optional chaining, this fatal error is still too much for me. My point is, `range` can be an elegant language feature, but if dynamically making it may cause a fatal error and an `if` check needs to be put beforehand, it becomes useless in a lot of cases, which leads you to fall back to the traditional way:

{% highlight swift %}
for var i = 0; i < self.last_loaded; i++ {
	self.items.removeLast()
}
{% endhighlight %}

So my second opition is that `Swift Range` should return `nil` if it's not a valid range.

Anyway I may talk about more about this topic in the future, but I won't talk things like "how slow Swift is" due to the fact that `Swift` is based on `Objective-C`, which uses a dynamic message based runtime and is slower in some tasks than C++, and it's exepcted to be slower than `Objective-C`. I'm sure Apple will be keep optimizing it and I don't appreciate the attitude to be a whiner about it, instead I would talk about how I would like it if I was put in the designer shoes and I feel like this is much more enjoyable.
