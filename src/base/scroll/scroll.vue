<template>
	<div ref="wrapper">
		<slot></slot>

	</div>
</template>


<script type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	export default{
		props:{
			probeType:{
				type:Number,
				default:1
			},
			click:{
				type:Boolean,
				default:true
			},
			data:{
				type:Array,
				default:null
			},
			listenScroll:{
				type:Boolean,
				default:false
			},
			pullup:{
				//是否开启上拉刷新，接收suggest组件传来的pullup值true
				type:Boolean,
				default:false
			},
			beforeScoll:{
				//再滚动前派发一个事件
				type:Boolean,
				default:false
			}
		},
		mounted(){
			setTimeout(()=>{
				this._initScroll()
			},20)
		},
		methods:{
			_initScroll(){
				if(!this.$refs.wrapper){
				//若没有初始化
					return
				}

				//new一个滚动实例并传入参数
				
				this.scroll=new BScroll(this.$refs.wrapper,{
					probeType:this.probeType,
					click:this.click				
				})
				if(this.pullup){
					//当滑动结束时触发scrollEnd事件
					this.scroll.on('scrollEnd',()=>{
						//滚动y的值是否小于最大滚动+50的值
						if(this.scroll.y<=(this.scroll.maxScrollY+50)){
							//派发suggest组件中，就是滑动小于最大距离就触发一个事件
							this.$emit('scrollToEnd')
						}
					})
				}
				if(this.beforeScoll){
					//再滚动前派发一个事件
					this.scroll.on('beforeScollStart',()=>{
						this.$emit('beforeScoll')
					})
				}
				
			},
			enable(){
				this.scroll && this.scroll.enable()
			},
			disable(){
				this.scroll && this.scroll.disable()
			},
			refresh(){//重新计算高度
				this.scroll && this.scroll.refresh()
			}
		},
		watch:{
			//watch监听data变化，变化了就重新初始化
			data(){
				
				setTimeout(()=>{
					this.refresh()
				},20)
			}
		}

	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">

</style>