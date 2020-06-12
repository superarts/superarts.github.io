---
layout: post
title:  A CocoaPods problem
date:   2020-06-11 17:51:00
categories: CocoaPods
tags: CocoaPods iOS
---
 
# A CocoaPods Problem: Multi-targets vs Multi-subspecs vs Multi-dependencies

## Sample use case

Some iOS projects may have multiple targets, including iOS, watch extension, today extension, Siri extension, and so on.

Also, some dependencies may require specific platforms. For example, suppose we have a `Utility` pod that includes:

- `JailbreakDetector`, which requires iOS platform for some `openURL` check, also its `objc` code cannot be bundled with Siri. 
- `Logger/AppDyanmicsLogger`, which depends on `AppDynamicsAgent`, which requires `iOS` platform (it's not open source so only God knows why).

## The problem

There is nothing wrong with this architecture design, but with CocoaPods' current `1.9.3` implementation, there is a problem. Suppose we have the following setup (`Core` is a common component for all platforms):

- iOS: `Utility/JailbreakDetector` + `Utility/Core`
- Watch extension: `Utility/Core`

The following error would occur when you try to archive the project:

```
error: Multiple commands produce '/Users/xxx/Library/Developer/Xcode/DerivedData/MyProject-amarkglozepfmyeasvcmupnzoxzn/Build/Intermediates.noindex/ArchiveIntermediates/MyProject/IntermediateBuildFilesPath/UninstalledProducts/iphoneos/Utility.framework':
1) Target 'Utility-JailbreakDetector-Core has create directory command with output '/Users/xxx/Library/Developer/Xcode/DerivedData/MyProject-amarkglozepfmyeasvcmupnzoxzn/Build/Intermediates.noindex/ArchiveIntermediates/MyProject/IntermediateBuildFilesPath/UninstalledProducts/iphoneos/Utility.framework'
2) Target 'Utility-CoreiOS' has create directory command with output '/Users/xxx/Library/Developer/Xcode/DerivedData/MyProject-amarkglozepfmyeasvcmupnzoxzn/Build/Intermediates.noindex/ArchiveIntermediates/MyProject/IntermediateBuildFilesPath/UninstalledProducts/iphoneos/Utility.framework'
```

## The reason

The reason is that for each target, the workspace CocoaPods generates tries to produce frameworks with the same name `Utility.framework`, which results the error above. Of course, when you try to run the project, it is fine because you can only run one target per each instance at a time.

## Solutions

My first impression was that this was a design flaw of CocoaPods. As [discussed here](https://github.com/CocoaPods/CocoaPods/issues/8206), this problem may be resolved by adding postfix in the framework file when there are different framework versions for multiple targets, e.g. the case mentioned above. Such postfix should not be added if the dependencies are the same, because you don't want to have `Utility-JailbreakDetector-Core.framework` and `Utility-CoreiOS.framework` at the same time, if there contents are exactly the same.

Practically, there will be quite a lot of dev/QA work involved for such a big change, but I don't think it's not doable. However, the more I think about it, I kind of have the classic "it's not a bug but a feature" feeling. In the end, it is up to CocoaPods team to define how they want their product to be like, and in this case, one would argue that the intention of `subspec` might not mean to be used for this case. In the end of the day, if a `subspec` is so special that it has it's own dependency, why not make it a separate pod? Why not have components like `UtilityJailbreakDetector` and `UtilityLoggerAppDynamics` as separated podspecs? Having multiple subspecs in the same repo is not the end of the world, and if you know how CocoaPods is implemented, you can set up your dependencies exactly as the way you want it to be.

There is one thing I hate to say: as a tool that's with us for 7 years, unlike other tools like TestFlight and Fastlane, CocoaPods is not acquired so far. Instead, Apple has its own Swift Package Manager as a dependency management system integrated with Xcode. So far, personally I still prefer CocoaPods for several reasons, but in the long run, we all know what happens when there's a official competitor in the same scene.

As a conclusion, I would just break down my `podspec` to solve this issue, even though I like the `subspec` based architecture design.
