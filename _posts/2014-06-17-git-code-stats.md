---
layout: post
title: 用Git extensions统计代码行数
category : 开发工具
description: 使用Git extensions上的插件Statistic统计代码行数
keyword: git, Git extensions, 代码统计
tagline: "Supporting tagline"
tags : [工具]
---
{% include JB/setup %}
# 用Git extensions统计代码行数
---

Git是当下非常流行的分布式源代码版本管理工具，越来越多的软件项目开始使用git。git是基于命令行的工具，网上有一大堆的教程指导如何使用各种git命令。当然，如果你习惯用GUI工具，在windows下Git extensions是个不错的选择。关于如何使用Git extensions，各位可以查看[github项目主页](https://github.com/gitextensions/gitextensions)。在这里只分享下如何使用它的插件统计repository的代码行数。

![setting]({{BASE_PATH}}/image/setting.jpg)

打开Git extension的Plugins -> Settings菜单，找到Plugins下的Statistics，设置Code fiels为你希望统计的文件类型，用分号;隔开多种文件扩展名。Directories to ignore是要排除的目录，也是用分号隔开多个目录。注意这两个设置的最后都不能加分号，否则统计结果为空。设置好后就可以打开Plugins -> Statistics就可以看到各种文件的代码行数了。

![setting]({{BASE_PATH}}/image/statistics.jpg)