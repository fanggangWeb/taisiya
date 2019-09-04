<template>
  <!-- 点餐-->
  <div class="warp">
    <div class="content">
      <div class="food_list" v-if="this.foodLists.length>0">
        <div class="list_group">
          <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
            <cube-index-list-item v-for="(item,index) in foodLists" :key="index">
              <div class="item_food">
                <div class="img">
                  <img v-if="item.picUrlDisplay" :src="item.picUrlDisplay" alt="">
                  <img v-else src="../../assets/images/product.png" alt="">
                  <!--<img :src="item.foodimg" alt="">-->
                </div>
                <div class="text">
                  <span class="name">{{item.name}}</span>
                  <span class="price"><font>￥</font>{{item.price}}</span>
                </div>
                <div class="num_control">
                  <span class="minus" @click.stop="minusFood(index,item.id)">-</span>
                  <span class="num">{{item.num}}</span>
                  <span class="add" @click.stop="addFood(index,item.id)">+</span>
                </div>
              </div>
            </cube-index-list-item>
          </cube-index-list>
        </div>
      </div>
      <div class="suspend_icon" @click="showCart()"></div>
      <div class="cart_list">
        <span class="cart_empty">购物车空空如也</span>
          <div class="cart_item" v-for="(item,index) in foodCartList" :key="index">
            <div class="img_small">
              <!--<img :src="item.foodimg" alt="">-->
              <img :src="item.picUrlDisplay" alt="">
            </div>
            <div class="text_small">
              <span class="name_small">{{item.name}}</span>
              <span class="price_small"><font>￥</font>{{item.price * item.num}}</span>
            </div>
            <div class="num_control_small">
              <span class="minus_small" @click.stop="minusCartFood(index,item.id)"></span>
              <span class="num_small">{{item.num}}</span>
              <span class="add_small" @click.stop="addCartFood(index,item.id)"></span>
            </div>
          </div>
      </div>
    </div>
    <!-- 结算-->
    <div class="clearing">
      <span class="price"><font>￥</font>{{totalMoney.toFixed(2)}}</span>
      <button @click="jump('orderFood/buy')">去结算</button>
    </div>
  </div>
</template>
<script>
  import { selectFoodList } from '@/utils/wfetch'
  import { selectBusinessOnId } from '@/api/member'
  import { mapMutations } from 'vuex'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        foodLists: [],
        foodCartList: [],
        totalMoney: 0,
        size: 10,
        pnum: 1,
        updateList: [],
        nextUpLoad: true,
        busId: '',
        options: {
          pullDownRefresh: {
            stop: 55,
            txt: '刷新成功'
          },
          pullUpLoad:  {
            txt: {
              more: ''
            }
          }
        }
      }
    },
    methods: {
      ...mapMutations(['foodList', 'foodSellId']),
      onPullingDown() {
        this.pnum = 1
        setTimeout(() => {
          const params = { num: this.pnum, size: this.size, bussinessId: this.busId }
          selectFoodList(params).then(res => {
            if (res.code === SUCCESS_OK) {
              this.foodLists = res.result.list
              this.footNum();
            } else {
              this.showAlert('连接错误');
            }
          });
        this.$refs.indexList.forceUpdate()
        }, 1000);
      },
      onPullingUp() {
        // Mock async load.
        setTimeout(() => {
          this.num++;
          this.updateList = [];
          // 请求数据
          const params = { num: this.pnum, size: this.size, bussinessId: this.busId }
          // 查询餐点列表
          selectFoodList(params).then(res => {
            if (res.code === SUCCESS_OK) {
              if (res.result.total <= this.foodLists.length) {
                this.showAlert('已为您加载全部数据')
              } else {
                for (var i = 0; i < res.result.list.length; i++) {
                  res.result.list[i].num = 0;
                }
                this.foodLists =  this.foodLists.concat(res.result.list);
              }
            } else {
              this.showAlert('网络故障');
            }
          });
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      jump: function(url) {
        this.foodList(JSON.stringify(this.foodCartList))
        if (this.foodCartList.length > 0) {
          this.$router.push(url)
        } else {
          this.showAlert('请选择菜品')
        }
        // this.saveList()
        // 提交后清空localStorage的购物车数据
        // localStorage.setItem("foodCartList", JSON.stringify([]));
      },
      showCart: function() {
        $(".cart_list").toggle("");
         this.cartEmptyEvent()
      },
      minusFood: function(index, id) {
        var num = this.foodLists[index].num
        if (num === 0) {
          return;
        }
        num--;
        var i =  this.searchPosition(this.foodCartList, 'id', id)
        this.foodLists[index].num = num;
        if (num === 0) {
            this.foodCartList.splice(i, 1);
        } else if (num > 0 && i !== -1) {
          this.foodCartList[i].num = num;
        }
        this.total();
        this.cartEmptyEvent()
        // this.saveList()
      },
      addFood: function(index, id) {
        var num = this.foodLists[index].num
        num++;
        this.foodLists[index].num = num;
        if (num === 1) {
          this.foodCartList.push(this.foodLists[index])
        } else {
          var i =  this.searchPosition(this.foodCartList, 'id', id)
          this.foodCartList[i].num = num;
        }
        this.total();
        // this.saveList();
         this.cartEmptyEvent()
      },
      minusCartFood: function(index, id) {
        var num = this.foodCartList[index].num;
        var i =  this.searchPosition(this.foodLists, 'id', id)
        num--;
        this.foodLists[i].num = num;
        if (num === 0) {
          this.foodCartList.splice(index, 1);
        } else {
          this.foodCartList[index].num = num;
        }
        this.total();
        this.cartEmptyEvent()
        // this.saveList()
      },
      addCartFood: function(index, id) {
        var num = this.foodCartList[index].num;
        var i =  this.searchPosition(this.foodLists, 'id', id)
        num++;
        this.foodLists[i].num = num;
        this.foodCartList[index].num = num;
        this.total();
        this.saveList()
        this.cartEmptyEvent()
      },
      // 根据数组的某个字段以及值返回这个在这个数组的位置,该字段应为唯一
      searchPosition: function(arr, name, value) {
        if (arr != null) {
          for (var i = 0; i < arr.length; i++) {
            if (arr[i][name] == value) {
              return i;
            }
          }
        }
        return -1;
      },
      // 计算总金额
      total: function() {
        if (this.foodCartList === null) {
          return;
        }
        this.totalMoney = 0;
        for (var i = 0; i < this.foodCartList.length; i++) {
          this.totalMoney += this.foodCartList[i].price * this.foodCartList[i].num;
        }
      },
      // 将购物车的数据存入localStorage
     /* saveList: function() {
        if (this.foodCartList.length === 0) {
          localStorage.setItem("foodCartList", JSON.stringify([]));
        } else {
          var storage = [];
          for (var i = 0; i < this.foodCartList.length; i++) {
            storage.push(JSON.stringify(this.foodCartList[i]))
            localStorage.setItem("foodCartList", JSON.stringify(storage));
          }
        }
      },*/
      // 当购物车为空时，隐藏结算按钮，在购物车里给出提示
      cartEmptyEvent: function() {
        if (this.foodCartList.length === 0) {
          $(".cart_empty").css({ "display":"inline-block" })
          $(".clearing").css({ "display":"none" })
        } else {
          $(".cart_empty").css({ "display":"none" })
          $(".clearing").css({ "display":"flex" })
        }
      },
      //  为foodList加入字段，赋值为0
      footNum() {
        if (this.foodLists.length > 0) {
          for (var i = 0; i < this.foodLists.length; i++) {
            this.foodLists[i].num = 0;
            this.foodLists[i].foodId = this.foodLists[i].id
          }
        }
      }
    },
    created: function() {
      // 先从商家获取家的id
      selectBusinessOnId().then(res => {
        if (res.code == SUCCESS_OK) {
          this.busId = res.result
          this.foodSellId(res.result)
          // 查询餐点列表
          const params = { num: this.pnum, size: this.size, bussinessId: this.busId }
          selectFoodList(params).then(res => {
            if (res.code === SUCCESS_OK) {
              this.foodLists = res.result.list
              this.footNum();
            } else {
              this.showAlert('连接错误');
            }
          });
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
  .content {
    display: flex;
    padding-bottom: 1rem;
    width: 100%;
    height: 100%;
    .food_list {
      width: 100%;
      padding: 0 0;
      .list_group {
        width: 100%;
        height: 100%;
/*        ul {
          display: flex;
          flex-flow: wrap;
          justify-content: space-between;*/
        .item_food {
          display: flex;
          flex-flow: nowrap;
          position: relative;
          width: 100%;
          padding: .27rem .23rem;
          border-bottom: .01rem solid #f0f0f0;
          .img {
            width: 1.6rem;
            height: 1.6rem;
            img {
              width: 100%;
              height: 100%;
            }

          }
          .text {
            width: 3.5rem;
            text-align: left;
            flex-grow: 0.2;
            position: relative;
            left: .24rem;
            display: flex;
            flex-direction: column;
            .name{
              font-size: .36rem;
              color: #727272;
            }
            .price{
              position: relative;
              top: .3rem;
              font-size: .4rem;
              color: #ff4a26;
              font{
                font-size: .2rem;
              }
            }
          }
          .num_control{
            position: absolute;
            right: .23rem;
            bottom: .27rem;
            display: flex;
            align-items: center;
            span{
              margin: 0 .08rem;
            }
            .minus{
              display: inline-block;
              width: .3rem;
              height: .3rem;
              border-radius: 100%;
              border: 1px solid #ffba00;
              color: #ffba00;
              line-height: .3rem;
            }
            .add{
              display: inline-block;
              width: .3rem;
              height: .3rem;
              border-radius: 100%;
              border: 1px solid #ffba00;
              background: #ffba00;
              line-height: .3rem;
              color: white;
            }
            .num{
              font-size: .36rem;
              color: #727272;
            }
          }
        }
      }
    }
  }
  .suspend_icon{
    position: fixed;
    width: .8rem;
    height: .8rem;
    right: .27rem;
    bottom: 1.35rem;
    border-radius: 50%;
    background: url("../../assets/images/order.png");
    background-size: cover;
    z-index: 1000;
  }
  .cart_list{
    width: 3.6rem;
    position: fixed;
    bottom: 2.2rem;
    right: .27rem;
    background: #fafafa;
    border: .01rem solid #f0f0f0;
    padding: 0 .1rem;
    display: none;
    z-index: 1000;
    max-height: 6rem;
    overflow: scroll;
    .cart_empty{
      font-size: .3rem;
      color: #ff4a26;
      display: inline-block;
      margin: 0 auto;
      height: 1rem;
      line-height:1rem;
    }
  }
  .cart_item {
    display: flex;
    flex_flow: nowrap;
    position: relative;
    width: 100%;
    padding: .1rem 0;
    border-bottom: .01rem solid #f0f0f0;
    .img_small {
      width: .8rem;
      height: .8rem;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .text_small {
      width: 1.2rem;
      text-align: left;
      position: relative;
      left: .08rem;
      display: flex;
      flex-direction: column;
      .name_small{
        font-size: .28rem;
        color: #727272;
      }
      .price_small{
        position: relative;
        top: .1rem;
        font-size: .24rem;
        color: #ff4a26;
        .font_small{
          font-size: .2rem;
        }
      }
    }
    .num_control_small{
      position: absolute;
      right: 0rem;
      bottom: 0.02rem;
      // height: 20px;
      display: flex;
      align-items: center;
      span{
        margin: 0 .08rem;
      }
      .minus_small{
        background: url("../../assets/images/minus-order2x.png") no-repeat;
      }
      .add_small{
        background: url("../../assets/images/add-order2x.png") no-repeat;
      }
      .minus_small,
      .add_small{
        display: inline-block;
        width: .24rem;
        height: .24rem;
        border-radius: 100%;
        background-size: 100% 100%;
      }
      .num_small{
        font-size: .24rem;
        color: #727272;
      }
    }
  }
</style>
