import Vue from 'vue'
import App from './App.vue'
import Vue2SfcTemplate from '../packages'

import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Vue2SfcTemplate)
// 在 App.vue 中引用，并启动项目查看

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')
