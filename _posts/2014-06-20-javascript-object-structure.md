---
layout: post
title: JavaScript对象结构：关乎性能
category : JavaScript
description: 提升javascript代码性能的常见方法是利用经过现代javascript引擎优化的属性访问。实际上，快速的属性访问是V8引擎设计元素的关键。
keyword: JavaScript性能,JavaScript引擎
tagline: "Supporting tagline"
tags : [javascript]
---
{% include JB/setup %}
# JavaScript对象结构：关乎性能
---

提升JavaScript代码性能的常见方法是利用经过现代JavaScript引擎优化的属性访问。实际上，快速的属性访问是V8引擎设计元素的关键。Webkit引擎背后的核心[JavaScriptCore](http://trac.webkit.org/wiki/JavaScriptCore)也通过[polymorphic inline cache](http://www.webkit.org/blog/214/introducing-squirrelfish-extreme/)技术实现了它。Firefox同样在它的JägerMonkey项目中使用polymorphic inline cache带来了速度提升。

那么怎样利用这个特性呢？非常简单。在实践中就是小心对待对象创建操作。比如，不推荐如下写法：

	var universe = {
	  answer: 42
	};
	// do something else
	universe.panic = false;

而应该这么写：
<!--break-->

	var universe = {
	  answer: 42,
	  panic: true
	};
	// do something else
	universe.panic = false;

大体上就是要保持对象结构不变（很明显，第一种写法就改变了结构）。如果你不知道某个属性的值，比如例子中的<code>panic</code>，这没关系。你可以稍后改变这个属性的值，但避免在对象创建后添加或删除属性可以帮到JavaScript引擎。

举个现实中的例子，比如[Esprima](http://esprima.org/)的开发。在版本[revision 4f9af77ddc](https://github.com/ariya/esprima/commit/4f9af77ddc)中，仔细修正了 <code>token</code> 对象的结构，从而提升了Firefox 9的性能。有个新功能的引入同样用到了这个技巧，从而加快了速度。

在你疯狂地使用快速属性访问特性之前，记住一点：可靠地优化。首先要确定性能瓶颈不在别的地方。另外要避免为了追求更高的性能而明显降低代码可读性。

好了，可以放手去优化了。

原文：[JavaScript object structure: speed matters](http://ariya.ofilabs.com/2012/02/javascript-object-structure-speed-matters.html), Ariya Hidayat.