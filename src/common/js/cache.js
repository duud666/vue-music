import storage from 'good-storage'

const SEARCH_KEY='_search_'
const SEARCH_MAX_LENGTH=15

function inserArray(arr,val,compare,maxlen){
	//添加数据
	//compare是一个函数
	const index=arr.findIndex(compare)//findInde查找当前数组中是否有某个元素
	if(index===0){
		//若有第一条数据
		return 
	}
	if(index>0){
		//若有的话删掉，再插入
		arr.splice(index,1)
	}
	arr.unshift(val)//直接插入
	if(maxlen && arr.length>maxlen){
		//若大于15
		arr.pop()
	}
}

function deleteFromArray(arr,compare){
	//删除数据
	const index=arr.findIndex(compare)
	if(index>-1){
		arr.splice(index,1)
	}
}

export function saveSearch(query){
	let searches=storage.get(SEARCH_KEY,[])
	inserArray(searches,query,(item)=>{
		//若等于query就说明在这个数据中
		return item===query
	},SEARCH_MAX_LENGTH)

	storage.set(SEARCH_KEY,searches)//保存数组
	return  searches//返回保存后的数组


}

export function loadSearch(){
	return storage.get(SEARCH_KEY,[])
	//从本地获取列表储存
}

export function deleteSearch(query){
	let searches=storage.get(SEARCH_KEY,[])
	//从本地获取列表储存
	deleteFromArray(searches,(item)=>{
		return item===query
	})
	storage.set(SEARCH_KEY,searches)//保存数组
	return  searches//返回保存后的数组

}

export function clearSearch(){
	storage.remove(SEARCH_KEY)
	//从本地获取列表储存
	return []
}