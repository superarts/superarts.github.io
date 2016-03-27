---
layout: post
title:  "Introducing LFRestTableController and LArrayClient"
date:   2015-06-24 13:44:06
categories: LSwift LRestClient LFRestTableController LArrayClient
---

As I mentioned in a [previous post](http://www.superarts.org/LSwift/lswift/lrestclient/lmodel/2015/06/19/new-thoughts-of-lrestclient.html) and [another blog of mine](http://www.superarts.org/blog/2015/06/17/some-thoughts-about-uitableview-data-handling/), it's a common case for us to load `table views` from URL calls. 2 classes have been created to help us deal with this kind of scenarios. Please note that although something brand new will be discussed, you can always use `LRestClient` in the old way, with some bugs fixed.

Firstly a new class `LArrayClient` is created based on `LRestClient`. It's generic, strong typed, and has an `items:[T:LFModel]` property that holds all the objects stored. It confirms to protocol `LTableClient` so that table view controllers can use it while the controllers being non-generic (due to the technical limitation we have). I'll explain how to use it in detail.

In my current app, we have a "last ID" based pagination system, in which the app adds a "last ID" property to tell the URL it wants to load the next 20 items after "last ID". The most common pagination system is skip/count based, and it will be implemented later. The following code creates a base class for the app with cache and toast support.

{% highlight swift %}
class ICArrayClient<T: ICModel>: LArrayClient<T> {
	override init(api url: String, parameters param: LTDictStrObj? = nil) {
		super.init(api: url, parameters: param)
		root = IC.api.root
		cache_policy = .CacheThenNetwork
		pagination_method = .LastID
		pagination_key = "last_loaded_id"
	}
	override func text_show() {
        IC.show_text(self.text!, duration:nil)
	}
	override func text_hide() {
		let window = UIApplication.sharedApplication().delegate!.window!
		MBProgressHUD.hideAllHUDsForView(window!, animated:true)
	}
}
{% endhighlight %}

In my previous post, I mentioned that I preferred to put all client calls together. While we can still do that, I'm trying a new practise like this:

{% highlight swift %}
class ICMessageListClient<T:LFModel>: ICArrayClient<T> {
	init() {
		let api = String(format:IC.api.message_list, IC.complaint!.id)
		super.init(api: api)
	}
}
{% endhighlight %}

Which, obviously, loads messages from an API. As the last step would be calling them in the UI code, here comes the `LFRestTableController`:

{% highlight swift %}
class ICDetailController: LFRestTableController {
	override func awakeFromNib() {
		super.awakeFromNib()
		pull_down = .Reload
		pull_up = .More
		reload_table = .Always

		let c = ICMessageListClient<ICMessageModel>()
		c.func_reload = {
			(messages) -> Void in
			self.reload_message_table(messages)
		}
		client = c
	}
	//	...
}
{% endhighlight %}

Here we tell the table view controller to always reload the contents while `viewWillAppear`, and enable the "pull down to reload" / "pull up to load more" stuff. Then we create a client, set up the callback function `func_reload` to do the `table.reloadData()` things. I really hate the last `client = c` line, which assign the client as `LFTableClient`, but I explained why it has to be there and this is the least ugly approach I found. I wish I could just writing `client = ICMessageListClient<ICMessageModel>()` but unfortunately I don't know how to get that work.

Anyway, now all the reloading / pagination part has been done, and all you need to do is implement your `reoad_message_table` function with a native object array, and hopefully you'll be able to write elegant code in this way, which is the intention for me to make `LRestClient`.

PS: To enable any pull-up related actions, I'm using a pod called `CCBottomRefreshControl`. Without that installed the function does not work.

[lswift]:      http://superarts.github.io/LSwift/
[superarts]:   http://www.superarts.org/blog
