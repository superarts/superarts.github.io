---
layout: post
title:  "Using Icon Font with LThemeManager"
date:   2015-05-08 15:40:00
categories: LSwift LThemeManager IBInspectable font icon
---

OK, actually `LThemeManager` doesn't do much here, but I want to share it because it's pretty neat to work with `Icon Fonts`. Basically what you have to do is:

1. Download icon fonts and add them in your project like regular fonts. You can start with [FontAwesome][fontawesome].
  1. Download zip, unzip, and find the `OTF` / `TTF` file. `OTF` is supposed to be a "better" version than `TTF`.
  1. Install the font in your OS X.
  1. Drag the font file into your project in Xcode.
  1. Create a `Fonts provided by application` key in your info.plist file.
  1. Add `FontAwesome.otf` into the newly created array.
1. Create a button and configure it like this:  
![Attributes Inspector](https://www.dropbox.com/s/ynsc3phroo2tuqi/Screenshot%202015-05-08%2011.14.48.png?dl=1 "UIButton with LThemeManager")  
1. Your button will look like this:  
![UIButton](https://www.dropbox.com/s/4qeya6c6kxmt57l/Screenshot%202015-05-08%2011.17.07.png?dl=1 "UIButton with LThemeManager")  
1. And in simulator:  
![Simulator](https://www.dropbox.com/s/2g0hkgw4f2n5wg2/Screenshot%202015-05-08%2011.18.56.png?dl=1 "UIButton with LThemeManager")  

Not a single line of code is needed here. And you may like to copy / paste the the button around so that you don't need to set the font name / user font name again, and replace the icon with a new one in [the FontAwesome cheatsheet][cheatsheet].

The advantages are obvious here. You don't have to drag around and manage a lot of separated icon files here and there, you can easily resize and change color of font icons (or add shadow, you name it), and your web developer buddy may feel good about you. Anyway, these are just basic icons but it's pretty good for mock up and stuff.

[fontawesome]:	http://fortawesome.github.io/Font-Awesome/
[cheatsheet]:	http://fortawesome.github.io/Font-Awesome/cheatsheet/
