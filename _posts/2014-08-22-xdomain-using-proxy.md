---
layout: post
title: 使用Web代理实现Ajax跨域
category : 开发工具
description: 用Asp.Net写的Web代理，实现跨域，方便前端开发。
keyword: 跨域,Web代理跨域,Ajax跨域,cookie
tagline: "Supporting tagline"
tags : [开发工具]
---
{% include JB/setup %}
# 使用Web代理实现Ajax跨域
---

目前的工作项目分为前端和后台，双方事先约定接口，之后独立开发。后台每天开发完后在测试服务器上部署，前端连接测试服务器进行数据交互。前端和后台分开的好处是代码不用混在一个工程里一起build，互不干涉。但由此也引发出一个问题，那就是Ajax跨域。目前的项目是一个Single Page App, 基本上所有数据交互都是通过Ajax请求来完成的。为了方便平时前端开发，必须解决跨域问题。

跨域方案有多种，我认为基本上可分为两大类，一类是需要目标Server配合的，另一类则不需要。前者限制稍多，必须由服务器显式允许跨域才行，比如返回HTTP头信息，修改服务器配置，返回JavaScript等。可以用JSONP，iframe等方式实现。后者主动权就掌握在跨域客户端，服务器不用为此做任何配置。这就是本文要说的Web代理。

作为前端开发，自然希望主动权在自己手里，不用劳烦Sever配合。所以我选择了使用Web代理方案。该方案的原理其实很简单，就是将跨域请求转变为同源请求。具体来说，就是在本地搭建一个Web站点（代理），该站点可以向目标服务器发送HTTP请求，接收响应。它的行为跟浏览器类似，因此目标服务器是不用区分对待的。然后将本地的前端站点也部署到这个Web站点中，这样它们就属于同一个域了。所有针对目标服务器的Ajax请求，都发送到这个代理，然后由代理负责转发和接收响应。这样就避开了跨域之名，却有跨域之实。

<!--break-->

![setting]({{BASE_PATH}}/image/Cross-domain-proxy.png)

图有点丑，欢迎拍砖。

剩下的就是实现细节了。由于对Asp.Net比较熟悉，就用它创建一个Web站点。在实现过程中，我觉得有几点细节需要关注一下。

#### HTTP Request拦截

由于事先不知道会有哪些请求（就算知道，请求的URL可能也会太多），不可能针对每个URL写一个转发规则。因此需要获取所有Ajax请求，经过统一的处理再转发到目标服务器。众所周知，Asp.Net的IHttpHandler接口定义了针对某个具体的HTTP请求的处理方法，如前所述，不可能为每个请求URL写一个Handler，有没有一种办法可以获取任何请求的信息？答案是HttpModule。HttpModule是先于HttpHandler处理的，所以在这里可以做些手脚。定义一个HttpModule也很简单，只要实现IHttpModule接口，监听Request事件就可以了。当然，需要在`Web.config`文件里注册这个HttpModule才能使用。

`XDomainProxy.cs`定义：

	public class XDomainProxy : IHttpModule
    {
        public void Dispose() { }
        public void Init(HttpApplication context)
        {
            context.BeginRequest += new EventHandler(Application_BeginRequest);
            context.EndRequest += new EventHandler(Application_EndRequest);
        }
        public void Application_BeginRequest(object sender, EventArgs e)
        {

        }
        public void Application_EndRequest(object sender, EventArgs e)
        {
            HttpApplication application = sender as HttpApplication;
            HttpContext context = application.Context;
            HttpResponse response = context.Response;
            response.StatusCode = 200;
        }
    }

在`Web.config`中注册`HttpModule`：

	<configuration>
		<system.web>
			<httpHandlers>
		     	... 
    		</httpHandlers>
		    <httpModules>
		      <add name="ProxyModule" type="AAProxy.Proxy"/>
		    </httpModules>
		</system.web>
	</configuration>

#### 模拟HTTP请求

.Net 已经封装好了`HttpWebRequest`和`HttpWebResponse`两个关键的类，非常方便。

	//实例化web访问类
	HttpWebRequest request = (HttpWebRequest)WebRequest.Create(requestUrl);
	request.Method = context.Request.HttpMethod;
	request.ContentType = context.Request.ContentType;

	string postData = context.Request.Form.ToString();
	byte[] postdatabytes = Encoding.UTF8.GetBytes(postData);
	request.ContentLength = postdatabytes.Length;
	request.AllowAutoRedirect = false;
	request.CookieContainer = loginCookie;
	request.KeepAlive = true;
	request.UserAgent = context.Request.UserAgent;

	if (context.Request.HttpMethod == "POST")
	{
	    Stream stream;
	    stream = request.GetRequestStream();
	    stream.Write(postdatabytes, 0, postdatabytes.Length);
	    stream.Close();
	}

	//接收响应
	response = (HttpWebResponse)request.GetResponse();
	 using (StreamReader reader = new StreamReader(response.GetResponseStream(), Encoding.UTF8))
    {
        string content = reader.ReadToEnd();
    }

这样就完成了一个简单的HTTP请求。注意POST请求需要另外发参数。

#### Cookie

由于所有的Ajax请求都需要用户登录才能进行，所以代理程序也必须模拟用户登录目标服务器站点。用户的登录信息是保存在cookie里的，所以在模拟请求的时候还需要保存cookie。`HttpWebRequest`有个`CookieContainer`属性，就是用来装cookie的。保存好cookie后，之后的每个请求都必须带上它，这样才能维持登录状态。另外，还需要把这些cookie写到浏览器中。这里需要注意，`.Net`封装了两个关于cookie的类，`HttpCookie`和`Cookie`。前者是Asp.Net程序写回给浏览器用的，而后者是向别的服务器发起HTTP请求时用的。所以代理程序收到目标Server返回的`Cookie`对象时，要转换成`HttpCookie`对象再返回给浏览器。

	//response是目标服务器的响应对象，context是返回给浏览器的上下文对象
	void SetCookie(HttpWebResponse response, HttpContext context)
    {
        foreach (Cookie cookie in response.Cookies)
        {
            HttpCookie httpCookie = new HttpCookie(cookie.Name, cookie.Value);
            httpCookie.Domain = cookie.Domain;
            httpCookie.Expires = cookie.Expires;
            httpCookie.Path = cookie.Path;
            httpCookie.HttpOnly = cookie.HttpOnly;
            httpCookie.Secure = cookie.Secure;
            context.Response.SetCookie(httpCookie);
        }
    }

#### Https连接

在使用过程中发现，如果目标服务器的数字证书是不受信任的，连接将被拒绝。这在连接Server端开发同事的PC调试时不方便，怎么破？.Net对Http请求有个证书验证机制，只要让这个验证总是通过就好了。（一切为了开发方便）

	ServicePointManager.ServerCertificateValidationCallback = new System.Net.Security.RemoteCertificateValidationCallback(ValidateRemoteCertificate);

	private bool ValidateRemoteCertificate(object sender, System.Security.Cryptography.X509Certificates.X509Certificate certificate, System.Security.Cryptography.X509Certificates.X509Chain chain, System.Net.Security.SslPolicyErrors sslPolicyErrors)
    {
        return true;
    }

#### 部署Web代理

部署就很简单了，新建一个IIS站点，根目录指向前端项目的路径，设定一个端口号。将Web代理发布到本地的某个目录下，然后作为一个应用程序添加到之前的IIS站点中即可。

#### 总结

经过以上几个关键步骤，基本上搭建好了Web代理。当然，这个过程中还有一些细节需要关注，比如转发请求的URL映射处理，Session过期，异常处理等。总的来说，没有用到什么高深的技术，只是针对各种跨域方案做了一个选择。