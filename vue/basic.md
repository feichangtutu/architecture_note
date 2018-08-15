# array
+ for in 会把key变成字符串
+ for in能打印私有属性
+ forEach不能return
+ for of   value of arr
支持return 值遍历数组，不能遍历对象
+ reduce 收敛函数 4个参数，返回的是叠加后的结果，原数组不变
    - arr.reduce(fucntion(prev,next,index,arr){
})
    - *本次的返回值会作为下一次的prev，next取数组下一项*
```javascript
let sum = [ 0, 
            {price:20, count:2},
            {price:30, count:3},
            {price:40, count:5}
            ].reduce(function(prev, next) {
  return prev + next.price * next.count
})
```
等价于
```javascript
let sum = [ {price:20, count:2},
            {price:30, count:3},
            {price:40, count:5}
            ].reduce(function(prev, next) {
  return prev + next.price * next.count
}, 0)
```
此处的0相当于第一次的prev

# arrow
arrow fn不具备this, arguments
自己不具备this就往上一级找

## 如何更改this指向
+ call apply bind
+ var that = this
+ =>

## 如何确定this是谁
看谁调用的，.前面是谁，this就是谁

## 箭头函数
有{}必须写return

```javascript
function a(b){
	return function(c) {
	  return b+c
	}
}
```
等价于arrow 
```javascript
let a = b => c => b+c
```
以上写法为高阶函数 带俩箭头

## 闭包
函数执行的一瞬间叫闭包 作用域不销毁，执行后返回的结果必须是引用类型，被外界变量接收，此时这个函数不会销毁

# vue
在vue中很多时候不能用箭头函数 </br >
适用于构建用户界面的渐进式框架

`npm init -y` 可一键生成`package.json`, 不能有大写，特殊字符， 中文

## defineProperty
`Object.defineProperty(obj, prop, descriptor)`
用法
```javascript
Object.defineProperty(obj, "key", {
  enumerable: false,
  configurable: false,
  writable: false,
  value: "static"
});
```
```javascript
// 在对象中添加一个属性与存取描述符的示例
var bValue;
Object.defineProperty(o, "b", {
  get : function(){
    return bValue;
  },
  set : function(newValue){
    bValue = newValue;
  },
  enumerable : true,
  configurable : true
});
```
### 应用defineProperty实现简单的双向绑定
