<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent="progressTouchStart"
            @touchmove.prevent="progressTouchMove"
            @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'
  const progressBtnWidth=16
  

  export default {
    props:{
      percent:{
        type:Number,
        default:0
      }
    },
    created(){
      this.touch={}//共享数据挂到touch上
    },
    methods:{
      progressTouchStart(e){
        this.touch.initiated=true//标志位
        this.touch.starX=e.touches[0].pageX//起始点记录下来长度
        this.touch.left=this.$refs.progress.clientWidth//按钮的偏移值记录下来
      },
      progressTouchMove(e){
        if(!this.touch.initiated){
          return 
        }
        const deltaX=e.touches[0].pageX-this.touch.starX//末位点-起始点=长度
        const offsetWidth=Math.min(this.$refs.progressBar.clientWidth-progressBtnWidth,Math.max(0,this.touch.left+deltaX))
        //长度+偏移量=最终长度
        this._offset(offsetWidth)
      },
      progressTouchEnd(){
        //移动完成的方法
        this.touch.initiated=false
        this._triggerPercent()//派发一个方法

      },
      progressClick(e){  
        const rect=this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth=e.pageX-rect.left
        //点击移动进度条
        this._offset(offsetWidth)//点击事件的x位置宽度
        this._triggerPercent()
      },
      _triggerPercent(){
        //将移动的宽度比例派发出去
         const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
         //progressBar的宽度减去按钮的宽度=右边空白的宽度(基本是固定的barWidth)
         const percent=this.$refs.progress.clientWidth/barWidth
         //按钮的偏移值所占整个的比例
         this.$emit('percentChange',percent)
         //将移动的宽度比例派发出去
      },
      _offset(offsetWidth){//封装进度移动的方法
         this.$refs.progress.style.width=`${offsetWidth}px`
          this.$refs.progressBtn.style.left=`${offsetWidth-6}px`
      }
    },
    watch:{
      percent(newPercent){
        //监听percent的变化
        if(newPercent>=0 && !this.touch.initiated){
     //！this.touch.initiated当鼠标移动完，进度条再改变否则一直有监听而不断改变
          const barWidth=this.$refs.progressBar.clientWidth-progressBtnWidth
          //progressBar的宽度减去按钮的宽度=右边空白的宽度
          const offsetWidth=newPercent*barWidth
          //偏移宽度的比例，newPercent为偏移的比例*进度条的宽度=已经播放的长度
          this._offset(offsetWidth)
        }
      }
    }

  }
  
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>