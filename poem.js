/**
 * @author      Yanni Jia
 * @function    myLove
 * @time        2018/8/9.
 * @email       385067638@qq.com
 */
new Promise((resolve, reject) => {
	let dateNow = new Date().getTime()
	let dateEnd = new Date('12018/08/09 19:00 ').getTime()
	let spanTime = dateEnd - dateNow
	if(spanTime<0){
		reject()
	}else{
		resolve('I will love you for 10,000 years!')
	}
})