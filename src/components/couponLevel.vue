<template>
  <!-- 优惠劵 层-->
  <div class="coupon_leave" id="coupon_leave" style="display: none" >
    <div class="panel">
      <div class="top">
        <span class="name">选择优惠券</span>
        <span class="close" @click="close">x</span>
      </div>
      <div class="coupon_list">
        <ul>
          <cube-index-list ref="indexList" :options="options"  @pulling-up="onPullingUp">
            <cube-index-list-item v-for="(item, index) in couponList"  :key="index">
              <li :class="{ active: index===currentIndex, noUse: item.useConditions>getLimitPrice }" @click="choose(item.id, item.faceValue, index, item.useConditions)">
                <div class="fl">
                  <span class="price">￥{{item.faceValue}}<span v-if="item.useConditions" class="condition">满￥{{item.useConditions}}可用</span></span>
                  <p class="">优惠劵号  {{item.conpouNumber}}</p>
                  <p class="">有效期限  {{item.createTime}}至 {{item.validityTime}}</p>
                </div>
                <div class="fr">
                  <i v-if="item.useConditions<=getLimitPrice" class="choice"><img src="../assets/images/coupon_icon.png"/></i>
                  <i v-if="item.useConditions>getLimitPrice" class="choice"><img src="../assets/images/coupon_icon.jpg"/></i>
                </div>
              </li>
            </cube-index-list-item>
          </cube-index-list>
        </ul>
      </div>
      <div class="coupon_foot">
        <button class="btn" @click="sureUse(couponNumber, faceValue)">确认使用</button>
      </div>
    </div>
  </div>
</template>
<script>

  import { selectConpouUserListByMoble } from '@/utils/lkfetch'
  import { mapGetters, mapMutations } from 'vuex'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'orderConfirm',
    props:{ couponType: Number },
    data() {
      return {
        currentIndex: -1,
        couponNumber: 0,
        faceValue: 0,
        params: {
          num: 1,
          size: 5,
          // businessId: 0, // 商家id，暂时不传
          couponType: 0, // 优惠券种类，暂时不传
          isUseing: 0, // 0未使用，1已使用
          isValidity: 0 // 0未过期 1已过期
        },
        couponList: [
          // { faceValue: 200, couponId:'1221111223', createTime:'2018-01-01', validityTime:'2018-02-02', isUsing: 0, isValidity: 0 }
        ],
        hasNext:true,
        options: {
          pullUpLoad:  {
            txt: {
              more: '没有更多数据'
            }
          }
        }
      }
    },
    computed: {
      ...mapGetters(['getSellerId', 'getCouponType', 'getLimitPrice'])
    },
    methods: {
      ...mapMutations(['couponFaceValue', 'couponId', 'couponLimit']),
      close: function() {
        $('#coupon_leave').hide();
      },
      reset() {
        this.currentIndex = -1
      },
      choose(couponId, faceValue, index, useConditions) {
        if (useConditions <= this.getLimitPrice) {
          this.currentIndex = index
          this.couponNumber = couponId
          this.faceValue = faceValue
          this.couponLimit(useConditions)
        } else {
          this.couponId('')
          this.couponFaceValue(0)
        }
      },
      sureUse(couponNumber, faceValue) {
        this.couponId(couponNumber)
        this.couponFaceValue(faceValue)
        $('#coupon_leave').hide();
      },
      onPullingDown() {
        // Mock async load.
        this.params.num = 1
        this.params.couponType = this.couponType
        setTimeout(() => {
          this._selectConpouUserListByMoble()
        }, 1000)
      },
      // 默认加载全部列表数据
      _selectConpouUserListByMoble() {
        this.params.couponType = this.couponType
        selectConpouUserListByMoble(this.params).then(res => {
          if (res.code == SUCCESS_OK) {
            this.couponList = res.result.list
            this.$refs.indexList.forceUpdate()
          } else {
            this.showAlert(res.desc)
          }
        })
      },
      onPullingUp() {
        // Mock async load.
        this.params.num++
        this.params.couponType = this.couponType
        setTimeout(() => {
          selectConpouUserListByMoble(this.params).then(res => {
            if (res.result.total <= this.couponList.length) {
              this.showAlert('已加载全部数据')
            } else {
              this.couponList = this.couponList.concat(res.result.list);
              this.$refs.indexList.forceUpdate()
            }
          })
        }, 1000)
      }
    },
    created() {
      this._selectConpouUserListByMoble()
    }
  }
</script>
<style scoped lang="less">
  .coupon_leave{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    background: rgba(0,0,0,.3);
    z-index: 1;
    .panel{
      width: 100%;
      height: 9.6rem;
      position: absolute;
      left: 0;
      bottom: 0;
      .top{
        display: flex;
        flex-flow: nowrap;
        align-items: center;
        justify-content: space-between;
        padding: 0  0.23rem 0.2rem 0.23rem;
        height: 1.2rem;
        background: white;
        border-radius:.2rem .2rem 0 0;
        .name {
          font-size: .32rem;
          color: #040404;
        }
        .close{
          font-size: .4rem;
          color: #040404;
        }
      }
      .coupon_list{
        display: flex;
        padding: 0 .23rem ;
        background: white;
        height: 6.5rem;
        ul{
          width: 100%;
          height: 100%;
          li{
            display: flex;
            width: 100%;
            height: 1.8rem;
            background: url("../assets/images/coupon_bg.png") no-repeat;
            background-size: 100% 100%;
            margin-bottom: .24rem;
            .fl{
              width: 5rem;
              padding:0 .23rem ;
              display: flex;
              flex-flow: wrap;
              span{
                width: 100%;
              }
              .price{
                  font-size: 20px;
                font-weight: bold;
                color: #ff005a;
                height: 30px;
                line-height: 30px;
                margin-top: 5px;
                .condition {
                  font-size: 14px;
                  margin-left: 20px;
                }
              }
              p{
                font-size: 12px;
                color: #7a2d3d;
                height: 20px;
                line-height: 20px;
              }
            }
            .fr{
              display: flex;
              width: calc(100% - 5rem);
              align-items: center;
              justify-content: center;
              i{
                width: 1.01rem;
                height: .89rem;
              }
            }
          }
          .active{
            background: url("../assets/images/coupon_ac_bg.png") no-repeat;
            background-size: 100% 100%;
          }
          .noUse{
            display: flex;
            width: 100%;
            height: 1.8rem;
            background: url("../assets/images/coupon_bg.png") no-repeat;
            background-size: 100% 100%;
            margin-bottom: .24rem;
            .fl{
              width: 5rem;
              padding:0 .23rem ;
              display: flex;
              flex-flow: wrap;
              span{
                width: 100%;
              }
              .price{
                text-align: left;
                font-size: 20px;
                font-weight: bold;
                color: #999999;
                height: 30px;
                line-height: 30px;
                margin-top: 5px;
                .condition {
                  font-size: 14px;
                  margin-left: 20px;
                }
              }
              p{
                font-size: 12px;
                color: #999999;
                height: 20px;
                line-height: 20px;
              }
            }
            .fr{
              display: flex;
              width: calc(100% - 5rem);
              align-items: center;
              justify-content: center;
              i{
                width: 1.01rem;
                height: .89rem;
              }
            }
          }
        }
      }
      .coupon_foot{
        display: flex;
        flex-flow: nowrap;
        align-items: center;
        justify-content: center;
        padding: 0 .23rem ;
        background: white;
        height: calc(100% - 1rem - 6.5rem);
        button{
          width: 6.1rem;
          height: .9rem;
          background: #ffba00;
          color: white;
          border-radius: .1rem;
          font-size: .3rem;
        }
      }
    }
  }
</style>
