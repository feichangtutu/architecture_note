/**
 * Created by jyn on 2018/8/10.
 */
setTimeout(function(){
	console.log(1)
},0)
new Promise(function executor(resolve) {
	console.log(2)
	for(var j = 0;j<10;j++){
		j=9&&resolve()
	}
	console.log(3)
}).then(function(){
	console.log(4)
})
console.log(5)