---
layout: post
title:  "Introducing LThemeManager: About IBInspectable"
date:   2015-05-06 15:40:00
categories: LSwift LThemeManager Gossip IBInspectable UI
---

As a former firmware engineer / iPhone toolchain developer, I totally enjoy implementing UI programmatically. However, as soon as the official `iPhone SDK` was released, I started to use `Interface Builder` right away. It's not that I had been missing `Delphi` for years; I was using `Turbo Pascal` before anyway. The thing was that Interface Builder was such a good tool that made perfect sense for developers like me. It was a pleasure to put view-based components together with each other and see how the layout looks like before any code was written; the way how `autoresizing mask` worked was simple, flexible, and powerful; and the tool itself was responsive. On the contrast the tool Google offered for Android sucked.

After almost 7 years, `Interface Builder` became part of `Xcode` IDE, `Auto Layout & Size Classes` was highly used, `NIB / XIB` was replaced by `Storyboard` in most cases, and Android Studio doesn't suck anymore. In general, more and more developers switched to Storyboard based UI design from the programmatical way. With this in mind, `LThemeManager` is a set of tools to help the `Interface Builder` users. Today I'm going to talk about the `IBInspectable` related parts.

The following figure shows how it's going to look like in your `Interface Builder` (hosted by `Dropbox` and may be blocked by `GFW` dentro del Chino):

![IBInspectable](https://www.dropbox.com/s/3bsfqs32qm39dbq/Screenshot%202015-05-06%2016.15.29.png?dl=1 "UIButton")

As you can see, as soon as you add `LThemeManager` in your project, above the standard `Button` section there will be 2 additional sections `Button` and `View` defined by `LThemeManager`, which allow you to assign colors as button background for different states, add a border to a view, etc. Although it's a bit easier to write the code, it's probably not a good idea to put font name inside `UIView`; and some people may not like the naming conventions, which I'll talk about in some later topics. Anyway, hope you get the idea if you haven't used it before.

I'm not going to discuss how it's implemented since it can be obviously found in the code, which is quite simple anyway. Instead I'll compare it with some other approaches and explain why I think it's better. Assuming we're going to add a user font to `UILabel` without installing it in OS X.

# Everything Programmatical 

In this way, you write everything in code, so setting a customized font is not really that different with setting a system font. In this way you can reuse the code in whatever way you want, but you need to deal with a lot of things programmatically, including `Auto Layout`, which in general is not very productive.

# Subclassing

In this way you create a MyFontXLabel with `self.textFont = UIFont(named:X)` in it's initializer, and when you add a label in Storyboard, you need to change its class. Normally it's 2 clicks, 1 copy/paste, and you need to write different classes for different fonts. The code can hardly be reusable.

# An UILabel Library with Customized Font

This is one of the most common approach. Generally instead of writing it, you use a `Pod` and the other things are up to how it's designed. But still you'll have to change the class name in `Interface Builder`, and write code or modify something in `Interface Builder` to apply the font.

# User Defined Runtime Attributes

You can take the advantage of user defined runtime attributes as shown below. In this way it allows you to work with category/extension instead of subclassing. In this way you don't have to change the class name but you need to enter the keypath and change the type for each UILabel, which is a bit annoying.

![Runtime Attributes](https://www.dropbox.com/s/r90kgj2re5b2qs4/Screenshot%202015-05-07%2011.37.01.png?dl=1 "UILabel")

# IBInspectable

IBInspectable works with category/extension and everything is inside the attributes inspector, so it:

- Works with the original `UIKit` classes
- Makes changing to a customized font as easy as applying a system font
- Results minimal key stroke / mouse click

The downside is naming convention since if you side to use it for now, you'll have to choose `LThemeManager`, which doesn't have solved the namespace pollution problem yet. Of course you're free to fork and write your own code based on it.

For now, here's a highlight of the features `LThemeManager` supports:

- Customized user font by font name
- Border for `UIView` with customized color, line width, corner radius, etc.
- Circle mask for `UIView` - especially useful for `UIImageView`
- `UITextField` left padding
- Colors as `UIButton` background for different states

Without `IBInspectable`, even you're using open source libraries you still have to write codes here and there, or change the class names of the controls, and now you only need to set some attribues like normally you would do.
