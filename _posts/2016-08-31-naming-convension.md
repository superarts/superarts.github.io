---
layout: post
title:  "Renaming LSwift to SAKit"
date:   2016-08-31 12:48:00
categories: LSwift Naming SAKit
tags:
- LSwift
- SAKit
- Naming
---

## Yet Another Brief History

Back in the end of year 2014, I was trying to make transition into `Swift`, and started a project `CompanySecrets` with a shared library `LSwift`. The idea was to rewrite some of the features `LFramework` / `LCategory` provide (including convenient categoires, native reflection, etc.), as well as implementing some other features might or might not planned. It was used in 3 projects: `CompanySecrets`, [FitFox](www.fitfoxrewards.com), and [iComplain](www.icomplain.com.au). For some business reason `CompanySecrets` was not published eventually, but the other 2 were released mainly in Australia.

Back then `cocoapods` support for `Swift` was not great, so `LSwift` was released as source code. Unfortuantely when I started to work in `AirService` from August 2015, most of my code was done in `Objective C` (and some `Java` for `Android` development of course), and I didn't have time to release `LSwift` as a `Pod`.

One year later, while I'm finishing off the main iOS app for `Macca's Monopoly 2016` campaign, I decided to (finally) make `LSwift` a `Pod`, and I would also like to make an important change: renaming.

## About Naming Convention

### Renaming LSwift to SAKit

As I mentioned in some early post, I started `LYKit` from 2010, and made a compact version `LFramework` as `Pod` later. The idea was also making sub-pods like `LCategory`, `LRestClient` etc. and using `LC`, `LR` etc. as name space so that everything starts with `L`, my favorite letter. (Eventually only `LCategory` was released.)

But recently I realized that instead of doing things that makes sense, it's actually better to go with some "standard" way. Firstly, standard way makes sense too, and secondly it reduces learning cost of users. Of course, it is not always possible to define "standard", hence the quotation here, but it won't be a bad idea to follow `Apple`'s standard.

In this case, using 2 capitalized letters as name space is more common, so I decided to rename `LSwft` to `SAKit`, with subspecs like `SAKit/SAFoundation`, `SAKit/SAClient` etc. `SAFoundation` will be the default spec of `SAKit`. My work was done in branch `refactor/framework`.

### Making Componenets Public

Since `LSwift` was included as source, everything was `internal` by default. This caused a little bit trouble when it's made as a `Pod`. I started with making classes and functions I used `public`, as well as writing `Tests` when I was progressing, but I'd also release it to public asap. In this case, I wrote a tool `swift-make-all-public` in `Ruby`, which obviously, helps me make everything `public`. I'm pretty sure some of the classes, functions, or properties should remain as `internal` or be made `private`, but at this stage making them `public` doesn't hurt.

### Underscore vs CamelCase

As a firmware developer, I always hated, and still hate `CamelCase`. `C` / `C++` in `Linux` style, `Ruby`, `Python`, `PHP` etc. prefer underscore as I do. Unfortunately it's not the case for `NEXTSTEP` and `Java` community, which is used in `Android`. I struggled for a long time, and I'm still not giving it up, but I also have to admit that Underscore is already the standard in `iOS` community.

I'll still use underscore myself, but in the same time, I created a tool `swift-wrap-underscore` that creates files like `SAFoundationWrapper.swift`, `SAClientWrapper` etc., which wraps properties and functions as `CamelCase`. For example, you can use `UIFont.printAll()` instead of `UIFont.print_all()`. The tool `swift-wrap-underscore` is still under development, but I'll keep it updated with `SAKit`.

### About IBAction and IBInspectable

Some exceptions are `IBAction` and `IBInspectable`. Creating wrapper functions doesn't make any sense, since duplicated functions would appear in `Interface Builder` and the same time, which would only cause confusion. In this case, they will be make `CamelCase` from the beginning.

`IBInspectable` will be named as `textFontName`, which is displayed as `Text Font Name` in `Interface Builder`. This is sort of fine because I still needs to write codes like `button.textFontName = "Open Sans"` sometimes, and from I see `IBInspectable` is not used in a lot of places yet.

However, `IBAction` will be named like `sakitActionDismiss` since `IBAction`s are widely used in almost all apps, and it will be important to know some functions like `dismiss` and `popToRoot` come from `SAKit`. Previously they were started with `lf_`. You can override them to handle additional logic if you want.

### About Previous Posts

Currently I have no plan to make changes to previous posts. The main reason here is that I believe not a lot of people were actually reading them. All codes in `Example` project and `StackOverflow Documents` however, will be released under new naming convention.

## Conclusion

Currently I'm writing this post in an aircraft to China. Some of the features are not fully implemented while I'm writing, and `SAKit` still sits in the `LSwift/refactor/framework` branch at the moment. But it will be released really soon. The beauty of the changes mentioned in this post is that even not everything is made `public` or renamed properly, the `Pod` can still be used right away.

Of course, after renaming, source code will not be backward compatible anymore. So a new `git` repo `SAKit` will be created with all history carried from `LSwift/refactor/framework`; in the same time a temperorary pod `LFramework2` will not be released: it once sit in `refactor/framework` and wasn't made public ever anyway - it's used in one of my open source app `WeatherPOV`, which switched to `SAKit` as I'm wring this post. So hopefully no damage will be done. `LSwift` itself will not be maintained after `Swift 3` is released, which will certainly make it deprecated.