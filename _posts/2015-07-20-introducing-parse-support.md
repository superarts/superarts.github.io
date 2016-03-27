---
layout: post
title:  "Introducting Parse Support"
date:   2015-07-20 13:00:00
categories: LSwift Parse LFProfile
---

I was trying to implement an `App Profile` system recently. In short, an `App Profile` system allows your app to download a set of configurations from a back-end service after app launch, so that you can quickly make some tweaks without releasing a new version. 

While `CloudKit` is a pretty good way to go, I still chose `Parse` since I've been using it for quite a long time and it would be good to add `Parse` support to `LSwift`. For now, a simple extension has been added:

{% highlight swift %}
extension LFModel {
	func parse_class() -> String		//	get a parse friendly class name
	func parse_object() -> PFObject		//	convert to a parse object
	func parse_load(object: PFObject)	//	reload properties from a parse object
}
{% endhighlight %}

Which allows to convert an `LFModel` to/from a `Parse` object. It is only a temporary solution since it's designed solely for `App Profile` for now, and is subject to change.

[lswift]:      http://superarts.github.io/LSwift/
[superarts]:   http://www.superarts.org/blog
