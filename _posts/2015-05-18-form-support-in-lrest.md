---
layout: post
title:  "Form Support in LRest"
date:   2015-05-18 15:40:00
categories: LSwift LThemeManager LRest
---

Most of the time, I would prefer to post `JSON` data as `Content-Type`, since I can make client code simple yet powerful. It is easier to deal with nesting, encoding, type-casting with `application/json`, however when it comes to file uploading, we'll have to encode the binary data in order to put it in a JSON object, and format like base64 encoding will make the `HTTP` payload bigger. If we do care about performance here, we may use `multipart/form-data` instead.

Recently I added multipart/form support in `LRest`. It's still in the early stage but the goal is still to keep it easy to use. Here is an example:

{% highlight swift %}
	var dict = complaint.dictionary
	let client = ICRestClient<ICResultModel>(api:IC.api.complaint_list, parameters:dict)
	client.method = .Post
	if let data = data_image {
		client.content_type = LRest.content.form
		client.form_keys = ["file"]
		client.form_data = [data]
	}
{% endhighlight %}

In this case, `LRest.content.form` replaces the default content_type, which is `LRest.content.json` (I'll change it to enum later since it's better supported in `Swift`), and key/data pairs are assigned to the client itself directly. Currently the data type is hard-coded as `image/jpeg` which should be set by user, or determined by `LRest`.

`Parameter` support is not as good as JSON either. `Array` objects cannot be nested, and value.description is used for all the other objects. It's not hard to fix these issues, and I'll start working on them when it's needed.
