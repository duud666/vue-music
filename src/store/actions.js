import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/utll'
import {saveSearch,deleteSearch,clearSearch} from 'common/js/cache'
function findIndex(list,song){
	//查找当前列表是否有这首歌曲，有的话返回歌曲的索引
	return list.findIndex((item)=>{
		return item.mid===song.mid
	})
}

export const selectPlay=function({commit,state},{list,index}){
	//点击播放的方法
	//各种模式的函数封装
	commit(types.SET_SEQUENCE_LIST,list)
	if(state.mode===playMode.random){
		//重置歌曲列表，类似于重新洗牌
		let randomlist=shuffle(list)
		commit(types.SET_PLAYLIST,randomlist)
		index=findIndex(randomlist,list[index])//顺序列表的歌索引对应随机列表的索引
	}else{
		//若不是随机播放，列表就是顺序列表播放
		commit(types.SET_PLAYLIST,list)//提交一个list
	}

	commit(types.SET_CURRENT_INDEX,index)
	commit(types.SET_FULL_SCREEN,true)
	commit(types.SET_PLAYING_STATE,true)

}
export const randomPlay= function({commit},{list}){
	//点击随机播放按钮的模式改变方法在music-list中
	commit(types.SET_PLAY_MODE,playMode.random)
	commit(types.SET_SEQUENCE_LIST,list)
	//重重歌曲列表
	let randomlist=shuffle(list)
	commit(types.SET_PLAYLIST,randomlist)//提交出去
	commit(types.SET_CURRENT_INDEX,0)
	commit(types.SET_FULL_SCREEN,true)
	commit(types.SET_PLAYING_STATE,true)

}

export const insertSong=function({commit,state},song){
	let playlist=state.playlist.slice()
	let sequenceList=state.sequenceList.slice()
	let currentIndex=state.currentIndex
	//记录下当前歌曲
	let currentSong=playlist[currentIndex]
	//查当前的列表是否有待插入歌曲并返回其索引
	let fpIndex=findIndex(playlist,song)
	currentIndex++//插入位置，当前索引的下一个,索引加1
	//插入这个歌曲到当前索引位置
	playlist.splice(currentIndex,0,song)
	if(fpIndex>-1){
		//若包含这首歌，
		if(currentIndex>fpIndex){
			//若当前插入索引大于列表索引，删掉这歌曲
			playlist.splice(fpIndex,1)
			//列表长度要-1
			currentIndex--
		}else{
			playlist.splice(fpIndex+1,1)
		}
	}

	//获得sequenceList插入的位置
	let currentSIndex=findIndex(sequenceList,currentSong)+1
	let fsIndex=findIndex(sequenceList,song)
	//插入这个歌曲到当前索引位置
	sequenceList.splice(currentSIndex),0,song
	if(fsIndex>-1){
		//若包含这首歌，
		if(currentSIndex>fsIndex){
			//若当前插入索引大于列表索引，插入在后面删掉之前这歌曲索引
			sequenceList.splice(fsIndex,1)
		}else{//若插入前面
			sequenceList.splice(fsIndex+1,1)
		}
	}

	commit(types.SET_PLAYLIST,playlist)//提交出去
	commit(types.SET_SEQUENCE_LIST,sequenceList)
	commit(types.SET_CURRENT_INDEX,currentIndex)
	commit(types.SET_FULL_SCREEN,true)
	commit(types.SET_PLAYING_STATE,true)

}

export const saveSearchHistory = function({commit},query){

	commit(types.SET_SEARCH_HISTORY,saveSearch(query))

}

export const deleteSearchHistory = function({commit},query){

	commit(types.SET_SEARCH_HISTORY,deleteSearch(query))

}

export const clearSearchHistory = function({commit}){

	commit(types.SET_SEARCH_HISTORY,clearSearch())

}