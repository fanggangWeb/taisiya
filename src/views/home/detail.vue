<template>
  <div class="warp">
    <div class="body-container">
      <!--上方div-->
      <div class="top-container">
        <!--滑动图-->
        <div class="swiper-container">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(pic, index) of picUrls" :key="index">
              <img :src="pic" alt="">
            </div>
          </div>
          <!-- Add Pagination -->
          <div class="swiper-pagination"></div>
        </div>
        <!--商品信息-->
        <div class="detail-info">
          <div class="info-box">
            <p class="info-name">{{product.productsName}}</p>
            <p class="info-price"><font class="price-sign">￥</font>{{product.productsPrice}}</p>
          </div>
          <div class="info-buy">
            <div>
              <span>运费</span>
              <span v-if="product.productsFreight != null">{{product.productsFreight}}</span>
              <span v-if="product.productsFreight == null">0</span>
            </div>
            <div>
              <span>月销</span>
              <span>{{product.monthlySales}}</span>
              <span>笔</span>
            </div>
          </div>
        </div>
      </div>
      <!--下方div-->
      <div class="info-img">
        <div class="detail-title">
          <img class="detail-title-img" src="../../assets/images/productDetail2x.png" alt="">
        </div>
        <div v-html="product.productsContext">
        </div>
      </div>
    </div>
    <div class="buy">
      <div class="collection">
        <div class="isCollect" @click="collect(0)" v-if="isCollect===1">
          <i>
            <img src="../../assets/images/details/collect@2x.png" alt="">
          </i>
          <p>取消</p>
        </div>
        <div class="isCollect"  @click="collect(1)" v-if="isCollect===0">
          <i>
            <img src="../../assets/images/details/collect1@2x.png" alt="">
          </i>
          <p>收藏</p>
        </div>
      </div>
      <div>
        <span @click="jump('orderConfirm')">立即购买</span>
      </div>
    </div>

  </div>
</template>
<script>
  import Swiper from 'swiper'
  import 'swiper/dist/css/swiper.min.css'
  import { mapGetters, mapMutations } from 'vuex'
  import { selectMerchantProductsById, insertCollection, deleteCollection } from '@/utils/lkfetch'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'detail',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        type: 1,
        product: {},
        isCollect: 0,
        collectionType: 1,
        picUrls: {}
      }
    },
    computed: {
      ...mapGetters(['getProductId', 'getAddressId', 'getIsChoose', 'getAddress'])
    },
    methods: {
      ...mapMutations(['couponType', 'addressId', 'address', 'addressName', 'addressTel']),
      jump: function(url) {
        this.$router.push({ path: url });
        this.couponType(0)
      },
      carousel: function() {
        new Swiper('.swiper-container', {
          pagination: '.swiper-pagination',
          paginationType: 'fraction',
          resistanceRatio: 0
        })
      },
      // 收藏、取消收藏
      collect(num) {
        this.isCollect = num;
        if (num === 1) {
          insertCollection({ businessId: this.getProductId, collectionType: this.collectionType }).then(res => {
            if (res.code == SUCCESS_OK) {
              this.showAlert('收藏商品成功');
            } else {
              this.showAlert('网络错误');
            }
          })
        } else if (num === 0) {
          deleteCollection({ ids: this.getProductId }).then(res => {
            if (res.code == SUCCESS_OK) {
              this.showAlert("取消收藏成功")
            } else {
              this.showAlert('网络错误')
            }
          })
        }
      }
    },
    created() {
      // 根据商品Id查询商品
      selectMerchantProductsById({ id: this.getProductId }).then(res => {
        if (res.code == SUCCESS_OK) {
            console.log(res);
          this.product = res.result;
          this.isCollection = res.result.isCollection;
          this.picUrls = res.result.listPicUrl;
          if (res.result.isCollection === '1') {
            this.isCollect = 1
          } else {
            this.isCollect = 0
          }
          this.$nextTick(function() {
            this.carousel()
          })
        } else {
          this.showAlert('连接错误')
        }
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
    border-radius: 10px;
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .info-box{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .info-name{
    line-height: 0.4rem;
    font-size: 0.28rem;
    text-align: left;
  }
  .info-price{
    height: 0.6rem;
    line-height: 0.6rem;
    font-size: 0.4rem;
    color: #FE4B27;
    text-align: left;
    margin-top: 4px;
  }
  .price-sign{
    font-size: .2rem;
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
    padding: 0.4rem 0 1rem 0;
  }
.detail-title{
    width: 100%;
    height: .3rem;
    margin: 0 auto;
    margin-bottom: .3rem;
  }
 .detail-title .detail-title-img{
   width: 3rem;
   height: .28rem;
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
    border-top: #e3dada 0.5px solid;
    flex-direction: column;
    justify-content: flex-end;
  }
  .collection{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .isCollect{
    height: 0.9rem;
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
