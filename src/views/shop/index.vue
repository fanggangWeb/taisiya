<template>
  <!-- 商城-->
  <div class="warp" style="overflow: hidden">
    <!-- top search-->
    <div class="search">
      <input type="text" placeholder="请输入要搜索的内容..." @keyup.enter="search" v-model="searchVal" />
    </div>

    <div class="content">
      <div class="shop_menu">
        <ul>
          <li v-for="(item,index) in  menuList"  @click="changeMenu(item.id,index)" data-type="0" class="classify_item" >
            <span v-if="item.fName.length <= 10">{{item.fName}}</span>
            <span v-if="item.fName.length > 10" >{{item.fName.slice(0,10)}}...</span>
          </li>
        </ul>
      </div>

          <div class="shop_list">
            <div class="shop_list_group">
              <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
                <cube-index-list-item v-for="(item, index) in shopList" :key="index">
                  <div @click="jump('home/detail', item.id)">
                    <img  :src="tmp"  v-for="(tmp,index2) in item.listPicUrl"  v-if="index2===0 ">
                    <span v-if="item.productsName.length <= 4">{{item.productsName}}</span>
                    <span v-if="item.productsName.length > 4">{{item.productsName.slice(0,4)}}...</span>
                  </div>
                </cube-index-list-item>
              </cube-index-list>
            </div>
          </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { getProductClassify, getProductsByClassify, getSearchProductList } from '@/utils/wfetch'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        menuList: [],
        shopList: [],
        searchVal: '',
        num: 1,
        size: 9,
        type : 0,
        defaultProImg:'this.src="' + require('../../assets/images/product.png') + '"',
        pullDownRefresh: '',
        nextUpLoad: true,
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
        cid: ''
      }
    },
    created: function() {
      /* 获取商品分类 */
      getProductClassify().then(res => {
        this.menuList = res.result.reverse();
         this.menuList.unshift({ id:'', fName:'全部' })
        /* 获取商品分类 */
        getProductsByClassify({ num:this.num, size: this.size }).then(res => {
            console.log(res.result.list)
          this.$nextTick(function() {
            var  listItems = document.querySelectorAll('.classify_item');
            listItems[0].dataset.type = '1';
        })
           this.shopList = res.result.list;
          if (res.result.isLastPage) {
            this.nextUpLoad = false;
          }
        });
      });
    },
    methods: {
      search() {
        // 搜索内容为空不执行
        if (this.searchVal == '') {
          return
        } else {
          getSearchProductList(this.num, this.size, this.searchVal).then(res => {
            if (res.code == SUCCESS_OK) {
              // console.log(res)
              this.type = 1
              var  listItems = document.querySelectorAll('.classify_item');
              for (let i = 0; i < listItems.length; i++) {
                listItems[i].dataset.type = 0;
              }
                this.shopList = res.result.list;
                if (res.result.isLastPage) {
                  this.nextUpLoad = false;
                } else {
                // console.log(res)
                this.productList = this.productList.concat(res.result.list)
              }
            } else {
              this.showAlert('连接数据库出错')
            }
          })
        }
      },
      ...mapMutations(['productId']),
      jump: function(url, id) {
        this.$router.push({ path: url });
        this.productId(id);
      },
      changeMenu: function(id, index) {
        /* 按分类查询商品 */
        this.nextUpLoad = true;
        this.cid = id;
        this.num = 1;
        getProductsByClassify({ num:this.num, size:this.size, fId:this.cid }).then(res => {
          this.$nextTick(function() {
            this.type = 0
            var  listItems = document.querySelectorAll('.classify_item');
            for (let i = 0; i < listItems.length; i++) {
              listItems[i].dataset.type = 0;
            }
            listItems[index].dataset.type = '1';
          })
          this.shopList = res.result.list;
          if (res.result.isLastPage) {
            this.nextUpLoad = false;
          }
        });
      },
      onPullingDown() {
        setTimeout(() => {
          this.num = 1;
          // 请求数据
          if (this.type === 0) {
           var params  = { num:this.num, size: this.size, fId:this.cid }
            getProductsByClassify(params).then(res => {
              if (res.code === SUCCESS_OK) {
                this.shopList = res.result.list;
                if (res.result.isLastPage) {
                  this.nextUpLoad = false;
                }
              } else {
                this.showAlert(res.error);
              }
            })
          } else {
           params =  { num: this.num, size: this.size, productsName: this.searchVal }
            getSearchProductList(this.num, this.size, this.searchVal).then(res => {
              if (res.code === SUCCESS_OK) {
                this.shopList = res.result.list;
                if (res.result.isLastPage) {
                  this.nextUpLoad = false;
                }
              } else {
                this.showAlert(res.error);
              }
            })
          }
          // Call forceUpdate after finishing data load.
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      onPullingUp() {
        // Mock async load.
        setTimeout(() => {
            this.num++;
            // 请求数据
            if (this.type === 0) {
              var params  = { num:this.num, size: this.size, fId:this.cid }
              getProductsByClassify(params).then(res => {
                if (res.code === SUCCESS_OK) {
                  if (res.result.total <= this.shopList.length) {
                    this.showAlert('已为您加载全部数据')
                  } else {
                    this.shopList = this.shopList.concat(res.result.list);
                  }
                } else {
                  this.showAlert(res.error);
                }
              })
            } else {
              getSearchProductList(this.num, this.size, this.searchVal).then(res => {
                if (res.code === SUCCESS_OK) {
                  if (res.result.total <= this.shopList.length) {
                    this.showAlert('已为您加载全部数据')
                  } else {
                    this.shopList = this.shopList.concat(res.result.list);
                  }
                } else {
                  this.showAlert(res.error);
                }
              })
            }
          this.$refs.indexList.forceUpdate()
        }, 1000)
      }
    }
  }

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .warp{
    background-color: #FFF;
    padding-top: 0.18rem;
  }
  .search {
    height: .65rem;
    margin: 0 .26rem .18rem .26rem;
    background: #f3f3f3;
    border-radius: .4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    input {
      font-size: .26rem;
      color: #bababa;
      border: none;
      background: none;
    }
    &:after{
      content: '';
      clear: both;
      position: absolute;
      left: 1.2rem;
      top: .2rem;
      width: .26rem;
      height: .26rem;
      background: url("../../assets/images/search-icon.png") no-repeat;
      background-size: 100%;
    }

  }
  .content {
    display: flex;
    height: 11.30rem;
    overflow: hidden;
    .shop_menu {
      position: fixed;
      width: 27%;
      height: 93%;
      background: #f4f4f4;
      overflow-y: auto;
      ul {
        height: 100%;
        li {
          height: 1rem;
          line-height: 1rem;
          font-size: .28rem;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .classify_item {
          display: inline-block;
          width: 100%;
          overflow:hidden;
          text-overflow:ellipsis; 
          white-space: nowrap;
        }
        .classify_item[data-type="0"]{
          color: #333;
          background: #f4f4f4;
          width: 100%;
          overflow:hidden;
          text-overflow:ellipsis; 
          white-space: nowrap;
        }
        .classify_item[data-type="1"]{
          color: #ffba00;
          background:  #FFFFFF;
          width: 100%;
          overflow:hidden;
          text-overflow:ellipsis; 
          white-space: nowrap;
        }
      }
    }

    .shop_list {
      margin-left: 27%;
      width: calc(100% - 1.77rem);
      height: 100%;
      padding: 0 .23rem;
      overflow-y: scroll;
      .shop_list_group {
        width: 100%;
        height: 100%;
        h5 {
          text-align: left;
          height: 1rem;
          line-height: 1rem;
          font-size: .34rem;
          color: #030303;
        }
        ul {
   /*       display: flex;
          flex-flow: wrap;
          justify-content: flex-start;*/
          li {
            float: left;
            width: 33%;
            div{
              display: flex;
              flex-direction: column;
              padding-left: .16rem;
            }
            img {
              width: 1.58rem;
              height: 1.58rem;
            }
            span {
              margin: .15rem 0;
              width: 100%;
              overflow:hidden;
              text-overflow:ellipsis; 
              white-space: nowrap;
            }
          }
        }
      }
    }
  }

</style>
