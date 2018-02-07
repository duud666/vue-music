<template>
<transition name="slide">
  <div class="search">
    <div class="search-box-wrapper">
      <search-box @query="onQueryChange" ref="searchBox"></search-box>
      <!--输入框组件-->
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <!--query为空就显示热门搜索-->
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                  <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                    <span>{{item.k}}</span>
                  </li>
              </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @select="addQuery" @delete="deleteOne" 
            :searches="searchHistory"></search-list>
            <!--searchHistory列表传给search-list组件 -->
            <!--监听search-list子组件的派发select，将历史query添加到input框中-->
            <!--从search-list组件接收派发的delete事件，删除历史-->
          </div>
        </div>
      </scroll>   
    </div>
    <div class="search-result" v-show="query">
      <!--检索到query就显示，显示下拉组件-->
      <suggest @select="saveSearch" @listScroll="blurInput" :query="query"></suggest>
      <!--从suggest组件接收派发的select事件，-->
      <!--从suggest派发事件，然后监听blurInput事件，两层传递-->
    </div>
    <confirm ref="confirm" text="是否清空所有搜索历史" confirmBtnText="清空"
    @confirm="deleteAll"></confirm>
    <router-view></router-view>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/suggest'
  import {mapActions,mapGetters} from 'vuex'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  export default {
    created(){
      this._getHotKey()
    },
    data(){
      return {
        hotKey:[],
        query:''
      }
    },
    computed:{
      shortcut(){
        //当hotKey或者searchHistory有一个发生改变时就重新计算scroll滚动高度
        return this.hotKey.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    methods:{
      _getHotKey(){
        //抓取数据的方法
        getHotKey().then((res)=>{
          if(res.code===ERR_OK){
            //console.log(res.data.hotkey)
            this.hotKey=res.data.hotkey.slice(0,10)
            //只选取前10个数据
          }
        })
      },
      blurInput(){
        this.$refs.searchBox.blur()
      },     
      addQuery(query){
        //将query添加到input输入框的方法
        //点击搜索的li就可以将k添加到search-box组件的输入框中
        this.$refs.searchBox.setQuery(query)

      },
      onQueryChange(query){
        //监听事件，监听并接受search-box派发的query数据
        //从search-box输入框中拿到query变化的值，然后在传递给suggest
        //search-box---->search---->suggest传query，然后触发suggest中的watch
        //query变化，然后调用search方法调用api请求抓数据
        this.query=query
      },
      saveSearch(){
        //将历史query添加到input
        this.saveSearchHistory(this.query)
      },
      deleteOne(item){
        //删除历史数据
        this.deleteSearchHistory(item)
      },
      deleteAll(){
        //删除全部历史数据
        this.clearSearchHistory()
      },
      showConfirm(){
        //点击垃圾桶图标调用confirm组件的show方法，显示弹窗
        this.$refs.confirm.show()
      },
      ...mapActions([
          'saveSearchHistory',
          'deleteSearchHistory',
          'clearSearchHistory'

        ])
    },
    wacth:{
        query(newQuery){
          //监听当input由有值变为空的时候，重新计算下滚动的计算高度值
          if(!newQuery){
            alert()
            setTimeout(()=>{
              this.$refs.shortcut.refresh()
            },20)
          }
        }
    },
    components:{
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  
.search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
.slide-enter-active{
    transition:all 0.3s
  }
  .slide-leave-active{
  	transition:all
  }
  .slide-enter,.slide-leave-to{
    transform:translate3d(100%,0,0);
  }
</style>
