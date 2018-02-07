import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Singer from 'components/singer/singer'
import Rank from 'components/rank/rank'
import Search from 'components/search/search'
import SingerDetail from 'components/singer-detail/singer-detail'
import Disc from 'components/disc/disc'
Vue.use(Router)
//配置路由路径
//将导入的路由包给Router，Router就相当于一个路由对象
//路由跳转就是跳转到另一个组件的页面

export default new Router({
  routes: [
  	{
  		path:'/',
  		redirect:'/recommend'//默认重定向推荐页面
  	},
    {
      path:'/recommend',
      component:Recommend,//recommend下的二级路由
      children:[
        {
          path:':id',
          component:Disc
        }
      ]

    },
    {
      path:'/singer',
      component:Singer,
      children:[//Singer下的子路由
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path:'/rank',
      component:Rank
    },
    {
      path:'/search',
      component:Search,
      children:[//search下的子路由
        {
          path:':id',
          component:SingerDetail
        }
      ]
    }
  ]
})
