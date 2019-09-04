<template>
  <!-- 点餐订单详情-->
  <div class="warp">
    <!-- top search-->
    <div class="content">
        <div class="order_detail" >
            <div class="order_detail_list">
              <h5>下单信息</h5>
              <p>
                  <span>时蔬 <font>x1</font></span>
                  <span>￥12.00</span>
              </p>
              <p>
                <span>时蔬 <font>x1</font></span>
                <span>￥12.00</span>
              </p>
            </div>
            <div class="order_detail_money mt-20">
              <p>
                <span>订单信息</span>
                <span>已付款</span>
              </p>
              <p>优惠金额: ￥0</p>
              <p>实付金额: ￥36</p>
              <p>订单号: 1711759471147</p>
              <p>购买时间: 2018-06-17 11:20:18</p>
            </div>
        </div>

    </div>

  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      const menuList = [{
          title: '服装美食'
        },
        {
          title: '公园小吃'
        },
        {
          title: '玩具乐器'
        },
        {
          title: '精品服装'
        },
        {
          title: '珠宝饰品'
        },
        {
          title: '图书影像'
        },
        {
          title: '钟表奢品'
        }]
      return {
        menuList: menuList,
        type: false
      }
    },
    methods: {

    }

  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .content {
    height: calc(13.34rem - 60px);
    background: #ebebeb;
    .order_detail {
      position: relative;
      top: .32rem;
      height: 5.75rem;
      margin:0 .37rem;
      background: url("../../assets/images/order-bg.png") no-repeat;
      background-size: 100%;
      padding: .23rem;
      h5{
        text-align: left;
        color: #010101;
        font-size: .36rem;
        font-weight: bold;
        margin-bottom: .32rem;
      }
      .order_detail_list{
        border-bottom: .01rem dashed #f0f0f0;
        p{
          padding-bottom: .15rem ;
          padding-top: .05rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: .30rem;
          span{
            font{
              color: #989898;
            }
          }
        }
      }
      .order_detail_money{
        p{
          padding-bottom: .1rem ;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: .24rem;
        }
        p:first-child{
          color: #4D4D4D;
          font-weight: bold;
          font-size: .3rem;
          span:last-child {
            color: #EC4747;
          }
        }
        p:not(:first-child) {
          color: #4D4D4D;
        }
      }
    }
  }


</style>
