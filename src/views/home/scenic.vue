<template>
  <div class="warp" style="height:100%">
    <div class="body-container">
      <!--景点-->
      <h3 v-if="isData" style="margin-top: 20px;text-align:center">暂无更多数据~</h3>
      <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <cube-index-list-item  v-for="(tmp, index) in hotSpotList" :key="index">
          <div class="scenic-list" @click="jump('scenicParticulars',tmp.id)">
            <!--景点图-->
            <div class="scenic-img">
              <img :src="tmp.picUrl" alt="">
            </div>
            <!--景点介绍-->
            <div class="scenic-info">
              <!--景点名称-->
              <p class="scenic-title">{{tmp.spotName}}</p>
              <!--简单描述-->
              <p class="info-describe">{{tmp.spotContext.slice(0,40)}}...</p>
            </div>
          </div>
        </cube-index-list-item>
        <!--我们的底线-->
        <!-- <div v-if="hotSpotList.length !== 0" class="footer">
          <span class="char">--------&nbsp;&nbsp;我们的底线&nbsp;&nbsp;-------</span>
        </div> -->
      </cube-index-list>
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { seclectSenicList } from '@/api/member'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'scenic',
    data() {
      return {
        isData: false,
        hotSpotList: {},
        num: 1,
        size: 5,
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
        }
      }
    },
    computed: {
      ...mapGetters(['getsearchValue', 'getSearchState', 'getSearchLabelId'])
    },
    methods: {
      ...mapMutations(['sceincId']),
      jump: function(url, id) {
        this.sceincId(id);
        this.$router.push({ path: url });
      },
      // 加载景区的
      _seclectSenicList(spotName, lable) {
        seclectSenicList(this.num, this.size, spotName, lable).then(res => {
          if (res.code === SUCCESS_OK) {
            this.hotSpotList = res.result.list;
            if (res.result.list.length < 1) {
              this.isData = true
            } else {
              this.isData = false
            }
          } else {
            this.showAlert(res.error);
          }
        })
      },
      // 下拉刷新
      onPullingDown() {
        // Mock async load.
        this.num = 1
        setTimeout(() => {
          if (this.getSearchState === 0) {
            // 这里是常规入口，也就是从首页进来的，调取列表接口写在这
            this._seclectSenicList()
          } else if (this.getSearchState === 1) {
            // 这里是搜索的入口，调用搜索的接口，传入搜索的getSearchValue
            this._seclectSenicList(this.getsearchValue, this.getSearchLabelId)
          } else {
            // 如果拿不到state或者出现其他值，直接返回首页
            this.$router.push({ path: '/' })
          }
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      // 上滑加载更多
      onPullingUp() {
        this.num++
        // Mock async load.
        setTimeout(() => {
          if (this.getSearchState === 0) {
            // 这里是常规入口，也就是从首页进来的，调取列表接口写在这
            seclectSenicList(this.num, this.size).then(res => {
              if (res.code == SUCCESS_OK) {
                if (res.result.total <= this.hotSpotList.length) {
                  this.showAlert('已为您加载全部数据')
                } else {
                  this.hotSpotList = this.hotSpotList.concat(res.result.list)
                }
              } else {
                this.showAlert('连接数据库出错')
              }
            })
          } else if (this.getSearchState === 1) {
            // 这里是搜索的入口，调用搜索的接口，传入搜索的getSearchValue
            seclectSenicList(this.num, this.size, this.getsearchValue, this.getSearchLabelId).then(res => {
              if (res.code == SUCCESS_OK) {
                if (res.result.total <= this.hotSpotList.length) {
                  this.showAlert('已为您加载全部数据')
                } else {
                  this.hotSpotList = this.hotSpotList.concat(res.result.list)
                }
              } else {
                this.showAlert('连接数据库出错')
              }
            })
          } else {
            // 如果拿不到state或者出现其他值，直接返回首页
            this.$router.push({ path: '/' })
          }
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      // 封装判断是从常规入口进入还是从搜索页面进入，调用不同的接口，搜索传入searchValue
      judgeIfSearch() {
        if (this.getSearchState === 0) {
          // 这里是常规入口，也就是从首页进来的，调取列表接口写在这
          this._seclectSenicList()
        } else if (this.getSearchState === 1) {
          // 这里是搜索的入口，调用搜索的接口，传入搜索的getSearchValue
          this._seclectSenicList(this.getsearchValue, this.getSearchLabelId)
        } else {
          // 如果拿不到state或者出现其他值，直接返回首页
          this.$router.push({ path: '/' })
        }
      }
    },
    mounted() {
      console.log(this.getsearchValue)
      this.judgeIfSearch()
    }

  }
</script>
<style scoped lang="less">
  *{
    text-align: left;
  }
  .body-container,.scenic-list,.scenic-img,.scenic-info{
    width: 100%;
    height: 100%;
  }
  .scenic-list{
    max-width: 7.5rem;
    margin: 0 auto;
    height: 100%;
  }
  .scenic-img{
    height: 4.8rem;
  }
  .scenic-img img{
    width: 100%;
    height: 100%;
  }
  .scenic-info{
    height: 1.3rem;
    padding: 0.1rem  0.27rem;
  }
  .scenic-title{
    line-height: 0.48rem;
    font-size: 0.36rem;
    font-weight: 700;
    font-family: "PingFang-SC-Medium";
    // margin-bottom: 0.1rem;
  }
  .info-describe{
    width:100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.28rem;
    height: 0.5rem;
    line-height: 0.5rem;
    overflow: hidden;
    font-family: "PingFang-SC-Regular";
    color: #BABABA;
  }
  .footer{
    width: 100%;
    height: 3.44rem;
    text-align: center;
    padding: 1rem 0 0 0;
    background: #F4F4F4;
  }
  .char{
    display: inline-block;
    font-size: 0.2rem;
    color: #8C8C8C;
  }

</style>
