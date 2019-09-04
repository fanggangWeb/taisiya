<template>
  <div class="warp">
    <h3 v-if="isData" style="margin-top: 20px;text-align:center">暂无更多数据~</h3>
    <cube-index-list ref="indexList" :options="options"  @pulling-up="onPullingUp" @pulling-down="onPullingDown">
      <cube-index-list-item  v-for="(item, index) in sellerList" :key="index">
        <div class="detail-list">
          <div class="detail-item" @click="jump('sellerDetails', item.id, item.businessName)">
            <div class="show-img">
              <a href="javascript:;"  v-for="(tmp,index2) in item.picUrl" v-if="index2===0" >
                <img :src="tmp" alt=""/>
              </a>
            </div>
            <div class="show-word">
              <div class="sell-name">
                <h2>{{item.businessName}}</h2>
              </div>
              <div class="sell-abstract">
                <p>地址：{{item.businessAddress}}</p>
              </div>
              <div class="sell-summary" v-if="item.businessContext.length>=32">{{item.businessContext.slice(0,32)}}...</div>
              <div class="sell-summary" v-if="item.businessContext.length<32">{{item.businessContext}}</div>
            </div>
          </div>
        </div>
      </cube-index-list-item>
    </cube-index-list>
  </div>
</template>
<script>
  // import Swiper from '../../assets/static/swiper.min.js'
  import { mapGetters, mapMutations } from 'vuex'
  // import { selectBusinessList } from '@/utils/lkfetch'
  import { seclectBusinessList } from '@/api/member'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        isData: false,
        msg: 'Welcome to Your Vue.js App',
        type: 1,
        sellerList: [],
        pullDownRefresh: '',
        options: {
          pullDownRefresh: {
            stop: 55,
            txt: '刷新成功'
          },
          pullUpLoad:  {
            // txt: {
            //   more: '没有更多数据'
            // }
          }
        },
        num: 1,
        size: 5
      }
    },
    computed: {
      ...mapGetters(['getsearchValue', 'getSearchState', 'getSearchLabelId'])
    },
    methods: {
      ...mapMutations(['sellerId', 'sellerName']),
      jump: function(url, id, name) {
        this.sellerId(id);
        this.sellerName(name);
        this.$router.push({ path: url });
      },
      // 封装判断是从常规入口进入还是从搜索页面进入，调用不同的接口，搜索传入searchValue
      judgeIfSearch() {
        if (this.getSearchState === 0) {
          // 这里是常规入口，也就是从首页进来的，调取列表接口写在这
          this._seclectBusinessList()
        } else if (this.getSearchState === 1) {
          // 这里是搜索的入口，调用搜索的接口，传入搜索的getSearchValue
          this._seclectBusinessList(this.getsearchValue, this.getSearchLabelId)
        } else {
          // 如果拿不到state或者出现其他值，直接返回首页
          this.$router.push({ path: '/' })
        }
      },
      onPullingDown() {
        this.num = 1
        // Mock async load.
        setTimeout(() => {
          // Update data.
         if (this.getSearchState === 0) {
            // 这里是常规入口，也就是从首页进来的，调取列表接口写在这
            this._seclectBusinessList()
          } else if (this.getSearchState === 1) {
            // 这里是搜索的入口，调用搜索的接口，传入搜索的getSearchValue
            this._seclectBusinessList(this.getsearchValue, this.getSearchLabelId)
          } else {
            // 如果拿不到state或者出现其他值，直接返回首页
            this.$router.push({ path: '/' })
          }
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      onPullingUp() {
        this.num++
        // Mock async load.
        setTimeout(() => {
          if (this.getSearchState === 0) {
            // 这里是常规入口，也就是从首页进来的，调取列表接口写在这
            this.loadMore()
          } else if (this.getSearchState === 1) {
            // 这里是搜索的入口，调用搜索的接口，传入搜索的getSearchValue
            this.loadMore(this.getSearchValue, this.getSearchLabelId)
          } else {
            // 如果拿不到state或者出现其他值，直接返回首页
            this.$router.push({ path: '/' })
          }
          this.$refs.indexList.forceUpdate()
        //   // }
        }, 1000)
      },
      loadMore(businessName, lable) {
        seclectBusinessList(this.num, this.size, businessName, lable).then(res => {
          if (res.code === SUCCESS_OK) {
              // console.log(res.result.list)
            if (res.result.total <= this.sellerList.length) {
              this.showAlert('已为您加载全部数据')
            } else {
              this.sellerList = this.sellerList.concat(res.result.list);
            }
          } else {
            this.showAlert(res.error);
          }
        })
      },
      _seclectBusinessList(businessName, lable) {
        seclectBusinessList(this.num, this.size, businessName, lable).then(res => {
          // console.log(res.result.list)
          if (res.code === SUCCESS_OK) {
            this.sellerList = res.result.list;
            if (res.result.list.length < 1) {
              this.isData = true
            } else {
              this.isData = false
            }
          } else {
            this.showAlert(res.error);
          }
        })
      }
    },
    mounted: function() {
      /* 请求数据 */
      this.judgeIfSearch()
 //     console.log(this.getsearchValue)
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .warp {
    /*width: 100%;*/
    height: 100%;
  }
  .detail-list{
    width:100%;
  }
  .detail-item{
    width: 100%;
    box-sizing: border-box;
    padding: 0.28rem 0.26rem 0 0.26rem;
    display: flex;
    justify-content: space-between;
    .show-img{
      float: left;
      width:2.3rem;
      a{
        display: block;
        width:100%;
        height: 100%;
        img{
          width:100%;
          height: 100%;
        }
      }
      margin-bottom: 0.18rem;
    }

    .show-word{

      display: block;
      width: 4.4rem;
      /*width: 58.67%;*/
      margin-top: 0.19rem;
      border-bottom: 0.01rem solid #F0F0F0;
      text-align: left;
      .sell-name{
        h2{
          font-size: 0.3rem;
          color: #030303;
          font-weight: 600;
        }
      }
      .sell-abstract {
        margin-top: 0.15rem;
        padding-bottom: 0.3rem;
        p{
          font-size: 0.2rem;
          height: 0.25rem;
          line-height: 0.25rem;
          color: #999;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .sell-summary{
        font-size: 0.22rem;
        color: #666;
        height: 0.74rem;
        line-height: 0.74rem;
        text-overflow :  ellipsis;
        white-space:nowrap;
        overflow:hidden;
      }
    }
  }
</style>
