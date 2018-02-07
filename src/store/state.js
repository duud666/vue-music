import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'

const state={
	//配置一些状态
	singer:{},//
	playing:false,//播放暂停
	fullScreen:false,//展开收起
	playlist:[],//播放列表
	sequenceList:[],//播放列表
	mode:playMode.sequence,//播放模式
	currentIndex:-1, //当前播放歌曲索引
	disc:{},//定义一个歌单推荐表的对象
	searchHistory:loadSearch()//从本地搜索历史的获取初始值
}

export default state //state暴露出去

