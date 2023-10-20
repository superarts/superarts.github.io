---
layout: post
title:  "Is HackerRank fair?"
date:   2023-10-20 11:44:00
tags:
- HackerRank
---

# A bit confused about HackerRank

Recently I'm doing a little bit [HackerRank](https://www.hackerrank.com/) questions, but I don't quite understand its system. In its "1 week preparation kit" day 4 "mock test", there's a [petrol pump problem like this one](https://www.geeksforgeeks.org/find-a-tour-that-visits-all-stations/); my "simple and slow" Swift answer failed more than half of the tests because they cannot be finished in 2 seconds:

```Swift
func truckTour(petrolpumps: [[Int]]) -> Int {
    print(petrolpumps)
    // Write your code here
    for index in 0 ..< petrolpumps.count {
        var petrol = 0
        var isFinished = true
        for i2 in index ..< petrolpumps.count {
            print("\(i2): \(petrol), \(petrolpumps[i2])")
            petrol += petrolpumps[i2][0] - petrolpumps[i2][1]
            if petrol <= 0 {
                isFinished = false
                break
            }
            print("\(i2): \(petrol)")
        }
        if isFinished {
            return index
        }
    }
    return 1
}
```

However, after translating it to `C`, all tests are passed in time:

```C
int truckTour(int petrolpumps_rows, int petrolpumps_columns, int** petrolpumps) {
    for (int index = 0; index < petrolpumps_rows; index++) {
        int petrol = 0;
        bool isFinished = true;
        for (int i2 = index; i2 < petrolpumps_rows; i2++) {
            petrol += petrolpumps[i2][0] - petrolpumps[i2][1];
            if (petrol <= 0) {
                isFinished = false;
                break; 
            }
        }
        if (isFinished) {
            return index;
        }
    }
    return 1; 
}
```

It is not surprising that my Swift answer failed, it's should because it's slow. However, I wonder why my C version is passed. IMO they should give the C version at most 0.08s to 0.1s, or increase input data size by 15-20 times. What do you think?