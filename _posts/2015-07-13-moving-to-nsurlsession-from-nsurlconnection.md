---
layout: post
title:  "Moving to NSURLSession from NSURLConnection"
date:   2015-07-13 11:37:00
categories: LSwift LRestClient NSURLSession NSURLConnection
---

Recently the server team I'm working with wants to work in a way that when an API call fails, while respoding with an error code, a JSON object is also going to be returned. This makes sense in some cases, for example when a register attempt fails due to multiple reasons, an array like `["email format is not valid", "username is too short", "password does not match"]` is returned. (In this case all these errors can and should be handled on the app side though.) However, the problem is that it simply cannot be achived with `NSURLConnection`: if the response code is not `2xx`, `connection:didFailWithError` will be triggered and `didReceiveData` will not be triggered at the same time, and vise versa.

From iOS 7.0, `NSURLSession` has been introduced and due to the requirement mentioned above, I think it's time to move to it. From now, by default `NSURLConnection` will be used by `LRestClient`, and you can change this by writing something like:

{% highlight swift %}
client.connection_class = .NSURLConnection
{% endhighlight %}

The reason why I keep a "legacy mode" here is that I cannot get authentication work. Some people said in iOS 8 there's some bug that prevents the delegate methods of `NSURLSession` being called, and I need to spend more time to get it work. Before it's worked out, `NSURLConnection` can be used as a work-around.

[lswift]:      http://superarts.github.io/LSwift/
[superarts]:   http://www.superarts.org/blog
