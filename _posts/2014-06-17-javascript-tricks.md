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

####比Math.floor性能更好的位操作运算符

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

####数字的点操作符

大家都知道，javascript对象都可以通过点操作符调用属性或方法。

	var a = {};
	a.toString();	//"[object Object]"

但是如果你在数字字面量上直接用点号调用，会抛出异常

	2.toString();	//SyntaxError: Unexpected token ILLEGAL
这说明数字不是对象吗？不是的。万物皆对象。在这里是由于javascript解析器将数字后面的点号解析成了小数点，所以造成语法错误。有几种办法可以避免：

	(2).toString();			//"2"
	2..toString();			//"2"
	Number(2).toString();	//"2"

未完待续。