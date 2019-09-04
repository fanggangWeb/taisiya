<template>
  <!-- 订单详情-->
  <div class="warp">
    <!-- top search-->
    <div class="search">
      <input type="text" placeholder="请输入要搜索的内容..."/>
    </div>

    <div class="content">
      <div class="shop_menu">
        <ul>
          <li v-for="(item, index) in  menuList" :key="index" :class="{'active':type === true}" >
               {{item.title}}
          </li>
        </ul>

      </div>
      <div class="shop_list">
        <div class="shop_list_group">
          <h5 class="title">美食中心</h5>
          <ul>
            <li>
              <img src="" alt="">
              <span>鸭舌帽</span>
            </li>
            <li>
              <img src="" alt="">
              <span>鸭舌帽</span>
            </li>
            <li>
              <img src="" alt="">
              <span>鸭舌帽</span>
            </li>
            <li>
              <img src="" alt="">
              <span>鸭舌帽</span>
            </li>

          </ul>
        </div>
        <div class="shop_list_group">
          <h5 class="title">化妆品</h5>
          <ul>
            <li>
              <img src="" alt="">
              <span>鸭舌帽</span>
            </li>
            <li>
              <img src="" alt="">
              <span>鸭舌帽</span>
            </li>
            <li>
              <img src="" alt="">
              <span>鸭舌帽</span>
            </li>

          </ul>
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
          title: '美食中心'
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

  .search {
    height: .65rem;
    margin: .18rem .26rem;

    background: #f3f3f3;
    border-radius: .4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      font-size: .26rem;
      color: #bababa;
      border: none;
      background: none;
    }
  }

  .content {
    display: flex;
    height: 11.30rem;
    .shop_menu {
      width: 1.77rem;
      height: 100%;
      background: #f4f4f4;
      ul {
        li {
          height: 1rem;
          line-height: 1rem;
          font-size: .28rem;
          background: #f4f4f4;
        }
        .active {
          color: #ffba00;
          background: white;
        }
      }
    }

    .shop_list {
      width: calc(100% - 1.77rem);
      height: 100%;
      padding: 0 .23rem;
      .shop_list_group {
        h5 {
          text-align: left;
          height: 1rem;
          line-height: 1rem;
          font-size: .34rem;
          color: #030303;
        }
        ul {
          display: flex;
          flex-flow: wrap;
          justify-content: space-between;
          li {
            display: flex;
            flex-direction: column;
            img {
              width: 1.58rem;
              height: 1.58rem;
            }
            span {
              margin: .15rem 0;
            }
          }
        }
      }
      .shop_list_group:not(:last-child) {
        margin-bottom: .2rem;
      }
    }
  }

</style>
