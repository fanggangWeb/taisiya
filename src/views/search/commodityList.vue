<template>
  <div class="sell-product">
    <h3 v-if="isData" style="margin-top: 20px">暂无更多数据~</h3>
    <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
      <cube-index-list-item  v-for="(item, index) in productList" :key="index">
        <div class="product-item" @click="jump(item)">
          <div class="product-box">
            <div class="product-img">
              <a href="javascript:;">
                <img  :src="tmp" v-for="(tmp,index2) in item.listPicUrl"  v-if="index2===0">
                <!--<img src="../../assets/images/product.png" alt=""/>-->
              </a>
            </div>
            <div class="product-info">
              <div class="sell-product">
                <p class="product-title">{{item.productsName}}</p>
                <span class="product-price">￥{{item.productsPrice}}</span>
              </div>
              <div class="sell-operate">
                <img src="../../assets/images/go-icon.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </cube-index-list-item>
    </cube-index-list>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { getSearchProductList } from '@/api/member'
const SUCCESS_OK = 'rest.success'
export default {
  data() {
    return {
      isData: false,
      num: 1,
      size: 10,
      productList: [],
      pullDownRefresh: '',
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
    ...mapGetters(['getsearchValue', 'getSearchLabelId'])
  },
  methods: {
    ...mapMutations(['productId']),
    jump(item) {
      console.log(item)
      // mutations存储id，然后跳转页面
      this.productId(item.id)
      this.$router.push({ path: '/home/detail' })
    },
    // 下拉刷新
    onPullingDown() {
      // Mock async load.
      this.num = 1
      setTimeout(() => {
        this._getSearchProductList()
        this.$refs.indexList.forceUpdate()
      }, 1000)
    },
    // 上滑加载更多
    onPullingUp() {
      this.num++
      // Mock async load.
      setTimeout(() => {
        getSearchProductList(this.num, this.size, this.getsearchValue, this.getSearchLabelId).then(res => {
        if (res.code == SUCCESS_OK) {
          if (res.result.total <= this.productList.length) {
            this.showAlert('已为您加载全部数据')
          } else {
             this.productList = this.productList.concat(res.result.list)
          }
        } else {
          this.showAlert('连接数据库出错')
        }
      })
        this.$refs.indexList.forceUpdate()
      }, 1000)
    },
    // 获取商品列表
    _getSearchProductList() {
      getSearchProductList(this.num, this.size, this.getsearchValue, this.getSearchLabelId).then(res => {
        if (res.code == SUCCESS_OK) {
          // console.log(res)
          this.productList = res.result.list
          if (res.result.list.length < 1) {
            this.isData = true
          } else {
            this.isData = false
          }
        } else {
          this.showAlert('连接数据库出错')
        }
      })
    }
  },
  mounted() {
    this._getSearchProductList()
  }
}
</script>
<style scoped>
.sell-product {
  width: 100%;
  height: 100%;
}
.sell-product .product-item{
    background: #F4F4F4;
    text-align: left;
    width: 100%;
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
    /*width: 16%;*/
    width: 16.5%;
    float: left;
  }
  .sell-product .product-item .product-box .product-img img{
    width: 100%;
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
    font-size: 14px;
    line-height: 20px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .sell-product .product-item .product-info .product-price{
    font-size: 0.4rem;
    color: #EC4747;
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
