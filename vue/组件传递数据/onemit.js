/**
 * Created by jyn on 2018/8/16.
 * 发布 订阅
 */
function Girl(){
	this._events = {}
}
Girl.prototype.on =  function(eventName, callback){
	if(this._events[eventName]){//不是第一次
		this._events[eventName].push(callback)
	}else{
		this._events[eventName] = [callback]// {heart-broken:[cry]}
	}
}
Girl.prototype.emit = function(eventName){
	if(this._events[eventName]){
		this._events[eventName].forEach(cb=>cb())
	}
}
let girl = new Girl()
let cry = () => {console.log('cry')}
let eat = () => {console.log('eat')}
let shopping = () => {console.log('shopping')}
girl.on('heart-broken',cry)
girl.on('heart-broken',eat)
girl.on('heart-broken',shopping)
girl.emit('heart-broken')