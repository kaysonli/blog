---
layout: post
title: Extjs 4 chart自定义坐标轴刻度
category : Javascript
tagline: "Supporting tagline"
tags : [ExtJS]
---
{% include JB/setup %}
# Extjs 4 chart自定义坐标轴刻度
---
<p>Sencha出品的ExtJs是一个非常优秀的前端框架，尤其是具有里程碑意义的4.0的发布。4.0采用MVC架构和全新的class系统，并且提供了非常丰富的组件。但是，尽管ExtJS如此强大，仍有不尽人意的地方。比如，chart里坐标轴的刻度通常是均匀分布的，ExtJS的实现也是通过坐标轴的最大值和最小值以及其他参数配置均匀的计算刻度。但是，在工作过程中碰到需要自定义刻度的情况，如下图所示</p>
<p><img style="display: block; margin-left: auto; margin-right: auto;" src="http://images.cnitblog.com/i/121167/201406/031012390521791.jpg" alt="" /></p>
<p>水平轴的刻度是5,10,20这样的不均匀值，但是ExtJS不支持这样的功能（至少我翻遍了文档也没找到）。最初想到的办法是隐藏不需要的label，可这样写：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #000000;">{
</span><span style="color: #008080;"> 2</span>     type: 'Numeric'<span style="color: #000000;">,
</span><span style="color: #008080;"> 3</span>     position: 'bottom'<span style="color: #000000;">,
</span><span style="color: #008080;"> 4</span>     fields: ['x'<span style="color: #000000;">],
</span><span style="color: #008080;"> 5</span> <span style="color: #000000;">    title: xAxisTitle,
</span><span style="color: #008080;"> 6</span> <span style="color: #000000;">    minimum: xRange.xMinimum,
</span><span style="color: #008080;"> 7</span> <span style="color: #000000;">    maximum: xRange.xMaximum,
</span><span style="color: #008080;"> 8</span>     <span style="color: #ff0000;">majorTickSteps: 5,
</span><span style="color: #008080;"> 9</span>     <span style="color: #ff0000;">minorTickSteps: 10,
</span><span style="color: #008080;">10</span> <span style="color: #000000;">    label: {
</span><span style="color: #008080;">11</span>         renderer: <span style="color: #0000ff;">function</span><span style="color: #000000;">(val) {
</span><span style="color: #008080;">12</span>             <span style="color: #008000;">//</span><span style="color: #008000;">lables: [5, 10, 20]</span>
<span style="color: #008080;">13</span>             <span style="color: #0000ff;">if</span> (labels.indexOf(val) &lt; 0<span style="color: #000000;">) {
</span><span style="color: #008080;">14</span>                 <span style="color: #0000ff;">return</span> ''<span style="color: #000000;">;
</span><span style="color: #008080;">15</span> <span style="color: #000000;">            }
</span><span style="color: #008080;">16</span>             <span style="color: #0000ff;">return</span><span style="color: #000000;"> val;
</span><span style="color: #008080;">17</span> <span style="color: #000000;">        }
</span><span style="color: #008080;">18</span> <span style="color: #000000;">    },
</span><span style="color: #008080;">19</span>     grid: <span style="color: #0000ff;">true</span>
<span style="color: #008080;">20</span> }</pre>
</div>
<p>但是这样写有两个问题，一是需要显示的label值不一定会出现在renderer中，二是即便label没显示，垂直的网格线（通过配置代码中红色部分的属性可以调节网格线密度）还是会出现，这可能并不是我们想要的。通过查阅源码发现，在坐标轴内部实现中，是通过坐标轴范围和刻度个数来计算的，并且网格线跟坐标刻度是一致的。在源码文件ext\src\chart\axis\Axis.js 480行：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;">1</span> <span style="color: #008000;">//</span><span style="color: #008000;"> Build the array of steps out of the fixed-value 'step'.</span>
<span style="color: #008080;">2</span>        steps = <span style="color: #0000ff;">new</span><span style="color: #000000;"> Array;
</span><span style="color: #008080;">3</span>        <span style="color: #0000ff;">for</span> (val = +me.from; val &lt; +me.to; val +=<span style="color: #000000;"> step) {
</span><span style="color: #008080;">4</span> <span style="color: #000000;">            steps.push(val);
</span><span style="color: #008080;">5</span> <span style="color: #000000;">       }
</span><span style="color: #008080;">6</span>        steps.push(+me.to);</pre>
</div>
<p>之后渲染label和网格线都用到steps这个数组。所以，可以在这个地方做点手脚，把steps变量强行改成我们需要的数组，让ExtJS按照我们的意图去做。显然，不能直接去修改Ext的源码文件。这里有两种办法，一是用Ext.override方法去重写Ext.chart.axis.Axis的drawAxis方法，二是在Axis的配置参数里提供该方法的自定义实现。前者会影响到之后的所有用到坐标轴的chart，后者只会影响当前的chart. 代码改动如下：</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> Ext.syncRequire('Ext.chart.axis.Axis'<span style="color: #000000;">);
</span><span style="color: #008080;"> 2</span> <span style="color: #000000;">Ext.override(Ext.chart.axis.Axis, {
</span><span style="color: #008080;"> 3</span>     <span style="color: #008000;">/*</span><span style="color: #008000;">*
</span><span style="color: #008080;"> 4</span> <span style="color: #008000;">     * Renders the axis into the screen and updates its position.
</span><span style="color: #008080;"> 5</span>      <span style="color: #008000;">*/</span>
<span style="color: #008080;"> 6</span>     drawAxis: <span style="color: #0000ff;">function</span><span style="color: #000000;">(init) {
</span><span style="color: #008080;"> 7</span>         <span style="color: #0000ff;">var</span> me = <span style="color: #0000ff;">this</span><span style="color: #000000;">,
</span><span style="color: #008080;"> 8</span> <span style="color: #000000;">            i,
</span><span style="color: #008080;"> 9</span>             x =<span style="color: #000000;"> me.x,
</span><span style="color: #008080;">10</span>             y =<span style="color: #000000;"> me.y,
</span><span style="color: #008080;">11</span>             dashSize =<span style="color: #000000;"> me.dashSize,
</span><span style="color: #008080;">12</span>             length =<span style="color: #000000;"> me.length,
</span><span style="color: #008080;">13</span>             position =<span style="color: #000000;"> me.position,
</span><span style="color: #008080;">14</span>             verticalAxis = (position == 'left' || position == 'right'<span style="color: #000000;">),
</span><span style="color: #008080;">15</span>             inflections =<span style="color: #000000;"> [],
</span><span style="color: #008080;">16</span>             calcLabels =<span style="color: #000000;"> (me.isNumericAxis),
</span><span style="color: #008080;">17</span>             stepCalcs =<span style="color: #000000;"> me.applyData(),
</span><span style="color: #008080;">18</span>             step =<span style="color: #000000;"> stepCalcs.step,
</span><span style="color: #008080;">19</span>             steps =<span style="color: #000000;"> stepCalcs.steps,
</span><span style="color: #008080;">20</span>             stepsArray =<span style="color: #000000;"> Ext.isArray(steps),
</span><span style="color: #008080;">21</span>             from =<span style="color: #000000;"> stepCalcs.from,
</span><span style="color: #008080;">22</span>             to =<span style="color: #000000;"> stepCalcs.to,
</span><span style="color: #008080;">23</span>             <span style="color: #008000;">//</span><span style="color: #008000;"> If we have a single item, to - from will be 0.</span>
<span style="color: #008080;">24</span>             axisRange = (to - from) || 1<span style="color: #000000;">,
</span><span style="color: #008080;">25</span> <span style="color: #000000;">            trueLength,
</span><span style="color: #008080;">26</span> <span style="color: #000000;">            currentX,
</span><span style="color: #008080;">27</span> <span style="color: #000000;">            currentY,
</span><span style="color: #008080;">28</span> <span style="color: #000000;">            path,
</span><span style="color: #008080;">29</span>             subDashesX = me.minorTickSteps || 0<span style="color: #000000;">,
</span><span style="color: #008080;">30</span>             subDashesY = me.minorTickSteps || 0<span style="color: #000000;">,
</span><span style="color: #008080;">31</span>             dashesX = Math.max(subDashesX + 1, 0<span style="color: #000000;">),
</span><span style="color: #008080;">32</span>             dashesY = Math.max(subDashesY + 1, 0<span style="color: #000000;">),
</span><span style="color: #008080;">33</span>             dashDirection = (position == 'left' || position == 'top' ? -1 : 1<span style="color: #000000;">),
</span><span style="color: #008080;">34</span>             dashLength = dashSize *<span style="color: #000000;"> dashDirection,
</span><span style="color: #008080;">35</span>             series =<span style="color: #000000;"> me.chart.series.items,
</span><span style="color: #008080;">36</span>             firstSeries = series[0<span style="color: #000000;">],
</span><span style="color: #008080;">37</span>             gutters = firstSeries ?<span style="color: #000000;"> firstSeries.nullGutters : me.nullGutters,
</span><span style="color: #008080;">38</span> <span style="color: #000000;">            padding,
</span><span style="color: #008080;">39</span> <span style="color: #000000;">            subDashes,
</span><span style="color: #008080;">40</span> <span style="color: #000000;">            subDashValue,
</span><span style="color: #008080;">41</span>             delta = 0<span style="color: #000000;">,
</span><span style="color: #008080;">42</span>             stepCount = 0<span style="color: #000000;">,
</span><span style="color: #008080;">43</span> <span style="color: #000000;">            tick, axes, ln, val, begin, end;
</span><span style="color: #008080;">44</span> 
<span style="color: #008080;">45</span>         me.from =<span style="color: #000000;"> from;
</span><span style="color: #008080;">46</span>         me.to =<span style="color: #000000;"> to;
</span><span style="color: #008080;">47</span> 
<span style="color: #008080;">48</span>         <span style="color: #008000;">//</span><span style="color: #008000;"> If there is nothing to show, then leave. </span>
<span style="color: #008080;">49</span>         <span style="color: #0000ff;">if</span> (me.hidden || (from &gt;<span style="color: #000000;"> to)) {
</span><span style="color: #008080;">50</span>             <span style="color: #0000ff;">return</span><span style="color: #000000;">;
</span><span style="color: #008080;">51</span> <span style="color: #000000;">        }
</span><span style="color: #008080;">52</span> 
<span style="color: #008080;">53</span>         <span style="color: #008000;">//</span><span style="color: #008000;"> If no steps are specified (for instance if the store is empty), then leave.</span>
<span style="color: #008080;">54</span>         <span style="color: #0000ff;">if</span> ((stepsArray &amp;&amp; (steps.length == 0)) || (!stepsArray &amp;&amp;<span style="color: #000000;"> isNaN(step))) {
</span><span style="color: #008080;">55</span>             <span style="color: #0000ff;">return</span><span style="color: #000000;">;
</span><span style="color: #008080;">56</span> <span style="color: #000000;">        }
</span><span style="color: #008080;">57</span> 
<span style="color: #008080;">58</span>         <span style="color: #0000ff;">if</span><span style="color: #000000;"> (stepsArray) {
</span><span style="color: #008080;">59</span>             <span style="color: #008000;">//</span><span style="color: #008000;"> Clean the array of steps:</span>
<span style="color: #008080;">60</span>             <span style="color: #008000;">//</span><span style="color: #008000;"> First remove the steps that are out of bounds.</span>
<span style="color: #008080;">61</span>             steps = Ext.Array.filter(steps, <span style="color: #0000ff;">function</span><span style="color: #000000;">(elem, index, array) {
</span><span style="color: #008080;">62</span>                 <span style="color: #0000ff;">return</span> (+elem &gt; +me.from &amp;&amp; +elem &lt; +<span style="color: #000000;">me.to);
</span><span style="color: #008080;">63</span>             }, <span style="color: #0000ff;">this</span><span style="color: #000000;">);
</span><span style="color: #008080;">64</span> 
<span style="color: #008080;">65</span>             <span style="color: #008000;">//</span><span style="color: #008000;"> Then add bounds on each side.</span>
<span style="color: #008080;">66</span>             steps =<span style="color: #000000;"> Ext.Array.union([me.from], steps, [me.to]);
</span><span style="color: #008080;">67</span>         } <span style="color: #0000ff;">else</span><span style="color: #000000;"> {
</span><span style="color: #008080;">68</span>             <span style="color: #008000;">//</span><span style="color: #008000;"> Build the array of steps out of the fixed-value 'step'.</span>
<span style="color: #008080;">69</span>             steps = <span style="color: #0000ff;">new</span><span style="color: #000000;"> Array;
</span><span style="color: #ff0000;">70 </span>            <span style="color: #ff0000;">if (me.fixedSteps) {
71                 steps = me.fixedSteps;
72             } else {
<span style="color: #000000;">73</span>                 <span style="color: #000000;">for (val = +me.from; val &lt; +me.to; val += step) {
74                     steps.push(val);
75                 }
76                 steps.push(+me.to);</span>
77             }
</span><span style="color: #008080;">78</span> 
<span style="color: #008080;">79</span> <span style="color: #000000;">        }
</span><span style="color: #008080;">80</span>         ...<span style="color: #008000;">//</span><span style="color: #008000;">此处省略其他原有代码</span>
<span style="color: #008080;">81</span> <span style="color: #000000;">    }
</span><span style="color: #008080;">82</span> });</pre>
</div>
<p>代码中红色部分if语句块里就是偷梁换柱的地方。使用的时候，在axis的配置代码里加上fixedSteps属性就行了。</p>
<div class="cnblogs_code">
<pre><span style="color: #008080;"> 1</span> <span style="color: #000000;">{
</span><span style="color: #008080;"> 2</span>     type: 'Numeric'<span style="color: #000000;">,
</span><span style="color: #008080;"> 3</span>     position: 'bottom'<span style="color: #000000;">,
</span><span style="color: #008080;"> 4</span>     fields: ['x'<span style="color: #000000;">],
</span><span style="color: #008080;"> 5</span> <span style="color: #000000;">    title: xAxisTitle,
</span><span style="color: #008080;"> 6</span> <span style="color: #000000;">    minimum: xRange.xMinimum,
</span><span style="color: #008080;"> 7</span> <span style="color: #000000;">    maximum: xRange.xMaximum,
</span><span style="color: #008080;"> 8</span>     <span style="color: #ff0000;">fixedSteps: [5, 10,20],
</span><span style="color: #008080;"> 9</span>     grid: <span style="color: #0000ff;">true</span>
<span style="color: #008080;">10</span> }</pre>
</div>
<p>至此，雕虫小技大功告成。欢迎拍砖。</p>