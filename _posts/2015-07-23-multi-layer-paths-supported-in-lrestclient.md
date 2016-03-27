---
layout: post
title:  "Multi-layer Paths are Supported in LRestClient"
date:   2015-07-27 11:25:00
categories: LSwift LRestClient Elastic
---

Recently I've asked to use `Elastic Search` directly to improve search performance. Besides the [funny compiler bug](http://www.superarts.org/blog/2015/07/20/app-stops-at-breakpoint-with-no-reason/) I've spotted, the JSON format of the response data has been significantly changed to something like this:

{% highlight json %}
{
	"took": 2,
	"timed_out": false,
	"_shards": {
		"total": 5,
		"successful": 5,
		"failed": 0
	},
	"hits": {
		"total": 15950,
		"max_score": 1,
		"hits": [
			{
				"_index": "business",
				"_type": "entity",
				"_id": "2001",
				"_score": 1,
				"_source": {
					"id": 2001,
					"name": "Business Name 001",
					...
				}
			}
		]
...
{% endhighlight swift %}

Which means to parse the data, you have to call something like `obj["hits"]["hits"][X]["_source"]` and loop through X to get the actual data:

{% highlight json %}
{
	"id": 2001,
	"name": "Business Name 001",
	...
}, {
	...
}
{% endhighlight %}

`Paths` and `Subpaths` are introduced to handle this kind of situations. Simply set them like this:

{% highlight swift %}
client.paths = ["hits", "hits"]
client.subpaths = ["_source"]
{% endhighlight %}

And the client will look for `obj["hits"]["hits"]` to get the array, and parse each objects in the array using subpath (in this case only one layer, but multi-layer has been supported as well). For now they are only available in `func_array`, and `func_model` only supports the only one-layer `path` parameter. It would be easy to add it though, and I'll do it when it's required in real life.

[lswift]:      http://superarts.github.io/LSwift/
[superarts]:   http://www.superarts.org/blog
