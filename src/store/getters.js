//将state状态数据取出，赋值给新常量
export const singer=state=>state.singer

export const playing=state=>state.playing

export const fullScreen=state=>state.fullScreen

export const playlist=state=>state.playlist

export const sequenceList=state=>state.sequenceList

export const mode=state=>state.mode

export const currentIndex=state=>state.currentIndex

export const currentSong=(state)=>{
	return state.playlist[state.currentIndex]||{}//取当前列表里播放的歌曲
}

export const disc=(state)=>state.disc

export const searchHistory=state=>state.searchHistory



