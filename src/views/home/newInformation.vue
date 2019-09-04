<template>
  <div class="warp" style="height:100%">
    <ul class="body-container">
      <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <h3 v-if="isData" style="margin-top: 20px;text-align:center">暂无更多数据~</h3>
        <cube-index-list-item  v-for="(tmp, index) in hotNewsList" :key="index">
          <li @click="jump('newDetail', tmp.id)">
            <!--左侧图片-->
            <div class="img-show">
              <img img :src="tmp.picUrl" alt="">
            </div>
            <!--右侧文字-->
            <div class="characters-show">
              <p v-if="tmp.newName.length>14">{{tmp.newName.slice(0,14)}}...</p>
              <p v-else>{{tmp.newName}}</p>
              <div  v-if="tmp.newContrxt.length < 20">{{tmp.newContrxt}}</div>
              <div  v-else>{{tmp.newContrxt.slice(0,20)}}...</div>
              <!--<div v-html="tmp.newContrxt"></div>-->
              <p>{{tmp.creatTime}}</p>
            </div>
          </li>
        </cube-index-list-item>
      </cube-index-list>
    </ul>
  </div>
</template>
<script>
  import {  mapGetters, mapMutations } from 'vuex'
  const SUCCESS_OK = "rest.success"
  // import { selectHotNewsList } from '@/utils/wfetch'
  import { seclectNewsList } from '@/api/member'
  export default {
    name: 'newInformation',
    data() {
      return {
        isData: false,
        hotNewsList: [],
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
      ...mapMutations(['newsId']),
      jump: function(url, id) {
        this.$router.push({ path: url });
        this.newsId(id);
      },
      onPullingDown() {
        // Mock async load.
        this.num = 1
        setTimeout(() => {
          if (this.getSearchState === 0) {
            // 这里是常规入口，也就是从首页进来的，调取列表接口写在这
            this._seclectNewsList()
          } else if (this.getSearchState === 1) {
            // 这里是搜索的入口，调用搜索的接口，传入搜索的getSearchValue
            this._seclectNewsList(this.getsearchValue, this.getSearchLabelId)
          } else {
            // 如果拿不到state或者出现其他值，直接返回首页
            this.$router.push({ path: '/' })
          }
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      // 加载新闻列表
      _seclectNewsList(newName, lable) {
        seclectNewsList(this.num, this.size, newName, lable).then(res => {
          if (res.code === SUCCESS_OK) {
            this.hotNewsList = res.result.list
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
      // 上滑加载更多
      onPullingUp() {
        this.num++
        // Mock async load.
        setTimeout(() => {
          if (this.getSearchState === 0) {
            // 这里是常规入口，也就是从首页进来的，调取列表接口写在这
            seclectNewsList(this.num, this.size).then(res => {
              if (res.code == SUCCESS_OK) {
                if (res.result.total <= this.hotNewsList.length) {
                  this.showAlert('已为您加载全部数据')
                } else {
                  this.hotNewsList = this.hotNewsList.concat(res.result.list)
                }
              } else {
                this.showAlert('连接数据库出错')
              }
            })
          } else if (this.getSearchState === 1) {
            // 这里是搜索的入口，调用搜索的接口，传入搜索的getSearchValue
            seclectNewsList(this.num, this.size, this.getsearchValue, this.getSearchLabelId).then(res => {
              if (res.code == SUCCESS_OK) {
                if (res.result.total <= this.hotNewsList.length) {
                  this.showAlert('已为您加载全部数据')
                } else {
                  this.hotNewsList = this.hotNewsList.concat(res.result.list)
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
        if (this.getSearchState == 0) {
          // 这里是常规入口，也就是从首页进来的，调取列表接口写在这
          this._seclectNewsList()
        } else if (this.getSearchState == 1) {
          // 这里是搜索的入口，调用搜索的接口，传入搜索的getSearchValue
          this._seclectNewsList(this.getsearchValue, this.getSearchLabelId)
        } else {
          // 如果拿不到state或者出现其他值，直接返回首页
          this.$router.push({ path: '/' })
        }
      }
    },
    created: function() {
      /* 请求数据 */
      this.judgeIfSearch();
    }

  }
</script>
<style scoped lang="less">
  *{
    text-align: left;
  }
  .warp{
    width: 100%;
  }
  .body-container{
    width: 100%;
    height: 100%;
    // padding: 0 0.29rem;
    background: #fff;
  }
  .body-container li{
    width: 100%;
    height: 2.6rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px;
    border-bottom: 1px solid #F3F3F3;
  }
  .img-show{
    width: 2.1rem;
    height: 2.1rem;
  }
  .img-show img{
    width: 100%;
    height: 100%;
  }
  .characters-show{
    position: relative;
    width: 4.6rem;
    height: 2.1rem;
    padding: 0.1rem 0;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    align-items: flex-start;
  }
  // .characters-show p,.characters-show>div{
/*    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;*/
  // }
  .characters-show p:first-child{
    width: 100%;
    font-family: 'PingFang-SC-Bold';
    font-size: 0.28rem;
    color: #333333;
    font-weight: bold;
    -webkit-line-clamp: 1;
  }
  .characters-show div{
    width: 100%;
    font-family: 'PingFang-SC-Medium';
    font-size: 12px;
    line-height: 19px;
    margin-top: 0.15rem;
    color: #666666;
    overflow: hidden;/*超出部分隐藏*/
    white-space: nowrap;/*不换行*/
    text-overflow:ellipsis;/*超出部分文字以...显示*/
  }
  .characters-show p:last-child{
    position: absolute;
    bottom: 0;
    width: 100%;
    font-family: 'PingFang-SC-Medium';
    font-size: 0.22rem;
    color: #C6C6C6;
    -webkit-line-clamp: 1;
  }



</style>
