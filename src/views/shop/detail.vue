<template>
  <div class="warp">
    <div class="body-container">
      <!--上方div-->
      <div class="top-container">
        <!--滑动图-->
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide">
              <img src="../../assets/images/details/detail.png" alt="">
            </div>
            <div class="swiper-slide">
              <img src="../../assets/images/details/detail.png" alt="">
            </div>
            <div class="swiper-slide">
              <img src="../../assets/images/details/detail.png" alt="">
            </div>
            <div class="swiper-slide">
              <img src="../../assets/images/details/detail.png" alt="">
            </div>
            <div class="swiper-slide">
              <img src="../../assets/images/details/detail.png" alt="">
            </div>
          </div>
          <!-- Add Pagination -->
          <div class="swiper-pagination"></div>
        </div>
        <!--商品信息-->
        <div class="detail-info">
          <p class="info-name">{{product.productsName}}</p>
          <p class="info-price">¥{{product.productsPrice}}</p>
          <div class="info-buy">
            <div>
              <span>运费</span>
              <span>{{product.productsFreight}}</span>
            </div>
            <div>
              <span>月销</span>
              <span>{{product.productsOrder}}</span>
              <span>笔</span>
            </div>
          </div>
        </div>
        <!--收货地址-->
        <div class="detail-address" >
          <span>收货地址</span>
          <span @click="jump('/member/setAddress')">
                <span>重庆市 渝北区 泰山大道23号7栋</span>
                <i class="arrow"></i>
            </span>
        </div>
      </div>
      <!--下方div-->
      <div class="info-img">
        <div class="detail-img">
          <i>
            <img src="../../assets/images/details/detail@2x.png" alt="">
          </i>
        </div>
        <div v-html="product.productsContext">
        </div>
      </div>
    </div>
    <div class="buy">
      <div>
        <div class="isCollect" @click="collect(0)" v-if="isCollect===1">
          <i>
            <img src="../../assets/images/details/collect@2x.png" alt="">
          </i>
          <p>已收藏</p>
        </div>
        <div class="isCollect"  @click="collect(1)" v-if="isCollect===0">
          <i>
            <img src="../../assets/images/details/collect1@2x.png" alt="">
          </i>
          <p>未收藏</p>
        </div>
      </div>
      <div>
        <span @click="jump('orderConfirm', id)">立即购买</span>
      </div>
    </div>

  </div>
</template>
<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'
  import { mapGetters } from 'vuex'
  export default {
    name: 'detail',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        type: 1,
        product: {},
        isCollect: 0,
        collectionType: 0
      }
    },
    computed: {
      ...mapGetters(['getProductId'])
    },
    methods: {
      jump: function(url) {
        this.$router.push({ path: url });
      },
      carousel: function() {
        new Swiper('.swiper-container', {
          pagination: '.swiper-pagination',
          paginationType: 'fraction',
          resistanceRatio: 0
        })
      },
      collect(num) {
        this.isCollect = num;
        if (num === 1) {
          this.$api.post('/back/collection/insertCollection', JSON.stringify({ businessId: this.getProductId, collectionType: this.collectionType })).then(res => {
          })
        } else if (num === 0) {
          this.$api.post('/back/collection/deleteCollection', JSON.stringify({ ids: this.getProductId })).then(res => {
          })
        }
      }
    },
    created() {
      this.$api.get('/merchantProducts/mobile/selectMerchantProductsById', { id: this.getProductId }).then(res => {
        this.product = res.result;
        this.isCollection = res.result.isCollection;
        this.$nextTick(() => {
          this.carousel()
        })
      });
    }

  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .body-container{
    width: 100%;
    background: #eee;
    padding: 0 ;
  }
  .top-container{
    width: 100%;
  }
  .swiper-container {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }
  .swiper-pagination{
    margin-left: 88%;
    width: 10%;
    color: #fff;
    background: #0a0a0a;
    opacity: 0.5;
  }
  .swiper-slide img{
    width: 100%;
    height:4.23rem;
    display: block;
    overflow: hidden;
  }
  .top-container{
    margin-bottom: 0.2rem;
  }
  .detail-info{
    background: #fff;
    padding: 0.2rem 0.24rem;
  }
  .info-name{
    font-size: 0.28rem;
    text-align: left;
  }
  .info-price{
    font-size: 0.37rem;
    color: #FE4B27;
    text-align: left;
  }
  .info-buy{
    width: 100%;
    display: flex;
    justify-content: start;
    align-items: center;
  }
  .info-buy div:nth-child(2){
    margin-left: 25%;
  }
  .info-buy span{
    font-size: 0.21rem;
    color: #D1D1D1;
  }
  .info-img{
    background: #fff;
    width: 100%;
    text-align: center;
    padding: 0.4rem 0;
  }
  .detail-img{
    width: 100%;
    height: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.3rem;
  }
  .detail-img>i{
    width: 3rem;
    height: 100%;
  }
  .detail-img>i>img{
    width: 100%;
    height: 100%;
  }
  .detail-address{
    background: #fff;
    width: 100%;
    height: 1rem;
    display: flex;
    justify-content: space-between;
    margin: 0.2rem 0;
    align-items: center;
    padding: 0 0.24rem;
    text-align: left;
  }
  .detail-address span{
    font-size: 0.3rem;
  }
  .detail-address>span:first-child{
    display: inline-block;
    width: 42%;
  }
  .detail-address span:nth-child(2){
    width: 58%;
    font-size: 0.22rem;
    color: #BEBEBE;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .detail-address span:nth-child(2) span{
    display: inline-block;
    font-size: 0.25rem;
    width: 90%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .arrow{
    display: inline-block;
    width: 0.1rem;
    height: 0.2rem;
    background: url("../../assets/images/map/arrow@2x.png") no-repeat center right;
    background-size: cover;
  }
  .buy,.buy>div{
    display: flex;
    align-items: center;
    height: 1rem;
  }
  .buy{
    position: fixed;
    bottom: 0;
    justify-content: flex-end;
    width: 100%;
    background: #fff;
  }
  .buy>div:first-child{
    width: 40%;
    color: #999999;
    flex-direction: column;
    justify-content: flex-end;
  }
  .isCollect>i{
    display: inline-block;
    width: 0.36rem;
    height: 0.36rem;
  }
  .isCollect>i>img{
    width: 100%;
    height: 100%;
  }
  .buy>div:last-child{
    justify-content: center;
    width: 60%;
    height: 100%;
    background: #FFBA02;
    color: #fff;
    font-size: 0.35rem;
  }


</style>
