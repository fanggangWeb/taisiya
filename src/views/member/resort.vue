<template>
  <div class="warp">
    <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
      <cube-index-list-item v-for="(item, index) in resortList" :key="index">
      <div class="staff">
        <div class="staff-img">
          <img :src="item.picUrlDisplay" alt="">
        </div>
        <div class="staff-contact">
          <div class="staff-post">
            <p>{{item.workName}}</p>
            <span class="dialing" @click="call(item.workPhone)"></span>
          </div>
          <p class="staff-phone">{{item.workPhone}}</p>
        </div>
      </div>
      </cube-index-list-item>
    </cube-index-list>
  </div>

</template>
<script>
  import { selectPersonnelList } from '@/utils/wfetch'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        nextUpLoad: true,
        num: 1,
        size: 3,
        options: {
          pullDownRefresh: {
            stop: 55,
            txt: '刷新成功'
          },
          pullUpLoad: {
            txt: {
              more: '没有更多数据'
            }
          }
        },
        resortList: []
      }
    },
    methods: {
      jump: function() {
        this.$router.push({ path: '/home' })
      },
      // 调用手机联系人接口
      call: function(tel) {
        window.location.href = 'tel:' + tel
      },
      onPullingDown() {
        setTimeout(() => {
          this.num = 1;
          // 请求数据
          const params = { num: this.num, size: this.size }
          selectPersonnelList(params).then(res => {
            if (res.code == SUCCESS_OK) {
              this.addressList = res.result.list;
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
        setTimeout(() => {
            this.num++;
            this.updateList = [];
            // 请求数据
            const params = { num: this.num, size: this.size }
            selectPersonnelList(params).then(res => {
              if (res.code == SUCCESS_OK) {
                if (res.result.total <= this.addressList.length) {
                  this.showAlert('已为您加载全部数据')
                } else {
                  this.addressList = this.addressList.concat(res.result.list)
                }
              } else {
                this.showAlert(res.error);
              }
            })
          this.$refs.indexList.forceUpdate()
        }, 1000)
      }
    },
    created: function() {
      /* 请求数据 */
      selectPersonnelList({ 'num': 1,  'size': 5 }).then(res => {
        if (res.code == SUCCESS_OK) {
          console.log(res)
          this.resortList = res.result.list;
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
  .warp{
    width: 100%;
    height: 100%;
  }
  .staff{
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    height: 1.94rem;
    padding-left: 0.26rem;
  }
  .staff .staff-img{
    width: 1.26rem;
    height: 1.26rem;
    margin:  0.36rem 0  0.32rem 0;
    /*padding: 0.36rem 0  0.32rem 0;*/
  }
  .staff .staff-img img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .staff-contact{
    width: 5.19rem;
    height: 1.94rem;
    padding: 0.36rem 0.26rem  0.32rem 0;
    border-bottom: 0.01rem solid #E2E3E4;
  }
  .staff-contact .staff-post{
    display: flex;
    justify-content: space-between;
  }
  .staff-contact .staff-post .dialing{
    display: inline-block;
    width: 0.36rem;
    height: 0.36rem;
    background: url("../../assets/images/resorticon2x.png") no-repeat;
    background-size: 100% 100%;
  }
  .staff-contact .staff-post p{
    font-size: 0.34rem;
    color: #030303;
  }
  .staff-contact .staff-phone{
    font-size: 0.28rem;
    color: #A1A1A1;
    text-align: left;
    margin-top: 0.20rem;
  }
</style>
