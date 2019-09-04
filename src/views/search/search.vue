<template>
  <div class="container">
    <div class="tabBar">
      <div class="tabItemCon" v-for="(item, index) in tabList" :key="index">
        <span class="tabItem" :class="{'tabActive':index===current}" v-on:click="tabClick(item, index)">{{item.name}}</span>
      </div>
    </div>
    <input class="searchBox" v-model="searchVal" placeholder="请输入要搜索的内容..." @change="search"/>
    <div class="labelTitle">标签搜索</div>
    <div class="history-container">
      <div v-for="(item, index) in historyList" :key="index" class="history-list" @click="historySearch(item)">{{item.name}}</div>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  export default {
    data() {
      return {
        current: 0,
        searchVal: '',
        searchType: 0,
        tabList: [{
          type: 0,
          name: '景点'
        }, {
          type: 1,
          name: '商家'
        }, {
          type: 2,
          name: '商品'
        }, {
          type: 3,
          name: '游记'
        }, {
          type: 0,
          name: '新闻'
        }],
        historyList: [{
          name: '某种品牌的包包'
        }, {
          name: '某种品牌的包包'
        }, {
          name: '某种品牌的包包'
        }, {
          name: '某种品牌的包包'
        }, {
          name: '某种品牌的包包'
        }, {
          name: '某种品牌的包包'
        }]
      }
    },
    computed: {
      ...mapGetters(['getTest', 'getUserName'])
    },
    methods: {
      tabClick(item, index) {
        // alert(111)
        this.current = index
        this.searchType = item.type
      },
      search() {
        console.log(this.searchVal)
        // 搜索内容为空不执行
        if (this.searchVal == '') {
          return
        } else {
          return
        }
      },
      historySearch(item) {
        console.log(item)
      },
      ...mapMutations(['test', 'userName'])
    },
    mounted() {
      this.test('vuex测试')
      console.log(this.getTest)
      // this.userName('like')
      console.log(this.getUserName)
      this.userName('like')
      console.log(this.getUserName)
    }
  }
</script>
<style lang="stylus" scoped>
.container
  width 100%
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
    background-color #F3F3F3
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
      background-color #F5F5F5
      border-radius 15px
      margin-left 10px
      margin-bottom 10px
</style>
