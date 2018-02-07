<template>
  <div class="music-list">
    <div class="back" @click="back">
      <!--返回的按钮-->
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1><!--解析title数据然后显示出来-->
    <div class="nameblock"></div>
    <div class="bg-image"  :style="bgStyle" ref="bgImage">  
      <!--绑定css风格，将图片路径赋值url--> 
      <div class="play-wrapper" >
       <div class="play" v-show="songs.length>0" ref="playBtn" @click="random">
            <i class="icon-play"></i>
            <span class="text">随机播放全部</span>
        </div>
      </div>
      
    </div>
    <scroll :data="songs" class="list" ref="list">
      <div class="song-list-wrapper" >
          <song-list :rank="rank" @select="selectItem" :songs="songs"></song-list>
          <!--接收到song-list子组件派发的select事件-->
      </div>
      <div class="loading-container" v-show="!songs.length">
        <!--懒加载，当songs.length长度为0时就显示加载图片，有数据就隐藏-->
          <loading></loading>
      </div>
    </scroll>
   
   </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import SongList from 'base/song-list/song-list'
  import {mapActions} from 'vuex'
  export default {
    props:{
      //props接收到singer-detail传来的以下3个数据，组件间传参
      bgImage:{
        type:String,
        default:' '
      },
      songs:{
      //songs对象数组
        type:Array,
        default:[]
      },
      title:{
        type:String,
        default:' '
      },
      rank:{
        type:Boolean,
        default:true
      }
    },
    computed:{
      bgStyle(){
        //计算方法得到图片路径
        return `background-image:url(${this.bgImage})`
      }
    },
    mounted(){
      //mounted在dom渲染后，计算当前页面图片的高度，即列表距离视口上的距离
      this.$refs.list.$el.style.top=`${this.$refs.bgImage.clientHeight}px` 
    },
    methods:{
      back(){
        this.$router.back()//点击返回的方法，返回上一个路径
      },
      random(){
        this.randomPlay({
          list:this.songs
        })
      },
      selectItem(item,index){

        this.selectPlay({
          list:this.songs,//说明点击了，就有list数据了
          index
        })
        
      },
      ...mapActions([
        //mapActions提交一个点击数据，然后修改mutation,进而修改state数据状态
        //然后数据映射在player，然后数据会映射到dom
        'selectPlay',
        'randomPlay'
        ])
      
    },
    components:{
      Scroll,
      SongList,
      Loading
    }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list{
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background

  }
  
    .back{
       position absolute
      top: 0
      left: 6px
      z-index: 50
    }
     
      .icon-back{
        display: block
        padding: 10px
        font-size: 22px
        color: #ffcd32
      }
        
    .title{
      position: absolute
      top: 11px
      text-align:center
      left: 10%
      font-size: 18px
      width: 80%
      z-index:20
      
    }
    .nameblock{
      z-index:100
      height:40px
      width:100%

     
    }
      
      no-wrap(){ 
      text-align: center
      line-height: 40px
      font-size: 18px
      color: red
    }    
    .bg-image{
      
      position: relative
      width: 100%
      height: 50px
      padding-top: 70%
      transform-origin: top
      background-size: cover
    }
    .song-list-wrapper{
      padding: 20px 30px
      
    }
    .list{
        
       position: fixed
       top: 0
       bottom: 0
       width: 100%
       overflow:hidden
       background: #222
       
    }
      
      .play-wrapper{
       position: absolute
        bottom: 50px
        z-index: 50
        width: 100%    
    }
     
    .play{
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid #ffcd32
          color:  #ffcd32
          border-radius: 100px
          font-size: 0

        }
         
          .icon-play{
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: 16px
          }
            
          .text{
            display: inline-block
            vertical-align: middle
            font-size: 12px

          }

        
    .bg-layer{
      position: relative
      height: 100%
      background: #222
    }
      .loading-container{  
       position: absolute
       width: 100%
       top: 50%
       transform: translateY(-50%)
    }
                
</style>