---
layout: post
title: RequireJS 模块打包
category : 前端综合
description: RequireJs 打包指定模块，输出为普通JS对象
keyword: amdclean, almond, RequireJS, AMD
tagline: "Supporting tagline"
tags : [模块化, RequireJS]
---
{% include JB/setup %}
# RequireJS 模块打包
---

 
`RequireJS`是常用的`JavaScript`模块化加载器，利用它可以方便地异步加载符合AMD规范的模块代码文件。并且它还自带一个优化工具`r.js`，可以将所有模块压缩成一个文件，用于生产环境。如果整个项目都采用`RequireJS`来管理模块，这种方式没什么问题。但是，如果要跟其他非`AMD`规范的项目集成，可能需要做些调整。比如，其他项目要用到你开发的模块，而且是采用同步脚本引用的方式，不依赖`RequireJS`。而你的模块又是用`RequireJS`写的，那么应该怎么集成呢？

<!--break-->
 
推荐两种方案：[almond](https://github.com/jrburke/almond)和[amdclean](https://www.npmjs.com/package/amdclean). 前者是`RequireJS`的替代品，在运行`r.js`后集成到优化过后的代码中。后者完全不需要`AMD`加载器了，直接将`define([], function(){})`转换成普通的`JavaScript`匿名函数。两者的配置都类似，都是配合`r.js`的`build`配置文件使用。


首先安装`RequireJS`的`node`插件

    node install requirejs

这样会在项目路径的`node_modules`目录下生成`requirejs\bin`目录，里面有个`r.js`文件。这个文件就是`RequireJS`的优化器。运行命令

    node node_modules\requirejs\bin\r.js -o build.js

命令参数可以直接写在命令里，但更好的方式是写在一个配置文件里，如build.js。

almond的build.js配置：

    ({
        baseUrl: 'app',
        optimize: 'none',
        out: 'components/build/ScatterPlot.min.js',
        name: '../almond',
        include: ['ScatterPlot'],
        paths: {
            jquery: '../bower_components/jquery/dist/jquery',
            underscore: '../bower_components/underscore/underscore',
            backbone: '../bower_components/backbone/backbone',
            text: '../bower_components/requirejs-text/text',
            css: '../bower_components/require-css/css',
            'css-builder': '../bower_components/require-css/css-builder',
            normalize: '../bower_components/require-css/normalize',
            marionette: '../bower_components/marionette/lib/backbone.marionette',
            d3: '../bower_components/d3/d3',
            jasmine: '../bower_components/jasmine/lib/jasmine-core/jasmine',
            'jasmine-html': '../bower_components/jasmine/lib/jasmine-core/jasmine-html',
            boot: '../bower_components/jasmine/lib/jasmine-core/boot',
            'jquery.layout': '../bower_components/jquery-layout/source/stable/jquery.layout',
            domReady: '../bower_components/domReady/domReady',
            'jquery.ui': '../bower_components/jquery-ui/jquery-ui',
            bootstrap: '../bower_components/bootstrap/dist/js/bootstrap.min',
            madhatter: '../public/lib/madhatter',
            ddselect: '../public/lib/madhatter/ddselect',
            ScatterPlot: '../components/scatter-plot/ScatterPlot'
        },
        wrap: {
             startFile: 'start.frag',
             endFile: 'end.frag'
        }
    })

其中`name`属性是almond.js模块，`paths`属性配置了第三方依赖的路径。`wrap`配置了匿名函数的定义块内容，会在打包后的文件开头和结尾的位置插入。

start.frag

    (function (root, factory) {
        // if (typeof define === 'function' && define.amd) {
        if(false) {
            //Allow using this built library as an AMD module
            //in another project. That other project will only
            //see this AMD call, not the internal modules in
            //the closure below.
            define([], factory);
        } else {
            //Browser globals case. Just assign the
            //result to a property on the global.
            root.ScatterPlot = factory();
        }
    }(this, function () {

end.frag

        //The modules for your project will be inlined above
        //this snippet. Ask almond to synchronously require the
        //module value for 'main' here and return it as the
        //value to use for the public API for the built file.
        return require('ScatterPlot');
    }));

使用`almond`打包虽然可以去除对`RequireJS`的依赖，但是会把依赖的第三方lib全部合并到一起，无法剥离。（也许是我没找到方法）所以后来又尝试了`amdclean`方案，该方案完全把AMD模块转换成普通`JavaScript`函数，打包成一个全局对象。`amdclean`是一个`node`模块，使用前先安装：

    npm install amdclean --save-dev

再来看build.js:

    ({
        baseUrl: 'app',
        optimize: 'none',
        out: 'components/build/ScatterPlot.min.js',
        include: ['ScatterPlot'],
        name: 'ScatterPlot',
        paths: {
            jquery: 'empty:',
            underscore: 'empty:',
            backbone: 'empty:',
            backboneLocalstorage: 'empty:',
            marionette: 'empty:',
            d3: 'empty:',
            jasmine: 'empty:',
            'jasmine-html': 'empty:',
            boot: 'empty:',
            'jquery.layout': 'empty:',
            domReady: 'empty:',
            'jquery.ui': 'empty:',
            bootstrap: 'empty:',
            madhatter: 'empty:',
            ddselect: 'empty:',

            text: '../bower_components/requirejs-text/text',
            components: '../components',
            ScatterPlot: '../components/scatter-plot/ScatterPlot'
        },
        onModuleBundleComplete: function(data) {
            var fs = module.require('fs'),
                amdclean = module.require('amdclean'),
                outputFile = data.path,
                cleanedCode = amdclean.clean({
                    'filePath': outputFile,
                    'globalModules': ['ScatterPlot'],
                    'prefixTransform': function(postNormalizedModuleName, preNormalizedModuleName) {
                        return postNormalizedModuleName.replace(/backbone/g, 'Backbone')
                            .replace(/marionette/g, 'Marionette')
                            .replace(/underscore/g, '_')
                            .replace(/madhatter/g, '""')
                            .replace(/ddselect/g, '""');
                    }
                });

            fs.writeFileSync(outputFile, cleanedCode);
        }
    })

可以看到跟`almond`配置文件的区别是，第三方lib的path配置只需写成`:empty`，这样就无需合并到结果文件。这就要求引入该压缩包的项目自行解决依赖。另外多了一个`onModuleBundleComplete`回调函数，这是r.js打包模块完成的时候会调用的。在这个函数内加载amdclean模块，写好配置。注意里面还有个`prefixTransform`回调函数，是用来给模块重命名的。之所以要重命名，是因为模块名字跟暴露的全局对象名字不一致。

