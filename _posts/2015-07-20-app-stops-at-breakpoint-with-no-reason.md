---
layout: post
title:  App Stops at Breakpoint with no Reason
date:   2015-07-20 11:01:00
tags: Swift Breakpoint Exception Debug LLDB
---

Sometimes when you are debugging an app with an "All Exceptions" breakpoint enabled, you may get your app stops at a breakpoint without a reason. Instead of showing a exception that helps you to debug, `LLDB` doesn't tell you anything about the error, and if you try to run `bt` you can only see something like `breakpoint 1.1`. And you can even `continue` the app and everything works fine.

Normally it's caused by some internal assertion failure, which doesn't print any logs while it should have. This is not really a `Swift` issue, but since it's more likely to be seen in `Swift` since it's not as mature as `Objective-C`. In this case, you will have to use your imagination to solve the problem.

In my case, my app stopped at `setValue:forKey`. I thought it was caused by invalid `key` or `object`, the log printed them correctlly:

{% highlight swift %}
LF.log("key", key)
LF.log("value", object[key])
self.setValue(object[key], forKey:key)
{% endhighlight %}

The reason was pretty stupid: the `self` object I set was immutable. Obviously you need to make it mutable to call `setValue:forKey`, but the thing is that firstly there should be some named exception raised, and secondly, after `continue` it should crash anyway. As this problem has been spotted in `Swift 1.2`, it can be considered as an existing `Syntax Trap`, which means something doesn't work as the way it should. Since `Swift` is still a new language, I'll write blogs about it as I discover them and report them to `Apple` in hope that they can be fixed in the next release.

## Other Syntax Traps

I'm listing some other syntax traps I found here just for fun.

### Update 1: Expression too Complex

While I'm working on elastic search API, the following code results an error: "Expression was too complex to be solved in reasonable time; consider breaking up the expression into distinct sub-expressions":

{% highlight swift %}
let query_bool = [
		"must":[["term":["approval":"confirmed"]],["filtered":["filter":["exists":["field":"id"]]]]],
		"should":[["match_phrase_prefix":["name":query]],["match":["name":["query":query,"operator":"and"]]],["match":["_all":["query":query,"operator":"and"]]]],
		"minimum_should_match":1
]
{% endhighlight %}

As it's said, breaking down the expression fixes the problem:

{% highlight swift %}
let query_must = [["term":["approval":"confirmed"]],["filtered":["filter":["exists":["field":"id"]]]]]
let query_should = [["match_phrase_prefix":["name":query]],["match":["name":["query":query,"operator":"and"]]],["match":["_all":["query":query,"operator":"and"]]]]
let query_bool = [
	"must":query_must,
	"should":query_should,
	"minimum_should_match":1
]
{% endhighlight %}

It's not really a "trap" since the error message is quite clear. However, it's interesting for us to guess how `Swift` compiler works when it's dealing with dictionary expressions. Anyway, it's not THAT complex :)

### Update 2: Failed table.dequeueReusableCellWithIdentifier

In short, if you copy-paste a `UITableViewCell` and change the class name and reuse identifiler correctly, but forgot to remove some `IBOutlet`, `table.dequeueReusableCellWithIdentifier` will fail silently. If a global exception breakpoint has been set, it stops running without telling you anything.
