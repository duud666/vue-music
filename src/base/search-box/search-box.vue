<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" class="box" v-model="query":placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
    <!--当为空隐藏x图标，有输入字符显示x图标-->
  </div>
</template>

<script type="text/ecmascript-6">
  import {debounce} from 'common/js/utll'

  export default {
    props:{
      placeholder:{
        type:String,
        default:'搜索歌曲，歌手'
      }
    },
    data(){
      return {
        //双向绑定input数据
        query:''
      }
    },
    methods:{
      clear(){
        //当点击x图标，将query置为空
        this.query=''
      },
      setQuery(query){
        //接收从search组件传来的热门搜索点击的看k
        this.query=query
     },
      blur(){
        this.$refs.query.blur()
      }
    },
     created(){
      //在渲染dom后就将query值监听变化并且派发出去，传入search中
      this.$watch('query',debounce((newQuery)=>{
        this.$emit('query',newQuery)
      },200))
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      height:28px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>