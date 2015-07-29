---
layout: post
title:  Splitting Codes into Classes
date:   2015-07-28 15:24:00
tags: Swift Editor VIM Git
---

I'm happy to say I'm a heavy `VIM` user, but it would not be a proud thing for me if it caused troubles to other people I'm working with. Yes, I have to put `.*.sw*` in the `.gitignore` file, but I'm talking about something else: I tend to create very long file to edit. For example, in the project I'm currently working on, the `ViewControllers.swift` file has more than 3000 lines.

While it's super convenient for me to edit everything in the same file using `/` and `*` to search for contents, and using `H` and `L` to `bprev` and `bnext` between things like `AppDelegate.swift`, `ViewControllers.swift` and `Const.swift`, it would a disaster for someone else to read the code. So if I'm working on a project or a module, I'd work in a way that I'm comfortable with, but when it's time to collaborate with other developers, I need to break things up in to `ViewControllers/MyClass1.swift` etc.

To automate this, I created a `swift-split` script in my [Github script repo](https://github.com/superarts/script), which was previous named `source-split` and perhaps I'll rename it back after I add support to other formats. Basically it splits source file by classes and put them inside a directory that is named after the original filename, e.g. split `MyClasses.swift` to `MyClasses/MyClass1.swift`, `MyClasses/MyClass2.swift` etc. For now, it's still under development at the time being, and I'm going to update this post after I make any progress:

{% highlight sh %}
USAGE:
	swift-split.php SOURCE_FILE1 SOURCE_FILE2 ...
NOTES:
	By default, OUTPUT_DIRX is the main part of the filename.
	Currently only SWIFT source files are supported.
ABOUT SWIFT SPLITTER:
	Nested classes and structs will not be splitted.
	Currently the 'import' part is not done correctly. Please modify this script to get it work.
{% endhighlight %}

As mentioned in the README, you need to modify the script to correctly apply the `import` list. You can also add them manually after splitting.
