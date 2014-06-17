---
layout: post
title: 你可能不知道的javascript特性
category : javascript
description: 列举几个不常用的javascript特性，有时候也会派上用场。
keyword: javascript特性
tagline: "Supporting tagline"
tags : [工具]
---
{% include JB/setup %}
# 你可能不知道的javascript特性
---

####1. 比Math.floor性能更好的位操作运算符

大家都知道Math.floor可以对数字向下取整。如

	Math.floor(1.6); 	//1
	Math.floor('4.3');  //4
	Math.floor(-1.6);   //-2
	Math.floor('ab');   //NaN

殊不知，用位操作符取反再取反**~~**和位或**|**也可以实现取整，而且由于是位操作，效率会比较高。

	console.log(~~1.6); 		//1
	console.log(~~'4.3');		//4
	console.log(~~-1.6);		//-1，注意不是-2

	console.log(1.6 | 0); 		//1
	console.log('4.3' | 0);		//4
	console.log(-1.6 | 0);		//-1，注意不是-2

	console.log(~~'ab');		//0
	console.log('ab' | 0);		//0

大家可能注意到了，跟 Math.floor 的**向下取整**不同，~~和 |0 只是将小数部分去掉，不管是整数还是负数。而且，后者还支持对非数字类型的值做处理。
<!--break-->
####2. 数字的点操作符

大家都知道，javascript对象都可以通过点操作符调用属性或方法。

	var a = {};
	a.toString();	//"[object Object]"

但是如果你在数字字面量上直接用点号调用，会抛出异常

	2.toString();	//SyntaxError: Unexpected token ILLEGAL
这说明数字不是对象吗？不是的。万物皆对象。在这里是由于javascript解析器将数字后面的点号解析成了小数点，所以造成语法错误。有几种办法可以避免：

	(2).toString();			//"2"
	2..toString();			//"2"
	Number(2).toString();	//"2"

####3. 利用a标签自动解析URL

有时候我们需要从URL中提取域名和查询参数等信息，通常会用字符串操作来实现。其实，通过浏览器对象模型（BOM）可以方便地完成

	var a = document.createElement('a');  
	a.href = 'http://www.zoneky.com/blog/2014/06/17/javascript-tricks/?name=kayson';  
 	console.log(a.host);	//www.zoneky.com
 	console.log(a.search);	//?name=kayson

为了方便代码复用，可以将这个功能封装成工具方法:

	function parseURL(url) {  
	    var a =  document.createElement('a');  
	    a.href = url;  
	    return {  
	        source: url,  
	        protocol: a.protocol.replace(':',''),  
	        host: a.hostname,  
	        port: a.port || '80',  
	        query: a.search,  
	        params: (function(){  
	            var ret = {},  
	                seg = a.search.replace(/^\?/,'').split('&'),  
	                len = seg.length, i = 0, s;  
	            for (;i<len;i++) {  
	                if (!seg[i]) { continue; }  
	                s = seg[i].split('=');  
	                ret[s[0]] = s[1];  
	            }  
	            return ret;  
	        })(),  
	        hash: a.hash.replace('#',''),  
	        path: a.pathname.replace(/^([^\/])/,'/$1'),  
	        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],  
	        segments: a.pathname.replace(/^\//,'').split('/')  
	    };  
	}
	var pageUrl = parseURL('http://www.zoneky.com/blog/2014/06/17/javascript-tricks/?name=kayson#top');
	pageUrl.hash;     // = 'top'
	pageUrl.host;     // = 'www.zoneky.com'
	pageUrl.query;    // = '?name=kayson'
	pageUrl.params;   // = Object {name: "kayson"}
	pageUrl.path;     // = '/blog/2014/06/17/javascript-tricks'
	pageUrl.segments; // = ["blog", "2014", "06", "17", "javascript-tricks", ""]
	pageUrl.port;     // = '80'
	pageUrl.protocol; // = 'http'
	pageUrl.source;   // = 'http://www.zoneky.com/blog/2014/06/17/javascript-tricks/?name=kayson#top'
