---
layout: post
title: jekyll配置有言评论插件
category : 博客建站
description: 有言是国内比较流行的社会化评论系统，本文简单介绍如何在jekyll中配置。
keyword: jekyll, 有言, 社会化评论系统
tagline: "Supporting tagline"
tags : [建站]
---
{% include JB/setup %}
# jekyll配置有言评论插件
---

最近开始接触jekyll博客系统，折腾了几天，基本上按照自己的想法搭建好了。博客还没写几篇，评论和分享功能倒是配置好了。刚开始是从别人网站上Copy的整个网站目录，用的JekyllBootstrap主题系统。评论系统默认是国外比较比较常见的社会化评论插件Disqus，考虑到天朝的特殊国情，找了一个国内比较优秀的替代品：有言。首先在_include文件下的JB目录中新建一个文件youyan，用来存放有言的插件脚本：

	_includes
	|--JB
	   |--comments-providers
	      |--disqus
	      |--youyan
	   |--comments
	|--themes
	   |--twitter
	      |--post.html

然后去[有言官网](http://www.uyan.cc/)去注册一个账号，然后获取插件代码，放到youyan这个文件中。

	<div id="uyan_frame"></div>
	<script type="text/javascript">
	    (function() {
	        var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
	        dsq.src = 'http://v2.uyan.cc/code/uyan.js?uid=你的ID';
	        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
	    })();
	</script>
	<noscript>Please enable JavaScript to view the <a href="http://www.uyan.cc/">comments powered by 有言.</a></noscript>

接下来再编辑JB下的comments文件，加上youyan的条件判断：

	{% raw %}{% if site.JB.comments.provider and page.comments != false %}

	{% case site.JB.comments.provider %}
	{% when "disqus" %}
	  {% include JB/comments-providers/disqus %}
	{% when "uyan" %}
	  {% include JB/comments-providers/uyan %}
	{% endcase %}

	{% endif %}{% endraw %}

然后在_includes/themes/twitter/post.html中加上引用

	{% raw %}{% include JB/comments %}{% endraw %}

最后在站点的配置文件_config.yml中指定用youyan作为评论插件就行了

	  # Settings for comments helper
	  # Set 'provider' to the comment provider you want to use.
	  # Set 'provider' to false to turn commenting off globally.
	  #
	  comments :
	    provider : uyan

至此评论插件就配置好了，可以push到Github上看看效果。分享插件的配置也是类似的。