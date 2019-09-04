<template>
  <div class="warp">
    <div class="coupon-navbar">
        <span :class="{'active':type === 1}"  @click="couponType(1)">未使用</span>
        <span :class="{'active':type === 2}" @click="couponType(2)">已使用</span>
        <span :class="{'active':type === 3}" @click="couponType(3)">已过期</span>
    </div>
    <div v-if="isData" style="margin-top:12px">您还没有优惠券哟~</div>
    <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
      <cube-index-list-item v-for="(item, index) in couponList" :key="index">
        <div class="coupon-item" :class="{'item-made':(type === 2 || type === 3),'item-nomade':type === 1}"  >
          <div class="coupon-info">
            <p>优惠劵号</p>
            <p class="coupon-num">{{item.conpouNumber}}</p>
            <p v-if="item.useConditions" class="cunpon-limit">满￥{{item.useConditions}}可用</p>
          </div>
          <div class="coupon-value">
            <p class="coupon-money">
              <span class="money-symbols">￥</span>
              <span class="money-num">{{item.faceValue}}</span>
            </p>
            <p class="coupon-date">{{item.createTime}}至</p>
            <p class="coupon-date">{{item.validityTime}}使用</p>
          </div>
        </div>
      </cube-index-list-item>
    </cube-index-list>
  </div>
</template>
<script>
  import { selectConpouUserList } from '@/utils/wfetch'
  const SUCCESS_OK = "rest.success"
  // v-if="item.isUsing === '0',item.isValidity === '0'"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        type: 1,
        isData: false,
        couponList: [],
        num:  1,
        size: 5,
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
        },
        isUseing: 0,
        isValidity: 0
      }
    },
    methods: {
      _selectConpouUserList: function(params) {
        // 请求数据
        selectConpouUserList(params).then(res => {
          console.log(res)
          if (res.code == SUCCESS_OK) {
            this.couponList = res.result.list;
            if (res.result.list.length < 1) {
              this.isData = true
            } else {
              this.isData = false
            }
            if (res.result.isLastPage) {
              this.nextUpLoad = false;
            } else {
              this.nextUpLoad = true;
            }
          } else {
            this.showAlert('网络故障');
          }
        });
      },
      couponType: function(num) {
        this.couponList = []
        this.type = num;
        if (num === 1) {
          this.isUseing = 0;
          this.isValidity = '';
        } else if (num === 2) {
          this.isUseing = 1;
          this.isValidity = 0;
        } else {
          this.isUseing = 0;
          this.isValidity = 1;
        }
        this.num = 1;
        this.nextUpLoad = true;
        var  params = {}
        if (num === 2) {
          // 请求数据
           params = { num: this.num, size: this.size, isUseing:this.isUseing }
        } else {
          params = { num: this.num, size: this.size, isUseing:this.isUseing, isValidity:this.isValidity }
        }
        // 请求数据
        this._selectConpouUserList(params)
      },
      onPullingDown() {
        setTimeout(() => {
          this.num = 1;
          // 请求数据
          const params = { num: this.num, size: this.size, isUseing:this.isUseing, isValidity:this.isValidity }
          this._selectConpouUserList(params)
          // Call forceUpdate after finishing data load.
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      onPullingUp() {
        setTimeout(() => {
            this.num++;
            this.updateList = [];
            // 请求数据
            var  params = {}
            if (this.type === 2) {
              // 请求数据
              params = { num: this.num, size: this.size, isUseing:this.isUseing }
            } else {
              params = { num: this.num, size: this.size, isUseing:this.isUseing, isValidity:this.isValidity }
            }
            selectConpouUserList(params).then(res => {
              if (res.code == SUCCESS_OK) {
                if (res.result.total <= this.couponList.length) {
                  this.showAlert('已为您加载全部数据')
                } else {
                  this.couponList = this.couponList.concat(res.result.list);
                }
              } else {
                this.showAlert('网络故障');
              }
            })
          this.$refs.indexList.forceUpdate()
        }, 1000)
      }
    },
    created: function() {
      const params = { num: this.num, size: this.size, isUseing:this.isUseing, isValidity:this.isValidity }
      this._selectConpouUserList(params)
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .warp{
    width: 100%;
    height: 100%;
  }
  .coupon-navbar{
    display: flex;
    justify-content: space-around;
    span{
      display: inline-block;
      width: 1.26rem;
      height: 0.48rem;
      text-align: center;
      line-height: 0.48rem;
      font-size: 0.26rem;
      color: #333;
      margin: 0.2rem 0;
    }
    .active{
      background: url("../../assets/images/selected2x.png") no-repeat;
      background-size:100% 100% ;
      color: #FFDA00;
    }
  }

/*  .coupon-list{
    width: 100%;*/
    .coupon-item{
      margin: 0 auto;
      width: 7.1rem;
      height: 2.4rem;
      margin-bottom: 0.61rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .coupon-info{
        width: 3.7rem;
        height: 1.7rem;
        padding:0.1rem  0.1rem 0.2rem 0.8rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
          p{
            color: #030303;
            font-size: 12px;
            line-height: 20px;
            height: 20px;
            text-align: left;
          }
        .coupon-num{
          font-size: 16px;
          margin-top: 5px;
        }
        .cunpon-limit{
          font-size: 12px;
          margin-top: 5px;
        }
      }
      .coupon-value{
        width: 2.3rem;
        height: 2.1rem;
        padding: 0.1rem 0 0.2rem 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .coupon-money{
          color: #010101;
          overflow: hidden;
          white-space: nowrap;
          width: 100%;
          text-overflow: ellipsis;
          .money-symbols{
            font-size: 0.3rem;
          }
          .money-num{
            font-size: 0.7rem;
            font-weight: 600;
            line-height: 0.7rem;
          }
        }
        .coupon-date{
          width: 100%;
          padding-left: 10%;
          text-align: left;
          font-size: 12px;
          color: #6B6B6B;
        }
      }
    }

    .item-nomade{
      background:url("../../assets/images/coupon2x.png") no-repeat;
      background-size: 100% 100%;
    }
    .item-made{
      background:url("../../assets/images/grayCounpon2x.png") no-repeat;
      background-size: 100% 100%;
    }

</style>
