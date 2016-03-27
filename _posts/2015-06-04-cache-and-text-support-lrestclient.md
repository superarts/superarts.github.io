---
layout: post
title:  "Cache and Text Support in LRestClient"
date:   2015-06-04 14:50:00
categories: LSwift LRestClient Cache
---

My work of `LRestClient` heavily reflects the work I've been doing: whenever I need something done and there's a chance that the same feature may be used somewhere else in the future, I'd try to build an interface that is not likely to be changed in the future, and implement it in the library. The ideal situation is that future refactor never change the API itself so that it won't break the other apps that are using the library. In some very rare cases I make mistakes about that, but in most cases I'm careful enough to avoid such situation.

It would be good for me to talk about some experience regarding refactoring, but here I'm going to talk about new features. The first thing is support for cache. In modem app design, cache is used in almost all `GET` related tasks and a lot of `POST` related tasks as well, except for tasks like user sign up etc. if `POST` is used instead of `PUT` here - while [POST or PUT](http://stackoverflow.com/questions/630453/put-vs-post-in-rest) is an interesting topic we're not going to talk about it here.

The best practise of using cache can be tricky in some occasions, but the most common case is:

1. App looks for cache for a request;
2. App loads from cache and reload UI if cache is valid for the request;
3. App tries to finish the request with server;
4. If new contents is different with cached contents, reload UI.

In `LRestClient`, this behavior is called `LRest.cache.policy.CacheThenNetwork`, although item #4 is not implemented yet (it will be pretty easy though, check the `TODO` item around line 150 in `LClient.swift` if you want). Here is an example:

{% highlight swift %}
static func list_all(block: (([ICSubcategoryModel]?, NSError?) -> Void)?) {
	let client = ICRestClient<ICSubcategoryModel>(api: IC.api.subcategory_list_all)
	client.cache_policy = .CacheThenNetwork
	client.func_array = {
		(results: [ICSubcategoryModel]?, error: NSError?) -> Void in
		if block != nil {
			block!(results, error)
		}
	}
	client.execute()
}
{% endhighlight %}

In this example, our client tries to get the list of all the subcategories, and cache this call for future use. A reasonable argument would be: should we download the contents and save them to local database, for example CoreData based? As I said in the introduction to `LRestClient`, I don't want to make things over complicated if it's not needed. As long as it's not going to be a performance issue in a foreseeable future, using cache is a more nature approach and only requires one line of additional code. In the other hand, while `LFModel` supports serialization/deserialization, it always require more code to get a local database up and running.

Another thing I want to talk about is the support for text messages like "now loading" etc. I haven't created a protocol yet since I'm still having doubts of the best practise of it, but the code is quite simple: overriding a bunch of UI related functions `text_show`, `text_hide`, `error_show` and you're ready to go. Here's an example based on `MBProgressHUD`:

{% highlight swift %}
class ICRestClient<T: ICModel>: LRestClient<T> {
	override init(api url: String, parameters param: LTDictStrObj? = nil) {
		super.init(api: url, parameters: param)
		root = IC.api.root
	}
	override func text_show() {
		let window = UIApplication.sharedApplication().delegate!.window!
		MBProgressHUD.show(self.text!, view:window!)
	}
	override func text_hide() {
		let window = UIApplication.sharedApplication().delegate!.window!
		MBProgressHUD.hideAllHUDsForView(window!, animated:true)
	}
	override func error_show(error: NSError) {
		let window = UIApplication.sharedApplication().delegate!.window!
		MBProgressHUD.show(error.localizedDescription, view:window!, duration: 2)
	}
}
{% endhighlight %}

In this case, when `client.text` is set, it will be displayed when before the URL call is started, and hidden when a response is received.

The reason why I mention the support for cache and text together is that you can write some code like this to get the work together:

{% highlight swift %}
	client.cache_policy = .CacheThenNetwork
	client.text = IC.str.loading	//	"loading"
{% endhighlight %}

In this case, text will not be displayed if the cache is there. This behavior is not 100% of the real life cases, but in most cases, when UI is reloaded with cache, you can live with it and refresh the UI when new contents is fetched. So here's the thing I've talked about in the beginning: something like "text behavior when cache is there" is likely to be introduced in the future, but to design it properly, more real life cases are needed, as well as different cache policies as well. Will there be 2 kinds of texts, like one is blocking the UI and the other is not? Will an Android-like toast system should be introduced, or should I assume that notification-like message is better? I tend to not make decision based on my assumption, and when I gathered more information about how to make a useful app, I'll add these and leave the old behavior as default. For example, cache policy is set to .None after it's introduced, so that the old apps will work in the same way.

As always, all I mentioned here are some quite basic principles of mine. You may not agree with all of them, but you got to have your consistant principles based on your solid understanding of the tasks you undertake, and maybe adapt them in the future based on the new knowledge you learn.
