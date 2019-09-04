<template>
  <div class="warp">
    <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <cube-index-list-item v-for="(item, index) in historyInfo" :key="index">
          <div  class="sug-item" >
            <p class="sug-time">{{item.complaintTime}}</p>
            <div class="sug-info">
              <div class="sug-content">
                <img src="../../assets/images/suggest2x.png" v-if="item.complaintType === 2" alt="">
                <img src="../../assets/images/complaint2x.png" v-if="item.complaintType === 1" alt="">
                <p>
                  {{item.complaintContext}}
                </p>
              </div>
              <div class="anwser-content">
                <img src="../../assets/images/anwser2x.png" alt="">
                <p>{{item.replyContext}}</p>
              </div>
            </div>
          </div>
        </cube-index-list-item>
    </cube-index-list>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { selectComplaintList } from '@/utils/wfetch'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        historyInfo: [],
        pullDownRefresh: '',
        num: 1,
        size: 5,
        updateList: [],
        nextUpLoad: true,
        options: {
          pullDownRefresh: {
            stop: 55,
            txt: '刷新成功'
          },
          pullUpLoad:  {
            txt: {
              more: '没有更多数据'
            }
          }
        }
      }
    },
    computed: {
      ...mapGetters(['getSuggestState'])
    },
    methods: {
      onPullingDown() {
        setTimeout(() => {
          this.num = 1;
          // 请求数据
          const params = { num: this.num, size: this.size, complaintType: this.getSuggestState, queryType: '2' }
          selectComplaintList(params).then(res => {
            if (res.code === SUCCESS_OK) {
              this.historyInfo = res.result.list;
              if (res.result.isLastPage) {
                this.nextUpLoad = false;
              }
            } else {
              this.showAlert(res.error);
            }
          })
          // Call forceUpdate after finishing data load.
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      onPullingUp() {
        // Mock async load.

          setTimeout(() => {
            if (this.nextUpLoad) {
              this.num++;
              this.updateList = [];
              // 请求数据
              const params = { num: this.num, size: this.size, complaintType: this.getSuggestState, queryType: '2' }
              selectComplaintList(params).then(res => {
                // console.log(res)
                if (res.code === SUCCESS_OK) {
                  if (res.result.list.length > 0) {
                    this.historyInfo = this.historyInfo.concat(res.result.list);
                    if (res.result.isLastPage) {
                      this.nextUpLoad = false;
                    }
                  }
                } else {
                  this.showAlert(res.error);
                }
              })
            } else {
              this.showAlert('没有更多数据了');
            }
            this.$refs.indexList.forceUpdate()
          }, 1000)
      }
    },
    created: function() {
       // 请求数据
      const params = { num: this.num, size: this.size, complaintType: this.getSuggestState, queryType: '2' }
      selectComplaintList(params).then(res => {
        if (res.code === SUCCESS_OK) {
          this.historyInfo = res.result.list;
          if (res.result.isLastPage) {
            this.nextUpLoad = false;
          }
        } else {
          this.showAlert(res.error);
        }
      })
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .warp {
    width: 100%;
    height: 100%;
  }
  .sug-item{
    background: #F4F4F4;
    .sug-time{
      font-size: 0.24rem;
      color: #999;
      padding: 0 0.26rem;
      line-height: 0.64rem;
      text-align: left;
    }
    .sug-info{
      padding: 0.36rem 0.26rem ;
      background: #fff;
      img{
        width: 0.32rem;
        height: 0.32rem;
      }
      .sug-content,
      .anwser-content{
        img{
          display: block;
          float: left;
        }
        p{
          float: left;
          margin-left: 0.2rem;
          width: 92.5%;
          font-size: 0.28rem;
          color: #666;
        }
        text-align: left;
        line-height: 0.4rem;
      }
      .sug-content:after,
      .anwser-content:after{
        content: '';
        display: block;
        clear: both;
      }
      .anwser-content{
        margin-top: 0.39rem;
        p{
          color: #030303;
        }
      }
    }
  }
</style>
