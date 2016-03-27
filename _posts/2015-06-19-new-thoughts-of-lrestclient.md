---
layout: post
title:  "New Thoughts about LRestClient"
date:   2015-06-19 16:38:00
categories: LSwift LRestClient LModel
---

I was talking about solutions like `Parse` allows you to get data from model, however when I think about it, it's actually impossible. The fundamental difference between Parse and LModel is that Parse uses subscript to get properties and thus is weak-typed, while LModel is not, and either Swift or C (which is what Objective-C builds upon) is strong-typed.

Consider this: build a rest client into a data model may seem to be too much, but a bigger problem is that the follow code is impossible in `Swift`:

{% highlight swift %}
class LRestObject: LFModel {
	var items: [LRestObject] = []	//	replace hard-coded LRestObject with dynamic type of the class self
	let client = LRestClient<LFModel>()
}
...
let obj = MyRestObject()
let items: [MyRestObject] = obj.items 
{% endhighlight %}

Instead we'll have to write something like `class LRestObject<T:LFModel>: LFModel` which doesn't make sense at all. I mean, if we have to write `class MyRestObject<T:MyRestObject>: LRestObject<T>`, why we don't write `class MyRestClient<T:MyRestModel>: LRestClient` instead? In this case split data model and REST client is the right way to go. Even in Objective-C this is basically cannot be done.

I also thought about coming up with something like `class LFRestTableController<MyModel>: LFTableController`, but generic type cannot work with interface builder since in IB class needs to be determined at design-time, while I suspect Swift generic classes get generated at compile-time (maybe they implement it in run-time, but that would not be a good idea perform-wise).

In the end, I need to address all of these and come up with some solution. I have described more of them in my [tech blog](http://www.superarts.org/blog/2015/06/17/some-thoughts-about-uitableview-data-handling/) and will write a post about my final solution later.
