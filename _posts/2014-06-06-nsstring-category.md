---
layout: post
title:  NSString Related Category
date:   2014-06-06 14:42:00
tags:
- Objective C
- String
- LCategory
- Category & Extension
---

There are string related functions that may be extended in future. I'll update pod of [LCategory](https://github.com/superarts/LCategory) really quick.

{% highlight objc %}
s = [s stringByAppendingFormat:@"[NSString string_from_int:42] - '%@'\n", [NSString string_from_int:42]];
s = [s stringByAppendingFormat:@"['1' is:'1'] - %i\n", [@"1" is:@"1"]];
s = [s stringByAppendingFormat:@"['1' is:'2'] - %i\n", [@"1" is:@"2"]];
s = [s stringByAppendingFormat:@"['12' contains:'1'] - %i\n", [@"12" contains:@"1"]];
s = [s stringByAppendingFormat:@"['12' contains:'3'] - %i\n", [@"12" contains:@"3"]];
s = [s stringByAppendingFormat:@"['    te st  ' string_without_leading_space] - '%@'\n", [@"    te st  " string_without_leading_space]];
s = [s stringByAppendingFormat:@"['test' string_without_leading_space] - '%@'\n", [@"test" string_without_leading_space]];
s = [s stringByAppendingFormat:@"['12345678 l23455678' string_without:'3' to:'67'] - '%@'\n", [@"12345678 l23455678" string_without:@"3" to:@"67"]];
s = [s stringByAppendingFormat:@"['12345678 l23455678' string_without:'3' to:'67' except:['45']] - '%@'\n", [@"12345678 l23455678" string_without:@"3" to:@"67" except:@[@"34567"]]];
s = [s stringByAppendingFormat:@"['12345678 l23455678' string_between:'3' and:'67'] - '%@'\n", [@"12345678 l23455678" string_between:@"3" and:@"67"]];
s = [s stringByAppendingFormat:@"['12345678 l23455678' string_between:'3' and:'67' from:9] - '%@'\n", [@"12345678 l23455678" string_between:@"3" and:@"67" from:9]];
s = [s stringByAppendingFormat:@"['12345678 l23455678' array_between:'3' and:'67'] - '%@'\n", [@"12345678 l23455678" array_between:@"3" and:@"67"]];
s = [s stringByAppendingFormat:@"['#hash' is_hashtag] - '%i'\n", [@"#hashtag" is_hashtag]];
s = [s stringByAppendingFormat:@"['c#' is_hashtag] - '%i'\n", [@"c#" is_hashtag]];
s = [s stringByAppendingFormat:@"['test #t1 t2 #t3 t4' array_hashtag] - '%@'\n", [@"test #t1 t2 #t3 t4" array_hashtag]];
s = [s stringByAppendingFormat:@"['line1' append_line:'line2] - '%@'\n", [@"line1" append_line:@"line2"]];
s = [s stringByAppendingFormat:@"['line1' append_line2:'line2] - '%@'\n", [@"line1" append_line2:@"line2"]];
s = [s stringByAppendingFormat:@"['word1' append:'word2' divider:'|'] - '%@'\n", [@"line1" append:@"line2" divider:@"|"]];
{% endhighlight %}

Results:

{% highlight bash %}
[NSString string_from_int:42] - '42'
['1' is:'1'] - 1
['1' is:'2'] - 0
['12' contains:'1'] - 1
['12' contains:'3'] - 0
['    te st  ' string_without_leading_space] - 'te st  '
['test' string_without_leading_space] - 'test'
['12345678 l23455678' string_without:'3' to:'67'] - '128 l28'
['12345678 l23455678' string_without:'3' to:'67' except:['45']] - '12345678 l28'
['12345678 l23455678' string_between:'3' and:'67'] - '45'
['12345678 l23455678' string_between:'3' and:'67' from:9] - '455'
['12345678 l23455678' array_between:'3' and:'67'] - '(
    45,
    455
)'
['#hash' is_hashtag] - '1'
['c#' is_hashtag] - '0'
['test #t1 t2 #t3 t4' array_hashtag] - '(
    t1,
    t3
)'
['line1' append_line:'line2] - 'line1
line2'
['line1' append_line2:'line2] - 'line1

line2'
['word1' append:'word2' divider:'|'] - 'line1|line2'
{% endhighlight %}
