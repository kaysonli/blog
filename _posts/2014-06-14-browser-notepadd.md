---
layout: post
title: 浏览器一秒钟变记事本
category : 开发工具
tagline: "Supporting tagline"
tags : [浏览器]
---
{% include JB/setup %}
# 浏览器一秒钟变记事本
---

通常，浏览器是用来浏览网页的。但是，你也可以让它瞬间变成记事本,只要在浏览器地址栏输入以下代码就可以了：

	data:text/html, <html contenteditable>

![]({{ BASE_PATH }}/image/browser_notepad.png)

现在你可以编辑内容，同时支持富文本。你也可以保存为html文件下次打开继续编辑。如果你觉得这个记事本太简陋，还可以给它设置样式：

	data:text/html, <title>Notepad</title> <body contenteditable style="border:3px dashed blue;font-size:2rem;line-height:1.4;max-width:60rem; margin:10 auto;padding:4rem;">

![]({{ BASE_PATH }}/image/richeditor.png)

这归功于HTML5的**contentEditable**属性，让元素的内容可以编辑。当然，这需要浏览器支持HTML5才行。