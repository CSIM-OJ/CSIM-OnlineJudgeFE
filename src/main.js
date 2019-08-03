// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/zh-TW'
import VCharts from 'v-charts'
import VueProgressBar from 'vue-progressbar'
import Chat from 'vue-beautiful-chat'
import Vuex from 'vuex'
import VuexPersistence from "vuex-persist";
import course from './store/course'


// Vuex
Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage
});

const store = new Vuex.Store({
  modules: {
    course
  },
  plugins: [vuexLocal.plugin]
});


Vue.use(Chat)

Vue.use(VueProgressBar, {
  color: '#409EFF',
  failedColor: '#409EFF',
  thickness: '3px',
  transition: {
    speed: '0.2s',
    opacity: '0.5s',
    termination: 700
  }
})

Vue.use(ElementUI, {locale});
Vue.use(VCharts);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
