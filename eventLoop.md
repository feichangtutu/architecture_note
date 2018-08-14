
![](https://user-gold-cdn.xitu.io/2018/8/10/1652325c09bb3e94?w=1920&h=800&f=jpeg&s=185219)
 
*写在前面*</br>
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
别着急，本篇内容结束后以上问题都不再是事儿。解决以上问题的要点，首先需要清楚Javascript异步处理模块，事件队列，以及事件环-Eventloop.
# 基础概念
## 进程 (process)与线程 (thread)
>进程是操作系统分配资源和调度任务的基本单位,线程是建立在进程上的一次程序运行单位，一个进程上可以有多个线程。</br>
 进程和线程属基础概念，不再赘述。有个最生动易懂的解释，详情请移步参考：[进程与线程的一个简单解释](http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)
## Javascript 单线程
 对Javascript而言，从诞生之日起，它就是单线程的。为什么呢？举个小栗子：如果可以多线程，a线程要添加某DOM节点，b线程要删除它，浏览器怎么办？难道要精分？
 所以，单线程减少了很多情境的复杂性。 </br>既然js是单线程的，它又以什么样的规则来处理并发的任务呢？千军万马要过独木桥的时候，不能靠力气来抢路。单线程，任务多，就得有个规矩来安排大家。说到这里，就到了本文的重点部分——*事件环（Event Loop）*.
 对于首次听说这个概念的同学，有必要铺垫下基础知识：

### 堆（heap）
> 对象被分配在一个堆中，即用以表示一个大部分非结构化的内存区域。
### 栈（stack）
> 函数调用形成一个栈帧;     

栈的特点：先进后出(First in, last out，具体是怎样让那些函数先入后出的？看下图会恍然大明白，图中的帅哥是Philip Roberts，看解释，别光看脸！
![](https://user-gold-cdn.xitu.io/2018/8/10/16523291001e67a8?w=951&h=530&f=gif&s=4959235)
   
### 任务队列（queue）—— 特点：先进先出(FIFO)
> 一个 JavaScript 运行时包含了一个待处理的消息队列。
    每一个消息都有一个为了处理这个消息相关联的函数
 
 说到了任务队列，就到了重点部分：事件环（Eventloop）了
 
 Defined by [webappapis](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue):
> To coordinate events, user interaction, scripts, rendering, networking, and so forth, user agents must use event loops as described in this section. 

任务队列以事件环来协调事件，用户交互，脚本，渲染，网络等。</br>

## 事件环 Eventloop
 + Explained by [Jake Archibald](https://jakearchibald.com/)：
   >Each 'thread' gets its own event loop, so each web worker gets its own, so it can execute independently
 + Or explained by [some other guys](https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40):
    > This is a constantly running process that checks if the
     call stack is empty. Imagine it like a clock and every time it ticks it looks at 
     the Call Stack and if it is empty it looks into the Event Queue. 
 
 简单来说，每个线程都有他自己的事件环，浏览器也拥有自己的事件环；事件环是一种运行时机制，它像个钟表一样，每滴答一下，就去看看`stack`里有没有事需要处理，没有的话就去事件队列（`Event Queue`）看看有没有事做。</br>
此处大家需要明白，事件环并不是定死的某个规矩，需要根据不同的运行时进行自己的一套规则。</br>
 如*node下的事件环*与*浏览器环境下的事件环*就不是相同的规则。一定要记清楚哦！首先讨论浏览器事件环。</br>
 一图顶千言，作图解释下：
![](https://user-gold-cdn.xitu.io/2018/8/10/16523ccd9d554adc?w=1000&h=650&f=png&s=115946)

根据上图的运作模式作进一步[解释](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)：
### 宏任务
虽然知道任务队列分为宏任务，微任务，但是一直未找到宏任务的定义，知道看到[stackoverflow](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)上的解释。
>  One go-around of the event loop will have exactly one task being processed from the macrotask queue (this queue is simply called the task queue in the WHATWG specification).

>事件循环的一次复制将从macrotask队列中正好处理一个任务（此队列在WHATWG规范中简称为任务队列）。 在该宏任务完成之后，将处理所有可用的微任务，即在相同的复飞周期内。 在处理这些微任务时，它们可以排队甚至更多的微任务，这些微任务将一个接一个地运行，直到微任务队列耗尽为止。


> After this macrotask has finished, all available microtasks will be processed, namely within the same go-around cycle. While these microtasks are processed, they can queue even more microtasks, which will all be run one by one, until the microtask queue is exhausted.

关于宏任务,"this queue is simply called the task queue in the WHATWG specification",


+ macro-task(宏任务)包含: setTimeout, setInterval, setImmediate, I/O
### 微任务
Explained by [webappapis](https://html.spec.whatwg.org/multipage/webappapis.html#microtask-queue)
> Each event loop has a microtask queue. A microtask is a task that is originally to be queued on the microtask queue rather than a task queue. There are two kinds of microtasks: solitary callback microtasks, and compound microtasks.

翻译：每个eventloop都有一个微任务队列，微任务最初是被放到微任务队列*而不是任务队列*。

微任务包括：process.nextTick([node api](http://nodejs.cn/api/process.html#process_process_nexttick_callback_args)), 原生Promise(有些实现的promise将then方法放到了宏任务中),Object.observe(已废弃), MutationObserver

事件环`eventloop`中为什么必须在所有的微任务`microtask`都执行结束后再取新的宏任务`macrotask`呢？
这涉及`microtask`的[执行机制](https://html.spec.whatwg.org/multipage/webappapis.html#microtask-queue)：
![](https://user-gold-cdn.xitu.io/2018/8/10/1652382ea8f1e824?w=2226&h=1106&f=png&s=363837)

step2中做了明确的解释，只要microtask的队列不为空，eventloop中的当前任务就会按顺序执行microtask队列中的所有任务。
[task queue](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue)的
 这里可以看到两者的一点区别，微任务`microtask`队列是独立的一个队列，在eventloop执行过程中才进入到任务队列`task queue`一次执行。

###写在最后
没有尽兴的朋友推荐以下几篇好文，这些是我个人认为讲解事件环，异步事件队列等最为具体清晰的文章：
>Best reference:
>1. [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) by Jake Archibald </br>
>2. [How does Javascript event work?](https://www.youtube.com/watch?v=8aGhZQkoFbQ) or </br>
[Help, I'm stuck in an event-loop](https://vimeo.com/96425312) by  Philip Roberts
> 3. https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context

其他参考
>4. https://abc.danch.me/microtasks-macrotasks-more-on-the-event-loop-881557d7af6f
>5. https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick
>6. http://nodejs.cn/api/process.html#process_process_nexttick_callback_args

希望大家看文本文能有收货。


![](https://user-gold-cdn.xitu.io/2018/8/10/1652325c09bb3e94?w=1920&h=800&f=jpeg&s=185219)
 
*写在前面*</br>
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
别着急，本篇内容结束后以上问题都不再是事儿。解决以上问题的要点，首先需要清楚Javascript异步处理模块，事件队列，以及事件环-Eventloop.
# 基础概念
## 进程 (process)与线程 (thread)
>进程是操作系统分配资源和调度任务的基本单位,线程是建立在进程上的一次程序运行单位，一个进程上可以有多个线程。</br>
 进程和线程属基础概念，不再赘述。有个最生动易懂的解释，详情请移步参考：[进程与线程的一个简单解释](http://www.ruanyifeng.com/blog/2013/04/processes_and_threads.html)
## Javascript 单线程
 对Javascript而言，从诞生之日起，它就是单线程的。为什么呢？举个小栗子：如果可以多线程，a线程要添加某DOM节点，b线程要删除它，浏览器怎么办？难道要精分？
 所以，单线程减少了很多情境的复杂性。 </br>既然js是单线程的，它又以什么样的规则来处理并发的任务呢？千军万马要过独木桥的时候，不能靠力气来抢路。单线程，任务多，就得有个规矩来安排大家。说到这里，就到了本文的重点部分——*事件环（Event Loop）*.
 对于首次听说这个概念的同学，有必要铺垫下基础知识：

### 堆（heap）
> 对象被分配在一个堆中，即用以表示一个大部分非结构化的内存区域。
### 栈（stack）
> 函数调用形成一个栈帧;     

栈的特点：先进后出(First in, last out，具体是怎样让那些函数先入后出的？看下图会恍然大明白，图中的帅哥是Philip Roberts，看解释，别光看脸！
![](https://user-gold-cdn.xitu.io/2018/8/10/16523291001e67a8?w=951&h=530&f=gif&s=4959235)
   
### 任务队列（queue）—— 特点：先进先出(FIFO)
> 一个 JavaScript 运行时包含了一个待处理的消息队列。
    每一个消息都有一个为了处理这个消息相关联的函数
 
 说到了任务队列，就到了重点部分：事件环（Eventloop）了
 
 Defined by [webappapis](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue):
> To coordinate events, user interaction, scripts, rendering, networking, and so forth, user agents must use event loops as described in this section. 

任务队列以事件环来协调事件，用户交互，脚本，渲染，网络等。</br>

## 事件环 Eventloop
 + Explained by [Jake Archibald](https://jakearchibald.com/)：
   >Each 'thread' gets its own event loop, so each web worker gets its own, so it can execute independently
 + Or explained by [some other guys](https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40):
    > This is a constantly running process that checks if the
     call stack is empty. Imagine it like a clock and every time it ticks it looks at 
     the Call Stack and if it is empty it looks into the Event Queue. 
 
 简单来说，每个线程都有他自己的事件环，浏览器也拥有自己的事件环；事件环是一种运行时机制，它像个钟表一样，每滴答一下，就去看看`stack`里有没有事需要处理，没有的话就去事件队列（`Event Queue`）看看有没有事做。</br>
此处大家需要明白，事件环并不是定死的某个规矩，需要根据不同的运行时进行自己的一套规则。</br>
 如*node下的事件环*与*浏览器环境下的事件环*就不是相同的规则。一定要记清楚哦！首先讨论浏览器事件环。</br>
 一图顶千言，作图解释下：
![](https://user-gold-cdn.xitu.io/2018/8/10/16523ccd9d554adc?w=1000&h=650&f=png&s=115946)

根据上图的运作模式作进一步[解释](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)：
### 宏任务
虽然知道任务队列分为宏任务，微任务，但是一直未找到宏任务的定义，知道看到[stackoverflow](https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context)上的解释。
>  One go-around of the event loop will have exactly one task being processed from the macrotask queue (this queue is simply called the task queue in the WHATWG specification).

>事件循环的一次复制将从macrotask队列中正好处理一个任务（此队列在WHATWG规范中简称为任务队列）。 在该宏任务完成之后，将处理所有可用的微任务，即在相同的复飞周期内。 在处理这些微任务时，它们可以排队甚至更多的微任务，这些微任务将一个接一个地运行，直到微任务队列耗尽为止。


> After this macrotask has finished, all available microtasks will be processed, namely within the same go-around cycle. While these microtasks are processed, they can queue even more microtasks, which will all be run one by one, until the microtask queue is exhausted.

关于宏任务,"this queue is simply called the task queue in the WHATWG specification",


+ macro-task(宏任务)包含: setTimeout, setInterval, setImmediate, I/O
### 微任务
Explained by [webappapis](https://html.spec.whatwg.org/multipage/webappapis.html#microtask-queue)
> Each event loop has a microtask queue. A microtask is a task that is originally to be queued on the microtask queue rather than a task queue. There are two kinds of microtasks: solitary callback microtasks, and compound microtasks.

翻译：每个eventloop都有一个微任务队列，微任务最初是被放到微任务队列*而不是任务队列*。

微任务包括：process.nextTick([node api](http://nodejs.cn/api/process.html#process_process_nexttick_callback_args)), 原生Promise(有些实现的promise将then方法放到了宏任务中),Object.observe(已废弃), MutationObserver

事件环`eventloop`中为什么必须在所有的微任务`microtask`都执行结束后再取新的宏任务`macrotask`呢？
这涉及`microtask`的[执行机制](https://html.spec.whatwg.org/multipage/webappapis.html#microtask-queue)：
![](https://user-gold-cdn.xitu.io/2018/8/10/1652382ea8f1e824?w=2226&h=1106&f=png&s=363837)

step2中做了明确的解释，只要microtask的队列不为空，eventloop中的当前任务就会按顺序执行microtask队列中的所有任务。
[task queue](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue)的
 这里可以看到两者的一点区别，微任务`microtask`队列是独立的一个队列，在eventloop执行过程中才进入到任务队列`task queue`一次执行。

###写在最后
没有尽兴的朋友推荐以下几篇好文，这些是我个人认为讲解事件环，异步事件队列等最为具体清晰的文章：
>Best reference:
>1. [Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/) by Jake Archibald </br>
>2. [How does Javascript event work?](https://www.youtube.com/watch?v=8aGhZQkoFbQ) or </br>
[Help, I'm stuck in an event-loop](https://vimeo.com/96425312) by  Philip Roberts
> 3. https://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context

其他参考
>4. https://abc.danch.me/microtasks-macrotasks-more-on-the-event-loop-881557d7af6f
>5. https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick
>6. http://nodejs.cn/api/process.html#process_process_nexttick_callback_args

希望大家看文本文能有收货。

