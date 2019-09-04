// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueScroller from 'vue-scroller'
import layer from 'vue-layer'
import api from '@/utils/api'
import store from './store/index'
// import VueTouch from 'vue-touch'
import 'babel-polyfill'
import 'jquery'
import Cube from 'cube-ui'
import * as msg from './utils/showmessage'  // 引入封装的各种弹出框
Vue.use(Cube)
import './permission'
// 引入视频插件 utils>index>FastClick.prototype.needsClick>添加了|| (/\bvjs/).test(target.className)
// require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
import videoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
Vue.use(videoPlayer)
import './vux'
import '@/utils/index'
import '@/styles/index.scss'
// 覆盖滴滴ui的某些样式
import '@/styles/resetCube.styl'
import {
  // 基础样式
  // basic
  Button, Loading, Tip, Toolbar,
  // form
  Checkbox, CheckboxGroup, Radio, Input, Textarea, Select, Switch, Rate, Validator, Upload, Form,
  // popup
  Popup, Toast, Picker, CascadePicker, DatePicker, TimePicker, SegmentPicker, Dialog, ActionSheet, Drawer,
  // scroll
  Scroll, Slide, IndexList, Swipe
} from 'cube-ui'
Vue.use(Button, Loading, Tip, Toolbar, Checkbox, CheckboxGroup, Radio, Input, Textarea, Select,
  Switch, Rate, Validator, Upload, Form, Popup, Toast, Picker, CascadePicker, DatePicker, TimePicker,
  SegmentPicker, Dialog, ActionSheet, Drawer, Scroll, Slide, IndexList, Swipe)
import { createAPI, BetterScroll } from 'cube-ui'
Vue.use(createAPI, BetterScroll)
import '../node_modules/vue-awesome-swiper/node_modules/swiper/dist/css/swiper.css'
import VueAwesomeSwiper from 'vue-awesome-swiper' // 滑动轮播图
Vue.use(VueAwesomeSwiper)
// 三级联动地区选择器
import VDistpicker from 'v-distpicker'
Vue.component('v-distpicker', VDistpicker)
Vue.use(VueScroller);
import gallery from 'img-vuer'
Vue.use(gallery)
// Vue.use(VueTouch, { name: 'v-touch' });
Vue.prototype.$api = api;
Vue.prototype.$layer = layer(Vue);
Vue.config.productionTip = false;
// 自定义封装消息提示框
Object.keys(msg).forEach(key => {
  Vue.prototype[key] = msg[key]
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
