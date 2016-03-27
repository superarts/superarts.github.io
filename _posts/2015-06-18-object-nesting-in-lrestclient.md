---
layout: post
title:  "Object Nesting in LRestClient"
date:   2015-06-18 14:43:00
categories: LSwift LRestClient LModel
---

Recently the backend guys I work with in a project decided to change the response format from:

{% highlight javascript %}
[obj]
or
[obj1, obj2... ]
{% endhighlight %}

To:

{% highlight javascript %}
{success=1, result=obj}
or
{success=1, results=[obj1, obj2... ]}
{% endhighlight %}

Which made me realized that althought I've added `path` support for the object based scenario, format like `{success=1, results=[obj1, obj2... ]}` hadn't been supported yet. So I added the missing code and both the scenarios are covered now. You can simply add:

{% highlight swift %}
client.path = "result"
or
client.path = "results"
{% endhighlight %}

So that `LRestClient` looks for the `path` key in the response data, and tries to parse from there instead of the root level. Of course, this is not the ideal solution since information of `success` will be discarded, and if you're starting from scratch or you have time to refactor the whole project, what you should start with is something like:

{% highlight swift %}
class MyAnotherModel: LFModel {
	var success: Int = 0
	var error: String?
	var object: MyObjectModel?
	var objects: [MyObjectModel] = []
    required init(dict: LTDictStrObj?) {
        super.init(dict: dict)
		reload("object", type: NSStringFromClass(MyObjectModel))	//	reload as object
		reload("objects", type: NSStringFromClass(MyObjectModel))	//	reload as array
	}
}
{% endhighlight %}

However, if you're already in the middle of something and just want everything to work again, or you don't care about other parameters anyway, then the `path` key can be really useful.

PS: as I commented inside `LClient.swift`, I should add nesting support for path later, which means you can find a nested object inside the response data. I'm not really having a real life case that this feature is actually needed so I'm leaving it there, and it's not hard to implement anyway.
