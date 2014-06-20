---
layout: post
title: 图片转DataURL
category : 开发工具
tagline: "Supporting tagline"
tags : [javascript, DataUrl, JS工具]
---
{% include JB/setup %}
# 图片转DataURL
---


DataURL是现代浏览器支持的一种引用图片的方式，它将图片数据直接编码到img标签的src属性中，格式为

	src="data:image/gif;base64,R0lGODlhAQAcALMAAMXh96HR97XZ98Hf98Xg97DX97nb98Lf97vc98Tg973d96rU97ba97%2Fe96XS9wAAACH5BAAAAAAALAAAAAABABwAAAQVMLhVBDNItXESAURyDI2CGIxQLE4EADs%3D"

其实就是图像数据的base64编码。这样做可以减少HTTP请求次数，但是增加了页面的体积，尤其是图片比较大的时候。当然，在使用背景图片时，也可以将DataURL写在css文件中。

那么，怎样将图片转成DataURL呢？网上有很多工具，但其实用浏览器本身的功能就可以实现了。利用HTML5的文件操作API可以读取本地图片文件，获取DataURL数据。
<!--break-->

	<input type="file" id="input" onchange="imagesSelected(this.files)" />
	function imagesSelected(myFiles) {
		var imageReader = new FileReader();
		imageReader.onload = function(e) {
		    var dataUrl = e.target.result;
		    console.log(dataUrl);
		}
		imageReader.readAsDataURL(myFiles[0]);
	}
*选择图片*
<input type="file" id="input" onchange="imagesSelected(this.files)" />
<img id="imgSelecte" />