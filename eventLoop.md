面过前端的小伙伴们都见过这么一道关于异步的小题：
```javascript
for(var i = 0; i<10; i++){
	setTimeout(function(){
		console.log(i)
	},1000)
}
```
稍微了解异步的同学都会对答案呼之欲出。BUT!
如果问题升级为：
```javascript
setTimeout(function(){
	console.log(1)
},0)
new Promise(function executor(resolve) {
  console.log(2)
  for(var j = 0;j<10000;j++){
  	j=9999&resolve()
  }
  console.log(3)
}).then(function(){
	console.log(4)
})
console.log(5)
```
还有这样：
```javascript
Promise.resolve().then(()=>{
	console.log('then2');
	Promise.resolve().then(()=>{
		console.log('then3');
	})
	setTimeout(function(){
		console.log('setTimeout2');
	},0)
})

setTimeout(function(){
	Promise.resolve().then(()=>console.log('then1'))
},0);
setTimeout(function(){
	console.log(1)
},0);
setTimeout(function(){
	console.log(2)
},0);
setTimeout(function(){
	console.log(3)
},0);

```
是不是稍微的有那么点小蒙圈？
别着急，本篇内容结束后以上问题都不再是事儿。
# 内容概要
+ 背景知识
    - 进程与线程
    - Javascript单线程
+ 浏览器事件环
+ node事件环
+ 回顾
>Best reference:
>1. [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) by Jake Archibald </br>
>2. [How does Javascript event work?](https://www.youtube.com/watch?v=8aGhZQkoFbQ) or </br>
[Help, I'm stuck in an event-loop](https://vimeo.com/96425312) by  Philip Roberts

# 基础概念
## 进程 (process)与线程 (thread)
>进程是操作系统分配资源和调度任务的基本单位,线程是建立在进程上的一次程序运行单位，一个进程上可以有多个线程。</br>
 进程和线程属基础概念，不再赘述。有个最生动易懂的解释，详情请移步参考：[阮一峰文：进程与线程的一个简单解释](http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)
## Javascript 单线程
 对Javascript而言，从诞生之日起，它就是单线程的。为什么呢？举个小栗子：如果可以多线程，a线程要添加某DOM节点，b线程要删除它，浏览器怎么办？难道要精分？
 所以，单线程减少了很多情境的复杂性。
 既然js是单线程的，它又以什么样的规则来处理并发任务呢？说到这里，就到了本文的重点部分——*事件环（Event Loop）*.看下概念：
 
 + Explained by [Jake Archibald](https://jakearchibald.com/)：
    >Each 'thread' gets its own event loop, so each web worker gets its own, so it can execute independently
 
 + Or explained by [some other guys](https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40):
    > This is a constantly running process that checks if the
     call stack is empty. Imagine it like a clock and every time it ticks it looks at 
     the Call Stack and if it is empty it looks into the Event Queue. 
 
 简单来说，每个线程都有他自己的事件环，浏览器也拥有自己的事件环；
 事件环是一种运行时机制，它像个钟表一样，每滴答一下，就去看看`stack`里有没有事需要处理，没有的话就去事件队列（`Event Queue`）看看有没有事做。
 一图顶千言，引用 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/EventLoop) 的可视化模型进一步了解下：
 ![Alt text](event_loop_model.svg)
 - 栈（stack）
    > 函数调用形成了一个栈帧;     
    栈的特点：先进后出，具体是怎样让那些函数先入后出的？看下图会恍然大明白，图中的帅哥就是Philip Roberts，看解释，别光看脸！
     <iframe height=200 width=400 src="stack.gif">

 - 堆（heap）
    > 对象被分配在一个堆中，即用以表示一个大部分非结构化的内存区域。
 - 任务队列（queue）—— 特点：先进先出
    > 一个 JavaScript 运行时包含了一个待处理的消息队列。
    每一个消息都有一个为了处理这个消息相关联的函数
    
    So, what isEvent loops? Defined by [webappapis](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue):
    > To coordinate events, user interaction, scripts, rendering, networking, and so forth, 
    user agents must use event loops as described in this section. 
    There are two kinds of event loops: those for browsing contexts, and those for workers.
     


### macro-task(宏任务)与micro-task(微任务)
众所周知，异步执行会在同步之后，那异步的执行规则又是什么呢？首先我们得先认识：macro-task(宏任务)与micro-task(微任务)
+ macro-task(宏任务): setTimeout, setInterval, setImmediate, I/O
+ micro-task(微任务): process.nextTick, 原生Promise(有些实现的promise将then方法放到了宏任务中),Object.observe(已废弃), MutationObserver
