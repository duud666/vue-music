import jsonp from 'common/js/jsonp' 
import axios from 'axios'

export function getLyric(mid){
	const url='/api/lyric/'
 
	 const data = Object.assign({}, commonParams, {
	 	songmid:mid,
	 	pcachetime:+new Date(),
		hostUin:0,
		g_tk:5381,
		needNewCode:0,
		platform:'yqq',
		format:'json'
	  })
	   return axios.get(url,{
	   	params:data
	   }).then((res)=>{
	   	return Promise.resolve(res.data)
	   })

}
