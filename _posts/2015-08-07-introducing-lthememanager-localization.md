---
layout: post
title:  "Introducting LThemeManager.localization"
date:   2015-08-07 16:56:00
categories: LSwift LThemeManager LFLocalizable LFParseLocalizable Parse
---

I'm always not happy with the default localization solution `iOS` provides, and while what `Android` offers is much better, it's still not the best it could be. Here are the features `LThemeManager.localization` provides, and I'll be discussing the disadvantages of the current solutions as well:

### To Define

In `iOS` or `Android` you'll have to put languages into different `text` / `xml` files. In `LThemeManager` however, we use class `LFLocalizable` / `LFParseLocalizable` to define the languages.

{% highlight swift %}
class TestLocalizable: LFParseLocalizable {
	var new = Item()
	var old = Item()
	required init(dict: LTDictStrObj?) {
		super.init(dict: dict)
		new += "new"
		new += "新"
		new += "nuevo"
		old += "old"
		old += "旧"
		old += "viejo"
	}
}
{% endhighlight swift %}

This allows you to:

- Put everything together if your language file is going to be very small.
- Split languages into different classes / files by module etc.
- Organize different localizable by language types (same as `iOS` and `Android`).
- Organize different localizable by keys (easier for translator who knows multiple languages).

Basically it's more flexiable since it's implemented programmatically. The done side is that you'll have to write an additional `key = Item()` to define a `LFLocalization.Item`, but it comes easier when it gets to:

### To Use

Instead of some unwrapping functions, you'll be able to use the localized strings as native data structure:

{% highlight swift %}
struct Test {
	static var common = TestLocalizable(publish:false)
}
//	...
let common = Test.common
LF.log("test", common.new.str)
{% endhighlight swift %}

Normally you'd define the localizable keys as consts to avoid spelling mistakes, but with native data structure, this problem is solved automatically. Besides, you can use the localized strings in 3 ways:

- common.new.str: an "as is" way that retuns the localized string.
- common.new.STR: returns uppercase version of the string.
- common.new.Str: the first character is in uppercase; useful when it's used with `Storyboard`.

### Storyboard Integration

In `Storyboard`, various controls including `UILabel`, `UITextView`... have 2 `text_localized` and `text_auto_localized` fields. Once `text_localized` is set, `LThemeManager.localization` uses it as the key and replace the text with the localized version; and if `text_auto_localized` is set, the current text will be used as the key. It may have some variant, e.g. for `UIButton` there are things like `normal_title_localized` and `highlighted_title_localized`, but they work in a very similar way.

To enable this though, localization needs to be initialized before `UIApplicationMain` is started. To do this, you need to:

- Remove the line with `@UIApplicationMain` in `AppDelegate.swift`.
- Create a new `main.swift` file with contents like:

{% highlight swift %}
//	init Parse here if it's based on ParseSDK
LTheme.localization.strings_append(Test.common.dictionary)
UIApplicationMain(Process.argc, Process.unsafeArgv, nil, NSStringFromClass(AppDelegate))
{% endhighlight swift %}

Basically before the main app is started, `LTheme.localization` and `Test.common` will be initialized before `Storyboard`. Although with this extra step, I believe it's still easier to use than the default localization solution of `Storybard`. (`Android` on the other hand, is easier enough as is - you just use "@string/key" to set the key directly in the layout files.)

### Setting Support Languages

Besides `common.new.str`, you can also call `LTheme.localization.str("new")` (or `Str` and `STR`). Both of them are used to get the localized strings which is based on the current locale setting. However, it is much more flexible than the default solution of `iOS` so that you can:

- Set current language: `LTheme.localization.language = .SpanishMexico`
- If the current language is not supported, `default_language` will be used which can be set programmatically: `LTheme.localization.default_language = .English`
- You can also reset the supported languages and languages alias list:

{% highlight swift %}
struct LTheme {
	struct localization {
		static var languages = [
			Language.English,
			Language.ChineseSimplified,
			Language.SpanishMexico,
		]
		static var languages_alias = [
			Language.EnglishAustralia.rawValue:			Language.English,
			Language.EnglishUnitedStates.rawValue:		Language.English,
			Language.EnglishUnitedKingdom.rawValue:		Language.English,
			Language.ChineseTraditional.rawValue:		Language.ChineseSimplified,
			Language.Spanish.rawValue:					Language.SpanishMexico,
		]
	}
}
{% endhighlight swift %}

In this example, tranditional Chinese users see simplified Chinese instead of English. All these makes `LTheme.localization` more flexible and powerful.

### How It Actually Works

There's a `LTheme.localization.strings` dictionary that contains all the localized version of the strings.`LTheme.localization.strings_append(dictionary)` appends a set of strings into it, and `LFLocalizable` can work with it easily as shown in the example above.

### Future Plans

Different language packs can be released as source code. I'll make some of them as demo into `LConst` and see if it helps things get my life easier first.

[lswift]:      http://superarts.github.io/LSwift/
[superarts]:   http://www.superarts.org/blog