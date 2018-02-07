<template>
  <div class="slider" ref="slider">
    	<div class="slider-group" ref="sliderGroup">
    		<slot>		
    		</slot>
    	</div>
    	<div class="dots">
    		<span class="dot" :class="{active:currentPageIndex===index}"v-for="(item,index) in dots"></span>
    	</div>
  </div>
</template>

<script type="text/ecmascript-6">
	
	import {addClass} from 'common/js/dom'
	import BScroll from 'better-scroll'
	
	export default{
		name:'slider',
		data(){
			return{
				dots:[],
				currentPageIndex:0
			}
		},
		props:{//自动播放，循环等，外部可以控制。即父子组件的通信
			loop:{
				type:Boolean,//循环默认
				default:true//是否
			},
			autoPlay:{//是否自动播放
				type:Boolean,
				default:true//是否
			},
			interval:{//时间间隔
				type:Number,
				default:4000
			}
		},
		mounted(){
			setTimeout(()=>{
				this._setSliderWidth(true)
				this._initDots()
				this._initSlider()

				if(this.autoPlay){
					this._play()
				}
			},20)
			//监听视口大小变化，第二个函数是回调函数
			window.addEventListener('resize',()=>{
				if(!this.slider){
					//若slider没有初始化的时候
					return
				}

					this._setSliderWidth(true)
					//当宽度发生变化时，重新计算slider
					this.slider.refresh()
				})
		},
		methods:{
			_setSliderWidth(isResize){
				this.children=this.$refs.sliderGroup.children //获取dom子元素

				let width=0
				let sliderwidth=this.$refs.slider.clientWidth//父容器宽度

				for(let i=0;i<this.children.length;i++)
				{
					let child=this.children[i]
					addClass(child,'slider-item')//添加class方法无效，导入问题
					child.style.width=sliderwidth+'px'
					width+=sliderwidth
				}
				if(this.loop &&!isResize){
					width+=2*sliderwidth
				}
				this.$refs.sliderGroup.style.width=width+'px'
			},
			_initDots(){
				this.dots=new Array(this.children.length)
			},
			_initSlider(){
				//滚动库及配置
				this.slider=new BScroll(this.$refs.slider,{
					scrollX:true,
					scrollY:false,
					momentum:false,
					snap:true,
					snaploop:this.loop,
					snapThreashold:0.3,
					snapSpeed:400,
					click:true
				})
				//触发滚动事件
				this.slider.on('scrollEnd',()=>{
					let pageIndex=this.slider.getCurrentPage().pageX
				//滚动事件方法this.slider.getCurrentPage().pageX
				//将滚动的下标是几是赋值给pageIndex，然后给currentPageIndex
				//当图片下标和滚动下标相等时，给dot添加css样式
					if(this.loop){
						//pageIndex-=1//轮播的问题，BScroll库没有克隆2个图片
					}
					this.currentPageIndex=pageIndex
						
					if(this.autoPlay){
						clearTimeout(this.timer)
						this._play()
					}
				})
				
			},
			_play(){
				let pageIndex=this.currentPageIndex
				if(this.loop){
					pageIndex+=1
				}
				if(pageIndex===5){
					pageIndex=0
				}
				this.timer=setTimeout(()=>{
					this.slider.goToPage(pageIndex,0,400)
				},this.interval)
			}
		},
		 destroyed() {//当组件销毁时清定时器
	      clearTimeout(this.timer)
	    }

	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"

  .slider{
  	min-height: 1px
  }
    
    .slider-group{
    	position: relative
      overflow: hidden
      white-space: nowrap
    }
      
      .slider-item{
      	  float: left;
        box-sizing: border-box
        overflow: hidden
        text-align: center
      }
      
        a{
        	display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        }
          
        img{
        	display: block
          width: 100%
          
        }
          
    .dots{
    	 position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
    }
     
      .dot{
      	 display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: rgba(255, 255, 255, 0.5)
      }
       
        &.active{
        	width: 20px
          border-radius: 5px
          background:rgba(255, 255, 255, 0.8)
        }
          
      
</style>
