<template>
  <scroll  :data="data" class="listview" ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="loading-container" v-show="!data.length">
      <!--当没有数据即长度为0，就显示loading,有就隐藏-->
      <loading></loading>
    </div>  
  </scroll>
</template>

<script type="text/ecmascript-6">
//歌手列表组件
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  //import {getData} from 'common/js/dom'
  export default {
    props: {//接收传输的数据
      data: {
        type: Array,//数据类型
        default: []
      }
    },
    methods:{
      selectItem(item){
        //点击派发出去
        this.$emit('select',item)
      }
    },
    components: {
      Scroll,
      Loading
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview{
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background:#222
  }
    
  .list-group{padding-bottom: 30px}
      
  .list-group-title{
         height: 30px
        line-height: 30px
        padding-left: 20px
        font-size:12px
        color:rgba(255, 255, 255, 0.5)
        background:#333
      }
       
  .list-group-item{
        display: flex
        align-items: center
        padding: 20px 0 0 30px
      }
        
  .avatar{
     width: 50px
          height: 50px
          border-radius: 50%
        }
         
   .name{
      margin-left: 20px
          color:rgba(255, 255, 255, 0.5)
          font-size: 14px
   }
        
    .list-shortcut{
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background:rgba(0, 0, 0, 0.3)
      font-family: Helvetica

    }
      
      .item{
        padding: 3px
        line-height: 1
        color:rgba(255, 255, 255, 0.5)
        font-size:12px

      }
       
      &.current{
          color: $color-theme
        }
    .list-fixed{
      position: absolute
      top: 0
      left: 0
      width: 100%

    }
      
     .fixed-title{
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color:rgba(255, 255, 255, 0.5)
        background:#333

      }
      
    .loading-container{
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)

    }
     
</style>
