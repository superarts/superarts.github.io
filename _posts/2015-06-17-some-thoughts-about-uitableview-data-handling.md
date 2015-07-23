---
layout: post
title:  Some Thoughts about UITableView Data Handling
date:   2015-06-17 14:28:00
tags: Swift UITableView LRectClient Generic LFRestTableController
---

This post is kind of a journal about adding this feature in LRestClient, and I've been working on it for several days, until the feature is actually implemented.

# Introduction

One of the goals when I'm writing code is to always avoid duplicated code. It sounds like a straight-forward principle, but sometimes the "best" approach is not that obvious. For example, considering:

{% highlight c %}
func job1() {
	perform1("task1")
	perform2("task2")
}
func job2() {
	perform1("task3")
	perform2("task4")
}
{% endhighlight %}

And:

{% highlight c %}
func perform(task1, task2) {
	perform1(task1)
	perform2(task2)
}
func job1() {
	perform("task1", "task2")
}
func job2() {
	perform("task3", "task4")
}
{% endhighlight %}

Is it worth the effort to create the `perform` function even it's going to be called twice? In this case, there will be 2 more lines. I believe there isn't a right answer for this one, and it's just a simple and extreme case. What bothered me recently is that when I'm working on some UI controllers, I feel like some of the features can be considered "generic", but it's still hard to decide which parts should be put in a library and which part should remain in the project of the product. The principle should be simple: if the logic belongs to the business itself, it should be part of the product, but still I find there are some cases that are quite similar across multiple products.

For now, I'll talk about a common case: a view that contains a table which loads its contents from an API.

# Day 1: The Question

Such example is similar with Apple's `UISearchDisplayController`, which as been replaced by `UISearchController` in `iOS 8`. From this angle, it makes sense to make it a library. However, I also found the implementation of `UISearchController` has some drawbacks. In one hand, it provides a pretty details solution; but in the other hand, it sacrificed quite some flexibility and it may prevent it to be used in some cases. To me it's not really like a class that you would expect from Apple; it's more like some `cocoapods` libraries that one thing and do it really well, and if you want customization, you can just find a most suitable one, fork it, and make it work in the exact same way you want it.

Back to the table that loads contents from API, I don't have a conclusion right now, and I'm writing this blog just help me think about if I should create a library based on this idea, and if I should, what exactly I should implement.

Here's the list I came up with some initial thoughts:

- Reload at start: `ViewDidLoad`
- Reload at refresh (optional): `ViewWillAppear`
- Reload at pull down
- Load more at pull up
- Bind LFModel with prototype cells
- Enable cache
- Show loading toast and disable UI interaction when no cache is available

# Day 2: The Problem

Firstly, I realized that binding models with prototype cells doesn't do much good. Yes, I can bind a `cell.text_title` with `object.title` together, but in reality there are always too much customization and it will not save a lot of work eventually, while implementing it is no easy task. Other features in the other hand, seem to be valid and I'd like to impelment all of them.

However, after some work, I realized that the whole thing is hard to be designed exactly as the same way I want it: a strong type solution without any type casting, however, from where we start - a reflection based data model it can't be done perfectly. Here are some facts.

1. We have a `LFModel` and its subclasses.
2. We can't have an `items` inside LFModel with correct type (mentioned [here](http://www.superarts.org/LSwift/lswift/lrestclient/lmodel/2015/06/19/new-thoughts-of-lrestclient.html) in the [LSwift Blog](superarts.github.io/LSwift/)), so we'll have to have a wrapper class, in this case, a `client` with generic type.
3. We need to put this client into a view controller based on `LFTableController`; or, we can make such controller confirm to a protocol so that the controller is a client itself. Either way it has to be generic as well.
4. And here's the problem: in the app that's calling LRestClient, we CAN'T have a view controller that is derived from the controller we created in the step above, because in `Interface Builder` the classes cannot be generic.

# Day 3: The Solution

Eventually I decide to make some compromise. In my controller, there has to be a callback function that is called when UI needs to be refreshed, and the interface is expected to be `func_relaod(items: [T])`. I don't really want to make it to be `func_reload(items: [LFModel])` and do `if let items = items as? MyModel` inside the callback function, so I end up with another approach: creating a protocol for the client to eliminate the generic factors, and there's only going to be one single cast of the client itself, instead of the data.

I'm sure my wording here may be blurry, but it will come clear when you actually read the code. I'll write a blog about how to use the new `LFRestTableController` in the [LSwift Blog](superarts.github.io/LSwift/).
