<template>
  <!-- 公园详情-->
  <div class="warp">
    <!-- top search-->
    <div class="content">
        <div class="scenicSpot_top">
            <!-- <div class="img"><img src="../../assets/images/scenicsopt-img.jpg" alt=""></div> -->
          <div class="banner-list">
            <swiper style="height:100%" :options="swiperOption" v-if="bannerList.length>0"  ref="mySwiper">
              <!-- 这部分放你要渲染的那些内容 -->
              <swiper-slide v-if="bannerList.length>0" v-for="item in bannerList" :key="item.id">
                <img class="banner-img" img :src="item.picDisplay" alt=""/>
              </swiper-slide>
              <!-- 这是轮播的小圆点 -->
              <!-- <div class="swiper-pagination" slot="pagination"></div> -->
            </swiper>
            <div class="infos">
              <span class="name">{{scenicDetail.parkName}}</span>
              <span class="price"><font>￥</font>{{scenicDetail.ticket}}</span>
            </div>
          </div>
          <!-- 收藏 客服-->
          <!-- <div class="suspend_icon">
            <i class=""><img src="../../assets/images/collect-icon.png" alt=""></i>
            <i class=""><img src="../../assets/images/customer-icon.png" alt=""></i>
          </div> -->
        </div>
        <div class="bot-con">
          <div class="activity_time">
            <span>开放时间</span>
            <span>{{scenicDetail.openTime}}</span>
          </div>
          <div class="activity_address" @click="location(scenicDetail.log, scenicDetail.lat)">
          <i><img src="../../assets/images/address-icon.png" alt=""></i>
            <span>{{scenicDetail.address}}</span>
          </div>

          <!--园区详情-->
          <div class="scenicSpot_detail_list">
            <h5>园区详情</h5>
            <div v-html="scenicDetail.parkContext"></div>
          </div>
          <!--结尾提示-->
          <div class="footer">
            <span class="char">--------&nbsp;&nbsp;到底了&nbsp;&nbsp;-------</span>
          </div>
        </div>
    </div>
    <!--立即购买-->
    <div class="purchase" @click="jump('orderConfirm')">
      <span>立即购买</span>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { selectParkById } from '@/utils/lkfetch'
  import { selectBannerList } from '@/utils/wfetch'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        scenicId: 0,
        scenicDetail: {},
        bannerList: [],
        swiperOption: {
          // 是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          // notNextTick: true,
          pagination: '.swiper-pagination',
          // 所有配置均为可选（同Swiper配置）
          //
          // slidesPerView: 2,
          loop: true,
          loopAdditionalSlides:-1,
          loopedSlides :8,
          speed: 500,
          autoplay: 3000,
          autoplayDisableOnInteraction: false,
          paginationClickable: true,
          mousewheelControl: true,
          observer: true,
          observeParents: true,
          debugger: true,
          // onSlideChangeEnd: swiper => {
          //   // 这个位置放swiper的回调方法
          //   // console.log(swiper.realIndex)
          //   //  this.page = swiper.realIndex + 1;
          //   // this.index = swiper.realIndex;
          // },
          preventLinksPropagation: false   // 阻止点击事件冒泡
        }
      }
    },
    computed: {
      ...mapGetters(['getParkId']),
      swiper() {
        return this.$refs.mySwiper.swiper;
      }
    },
    methods: {
      ...mapMutations(['couponType', 'lat', 'lng']),
      // 获取轮播图的接口
      fetchBannerList() {
        const data = { bannertype: '2' }
        selectBannerList(data).then(res => {
          if (res.code === SUCCESS_OK) {
            this.bannerList = res.result.list;
            this.$nextTick(function() {
              this.swiper.slideTo(0, 0, false);
              // this.swiper1.slideTo(0, 0, false);
            })
          } else {
            this.showAlert('获取轮播图失败');
          }
        })
      },
      location: function(lng, lat) {
        this.lat(lat)
        this.lng(lng)
        this.$router.push({ path: '/map/walk' });
      },
      jump: function(url) {
        this.$router.push({ path: url });
        this.couponType(1);
      }
    },
    created() {
      this.fetchBannerList()
      selectParkById({ id: this.getParkId }).then(res => {
        if (res.code === SUCCESS_OK) {
          this.scenicDetail = res.result;
        } else {
          this.showAlert(res.error);
        }
      })
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .content {
    // display: flex;
    flex-flow: wrap;
    // justify-content: center;
    width: 100%;
    background: #f6f6f6;
    .scenicSpot_top{
      position: relative;
      width: 100%;
      height: 4.24rem;
      background: white;
      // .img{
      //   height: 4.24rem;
      //   img{
      //     width: 100%;
      //     height: 100%;
      //   }
      // }
      .banner-list{
        width: 100%;
        height: 100%;
        img{
          width: 100%;
          height: 4.24rem;
        }
      }
      .infos {
        width: 100%;
        position: relative;
        top: -1.08rem;
        // position: absolute;
        height: 1.08rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        left: 0;
        bottom: 0;
        z-index: 2;
        background: rgba(0,0,0,0.3);
        .name{
          color: white;
          font-size: .36rem;
          padding-left: .23rem;
        }
        .price{
          font-size: .4rem;
          padding-right: .23rem;
          color: #ff4a26;
          font{
            font-size: .2rem;
          }
        }
      }
      .suspend_icon{
        position: absolute;
        right: 0;
        top: .23rem;
        display: flex;
        i{
          width: .53rem;
          height: .53rem;
          margin-right: .23rem;
        }
      }
    }
    .activity_time{
      background: white;
      display: flex;
      height: 40px;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      padding: 0 .23rem;
      border-bottom: .01rem solid #f0f0f0;
      span{
        font-size: .26rem;
        color: #4d4d4d;
        &:first-child{
          color: #c3c3c3;
        }
      }
    }
    .activity_address{
      background: white;
      position: relative;
      height: 40px;
      padding: 0 .26rem;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: space-between;
      border-bottom: .01rem solid #f0f0f0;
      i{
        width: .3rem;
        height: .39rem;
      }
      span{
        position: relative;
        padding-right: .39rem;
        line-height: 19px;
        &:after{
          content:'';
          clear: both;
          position: absolute;
          right: 0;
          top: 1px;
          background: url("../../assets/images/go-icon.png") no-repeat;
          width: .16rem;
          height: .26rem;
          background-size: 100%;
        }
      }
    }

    .scenicSpot_detail_list{

      display: flex;
      flex-flow: wrap;
      width: 100%;
      position: relative;
      background: white;
      h5{
        width: 100%;
        height: 40px;
        line-height: .77rem;
        text-align: left;
        font-size: .28rem;
        color: #4d4d4d;
        font-weight: bold;
        align-items: center;
        padding-left: .33rem;
        border-bottom: .01rem solid #f0f0f0;
      }
      div {
        margin: .23rem .3rem;
        position: relative;
        width: 100%;
        margin-top: .2rem;
      }
    }
  }
  .footer{
    width: 100%;
    height: 1.35rem;
    text-align: center;
    padding: 0.5rem 0 0 0;
    background: #F4F4F4;
    margin-bottom: 1rem;
    .char{
      display: inline-block;
      font-size: 0.2rem;
      color: #8C8C8C;
    }
  }
  .purchase{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #FFBA00;
    span {
      font-size: .3rem;
      color: #ffffff;
      font-family: 'PingFang-SC-Medium';
  }
  }
</style>
