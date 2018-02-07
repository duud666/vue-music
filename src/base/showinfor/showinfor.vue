<template>
  <transition name="showinfor-fade">
    <div class="showinfor" v-show="showFlag" @click.stop>
      <div class="showinfor-wrapper" ref="showinforwrapper">
        <div class="showinfor-content" ref="showinforcontent">
          <div class="icon">
            <img class="icon1">
            <span class="text">{{text}}</span>   
          </div>
          <div class="operate">
             <div class="back">
               <i @click="back" class="icon-back" ></i>
             </div>
            <div class="funinfor1">
              <p>功能暂未开放，敬请期待！</p>
            </div>
           
            <div class="footer">
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
//弹窗确认删除组件
  export default {
      props: {
      text: {
        type: String,
        default: '嘟嘟'
      }
    },
    data() {
      return {
        showFlag: false,
        onheight:667,
        onwidth:0
      }
    },
    created() { 
    this.onheight = document.documentElement.clientHeight
    this.onwidth  = document.documentElement.clientWidth
  },
  watch:{
    onheight(){
        this._changecss()
    }
  },
    methods: {
      show() {
        this.showFlag = true

      },
      back() {
        this.showFlag = false
      },
      _changecss(){
        this.$refs.showinforcontent.style.height=`${this.onheight}px`
        this.$refs.showinforcontent.style.width=`${this.onwidth/2}px`
        this.$refs.showinforwrapper.style.left=`${(this.onwidth/2)*0.5}px`
      }
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .back
    position:absolute
    left:90%
    top:-33px
  .footer
    border-top: 1px solid $color-background-d
    margin-top:230px
  .funinfor1
    margin:100% 0
    letter-spacing:2px
    height:25px
    line-height:25px
  .icon
     float:left 
   .icon1
      display: inline-block
      margin-top: 6px
      width: 35px
      height: 33px
      border-radius:50%
      background-image:url(4.jpg)
      background-size: 35px 33px
      margin: 10px 2px
  .showinfor
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 998
    background-color: $color-background-d
    &.showinfor-fade-enter-active
      animation: showinfor-fadein 0.3s
      .showinfor-content
        animation: showinfor-zoom 0.3s
    .showinfor-wrapper
      position: absolute
      top: 50%
      left: 33%
      transform: translate(-50%, -50%)
      z-index: 999
      .showinfor-content
        width: 250px
        height:667px
        border-radius: 2px
        background: $color-highlight-background
        .text
          position:absolute
          margin:15px 10px
          line-height: 22px
          font-size: $font-size-large
          color: $color-text-l
          letter-spacing:2px
        .operate
          width:100%
          position:absolute
          border-top: 1px solid $color-background-d
          top:50px
          font-size: $font-size-large
          .operate-btn
            flex: 1
            line-height: 22px
            padding: 10px 0
            color: $color-text-d

  @keyframes showinfor-fadein
    0%
      opacity: 0
    100%
      opacity: 1

  @keyframes showinfor-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)
</style>