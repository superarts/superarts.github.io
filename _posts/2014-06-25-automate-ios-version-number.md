---
layout: post
title:  Automating Version Number for iOS / Mac Apps
date:   2014-06-25 16:15:00
tags:
- Objective C
- Swift
- Xcode
---

UPDATE: format like `1.0.82 (E3B8)`, which makes perfect sense in alpha test stage since we wouldn't want too many tags for alpha builds, is not accepted by `Apple` anymore. We'll have to use the `1.0.82` part only.

IMPORTANT: I'm still trying to figure out the best practice of this topic, thus the approach I described in this article may not be final.

Long story short:

1. Add a `Run Script` in `Build Phases` (Editor -> Add Build Phase), and put it before `Copy Bundle Resources` so that we can increase version number in info.plist, and then copy plist into app bundle.

2. Add script as below. The magic here is `git rev-list HEAD | wc -l | tr -d ' '` that gives you the subversion-style revision number, which means if you're not in master branch this doesn't make any sense (that's why I said I'm still figuring it out). Basically I don't mind change version number in debug mode but you may want to uncomment the 2nd line if you stay in develop branch most of the time.

{% highlight bash %}
#Update build number with number of git commits if in release mode
# if [ ${CONFIGURATION} == "Release" ]; then
# enable the following line to enable auto commit
#git commit -a -m "auto-commit: version number increased"
versionNumber=$(/usr/libexec/plistbuddy -c Print:CFBundleShortVersionString: "${PROJECT_DIR}/${INFOPLIST_FILE}")
buildNumber=$(git rev-list HEAD | wc -l | tr -d ' ')
buildHash=$(git rev-parse HEAD | cut -c1-4)
#/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $versionNumber.$buildNumber ($buildHash)" "${PROJECT_DIR}/${INFOPLIST_FILE}"
/usr/libexec/PlistBuddy -c "Set :CFBundleVersion $versionNumber.$buildNumber" "${PROJECT_DIR}/${INFOPLIST_FILE}"
# fi;
{% endhighlight %}
 
* Display version number somewhere in your UI.
 
{% highlight objc %}
label_version.text = [NSString stringWithFormat:@"%@ %@", 
	[[[NSBundle mainBundle] infoDictionary] valueForKey:@"CFBundleName"],
	[[[NSBundle mainBundle] infoDictionary] valueForKey:@"CFBundleVersion"]];
{% endhighlight %}

-- swift version --

{% highlight swift %}
label_version.text = NSBundle.mainBundle().infoDictionary?["CFBundleVersion"] as? String
{% endhighlight %}

The thing I'm not sure is that although `1.0.82` seems to be nice to non-tech person, it is not as good as git hash if you want to debug something. So maybe something like `1.0.82 (5cb5ec)` would be better; anyway it's very easy to modify the script in step 2 to make whatever version string you want.
