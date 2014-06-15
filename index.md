---
layout: page
title: 大道至简
description: 李中凯的个人博客，主要分享软件开发方面的心得以及生活感悟。
keyword: 李中凯,大道至简,776966383,博客
tagline: 享受代码和生活
---
{% include JB/setup %}

{% for post in site.posts %}
<div class = "card">
		<div  class = "date_label">
			<div class="day_month">
      			{{ post.date | date:"%m/%d" }}
      			</div>
      			<div class="year">
      			{{ post.date | date:"%Y" }}
      			</div>
      		</div> 
		{{ post.content | split:'<!--break-->' | first }}
	<div class = "read_more">
		<a class="fa fa-link" href="{{ BASE_PATH }}{{ post.url }}">  查看全文&hellip;</a>
	</div>
	
</div>

{% endfor %}

