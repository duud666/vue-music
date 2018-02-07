<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" class="item" v-for="(song,index) in songs">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
          <!--监听css样式，前面排序的小图标样式-->
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2><!--歌名-->
          <p class="desc">{{getDesc(song)}}</p><!--歌曲描述：歌手，专辑方法 -->
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      songs: {
        type: Array,
        default: []
      },
      rank: {
        type: Boolean,
        default: true
      }
    },
    methods: {
        selectItem(item, index) {//index遍历的数组索引
          //item是当前点击的歌曲名
          
          this.$emit('select', item, index)//点击后将响应派发出去，即被点击了
        },
        getDesc(song) {
          //歌曲描述：歌手，专辑方法 
          return `${song.singer}·${song.album}`
        },
        getRankCls(index){
          if(index<=2){
            return `icon icon${index}`
          }else{
            return `text`
          }
        },
        getRankText(index){
          if(index>2){
            return index+1
          }
        }
      }
  }
  
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item 
        display: flex
        align-items: center
        box-sizing: border-box
        height: 64px
        font-size: 14px     
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
              
        .text
          color: #ffcd32
          font-size: 18px
   .content
        flex: 1
        line-height: 20px
        overflow: hidden
        border-bottom:1px #444 dashed
      .name
       no-wrap()
        color: $color-text
      .desc
        no-wrap()
        margin-top: 4px
        color: $color-text-d
        
            
</style>