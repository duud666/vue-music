<template>
    <div class="player" v-show="playlist.length>0">
      <transition name="normal">
      <div class="normal-player" v-show="fullScreen" ref="noplayer">
        <div class="background">
          <img width="100%"  height="100%" :src="currentSong.image">
        </div>
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <div class="middle">
          <div class="middle-l">
              <div class="cd-wrapper">
                  <div class="cd" :class="cdCls">
                     <img class="image" :src="currentSong.image">          
                 </div>
              </div>
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators" >
              <div class="icon i-left">
                <i @click="changeMode" :class="iconMode"></i>
              </div>
              <div class="icon i-left" :class="disableCls">
                <i @click="prev" class="icon-prev"></i>
              </div>
              <div class="icon i-center" :class="disableCls">
                <i @click="togglePlaying" :class="playIcon"></i><!--监听状态-->
              </div>
              <div class="icon i-right" :class="disableCls">
                <i @click="next" class="icon-next"></i>
              </div>
              <div class="icon i-right">
                <i @click="toggleFavorite" :class="iconFavorite"></i>
              </div>

          </div>
        </div>
      </div>
      </transition>
      <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon" >
          <img :class="cdCls" width="40"  height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control" :class="disableCls">
              <i @click="prev" class="icon-prev prev"></i>
          </div>
        <div class="control">
          <i @click.stop="togglePlaying":class="miniIcon"></i>
        </div>
        <div class="control"  :class="disableCls">
            <i @click="next" class="icon-next next"></i>
        </div>
        <div class="control">
            <i @ class="icon-playlist"></i>
        </div>
      </div>
      </transition>
      <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error"@timeupdate="updateTime" @ended="end"></audio>
      <!--点击出来的歌名和歌手，就将歌链接赋给src，并且监听src变化然后播放-->
 </div>
   
</template>

<script type="text/ecmascript-6">
  import {mapGetters,mapMutations} from 'vuex'
  import ProgressBar from 'base/progress-bar/progress-bar'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/utll'
  export default{
    data(){
      return{
        songReady:false,
        currentTime:0,//播放时间
        favorite:true
      }
    },
    computed:{
      cdCls(){
        //监听cdCls变化
         return this.playing?'play':'play pause'
      },
      playIcon(){
        //计算变量属性，this.playing为true是播放图标，fasle是暂停图标
        //:绑定class的变化
        return this.playing?'icon-pause':'icon-play'
      },
      iconFavorite(){
        return this.favorite?'icon-not-favorite':'icon-favorite'
      },
      iconMode(){
        //播放模式切换，监听按钮的点击。
        if(this.mode==0)
          {return 'icon-sequence'}
        else if(this.mode==2){
          return 'icon-random'
        }else{
          return 'icon-loop'
        }
       // return this.mode === playMode.sequence?'icon-sequence':(this.mode===playMode.loop)?'icon.loop':'icon-random'
      },
      miniIcon(){
        //监听 mini播放器的图标切换
        return this.playing?'icon-pause-mini':'icon-play-mini'
      },
      disableCls(){
        //若音乐src未准备好，就失能按钮
         return this.songReady?'':'disable'
      },
      percent(){
        return this.currentTime/this.currentSong.duration
        //计算一个播放音乐占全时间的比例
      },
      ...mapGetters([
          'fullScreen',//获取state状态
          'playlist',//获取数据
          'currentSong',//获取当前的音乐信息包括歌名，歌手，播放地址
          'playing',//获取当前播放音乐的状态
          'currentIndex',
          'mode',
          'sequenceList'

        ])
    },
    methods:{
      toggleFavorite(){
        this.favorite=!this.favorite
      },
      back(){
        this.setFullSrceen(false)
      },
      open(){
        this.setFullSrceen(true)
      },
      togglePlaying(){//播放暂停方法
        if(!this.songReady){
          return
        }
        this.setPlayingState(!this.playing)
        
        //点击后取反方法，获取mapMutations里状态，然后修改取反
      },
      end(){
        if(this.mode===playMode.loop){
          //若==1就循环播放
          this.loop()
        }else{
          //播放完执行下一首
           this.next()
        }
        
      },
      loop(){
        //循环单曲，重置0即可
        this.$refs.audio.currentTime=0
        this.$refs.audio.play()
      },
      next(){//下一首
        if(!this.songReady){
          return
        }
        let index=this.currentIndex+1
        if(index===this.playlist.length){
          //当等于最后一首歌时，为0 
          index=0
        }
        this.setCurrentIndex(index)//提交一个mapMutations修改index
        if(!this.playing){//点击下一首，如果是暂停就改变状态playing为true
          this.togglePlaying()
        }
        this.songReady=false
      },
      prev(){//上一首
        if(!this.songReady){
          return
        }
        let index=this.currentIndex-1
        if(index===-1){
          //当等于第一首歌时，为最后一首歌 
          index=this.playlist.length-1
        }
        this.setCurrentIndex(index)//提交一个mapMutations修改index
        if(!this.playing){//点击下一首，如果是暂停就改变状态playing为true
          this.togglePlaying()
        }
        this.songReady=false
      },
      changeMode(){
        
        const mode=(this.mode+1)%3
        this.setPlayMode(mode)
        let list=null
        if(mode===playMode.random){
          //sequenceList是歌曲列表，随机播放
          list=shuffle(this.sequenceList)
        }else{
          //顺序播放
          list=this.sequenceList 
        }
        this.resetCurrentIndex(list)
        this.setPlaylist(list)
      },
      resetCurrentIndex(list){
        //重置currentSong
        let index=list.findIndex((item)=>{
          return item.mid===this.currentSong.mid
        })
        this.setCurrentIndex(index)
      },
      ready(){
        this.songReady=true
        //当音乐src准备好了才允许播放，下一首，上一首
      },
      error(){
        this.songReady=true
      },
      updateTime(e){//audio派发一个事件
        //audio返回当前播放的时间给curentTime
        this.currentTime=e.target.currentTime
      },
      format(interval){//计算时间方法,|0向下取整
        interval=interval|0
        const minute=interval/60|0
        const second=this._pad(interval%60)
        return `${minute}:${second}`
      },
      onProgressBarChange(percent){

        this.$refs.audio.currentTime=percent*this.currentSong.duration
        //总时间*传来移动的宽度比例=移动后的播放时间
        if(!this.playing){
          this.togglePlaying()
        }
      },
      _pad(num,n=2){
        //时间补0方法
        let len=num.toString().length
        while(len<n){
          num='0'+num
          len++
        }
        return num
      },
      ...mapMutations({
        //利用mapMutations来修改vuex里的fullScreen值
        setFullSrceen:'SET_FULL_SCREEN',//mapMutations映射,展开
        setPlayingState:'SET_PLAYING_STATE',//播放暂停映射
        setCurrentIndex:'SET_CURRENT_INDEX',//改变index提交一个方法
        setPlayMode:'SET_PLAY_MODE',//播放模式
        setPlaylist:'SET_PLAYLIST'
      })      
    },
    watch:{
      currentSong(newSong,oldSong){
        //监听currentSong变化方法,若变化就播放歌曲
        if(newSong.mid===oldSong.mid){
          return
        }
        this.$nextTick(()=>{//加一个延迟来准备src
          this.$refs.audio.play()
         // this.currentSong.getLyric()歌词暂时不添加了
        })  
      },
      playing(newPlaying){
        //监听playing状态的变化的方法
        const audio=this.$refs.audio
        //newPlaying为true就播放，false就暂停
         this.$nextTick(()=>{//加一个延迟来准备src
          newPlaying?audio.play():audio.pause()
        }) 
        
      },

    },
    components:{
      ProgressBar
    }
  } 
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

    
    .normal-player
      position: fixed
      left: 0
      right: 0 
      top: 0
      bottom: 0
      z-index: 150
      background:$color-background
      .background    
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
              
              position absolute
              top: 0
              left: 6px
              z-index: 50
          .icon-back
                      display: block
                      padding: 9px
                      font-size: 22px
                      color:$color-theme 
                      transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom,.middle
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)  
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
        .middle
          opacity: 0
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden

        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 20px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0
         .prev
          font-size:26px
          color: $color-theme-d
         .next
            font-size:26px
            color: $color-theme-d
  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
      
</style>