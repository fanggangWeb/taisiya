<template>
  <div class="warp">
    <cube-index-list ref="indexList" :options="options"  @pulling-up="onPullingUp" @pulling-down="onPullingDown">
        <div class="sell-box">
          <div class="seller-img">
            <div class="swiper-container">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="pic of picUrls">
                  <img :src="pic" alt="">
                </div>
              </div>
              <div class="swiper-pagination"></div>
            </div>
            <!--<img class="" src="../../assets/images/sellerImg.png" alt="">-->
          </div>
          <div class="detail-info">
            <div class="sell-info">
              <h2 class="sell-name">{{seller.businessName}}</h2>
              <div class="sell-location" @click="location(seller.lng,seller.lat)">
                <img src="../../assets/images/location2x.png" alt="">
                <p>{{seller.businessAddress}}</p>
              </div>
            </div>
            <div class="sell-contact" >
              <img src="../../assets/images/phone2x.png" alt="" @click="call(seller.businessPhone)" />
            </div>
          </div>
        </div>
        <div class="sell-detail">
          <div class="detail-title">
            <img class="detail-title-img" src="../../assets/images/sellerDetails2x.png" alt="">
          </div>
          <div class="show-position"  v-html="seller.businessContext">
          </div>
        </div>
        <div class="sell-product">
          <div class="sell-title-box">
            <h3 class="sell-title">商家产品</h3>
          </div>
          <div class="scroll-container">
            <cube-index-list-item  v-for="(item, index) in productList" :key="index">
            <!--商家产品列表------start-->
                <div class="product-item" @click="jump('detail',item.id)">
                  <div class="product-box">
                    <div class="product-img">
                      <a href="javascript:;"  v-for="(tmp,index2) in item.listPicUrl" v-if="index2===0" >
                        <img :src="tmp" alt=""/>
                      </a>
                    </div>
                    <div class="product-info">
                      <div class="sell-product">
                        <p class="product-title"  v-if="item.productsName.length <= 13" >{{item.productsName}}</p>
                        <p class="product-title"  v-if="item.productsName.length > 13" >{{item.productsName.slice(0,13)}}...</p>
                        <span class="product-price"><font class="price-sign">￥</font>{{item.productsPrice}}</span>
                      </div>
                      <div class="sell-operate">
                        <!--&gt;-->
                        <img src="../../assets/images/go-icon.png" alt="">
                      </div>
                    </div>
                  </div>
                </div>
            </cube-index-list-item>
            <!--商家列表------end-->
          </div>
        </div>
    </cube-index-list>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { selectBusinessById, selectMerchantProductsList } from '@/utils/lkfetch'
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'sellerDetails',
    data() {
      return {
        imgs: [],
        seller: {},
        details: [],
        productList: [],
        picUrls: [],
        hasNext:true,
        pullDownRefresh: '',
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
        num:1,
        size:3
      }
    },
    computed: {
      ...mapGetters(['getSellerId'])
    },
    methods: {
      location: function(lng, lat) {
        this.lat(lat)
        this.lng(lng)
        this.$router.push({ path: '/map/walk' });
      },
      ...mapMutations(['productId', 'lng', 'lat', 'sellerName']),
      jump: function(url, id) {
        this.productId(id);
        this.sellerName(this.seller.businessName)
        this.$router.push({ path: url });
      },
      // 调用手机联系人接口
      call: function(tel) {
        window.location.href = 'tel:' + tel
      },
      carousel: function() {
        new Swiper('.swiper-container', {
          pagination: '.swiper-pagination',
          paginationType: 'fraction',
          resistanceRatio: 0
        })
      },
      onPullingDown() {
        // Mock async load.
        setTimeout(() => {
          // Update data.
          this.update();
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      onPullingUp() {
        // Mock async load.
        setTimeout(() => {
          // if (this.hasNext === true) {
          //     this.loadMore(1);
          // } else {
          //   this.showAlert("已为您加载全部数据");
          // }
          this.loadMore(1)
          this.$refs.indexList.forceUpdate()
          //   // }
        }, 1000)
      },
      // 上拉加载更多商品
      loadMore(pno) {
        this.num += pno;
        selectMerchantProductsList({ num: this.num, size: this.size, businessId: this.getSellerId }).then(res => {
           // console.log(res);
          if (res.code === SUCCESS_OK) {
            if (res.result.total <= this.productList.length) {
              this.showAlert('已为您加载全部数据')
            } else {
              this.productList = this.productList.concat(res.result.list);
            }
          } else {
            this.showAlert('网络错误');
          }
        })
      },
      update() {
        this.num = 1;
        this.productList = []
        this.loadMore(0)
      },
      showImagePreview() {
        this.$createImagePreview({
          imgs: this.imgs
        }).show()
      },
      init: function() {
        // 初始化组件
        /* eslint-disable no-undef*/
        // var timer = null
        var myThis = this
        $('body').on('click', '.show-position img', function() {
          myThis.imgs[0] = $(this).attr('src')
          myThis.showImagePreview()
          $('.cube-image-preview-counter').hide()
        })
      }
    },
    created: function() {
      /* 请求数据 */
      // 根据商家id查询商家详情
      selectBusinessById({ id: this.getSellerId }).then(res => {
        if (res.code === SUCCESS_OK) {
       //   console.log(res)
          this.seller = res.result;
          this.details = res.result.listPic
          this.picUrls = res.result.picUrl
          this.num = 1
          /* 获取商家商品列表(默认加载第一页)*/
          this.loadMore(0)
          this.$nextTick(function() {
            this.carousel()
          })
        } else {
          this.showAlert(res.error);
        }
      });
      this.init()
    }
  }
</script>

<style scoped>
  .warp{
    background: #F4F4F4;
    text-align: left;
  }
  .sell-box{
    width: 100%;
  }
  .sell-box .seller-img {
    width: 100%;
    height: 4.24rem;
  }
  .seller-img img{
    width: 100%;
    height: 4.24rem;
  }
  .detail-info{
    background: #fff;
    height: 1.62rem;
    padding: 0.39rem 0 0.38rem 0.26rem  ;
    display: flex;
    justify-content: space-between;
  }
  .sell-info{
    float: left;
    border-right: 0.01rem solid #E1E1E1;
    width: 5.74rem;
    /*width: 76.5%;*/
    height: 1rem;
  }
  .sell-info .sell-name{
    font-size: 0.4rem;
    color: #000;
    text-align: left;
  }
  .sell-info .sell-location{
    width: 4.7rem;
    font-size: 0.4rem;
    color: #000;
    display: flex;
    justify-content:space-between;
    align-items: center;
    height: 0.4rem;
  }
  .sell-info .sell-location img{
    width: 0.2rem;
    height: 0.2rem;
  }
  .sell-info .sell-location p{
    width: 4.4rem;
    font-size: 12px;
    color: #ABABAB;
    height: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 16px;
  }
  .sell-contact{
    width: 23.5%;
    /*width: 1.48rem;*/
    height: 1rem;
    display: flex;
    justify-content:center;
    align-items: center;
  }
  .sell-contact img{
    width: 0.33rem;
    display: inline-block;
  }
  .sell-detail{
    margin-top: 0.1rem;
    padding-bottom: 0.45rem;
    width: 100%;
    background: #fff;
  }
  .sell-detail::before{
    content: '';
    display: table;
  }
  .sell-detail .detail-title{
    width: 1.86rem;
    height: 0.6rem;
    margin: 0 auto;
    margin-top: 0.24rem;
  }
  .sell-detail .detail-title .detail-title-img{
    width:100%;
  }

  .sell-detail .show-position{
    padding:0 0.5rem 0 0.52rem;
    margin-top: 0.28rem;

  }
  .sell-detail .show-position .part-position{
    font-size: 0.26rem;
    color: #333;
    text-align: left;
    line-height: 0.4rem;
    margin-bottom: 0.1rem;
  }
  .sell-detail .show-position .pisition-img{
    display: block;
    width:100%;
  }

  .sell-product{
    margin-top: 0.2rem;
    width: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .sell-product .sell-title-box{
    /*padding: 0 0.26rem 0 0.26rem;*/
    border-bottom: 0.01rem solid #ddd;
  }
  .sell-product .sell-title{
    width: 100%;
    font-size: 0.3rem;
    font-weight: 800;
    color: #000;
    text-align: left;
    padding:0.24rem 0.26rem;
  }
  /*商品列表展示区大小*/
  .scroll-container{
    width: 100%;
    /*height: 5.2rem;  !*5列高度为8.65rem*!*/
  }
  .sell-product .product-item{
    width: 100%;
    background: #FFF;
  }
  .sell-product .product-item .product-box{
    margin-left: 0.26rem;
    padding: 0.24rem 0.4rem 0.24rem 0;
    border-bottom: 0.01rem solid #ddd;
    display: flex;
    justify-content: space-between;
  }
  .sell-product .product-item .product-box:after{
    content: "";
    display: block;
    clear: both;
  }
  .sell-product .product-item .product-box .product-img{
    width: 1.1rem;
    height: 1.1rem;
    float: left;
  }
  .sell-product .product-item .product-box .product-img a {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
  .sell-product .product-item .product-box .product-img img{
    width: 100%;
    height: 100%;
  }
  .sell-product .product-item .product-box .product-info{
    float: left;
    width: 83.5%;
    padding-left: 0.2rem;
    display: flex;
    justify-content: space-between;
  }
  .sell-product .product-item .product-box .product-info .sell-product{
    width:90%;
    text-align: left;
    margin: 0;
  }
  .sell-product .product-box .product-info .product-title{
    font-size: 0.32rem;
  }
  .sell-product .product-item .product-info .product-price{
    font-size: 0.4rem;
    color: #EC4747;
  }
  .sell-product .product-item .product-info .price-sign{
    font-size: .26rem;
  }
  .sell-product .product-item  .product-info .sell-operate{
    width: 10%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .sell-product .product-item  .product-info .sell-operate img{
    width: 0.13rem;
  }


</style>
