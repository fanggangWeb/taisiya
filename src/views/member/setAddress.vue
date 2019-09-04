<template>
  <div class="warp bgf4">
    <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
      <div v-if="isData" style="margin-top:12px">您还没有添加地址哟~</div>
      <cube-index-list-item v-for="(item, index) in addressList" :key="index">
        <div class="address-item" >
          <div class="address-info" @click="chooseAddress(item.address, item.userName, item.contactNumber, item.id)">
            <div class="user-contact">
              <p class="user-name">{{item.userName}}</p>
              <p class="user-phone">{{item.contactNumber}}</p>
            </div>
            <p class="address-detail">{{item.address}}</p>
          </div>
          <div class="operate-list">
            <a href="javascript:;" class="default-address" >
              <!-- <input :id="index" name='address' class="address-icon" type="audio" :checked="item.isDefaultAddress === 1?true:false" @change="test">
              <label :for="index">默认地址</label> -->
              <span class="icon-select" :class="{'sle-active':item.isDefaultAddress === 0}" @click="setDefaultAddress(item,index)"></span>默认地址
            </a>
            <div class="operate-address">
              <span class="edit-address" @click.stop="editAddress(item)">编辑</span>
              <span class="del-address" @click="_delAddress(item)">删除</span>
            </div>
          </div>
        </div>
      </cube-index-list-item>
    </cube-index-list>
    <span class="btn-add" @click="addAddress">添加新地址</span>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { getAddressList, setDefaultAddress, delAddress } from '@/api/member'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        isData: false,
        num: 1,
        size: 5,
        addressList: [],
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
        defaultAddress: -1
      }
    },
    computed: {
      ...mapGetters(['getIsChooseAddress'])
    },
    methods: {
      ...mapMutations(['addressState', 'addressId', 'address', 'addressName', 'addressTel', 'isChoose']),
      // 点击新增地址按钮
      addAddress() {
        this.addressState(0)
        this.$router.push({ path: 'addAddress' })
      },
      // 点击编辑按钮
      editAddress(item) {
        this.addressState(1)
        this.addressId(item.id)
        this.$router.push({ path: 'addAddress' })
      },
      // 删除地址的接口回调
      delete(data) {
        delAddress(data).then(res => {
          if (res.code == SUCCESS_OK) {
            this.showAlert('删除成功')
            this._getAddressList()
            // Call forceUpdate after finishing data load.
            this.$refs.indexList.forceUpdate()
          } else {
            this.showAlert('连接数据库失败')
          }
        })
      },
      // 点击删除地址的按钮
      _delAddress(item) {
        this.showBtn('确定删除该条数据吗', this.delete, item.id)
      },
      jump: function(url) {
        this.$router.push(url)
      },
      chooseAddress(address, addressName, addressTel, id) {
        // addressType
        if (this.getIsChooseAddress === 0) {
          return false;
        }
        this.addressId(id);
        this.address(address);
        this.addressName(addressName);
        this.addressTel(addressTel);
        this.isChoose(1);
        this.$router.push('/home/orderConfirm');
      },
      setDefaultAddress(item, index) {
        for (let i = 0; i < this.addressList.length; i++) {
          this.addressList[i].isDefaultAddress = 1
        }
        item.isDefaultAddress = 0
        // 将item.id传过去设为默认
        setDefaultAddress(item.id).then(res => {
          if (res.code == SUCCESS_OK) {
            this.showAlert('默认地址更新成功')
            this._getAddressList()
            // Call forceUpdate after finishing data load.
            this.$refs.indexList.forceUpdate()
          } else {
            this.showAlert('连接失败')
          }
        })
      },
      // 获取所有地址的列表
      _getAddressList() {
        getAddressList(this.num, this.size).then(res => {
          if (res.code == SUCCESS_OK) {
           //  console.log(res)
            this.addressList = res.result.list
            if (res.result.list.length < 1) {
              this.isData = true
            } else {
              this.isData = false
            }
          } else {
            this.showAlert('连接数据库失败')
          }
        })
      },
      onPullingDown() {
        this.num = 1
        setTimeout(() => {
          // 请求数据
          this._getAddressList()
          // Call forceUpdate after finishing data load.
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      onPullingUp() {
        this.num++
        setTimeout(() => {
          getAddressList(this.num, this.size).then(res => {
            if (res.code == SUCCESS_OK) {
            //   console.log(res)
              // 判断是否是最后一页
              if (res.result.total <= this.addressList.length) {
                this.showAlert('已为您加载全部数据')
              } else {
                // console.log(res)
                this.addressList = this.addressList.concat(res.result.list)
              }
            } else {
              this.showAlert('连接数据库失败')
            }
          })
          this.$refs.indexList.forceUpdate()
        }, 1000)
      }
    },
    created: function() {
        this._getAddressList()
        $(".cube-index-list-content>ul").css('background', '#f4f4f4')
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .warp{
    width: 100%;
    height: calc(100% - 19px);
    background: #f4f4f4;
  }
/*  .cube-index-list-content{
    background: #f4f4f4;
  }*/
  .address-item{
    width: 100%;
    margin-bottom: 0.2rem;
    height: auto;
    background: #fff;
  }
  .address-item .address-info{
    padding: 0.26rem;
    border-bottom: 0.01rem solid #F0F0F0;

  }
  .user-contact{
    display: flex;
    justify-content: space-between;
  }
  .address-item .address-info .user-contact .user-name{
    position: relative;
    top: -.05rem;
    font-size: 0.3rem;
    color: #030303;
    font-weight: bold;
  }
  .address-item .address-info .user-contact .user-phone{
    font-size: 0.28rem;
    color: #666;
  }
  .address-item .address-info .address-detail{
    font-size: 0.3rem;
    color: #666;
    text-align: left;
    position: relative;
    top: .1rem;
  }
  .address-item .operate-list{
    background: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0.26rem 0.26rem  0.26rem 0.29rem;
  }
  .address-item .operate-list .default-address,
  .address-item .operate-list .operate-address .edit-address,
  .address-item .operate-list .operate-address .del-address{
    color: #999;
    font-size: 0.24rem;
  }
  .address-item .operate-list .default-address{
    position: relative;
    padding-left: 0.45rem;
  }
  .address-item .operate-list .default-address .icon-select{
    display: inline-block;
    width: 0.32rem;
    height: 0.32rem;
    border-radius: 50%;
    border: 0.01rem solid #ddd;
    position: absolute;
    top:50%;
    left:0;
    margin-top: -0.16rem;
  }
  .address-item .operate-list .default-address  .sle-active{
    border: 0;
    background: url(../../assets/images/selectAddress2x.png);
    background-size: 0.32rem 100%;
    /*color: #FFBA00;*//*js处理时修改*/
  }

  .address-item .operate-list .operate-address .edit-address,
  .address-item .operate-list .operate-address .del-address{
    display: inline-block;
    padding-left: 0.43rem;

  }
  .address-item .operate-list .operate-address .edit-address{
    padding-right: 0.22rem;
  }
  .address-item .operate-list .operate-address .edit-address{
    background: url(../../assets/images/edit2x.png)  no-repeat;
    background-size: 0.32rem 100%;
  }
  .address-item .operate-list .operate-address .del-address{
    background: url(../../assets/images/delete2x.png) no-repeat;
    background-size: 0.32rem 100%;
  }

  .btn-add{
    display: inline-block;
    width: 100%;
    height: 0.96rem;
    background: #FFBA00;
    color: #fff;
    font-size: 0.36rem;
    text-align: center;
    line-height: 0.96rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 3
  }
  .address-icon {
    background: #FFBA00;
    position: relative;
    top: .02rem;
  }
  .cube-index-list {
    height: calc(100% - 18px) !important;
  }

</style>
