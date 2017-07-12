---
layout: post
title:  Performance of Reflection in Swift"
date:   2017-07-12 12:33:00
categories: LSwift Reflection Objective-C
---

[Original question](https://stackoverflow.com/questions/38532037/swift-mirrorreflecting-self-too-slow/45063199#45063199)

(Details will be explained later)

### Loop 1,000,000 times on my Macbook Pro (in seconds)

- 2 properties: 1 `Int` & 1 `String`
  - Getting mirror: 1.67
  - Looping throw mirror and set values: 5.68
  - Setting values: 0.11

- 1 property: 1 `Int`
  - Getting mirror: 1.52
  - Looping throw mirror and set `child.value`: 3.3
  - Looping throw mirror and set `42`: 3.27
  - Setting value `42`: 0.05
  - Setting value `42`: 0.05

[lswift]:      http://superarts.github.io/LSwift/
[superarts]:   http://www.superarts.org/blog

### Test Class

```
	class Test: NSObject {
		var int = 42
		var str = "test"
		var data = [String: Int]()
	}
```

### Benchmark

```
	var test = Test()
	let date = Date()
	for _ in 0 ... 1000000 {
		let reflection = Mirror(reflecting: test)
		for child in reflection.children {
			if let key = child.label {
				test.setValue(42, forKey: key)
			}
		}
		test.int = 42
		test.str = "test"
		test.data["int"] = 42
	}
	SA.log("BENCHMARK", -date.timeIntervalSinceNow)
```