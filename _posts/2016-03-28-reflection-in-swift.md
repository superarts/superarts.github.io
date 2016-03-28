---
layout: post
title:  "Implementation of Reflection in Swift"
date:   2016-03-27 19:36:00
categories: LSwift 
---

### Intro

[Reflection](https://en.wikipedia.org/wiki/Reflection_(computer_programming)) is a set of functions that allows a program to inspect and modify its own structure or even how it works at runtime. I'll start with a real life use case.

Recently I've found an excellent library [EVReflection](https://github.com/evermeer/EVReflection), which does a similar job as [LFModel](http://www.superarts.org/LSwift/lswift/lrestclient/gossip/modelling/restful/2015/05/02/about-lrestclient.html) does: parsing a dictionary to and from a native `Swift` class. Please take a look at the code below:

{% highlight swift %}
import LFramework
import EVReflection

class UserModel: LFModel {
	var name: String?
	var friends: [UserModel] = []
	required init(dict: LTDictStrObj?) {
		super.init(dict: dict)
		reload("friends", type: NSStringFromClass(UserModel))
	}
}

class UserObject: EVObject {
    var id: Int = 0
    var name: String = ""
    var friends: [UserObject]? = []
}

...

let model = UserModel(dict: ["id": 42, "name": "Leah Cain", "friends": [["id": 43, "name": "Leo"]]])
LF.log("model", model)

let json:String = "{\"id\": 24, \"name\": \"Bob Jefferson\", \"friends\": [{\"id\": 29, \"name\": \"Jen Jackson\"}]}"
let user = UserObject(json: json)
print("user: \(user)")
{% endhighlight %}

The output is going to be like this:

{% highlight swift %}
model: 'LFramework_Example.UserModel (0x7fdc5be28470): [
    friends: [
        {
			friends =     (
			);
			id = 43;
			name = Leo;
		}
    ]
    id: 42
    name: 'Leah Cain'
]'
user: UserObject {
   hash = 2985078112003787767
   key = id, value = 24
   key = name, value = Bob Jefferson
   key = friends, value = (
        {
			friends =         (
			);
			id = 29;
			name = "Jen Jackson";
		}
	)
}
{% endhighlight %}

Although reflection is relatively slow, the advantage is obvious: you can write highly dynamic code that minimizes interface and still achieves functionalities that's desired. For example, in `EVRefection` or `LFModel`, you don't have to tell what properties there would be in the data model while parsing. The library loops through all the keys/values and processes different data types itself.

In this post, I'll be focusing on the implementation of reflection in `Swift`, and hopefully it will help you get a better understanding of the dynamic feature of `Swift`, so that it can be used in your own framework.

### Implementation

(To be continued)

[lswift]:      http://superarts.github.io/LSwift/
[superarts]:   http://www.superarts.org/blog