<template>
<transition name="slide">
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div class="content">
	    <div v-if="recommends.length" class="slider-wrapper">
	      <slider>
	    	<div v-for="item in recommends">
	       	  <a :href="item.linkUrl">
	    		<img class="needsclick"@load="loadImage" :src="item.picUrl">
	          </a>
	        </div>
	      </slider>
	    </div>
		  <div class="recommend-list">
			<h1 class="list-title">热门歌单推荐</h1>
			  <ul>
		<li @click="selectItem(item)" v-for="item in discList" class="item">
				  <div class="icon">
					<img class="needsclick"width="80" height="80" v-lazy="item.imgurl">
				  </div>	
				  <div class="text">
					 <h2 class="name" v-html="item.creator.name"></h2>
					  <p class="desc" v-html="item.dissname"></p>
				  </div>					
				</li>
			</ul>
		  </div>
	 </div>
		<div class="loading-container" v-show="!discList.length">
			<!--当没有数据即长度为0，就显示loading,有就隐藏-->
		  <loading></loading>
		</div>			
    </scroll>
   <router-view></router-view>
   <!--对应2级路由,在歌单点击事件selectItem(item)传入歌单-->
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
	import Scroll from 'base/scroll/scroll'	
	import Loading from 'base/loading/loading'	
	import Slider from 'base/slider/slider'
	import {getRecommend,getDiscList} from 'api/recommend'
	import {ERR_OK} from 'api/config'
	import {mapMutations} from 'vuex'
		export default{
			data(){
				return {
					recommends:[],
					discList:[]
				}
			},
			created(){
				//钩子函数里调用获取数据的两个方法
				this._getRecommend()
				this._getDiscList()
				
			},
			methods:{
				selectItem(item){
				//点击方法，二级路由的跳转路径
					this.$router.push({
						path:`/recommend/${item.dissid}`
					})
					this.setDisc(item)
				//跳转后修改mutation里的disc对象，存入的是点击的对象列表
				},
				_getRecommend(){
					getRecommend().then((res)=>{
						if(res.code===ERR_OK)
						//console.log(res.data.slider)
						//res.data.slider包含linkUrl链接，picUrl图片链接
						//获取的数据给recommends数组对象
						this.recommends=res.data.slider
					})
				},
				_getDiscList(){
					//获取歌单推荐数据
					getDiscList().then((res)=>{
						if(res.code===ERR_OK){
							this.discList=res.data.list	
						}

						//res.data.slider包含linkUrl链接，picUrl图片链接
						//获取的数据给recommends数组对象
						//this.recommends=res.data.slider
					})
				},
				loadImage(){
					if(!this.checkLoaded){
						this.$refs.scroll.refresh()
						this.checkLoaded=true
					}
					
				},
				...mapMutations({
					setDisc:'SET_DISC'
				})
			},
			components:{//注册下Slider组件
				Slider,
				Scroll,
				Loading
			}

		}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	.content{
		//字容器要大于父容器的高度
		height:4250px
		
	}
	.recommend{
		position: fixed
		width: 100%
		top: 88px
		bottom: 0	
		
	}
	.recommend-content{
		height:100%
     	overflow: hidden
	
	 }
      
    .slider-wrapper{
      	position: relative
        width: 100%
        overflow: hidden
        
        
      }

    .recommend-list
       .list-title{
 		height: 65px
        line-height: 65px
        text-align: center
        font-size: 14px
        color: #ffcd32
     
       }
    .item{
         display: flex
         box-sizing: border-box
         align-items: center
         padding: 0 20px 20px 20px
       
        }
      .needsclick{
      	border-radius:5px
      }    
    .icon{
         flex: 0 0 60px
         width: 60px
         padding-right: 20px  
        }
    
    .text{
          display: flex
          flex-direction: column
          justify-content: center
          flex: 1
          line-height: 20px
          overflow: hidden
          font-size: 14px
         }
           
    .name{      
          margin-bottom: 20px
          color: #fff
         }
             
    .desc{
          margin-bottom: 40px
          color: rgba(255, 255, 255, 0.3)
         }
   .loading-container{
      	 position: absolute
         width: 100%
         top: 50%
         transform: translateY(-50%)  
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
