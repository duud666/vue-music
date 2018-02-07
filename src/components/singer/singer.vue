<template>
<transition name="slide">
  <div class="singer">
	<listview @select="selectSinger":data="singers"></listview>    
	<router-view></router-view>
  </div>
 </transition>
</template>

<script type="text/ecmascript-6">
	import {getSingerList} from 'api/singer'//抓取歌手方法
	import {ERR_OK} from 'api/config'
	import Singer from 'common/js/singer'//方法类
	import Listview from 'base/listview/listview'//歌手列表组件
	import {mapMutations} from 'vuex'
	const HOT_NAME='热门'
	const HOT_SINGER_LEN=10
	export default{
		data(){
			return{
				singers:[]
			}
			
		},
		created(){
			this._getSingerList()
		
		},
		methods:{
			_getSingerList(){		
					getSingerList().then((res)=>{
						if(res.code===ERR_OK){
							this.singers=this._normalizeSinger(res.data.list)	
							//console.log(this._normalizeSinger(this.singers))
						}
					})
				},
			_normalizeSinger(list){
				let map={//map对象
					hot:{
						title:HOT_NAME,
						items:[]
					}
				}
				list.forEach((item,index)=>{
					if(index<HOT_SINGER_LEN){
						//将前10个热门先存在数组对象items中
						map.hot.items.push(new Singer({
							//建立一个singer类
							id:item.Fsinger_mid,
							name:item.Fsinger_name,							
						}))
					}
					const key=item.Findex
					if(!map[key]){
						//若没有这个聚合的对象就创建一个
						map[key]={
							title:key,
							items:[]
						}
					}
					map[key].items.push(new Singer({
							id:item.Fsinger_mid,
							name:item.Fsinger_name,
						}))
					})
				//console.log(map)
				//为了得到有序列表,排序字母，我们需要处理map
				let hot=[]
				let ret=[]
				for(let key in map){
					let val=map[key]
					if(val.title.match(/[a-zA-Z]/)){
					 ret.push(val)
					}else if(val.title===HOT_NAME){
					 hot.push(val)
					}
				}
				ret.sort((a,b)=>{
					return a.title.charCodeAt(0)-b.title.charCodeAt(0)
				})
				return hot.concat(ret)
			},
			selectSinger(singer){
				//跳转路由的编程接口，点击dom跳转对应页面
				this.$router.push({
					path:`/singer/${singer.id}`
				}),
				this.setSinger(singer)
			},
			...mapMutations({
				setSinger:'SET_SINGER'//做一个映射
			})
		},
		components:{
			Listview
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	.singer{
		position:fixed
		top:88px
		bottom:0
		width:100%
	}
	.slide-enter-active{
    transition:all 0.3s
  }
  .slide-leave-active{
  	transition:all
  }
  .slide-enter,.slide-leave-to{
    transform:translate3d(100%,0,0);
  }
</style>
