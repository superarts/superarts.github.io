---
layout: post
title:  iPhone OS Toolchain Programming Tips
date:   2008-07-03 13:12:00
tags:
- iOS
- Toolchain
---

Tons of private classes back then!

Leo, 2016-06-07

# [Using NSClassFromString](http://superart.wikidot.com/chinese:iphone-nsclassfromstring)

In most cases,
   
`id myObj = [[NSClassFromString(@"MySpecialClass") alloc] init];` and

`id myObj = [[MySpecialClass alloc] init];`

Does the same thing. But in some cases, your app cannot be compiled if you don't have the correct header file. For example, to use `NSTask` you can use:

`[[NSClassFromString(@"NSTask") …..]]`

Remember to check if it's `nil`. Anyway, you can initialize a class if you're sure it's there in the `iPhone OS`, even you don't have the header file in your toolchain. Also the framework doesn't need to be linked with your app, and of course you don't have to `import` the class header file.

# [Creating a Unlock Slider](http://superart.wikidot.com/chinese:iphone-create-a-slide-bar)

```
#import <telephonyui/TelephonyUI.h>

TPBottomLockBar* lockBar = [[TPBottomLockBar alloc] initWithFrame:CGRectMake(0.0f, 340.0f, 320.0f, 100.0f) knobColor:1];

[lockBar setLabel:@"Slide To Unlock"];
[lockBar setFontSize: 14];
[lockBar setDelegate: self];
[contentView addSubview: lockBar];
[lockBar startAnimating];

//	override unlock to get the callback

- (void)unlock
{
	//do something
}
```

# [Keeping WIFI Connected while iPhone is Locked](http://superart.wikidot.com/chinese:iphone-keep-wifi-alive-while-sleeping)

From MobileChat

The following code keeps your iPhone connected to WIFI even when the screen is turned off. It allows background sessions like SSH connected, and consumes battery much quicker. Better keep it being charged.

```
//	add in applicationDidFinishLaunching
IONotificationPortRef notificationPort;
root_port = IORegisterForSystemPower(self, &notificationPort, powerCallback, &notifier);
CFRunLoopAddSource(CFRunLoopGetCurrent(), IONotificationPortGetRunLoopSource(notificationPor t), kCFRunLoopCommonModes);

//	create a global function
void powerCallback(void *refCon, io_service_t service, natural_t messageType, void *messageArgument) {
	[(YourAppnameApp*)refCon powerMessageReceived: messageType withArgument: messageArgument];
}

//	create a delegate method
- (void)powerMessageReceived:(natural_t)messageType withArgument:(void *) messageArgument {
	switch (messageType) {
		case kIOMessageSystemWillSleep:
			IOAllowPowerChange(root_port, (long)messageArgument);
			break;
		case kIOMessageCanSystemSleep:
			if([self wifiKeepAliveIsSet]) {
				IOCancelPowerChange(root_port, (long)messageArgument);
			}
			break;
		case kIOMessageSystemHasPoweredOn:
			break;
	}
}
```

# [Scaling Image on iPhone Using Gestures](http://superart.wikidot.com/chinese:iphone-image-scaling)

From Erica Sadun

```
id scroller = [[UIScroller alloc] initWithFrame:CGRectMake(0.0f, 0.0f, 320.0f, 480.0f)];
[scroller setAllowsFourWayRubberBanding:YES];
[scroller setAdjustForContentSizeChange:YES];
[scroller setThumbDetectionEnabled:YES];

struct CGRect zrect;
float zres = 3.0f;
zrect = CGRectMake(0.0f, 0.0f, 320.0f * zres, 480.0f * zres);

[scroller setContentSize:zrect.size];
img = [[UIImage imageAtPath:path] retain];
[imgView initWithImage:img];
[imgView setEnabledGestures:YES];
[imgView setGestureDelegate: self];

int i;

for (i = 0; i < 0×2f; i++)
{
	[imgView setEnabledGestures: i];
}

[scroller addSubview:imgView];

//	get file size after scaling

- (void)didFinishGesture:(int)fp8 inView:(id)fp12 forEvent:(struct __GSEvent *)fp16
{
	struct CGSize imgSize = [fp12 size];
	[scroller setContentSize:CGSizeMake(imgSize.width * 2.0f, imgSize.height * 2.0f)];
}
```

# (How to Play Audio Files](http://superart.wikidot.com/chinese:iphone-how-to-play-sound)

Method 1: Supports all audio formats, including mp3, m4a, m4r, etc. To compile, add `-framework Celestial`. iPod music playback will be stopped.

```
av = [[AVController alloc] init];
item = [[AVItem alloc] initWithPath:[[NSBundle mainBundle] pathForResource :@"silent" ofType:@"mp3"] error:&error];
[av setCurrentItem:item preservingRate:NO];
BOOL ok = [av play:nil];
```

Method 2: AIFF only. To compile, add `-framework GraphicsServices.framework`. This method doesn't affect iPod playback.

```
GSEventPlaySoundAtPath(@”/path/to/a/sound.aif”)

//	and some other functions
GSEventPlayAlertOrSystemSoundAtPath
GSEventPlaySoundLoopAtPath
GSEventPrimeSoundAtPath
GSEventStopSoundAtPath
```

Method 1 can be used in background music, and method 2 is mainly used in sound effects.