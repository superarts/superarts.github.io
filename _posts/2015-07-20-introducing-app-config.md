---
layout: post
title:  "Introducting App Profile"
date:   2015-07-20 14:10:00
categories: LSwift LFProfile Parse CloudKit
---

I've mentioned in a previous post about `App Profle`, which was named `App Config` (`LFConfigModel`) previously. In Swift, to define some constants I've been using struct. It has some drawback but the code looks quite clean:

{% highlight swift %}
struct MyConfig {
	struct URL {
		static let root = "http://na.com"
		static let promotion = "http://nb.com"
	}
	struct API {
		static let list = "v1/list"
		static let detail = "v1/detail/"
	}
}
//	To use: LF.log("root", MyConfig.URl.root)
{% endhighlight swift %}

`App Profile` allows you to define constants in a similar fashion, but with back-end support: such "profiles" can be managed on the server side. For example, you can change some call-to-action texts and background colors to find the best visual composition for marketing, or even some of the URLs. You can use something like `Google Tag Manager` to achieve something like this, but in `LSwift` it's much easier to use. For example, you can define the profiles in this way:

{% highlight swift %}
class MyURLProfile: LFProfile {
	var root = "http://na.com"
	var promotion = "http://nb.com"
}
class MyAPIProfile: LFProfile {
	var list = "v1/list"
	var detail = "v1/detail/"
}

struct My {
	struct config {
		static let is_publisher = false
		static var url = MyURLProfile(publish:is_publisher)
		static var api = MyAPIProfile(publish:is_publisher)
	}
}
{% endhighlight %}

Although `CloudKit` would be the ideal back-end service, currently `Parse` is the only one that's supporteddue to the projects I'm currently working on, which means you'll have to init `Parse` before using `App Profile`. After that, if the `is_publisher` argument is set to `true`, the app will upload the profiles to the back-end service, which should be run at least once during development. After that, please set it to `false` so that it will:

- Try to get profiles from cloud;
- If profiles are obtained, they will be applied and saved locally;
- Saved profiles will be loaded straight away when the app is launched next time.

There should be a flag to disable changing profiles in an app session, which you may not like to do e.g. changing tab orders in an app session is not a good idea. It's not implemented yet so please keep it in mind that the app profiles can be changed anytime after the first time you call them:

{% highlight swift %}
LF.log("root", My.config.url.root)
{% endhighlight %}

One more thing: I've talked about putting texts into `App Profiles`. I've already been working on a localization solution, which will support `Storyboard` and probably `App Profile` later. It will be put into the `LThemeManager`.

[lswift]:      http://superarts.github.io/LSwift/
[superarts]:   http://www.superarts.org/blog
