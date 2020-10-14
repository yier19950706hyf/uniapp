import Vue from 'vue'
import App from './App'
import store from './store'
import tui from './common/httpRequest'

import util from '@/utils/api.js'//引入request封装


Vue.config.productionTip = false
// #ifdef H5
window.QQmap = null;
// #endif
// #ifndef MP-TOUTIAO
//网络监听
setTimeout(() => {
	uni.onNetworkStatusChange(function(res) {
		//console.log(res.networkType);
		store.commit("networkChange", {
			isConnected: res.isConnected
		})
	});
}, 100)
// #endif

Vue.prototype.tui = tui
Vue.prototype.$eventHub = Vue.prototype.$eventHub || new Vue()
Vue.prototype.$store = store

Vue.prototype.$util=util;//全局绑定request


App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()