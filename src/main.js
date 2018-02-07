import 'babel-polyfill'
import fastclick from 'fastclick'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import 'common/stylus/index.styl'
import store from './store'


Vue.config.productionTip = false

fastclick.attach(document.body)
Vue.use(VueLazyLoad,{
	//common/images/default.png
	loading:require('base/loading/loading.gif')
})
// eslint-disable-next-line
/*去掉点击300ms的延时*/
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  router
})
