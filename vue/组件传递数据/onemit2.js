/**
 * Created by jyn on 2018/8/16.
 * 传参功能添加
 */
function Girl(){
	this._events = {}
}
Girl.prototype.on =  function(eventName, callback){
	if(this._events[eventName]){//不是第一次
		this._events[eventName].push(callback)
		console.log(this._events[eventName])
	}else{
		this._events[eventName] = [callback]// {heart-broken:[cry]}
	}
}
Girl.prototype.emit = function(eventName,...args){
	// 参数里...叫剩余运算符
	// console.log(args)
	if(this._events[eventName]){
		this._events[eventName].forEach(cb=> {
			cb(args)
			cb(...args)
		})// 展开运算符
	}
}
let girl = new Girl()
let cry = (who) => {console.log(who+ ' cry')}
let eat = (who) => {console.log(who+' eat')}
let shopping = (who) => {console.log(who+' shopping')}
girl.on('heart-broken',cry)
girl.on('heart-broken',eat)
girl.on('heart-broken',shopping)
girl.emit('heart-broken','me','you')