<template>
  <scroll class="suggest" 
          :data="result" 
          :pullup="pullup"
          @scrollToEnd="searchMore"
          ref="suggest"
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll">
          <!--监听scroll组件传来的scrollToEnd事件-->
          <!--:data="result" 有数据scroll监听data变化就计算下高度-->
          <!--监听scroll组件传来的beforeScroll事件-->
    <ul class="suggest-list">
     <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
          <!--绑定class样式的改变,区分下icon的样式，前面小图标-->
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
          <!--getDisplayName显示名字和歌手item，v-html转义字符-->
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
      <!--hasMore为false无法下拉，就隐藏，为true就出现加载中图标-->
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <!--无歌曲下拉和无结果时显示-->
      <no-result title="抱歉，暂无搜索结果"></no-result>
      <!--向子组件传title-->
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
//搜索下拉页面组件
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import {mapMutations, mapActions} from 'vuex'
  import Singer from 'common/js/singer'
  import NoResult from 'base/no-result/no-result'

  const TYPE_SIGNER='singer'
  const perpage=20

  export default {
    props: {
      showSinger: {
        //是否显示歌手
        type: Boolean,
        default: true
      },
      query: {
        //存search组件传入的检索词
        type: String,
        default: ''
      }
    },
    data(){
      return {
        page:1,
        result:[],
        pullup:true,
        hasMore:true,//下拉标志位
        beforeScroll:true
      }
    },
    methods:{
      listScroll(){
        this.$emit('listScroll')
      },
      search(){
        this.page=1//每次请求都要重新为1，从第一页开始
        this.hasMore=true//第一次抓数据hasMore为true
        //this.$refs.suggest.scrollTo(0,0)
        //请求服务端抓取检索数据渲染到dom

        search(this.query,this.page, this.showSinger,perpage).then((res)=>{
          if(res.code===ERR_OK){
            this.result=this._genResult(res.data)
            this._checkMode(res.data)
          }
        })
      },
      _checkMode(data){
        //数据中是否有更多的数据，是否可以下拉
        const song=data.song//拿到song
      //没有数据返回或者数量大于歌曲总的数量hasMore为false,fasle就是无法下拉了
        if(!song.list.length || (song.curnum+song.curpage*perpage)>song.totalnum){
          this.hasMore=false
        }

      },
      searchMore(){
      //监听scroll滑动派发的事件，有就触发判断hasMore值
      //true就是可以下拉有数据，false就是无数据了
        if(!this.hasMore){
          return 
        }
        this.page++//page就是类似于页码,请求第二页的数据
        //hasMore为true说明要加载更多数据，所以数据page++
        search(this.query,this.page,this.showSinger,perpage).then((res)=>{
            if(res.code===ERR_OK){
            this.result=this.result.concat(this._genResult(res.data))
            //要把第一次抓取的result结果拼接(concat)到result后
            this._checkMode(res.data)
          }
        })

      },
      _genResult(data){
        //整理下数据结构
        let ret =[]
        if(data.zhida&&data.zhida.singerid){
          ret.push({...data.zhida,...{type:TYPE_SIGNER}})
        }
        if(data.song){
          //data.song数据结构存在，就将song下的list存入ret
          ret=ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret 
      },
      _normalizeSongs(list){
        let ret=[]
        list.forEach((musicData)=>{
           if(musicData.songid && musicData.albumid){
            ret.push(createSong(musicData))
           }
        })
        return ret 
      },
      getIconCls(item){
        //绑定class样式的改变,区分下icon的样式，前面小图标
        if(item.type===TYPE_SIGNER){
          return 'icon-mine'
        }else{
          return 'icon-music'
        }
      },
      getDisplayName(item){
        //获取name
        if(item.type===TYPE_SIGNER){
          return item.singername
        }else{
          return `${item.name}-${item.singer}`
        }
      },
      selectItem(item){
        //点击检索下拉的词,判断类型是否是歌手
        if(item.type===TYPE_SIGNER){
        //若是歌手传这个歌手的id和name，然后跳转到singerdetail路由
          const singer =new Singer({//Singer对象数据
            id:item.singermid,
            name:item.singername
          })
          this.$router.push({
            //将跳转的路径
            path:`/search/${singer.id}`
          })
          this.setSinger(singer)//将singer存的Singer数据写入mapMutations
        }else{
          //若是点击的是歌曲，
          this.insertSong(item)
        }
        this.$emit('select')//点击后就派发出一个事件
      },
      ...mapMutations({
        setSinger:'SET_SINGER'//做一个映射传入
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch:{
      
      query(){
       //监听query发生的变化,即输入框有值就改变就触发search方法抓取数据
        this.search()
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        letter-spacing:1px
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
      
</style>