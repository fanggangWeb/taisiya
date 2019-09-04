<template>
  <div class="warp">
    <div v-show="isData" style="text-align:center;margin-top:12px">您还没有收藏商品哟~</div>
    <ul class="list-container">
      <li class="list-item " v-for="item in collectionList" :key="item.id" data-type="0">
        <div class="list-box" @touchstart.capture="touchStart" @touchend.capture="touchEnd" @click="skip(item)">
          <div class="goods-item">
            <div class="goods-img">
              <img :src="item.listPicUrl[0]" alt=""/>
            </div>
            <div class="goods-info">
              <div class="goods-title">
                <p>{{item.businessName}}</p>
              </div>
              <div class="goods-price">
                <span v-if="item.price" class="price-currency">¥</span>
                <span class="price-num">{{item.price}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="delete" @click="deleteItem(item.businessId)">删除</div>
      </li>
    </ul>
  </div>
</template>
<script>
  import { deleteCollection } from '@/utils/wfetch'
  import { getCollectList } from '@/api/member'
  import { mapMutations } from 'vuex'
  import qs from 'qs'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'index',
    data() {
      return {
        isData: false,
        collectionList:[],
        collectionList1:[{
          businessName:' Sk-ii sk2前男友面膜skii补水面膜面部护肤精华贴H',
          businessId: '9a2d1075da424822bd6821a0fddf97dd',
          productsPrice:'3600'
        }],
        startX : 0,
        endX : 0
      }
    },
    methods: {
      ...mapMutations(['productId']),
      // 跳转
      skip(item) {
        if (this.checkSlide()) {
          this.restSlide();
        } else {
          this.productId(item.businessId)
          this.$router.push({ path: '/home/detail' })
        }
      },
      // 滑动开始
      touchStart(e) {
        // 记录初始位置
        this.startX = e.touches[0].clientX;
      },
      // 滑动结束
      touchEnd(e) {
        // 当前滑动的父级元素
        var parentElement = e.currentTarget.parentElement;
        // 记录结束位置
        this.endX = e.changedTouches[0].clientX;
        // 左滑
        if (parentElement.dataset.type == 0 && this.startX - this.endX > 30) {
          this.restSlide();
          parentElement.dataset.type = 1;
        }
        // 右滑
        if (parentElement.dataset.type == 1 && this.startX - this.endX < -30) {
          this.restSlide();
          parentElement.dataset.type = 0;
        }
        this.startX = 0;
        this.endX = 0;
      },
      // 判断当前是否有滑块处于滑动状态
      checkSlide() {
        var  listItems = document.querySelectorAll('.list-item');
        for (let i = 0; i < listItems.length; i++) {
          if (listItems[i].dataset.type == 1) {
            return true;
          }
        }
        return false;
      },
      // 复位滑动状态
      restSlide() {
        var listItems = document.querySelectorAll('.list-item');
        // 复位
        for (let i = 0; i < listItems.length; i++) {
          listItems[i].dataset.type = 0;
        }
      },
      // 删除
      deleteItem(id) {
        // 复位
        this.restSlide();
        // 删除
        // this.collectionList.splice(index, 1);
        let data = {
          ids:  id
        }
        data = qs.stringify(data)
        deleteCollection(data).then(res => {
          if (res.code === SUCCESS_OK) {
            this.showAlert("删除成功");
            this._getCollectList()
            // this.collectionList = res.result.list
          } else {
            this.showAlert(res.error);
          }
        });
      },
      // 获取收藏列表
      _getCollectList() {
        const data = { collectionType: 1 }
        getCollectList(data).then(res => {
          if (res.code == SUCCESS_OK) {
            // console.log(res)
            this.collectionList = res.result.list
            if (res.result.list < 1) {
              this.isData = true
            } else {
              this.isData = false
            }
          } else {
            this.showAlert(res.desc)
          }
        })
      }
    },
    created() {
      // this.collectionList = this.collectionList1;
      this._getCollectList()
    }
  }
</script>
<style scoped lang="less" scoped>
  .warp{
    width: 100%;
    overflow: hidden;
  }
  .list-container {
    overflow-y:auto;
    overflow-x:hidden;
    height: 100%;
  }
  .list-item{
    position: relative;
    -webkit-transition: all 0.2s;
    transition: all 0.2s;
    padding: .25rem 0;
    /*border-bottom:0.01rem solid #EFEFEF ;*/
    height: 2.6rem;
  }
  .list-item[data-type="0"]{
    transform: translate3d(0,0,0);
  }
  .list-item[data-type="1"]{
    transform: translate3d(-1.24rem,0,0);
  }
  .list-item:after{
    content: " ";
    position: absolute;
    left: 0.2rem;
    bottom: 0;
    right: 0;
    height: .01rem;
    border-bottom:.01rem solid  #EFEFEF ;;
    color: #ccc;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    z-index: 2;
  }
  .list-box{
    padding: 0.25rem;
    background: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    font-size: 0;
  }
  .list-item .delete{
    width: 1.24rem;
    height: 2.6rem;
    background: #ff4949;
    color: #fff;
    text-align: center;
    position: absolute;
    top:0;
    right: -1.24rem;
    margin: 0 auto;
    font-size: 0.26rem;
    line-height: 2.6rem;
  }
  .goods-item{
    width: 100%;
    display: flex;
    justify-content: space-between;
    .goods-img{
      float: left;
      width: 2.1rem;
      height: 2.1rem;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .goods-info{
      float: left;
      width: 5.2rem;
      height:2.1rem;
      padding : 0.15rem 0.3rem 0.15rem 0.2rem;
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .goods-title p{
        font-size: 13px;
        line-height: 20px;
        font-weight: bold;
        color: #727272;
        overflow:hidden; 
        text-overflow:ellipsis;
        display:-webkit-box; 
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2; 
      }
      .goods-price{
        color: #FF4A26;
        .price-currency{
          font-size: 14px;
        }
        .price-num{
          font-weight: 600;
          font-size: .4rem;
        }
      }
    }
  }
</style>
