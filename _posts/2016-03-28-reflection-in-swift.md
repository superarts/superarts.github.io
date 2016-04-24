---
layout: post
title:  "Implementation of Reflection in Swift"
date:   2016-03-28 19:36:00
categories: LSwift Reflection Objective-C
---

## Intro

[Reflection](https://en.wikipedia.org/wiki/Reflection_(computer_programming)) is a set of functions that allows a program to inspect and modify its own structure or even how it works at runtime. I'll start with a real life use case.

Recently I've found an excellent library [EVReflection](https://github.com/evermeer/EVReflection), which does a similar job as [LFModel](http://www.superarts.org/LSwift/lswift/lrestclient/gossip/modelling/restful/2015/05/02/about-lrestclient.html) does: parsing a dictionary to and from a native `Swift` class. Please take a look at the code below:

{% highlight swift %}
import LFramework
import EVReflection

class UserModel: LFModel {
    var name: String?
    var friends: [UserModel] = []
    var father: UserModel!
    //    the commented code will be explained later
    /*
    required init(dict: LTDictStrObj?) {
        super.init(dict: dict)
        reload("father", type: NSStringFromClass(UserModel))
        reload("friends", type: NSStringFromClass(UserModel))
    }
    */
}

class UserObject: EVObject {
    var id: Int = 0
    var name: String = ""
    var friends: [UserObject]? = []
}

...

let model = UserModel(dict: [
    "id": 42, 
    "name": "Leah Cain", 
    "friends": [["id": 43, "name": "Leo"]], 
    "father": ["id": 44, "name": "Deckard Cain"]
])
LF.log("model", model)

let json:String = "{\"id\": 24, \"name\": \"Bob Jefferson\", \"friends\": [{\"id\": 29, \"name\": \"Jen Jackson\"}]}"
let user = UserObject(json: json)
print("user: \(user)")
{% endhighlight %}

The output is going to be like this:

{% highlight bash %}
model: 'LFramework_Example.UserModel (0x7f96c1427810): [
    father: '{
        friends =     (
        );
        id = 44;
        name = "Deckard Cain";
    }'
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

Although reflection is relatively slow, the advantage is obvious: you can write highly dynamic code that minimizes interface and still achieves functionalities that's desired. For example, with `EVRefection` or `LFModel`, you don't have to tell what properties there would be in the data model while parsing. The library loops through all the keys/values and processes different data types itself.

In this post, I'll be focusing on the implementation of reflection in `Swift`, and hopefully it will help you get a better understanding of the dynamic feature of `Swift`, so that it can be used in your own framework.

## Implementation

### Creating a native object based on a Dictionary

To create a native object from a given `Dictionary` (or a `JSON` object that can be deserialized to native `Dictionary`), we can **use `for (key, value) in dict` to loop through it**, and **assign the keys/values to an object using `setValue(value, forKey:key)`**. However, assigning a value to a non-existent key will cause an error, thus we need to **check if the object `respondsToSelector` first**.

But here's something funny happening. Please try to guess what will happen and run the following code in a `Playground`.

{% highlight swift %}
import Foundation

class TestObject: NSObject {
    var int0: Int = 0
    var int1: Int?
    var int2: Int!
    var int3: NSNumber?
    var str: String?
    
    func selectorTest() {
        print("responds to int0: \(respondsToSelector(NSSelectorFromString("int0")))")
        print("responds to int1: \(respondsToSelector(NSSelectorFromString("int1")))")
        print("responds to int2: \(respondsToSelector(NSSelectorFromString("int2")))")
        print("responds to int3: \(respondsToSelector(NSSelectorFromString("int3")))")
        print("responds to str: \(respondsToSelector(NSSelectorFromString("str")))")
        
        setValue(42, forKey:"int3")
    }
}

let test = TestObject()
test.selectorTest()
print("int3: \(test.int3)")
{% endhighlight %}

Although in `Swift` `Int` can be bridged to `NSNumber`, `TestObject` does not respond to `int1` and `int2`, and `setValue(42, forKey:("int1"))` will result an error. So it shows that an `NSObject` responds to:

- `Int` with a default value
- `NSNumber?`, a subclass of `NSObject`
- `String?`, a native `Swift` data type.

Since `TestObject` is an `NSObject`, all the method calls are identical in `Objective-C`. However, to do things the other way around, some `Swift` only mechanism will be introduced.

### Getting all properties from a native object

In `Objective-C`, to get all properties from a `NSObject`, we can **use [Objective-C runtime APIs](https://developer.apple.com/library/mac/documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Articles/ocrtPropertyIntrospection.html) `class_copyPropertyList` to get the property list**, and then **use `property_getName` to get the names of all the items**.

{% highlight swift %}
import Foundation

class ChildObject: NSObject {
    var int10: Int = 0
    var int11: Int?
    var str10: String = "test"
    var str11: String?
    
    func keys() -> [String] {
        var array = [String]()
        var count: CUnsignedInt = 0
        let properties: UnsafeMutablePointer<objc_property_t> = class_copyPropertyList(object_getClass(self), &count)

        for i in 0 ..< Int(count) {
            if let key = NSString(CString: property_getName(properties[i]), encoding: NSUTF8StringEncoding) as? String {
                array.append(key)
            }
        }
        return array
    }
}

let child = ChildObject()
print("keys: \(child.keys())")
{% endhighlight %}

You'll see `keys: ["int10", "str10", "str11"]` as the results in `Playground`. Yes, `int11` is still missing, so with this approach you'll always need to give types like `Int` a default value.

Furthermore, if we inherit from `TestObject` but not `NSObject`, i.e. `class ChildObject: TestObject`, we're going to see the same result. In real life it's very common to create things like a `StudentObject` based on a `UserObject`, and we do need to know `student1.name`, in which name is a property of `UserObject` if I'm allowed to be Captain Obvious here. Anyway, to support things like this, we need to do some little tweaks:

{% highlight swift %}
...

class ChildObject: TestObject {
    var int10: Int = 0
    var int11: Int?
    var str10: String = "test"
    var str11: String?
    
    func keys() -> [String] {
        var array = [String]()

        var c: AnyClass! = object_getClass(self)
        loop: while c != nil {
            print("class: \(NSStringFromClass(c))")
            if NSStringFromClass(c) == "NSObject" {
                break
            }
            var count: CUnsignedInt = 0
            let properties: UnsafeMutablePointer<objc_property_t> = class_copyPropertyList(c, &count)
            for i in 0 ..< Int(count) {
                if let key = NSString(CString: property_getName(properties[i]), encoding: NSUTF8StringEncoding) {
                    array.append(key as String)
                }
            }
            c = class_getSuperclass(c)
        }
        return array
    }
}

let child = ChildObject()
print("keys: \(child.keys())")
{% endhighlight %}

And now we're getting `keys: ["int10", "str10", "str11", "int0", "int3", "str"]` - guess we are used to the absence of `int1`, `int2`, and `int11` already. Basically what we did this time was trying to loop through the object and its superclasses to get all the properties of each other, until the superclass is `NSObject`.

### Mirror in Swift 2

If you're not quite comfortable with the code above since it's too `objc`, it's perfectly fine: actually `Swift` has its own reflection mechanism, and it's significantly changed since `Swift 2`. **[`Mirror()`](https://developer.apple.com/library/watchos/documentation/Swift/Reference/Swift_Mirror_Structure/index.html) replaced `reflect()` and represents the structure of a native object**. Try to add the code below after the definition of `ChildObject` and its instance `child`:

{% highlight swift %}
var mirror: Mirror? = Mirror(reflecting: child)
repeat {
    for property in mirror!.children {
        print("property: \(property)")
    }
    mirror = mirror?.superclassMirror()
} while mirror != nil
{% endhighlight %}

And what do we get this time?

{% highlight swift %}
property: (Optional("int10"), 0)
property: (Optional("int11"), nil)
property: (Optional("str10"), "test")
property: (Optional("str11"), nil)
property: (Optional("int0"), 0)
property: (Optional("int1"), nil)
property: (Optional("int2"), nil)
property: (Optional("int3"), nil)
property: (Optional("str"), nil)
{% endhighlight %}

Yay! Not only the code is much simpler, we also have all the `Int` families back in. You can read more about `Mirror` in [The Swift Reflection API and what you can do with it](https://appventure.me/2015/10/24/swift-reflection-api-what-you-can-do/#sec-1-4-4), but from the code above we already get what we want: getting all properties from a native object.

### Getting the class of a property from its name

You may notice the commented `init` in `UserModel`. It can be interpret to "after everything is initialized, find the key `father` or `friends`, and reload it as either a `UserModel` or an array of `UserModel`, based on the type of `father` or `friends`". Without this line `friends` will be set as the original `Array`, which looks like `[["id": 43, "name": "Leo"]]`. So suppose the function `reload` is already there, how to implement the `init` so the `reload`s happen automatically?

Firstly let's see what we need. In `reload`, **`NSClassFromString` is used to get the class of the object from a string**.

{% highlight swift %}
let a_class = NSClassFromString(type) as! LFModel.Type
let obj = a_class.init(dict: dict_parameter)
setValue(obj, forKey:key)
{% endhighlight %}

If you inspect `type`, which in our case is `NSStringFromClass(UserModel)`, it's something like `LFramework_Example.UserModel`, as we can see a `Swift` class is like "bundle name + class name". So we can **loop through `child in Mirror(reflecting:self).type.children` and find the `child` where `child.label` is equal to either `father` or `friends`**. Each `child.value.dynamicType` is going to be:

- `father`: `Optional<UserModel>`
- `friends`: `Array<UserModel>`

So if we get rid of the `Optional<>` and `Array<>` part, and append it after bundle name `bundle.infoDictionary[kCFBundleNameKey]`, we'll be able to use the class name string to do the `reload`. After the following code is added inside `init` of `LFModel`, we don't need to call the `reload` manually.

{% highlight swift %}
if value is [String: AnyObject] || value is [AnyObject] {
    let type: Mirror = Mirror(reflecting:self)
    for child in type.children {
        if let label = child.label where label == key
        {
            var type = String(child.value.dynamicType)
            type = type.stringByReplacingOccurrencesOfString("Optional<", withString: "", options: NSStringCompareOptions.LiteralSearch, range: nil)
            type = type.stringByReplacingOccurrencesOfString("Array<", withString: "", options: NSStringCompareOptions.LiteralSearch, range: nil)
            type = type.stringByReplacingOccurrencesOfString(">", withString: "", options: NSStringCompareOptions.LiteralSearch, range: nil)

            let bundle = NSBundle(forClass: self.dynamicType)
            if let name = bundle.infoDictionary?[kCFBundleNameKey as String] as? String {
                type = name + "." + type
            }

            setValue(value, forKey:key)
            reload(key, type: type)
            break
        }
    }
} else {
    setValue(value, forKey:key)
}
{% endhighlight %}

However, the code above is just a proof of concept to show how to get the class of a property from its name. We don't have to do it if we pass the class instead of the class name to `reload`, and not to mention it highly relies on the implementation of how `NSStringFromClass` works in `Swift`, which might be changed in future. I would highly recommend to use the better maintained `EVObject` instead of my `LFModel`, which is used in this tutorial just because its implementation is much simpler to understand.

## Conclusion

In this post, we've discussed the tricks of assigning keys/values to a native object and the other way around, i.e. getting properties from a native object in both the old `Objective-C` runtime way and the new `Swift 2` `Mirror` way, as well as getting the class of a property from its name. In the beginning these tricks are used to convert a `Dictionary` into an object.

The downside of reflection is always about performance, and it makes it harder to perform static analytics, so it's more often used in libraries and not the actual business logic, expect you're 100% sure what you're doing, which might not be right if you take a look at the code 1 year later. And particularly in `Swift`, it's a relatively new and fast evolving language, and the new version is not always going to be backward compatible. For example, as we mentioned in `Swift 2` `Mirror()` replaced `reflect()`, and there's no guarantee that `NSStringFromClass` is always going to work in the same way.

Despite of all the disadvantages, using `reflection` carefully results highly dynamic code, simplifies interface, and allows you to think out of the box.

All the code above can be found in [the `refactor/framework` branch of LSwift](https://github.com/superarts/LSwift/tree/refactor/framework).

[lswift]:      http://superarts.github.io/LSwift/
[superarts]:   http://www.superarts.org/blog