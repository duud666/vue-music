
function getRandomInt(min,max){
	//max与min之间的随机数，然后向下取整
	return Math.floor(Math.random()*(max-min+1)+min)
}

export function shuffle(arr){
	let _arr=arr.slice()//复制一个list，否则返回的arr会修改原来的list列表
	//一个方法洗牌函数,将数组打乱
	for(let i=0;i<_arr.length;i++){
		let j=getRandomInt(0,i)
		let t=_arr[i]
		_arr[i]=_arr[j]
		_arr[j]=t
	}
	return _arr
}

export function debounce(func,delay){
	//截留函数
	let timer 
	return function(...args){
		if(timer){
			clearTimeout(timer)
		}
		timer=setTimeout(()=>{
			func.apply(this,args)
		},delay)
	}
}