---
layout: post
title:  "About LModel and LRestClient"
date:   2015-05-01 17:45:00
categories: LSwift LRestClient Gossip Modelling RESTful
---

I asked a question regarding `NSURLConnection` on [stackoverflow][stackoverflow] about why `NSURLConnectionDelegate` and `NSURLConnectionDataDelegate` don't work for generic classes. Someone asked me why I would like to use generic class in the first place. I think one of the reasons he asked was that generic is a newly introduced feature in `Swift` and it's may make things more complicated than they should be. I briefly answered it in [the original question][stackoverflow], but I'd like to write more about `LRestClient`. I'll start with an example about getting notifications from an API call, and will explain the idea behind it later.

Before I start, I need to point out that the following contents may sort of look like what `CloudKit` is offering, but I came up with the design in the early 2014, which was before CloudKit was released. The reason why I'm still working on this instead of switching to CloudKit is that I still need to program with our own REST servers, and even if I don't, I would still choose cross platform solutions like `Parse` because they are... Cross platform. Anyway let's start.

Firstly, let's assume that we have an app with a random namespace `FF`, and we're trying to get a bunch of notifications from an API called `FF.api.notification_list`. It has nothing to do with `LSwift` itself but such code looks pretty compact in `Swift`.

{% highlight swift %}
struct FF {
	struct api {
		static let root = "http://api.superarts.org/"
		static let notification_list = "users/notification_list"
	}
}
{% endhighlight %}

The format we're expecting is a `JSON` array with objects with keys `content`, `is_read`, and a `message_type`. So let's start from a subclass of `LFModel`:

{% highlight swift %}
class FFNotificationModel: LFModel {
	var content: String?
	var is_read: Int = 0
	var message_type: String?
}
{% endhighlight %}

We also need a subclass of LRestClient. In this example we don't have authentication, so it's just about putting our API root in:

{% highlight swift %}
class FFRestClient<T: LFModel>: LRestClient<T> {
	override init(api url: String, parameters param: LTDictStrObj? = nil) {
		super.init(api: url, parameters: param)
		api = url
		root = FF.api.root
	}
}
{% endhighlight %}

The recommended approach here is wrapping up our REST client. Here is where generic class kicks in, and it makes the code looks really simple:

{% highlight swift %}
class FFClients {
	class func notification_list(block: ((Array<FFNotificationModel>?, NSError?) -> Void)? = nil) {
		let client = FFRestClient<FFNotificationModel>(api: FF.api.notification_list)
		client.func_array = block
		client.execute()
	}
}
{% endhighlight %}

The following code is from an actual app that handles the notifications. Basically you just call `FFClients.notification_list`, and then you'll be free to deal with the notifications you get (or the error of course).

{% highlight swift %}
func notification_reload() {
	FFClients.notification_list(block: {
		(array: Array<FFNotificationModel>?, error: NSError?) -> Void in
		if error != nil {
			LF.log("NOTIFICATION error", error)
		} else {
			FF.unread_notifications.removeAll()
			for notification in array! {
				if notification.message_type == "WINNER" && notification.is_read == 0 {
					LF.log("We got a winner!")
				}
				FF.unread_notifications.append(notification.uid)
			}
			LF.log("NOTIFICATION uid list", FF.unread_notifications)
		}
	})
}
{% endhighlight %}

OK, now base on the code above, I'll explain why I designed `LModel` and `LRestClient` in this way. The 1st topic is about data modelling. When we try to get data from API calls via HTTP/HTTPS protocol, we'll be having some meta-data in the header, and a well formatted string as body. The format of the string can be:

- JSON, a simple format that supports dictionary, array, etc.
- Some data formats supported by native SDKs, e.g. `PFObject` in `Parse SDK`. Technically it may still be JSON but you'll be dealing with native objects anyway.
- Other stuff
  - XML: no one uses it now
  - CSV: are you serious?
  - ...

And in our apps, usually we would use:

- Native classes from the language you're using, e.g. `Dictionary`, `Array`, etc.
- Native classes from SDKs, e.g. `PFObject`, etc.
- Native classes of your own
  - From your own code
  - From CoreData
  - ...

Although sometimes we convert JSON to native classes using `NSJSONSerialization` directly, it is generally a bad idea because you'll need to write error handling code again and again. It becomes better if you write some class to handle it, which feels like using SDKs like `Parse`. However, it is still not recommended to use the results in the form of (`Array` of) `Dictionary` or `PFObject` directly, because generally it makes more sense to put some model related logic inside the models themselves instead of out of them, for example some computed properties.

In this case, it appears nature to have your own modelling objects, and a client to manipulate them. To use them from the app, we may use different approaches, for example:

- Writing different clients e.g. `FFUserClient`, `FFNotificationClient`, etc. to perform different sorts of tasks
- Writing an aggregated interface, e.g. `FFClients` in our example
- Appending task related methods like "list" in models, e.g. `FFNotificationModel.list(...)`

As long as there are no duplicated codes, I would say it's the right usage.

A side note: I'm not using `Core Data` because I think it's designed for more generic usages, and is overcomplicated in `REST` because we're only dealing with JSON objects. In my philosophy, flexibility sometimes comes with the trade off of simplicity, and if something doesn't have to be there, I don't want it to be there. Lucky me! I really didn't like XML when I read about it in the early 2000s, and no one uses it for now unless those enterprise IT professionals who earn big bulk of money by create more problems then solving them (this is sore sarcasm, I do want to make money in that way sometimes, maybe my next life).

Anyway, `LModel` allows you to define your models based on JSON objects. I'm still working on it and will write more detailed posts for it, but here's a brief list for the features supported:

- Nesting - supports both single object and object array
- Exporting `Dictionary`
- Well formatted description
- Accessing raw data

To work with it, we also have `LRestClient`, which is a RESTful client that supports multiple authentication mechanism (parameters, cookie, header, authentication challenge, etc.) and can be hooked up with UI. The main idea here includes:

- Simplicity. For a RESTful client, technically there can be several layers like HTTP handling, JSON deserialzation, model parsing, error handling etc. but to the user, it's just "getting data from API". User can choose how and what data to get from which API, and he doesn't need to worry about things not related to his task.
- Responsibility. User wants data, so he needs to define the data model. User needs to get the data, so he needs to define a client with URL, APIs, authentication methods, etc. All the parts user needs to subclassing must be meaningful to him, and the interface needs to be really clear.
- Always no duplicated codes. Libraries are created to solve problems, not causing more problems, so there should be no chance for users to create duplicated codes. For example, to get data there are 3 callbacks `func_model` (to get a single object), `func_array` (to get multiple objects in an array), and `func_dict` (to get raw dictionary which is for testing code only) and that's it. I'm not offering flexible interface to allow user to create his own layer because otherwise it may results a lot of duplicated codes, and I don't give them the chance to do that.

Anyway, it's impossible to explain all these without proper examples, so stay tuned and I'll be back "Soon™"!

[stackoverflow]:		http://stackoverflow.com/questions/4425198/markdown-target-blank
