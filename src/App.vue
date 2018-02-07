<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
    <router-view></router-view><!--挂载路由-->
    </keep-alive>
    <player></player><!--全局的播放跟路由跳转没关系，加在全局上-->
    
  </div>
</template>

/
<script type="text/ecmascript-6">
//前面是组件的名字，from是导入组件路径
import  Player    from './components/player/player'
import  MHeader   from './components/m-header/m-header'
import  Tab       from './components/tab/tab'
import  Rank      from './components/rank/rank'
import  Singer    from './components/singer/singer'
import  Recommend from './components/recommend/recommend'
//然后在下面注册组件
  export default{
    components:{
        MHeader,
        Tab,
        Recommend,
        Rank,
        Singer,
        Player
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
