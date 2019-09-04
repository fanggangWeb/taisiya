<template>
  <div class="container">
    <div class="tabBar">
      <div class="tabItemCon" v-for="(item, index) in tabList" :key="index">
        <span class="tabItem" :class="{'tabActive':index===current}" v-on:click="tabClick(item, index)">{{item.name}}</span>
      </div>
    </div>
    <input class="searchBox" v-model="searchVal" placeholder="请输入要搜索的内容..." @keyup.enter="search"/>
    <div v-if="isShow" class="labelTitle">标签搜索</div>
    <div v-if="isShow" class="history-container">
      <div v-for="(item, index) in historyList" :key="index" class="history-list" @click="historySearch(item)">{{item.display}}</div>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { getLabelList } from '@/api/member'
  const SUCCESS_OK = "rest.success"
  export default {
    data() {
      return {
        isShow: true,
        current: 0,
        searchVal: '',
        searchType: 0,
        labelCode: 'scenicSpotLable',
        tabList: [{
          type: 0,
          name: '景点',
          label: 'scenicSpotLable'
        }, {
          type: 1,
          name: '商家',
          label: 'businessLable'
        }, {
          type: 2,
          name: '商品',
          label: 'merchantProductsLable'
        }, {
          type: 3,
          name: '游记',
          label: 'travelsLable'
        }, {
          type: 4,
          name: '新闻',
          label: 'newLable'
        }],
        historyList: []
      }
    },
    computed: {
      ...mapGetters(['getsearchValue', 'getSearchState'])
    },
    methods: {
      tabClick(item, index) {
        this.current = index
        this.searchType = item.type
        this.labelCode = item.label
        if (index == 3) {
          this.isShow = false
        } else {
          this.isShow = true
          this._getLabelList()
        }
      },
      search() {
        console.log(this.searchVal)
        // 搜索内容为空不执行
        if (this.searchVal == '') {
          return
        } else {
          // 将搜索的值存到vuex
          this.searchLabelId('')
          this.searchValue(this.searchVal)
          this.searchGoRouter()
        }
      },
      // 点击历史消息的记录
      historySearch(item) {
        this.searchValue('') // 清空searchValue
        this.searchLabelId(item.value)
        // 将item.id存储到vuex方面进行取值
        // this.showError('测试弹出框')
        this.searchGoRouter()
      },
      // 获取搜索的标签
      _getLabelList() {
        getLabelList(this.labelCode).then(res => {
          if (res.code == SUCCESS_OK) {
            this.historyList = res.result
          } else {
            this.showAlert('网络连接错误')
          }
        })
      },
      // 搜索页面的跳转路由方法封装
      searchGoRouter() {
        // 根据5种type跳转不同的页面，改变searchState
        this.searchState(1)
        if (this.searchType === 0) {
          this.$router.push({ path: '/home/scenic' })
        } else if (this.searchType === 1) {
          this.$router.push({ path: '/home/sellerList' })
        } else if (this.searchType === 2) {
          // 商品列表重新写的组件
          this.$router.push({ path: '/search/commodity' })
        } else if (this.searchType === 3) {
          this.$router.push({ path: '/travel' })
        } else if (this.searchType === 4) {
          this.$router.push({ path: '/home/newInformation' })
        }
      },
      ...mapMutations(['searchValue', 'searchState', 'searchLabelId']),
      // 显示加载错误
      showError(msg) {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: msg
        }).show()
      }
    },
    mounted() {
      // console.log(this.getSearchState)
      this._getLabelList()
    }
  }
</script>
<style lang="stylus" scoped>
.container
  width 100%
  height 100%
  background-color #f4f4f4
  .tabBar
    width 100%
    height 40px
    display flex
    flex-wrap nowrap
    .tabItemCon
      width 20%
      padding 3px 10px
      .tabItem
        display inline-block
        width 100%
        height 100%
        line-height 34px
        text-align center
        font-size 14px
      .tabActive
        background-color #555
        color #EDD014
        border-radius 16px
  .searchBox
    padding-left 10px
    width 80%
    border-radius 15px
    // background-color #F3F3F3
    height 40px
    margin-top 10px
  .labelTitle
    font-size 12px
    color #666666
    width 80px
    height 40px
    text-align center
    line-height 40px
    margin-top 20px
  .history-container
    width 100%
    height auto
    display flex
    flex-wrap wrap
    .history-list
      height 30px
      line-height 30px
      padding 0 10px
      background-color white
      border-radius 15px
      margin-left 10px
      margin-bottom 10px
</style>
