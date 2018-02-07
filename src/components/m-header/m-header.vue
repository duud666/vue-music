<template>
  <div class="m-header">
      
   		<div class="icon"></div>
   		<h1 class="text">叫-☆都哥☆</h1>
      <div class="mine" @click="showInfor">
        <i class="icon-mine"></i>
      </div>
      <showinfor ref="showInfor"></showinfor>
  </div>
</template>

<script type="text/ecmascript-6">
import Showinfor from 'base/showinfor/showinfor'
	export default{
    methods:{
      showInfor(){
        this.$refs.showInfor.show()
      }
    },
     components:{
      Showinfor
     }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/stylus/variable" 
@import "~common/stylus/mixin" 
    .icon-mine
        display: block
        padding: 12px
        font-size: 20px
        color: $color-theme  
        
    .mine
      position: absolute
      top: 0
      right: 88%  
  .m-header
	    position: relative
	    height: 44px
	    text-align: center
	    color: $color-theme
	    font-size: 0
	    
   .icon
      display: inline-block
      vertical-align: top
      margin-top: 6px
      width: 35px
      height: 33px
      border-radius:50%
      margin-right: 9px
      background-image:url(4.jpg)
      background-size: 35px 33px
   .text
      letter-spacing:1px
      display: inline-block
      vertical-align: top
      line-height: 44px
      font-size: 16px
      animation: change 2s  ease-in  infinite 
      font-weight: bold   
      color:#ffcd32
      @keyframes change 
            0%{ text-shadow: 0 0 4px #fff}  
            50%{ text-shadow: 0 0 20px #fff}  
            100%{ text-shadow: 0 0 4px #fff}  
    
     
</style>
