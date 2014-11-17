---
layout: post
title: Chrome Command API 参考
category : 开发工具
description: Chrome控制台命令行API参考
keyword: Chrome,Command Line API,Chrome控制台
tagline: "Supporting tagline"
tags : [开发工具]
---
{% include JB/setup %}
# Chrome Command API 参考
---

Chrome开发工具已经强大得令人发指了，除了可通过UI操作的各种功能外，还提供了基于控制台的命令行方法，极大地方便了开发调试。现在就来领略下Chrome Command API 的风骚。

<!--break-->

### $_

返回控制台最近计算的表达式的值。
    > 2+ 2
      4
    > $_
      4
    >


### $0 - $4

返回在Elements面板最近选择的5个DOM元素（或者Profiles面板里选择的JavaScript对象）。

### $选择器

有木有很熟悉？对了，jQuery也用这个。其实他是document.querySelector()的别名，
用法跟jQuery的类似，它只返回一个DOM元素（如果有的话）。

### $$选择器

是document.querySelectorAll()的简写，它返回匹配的DOM元素集合。

### $x(path)

根据指定的XPath表达式返回DOM元素集合。

### clear()

清除控制台内容。

### copy(object)

这个好用，可以把JavaScript对象的字符串表示拷贝到剪贴板。之前碰到过JavaScript对象某个属性的值
是个很长的字符串的情况，在控制台输出时只能显示一部分，其余的用...显示了，这样直接选中拷贝的话就不完整了。

### debug(function)

可以指定调试某个function，当function被调用时会在function内部出现一个断点。跟它对应的undebug(function),可以取消断点。

### dir(object)
console.dir(object)的别名, 将对象输出到控制台，可以展开查看各个属性。

### dirxml(object)

等同于console.dirxml()方法。输出DOM对象的效果跟在Elements面板里看到的相同。

### inspect(object/function)

打开对象或元素所在的查看面板：DOM元素就打开Elements面板，JavaScript对象就打开Profiles面板。

### getEventListeners(object)
列出DOM元素上注册的事件处理器。

### keys(object)
返回一个数组，包含指定对象的所有属性名。要获取对应的值数组，请用values(object)。

    var player1 = {    "name": "Ted",    "level": 42}

    > keys(player1)
      ["name", "level"]
    > values(player1)
      ["Ted", 42]
    >


### monitor(function)
监听一个函数的执行，当函数被调用时，控制台输出一条记录。

    > function sum(x, y) {    return x + y;}monitor(sum);
    > sum(1,2)
    function sum called with arguments: 1, 2
    > 3
    >
要取消监听，就用unmonitor(function)。

### monitorEvents(object[, events])
监听对象上的事件。如果对象上指定的事件被触发，控制台会输出一条信息。可以在参数里指定事件名，或者事件类型。可以是单个事件，也可以是多个事件（放在数组里）。

    > monitorEvents(window, "resize");
    undefined
    resize Event {clipboardData: undefined, path: NodeList[0], cancelBubble: false, returnValue: true, srcElement: Window…}
事件类型可以指定一类事件：

<table><thead><tr><th>事件类型</th><th>事件</th></tr></thead><tbody><tr><td><strong>mouse</strong></td><td>"<code>mousedown</code>", "<code>mouseup</code>", "<code>click</code>", "<code>dblclick</code>", "<code>mousemove</code>", "<code>mouseover</code>", "<code>mouseout</code>", "<code>mousewheel</code>"</td></tr><tr><td><strong>key</strong></td><td>"<code>keydown</code>", "<code>keyup</code>", "<code>keypress</code>", "<code>textInput</code>"</td></tr><tr><td><strong>touch</strong></td><td>"<code>touchstart</code>", "<code>touchmove</code>", "<code>touchend</code>", "<code>touchcancel</code>"</td></tr><tr><td><strong>control</strong></td><td>"<code>resize</code>", "<code>scroll</code>", "<code>zoom</code>", "<code>focus</code>", "<code>blur</code>", "<code>select</code>", "<code>change</code>", "<code>submit</code>", "<code>reset</code>"</td></tr></tbody></table>
相应地，用unmonitorEvents(object[, events])取消监听。

#### 参考资料
[Command Line API Referrence](https://developer.chrome.com/devtools/docs/commandline-api)