<template>
  <div class="warp">
    <ul class="address-info">
      <li class="address-item">
        <label for="user-name" class="item-title">收货人</label>
        <input type="text" v-model="userName"  class="user-name" id="user-name"/>
      </li>
      <li class="address-item">
        <label for="user-phone" class="item-title">联系电话</label>
        <input type="text" v-model="contactNumber"  class="user-phone" id="user-phone"/>
      </li>
      <li class="address-item" @click="openLinkage">
        <label for="user-area" class="item-title">所在地区</label>
        <div class="area">
          <input type="text"  class="area-input" id="user-area" :placeholder="areaPlaceholder" readonly/>
          <span class="area-list"></span>
        </div>
      </li>
      <li class="detail-box">
        <textarea v-model="addressDetail" name="address-detail" class="address-detail" placeholder="请填写详细地址，不少于5个字" rows="3" ></textarea>
      </li>
    </ul>
    <div class="default-address">
      <!-- <span class="default-word">设为默认</span>
      <div class="switch-btn">
        <span class="slider-btn"></span>
      </div> -->
      <cube-switch v-model="defaultAdd" style="font-size:14px">设为默认地址</cube-switch>
    </div>
    <span class="btn-add" @click="saveAddress">保存</span>
    <v-distpicker type="mobile" v-show="panelShow" :province="province" :city="city" :area="area" @selected="chooseArea" style="height:300px;overflow-y:auto"></v-distpicker>
    <!-- <city @hidePanel=hidePanel v-show="panelShow" :panelShow="panelShow"></city> -->
    <!-- <v-distpicker type="mobile" v-show="panelShow" @selected="chooseArea" style="height:300px;overflow-y:auto"></v-distpicker> -->
  </div>

</template>
<script>
  import VDistpicker from 'v-distpicker'
  // import city from '../../components/linkage'
  import { insertAddress, getAddressInfo, updateAddress } from '@/api/member'
  import { mapGetters } from 'vuex'
  import { setTimeout } from 'timers'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    components: {
      // city: city
      VDistpicker
    },
    data() {
      // const cityInfo = {
      //   type: true,
      //   msg:''
      // }
      return {
        id: '',
        userName: '',
        contactNumber: '',
        province: '',
        city: '',
        area: '',
        defaultAdd: false,
        isDefaultAddress: 0,
        panelShow: false,
        addressDetail: '',
        totalAddress: '',
        areaPlaceholder: '请选择',
        areaInfo: {
          province: '',
          city: '',
          area: ''
        }
      }
    },
    computed: {
      ...mapGetters(['getAddressState', 'getAddressId']),
      getTotalAddress() {
        this.totalAddress = this.areaInfo.province + this.areaInfo.city + this.areaInfo.area + this.addressDetail
      }
    },
    methods: {
      // 手机校验
      isPhone: function(phone) {
        var reg =  /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/;
        return reg.test(phone);
      },
      // 点击保存地址
      saveAddress() {
        // 0为新增页面 1为编辑页面
        if (this.defaultAdd == false) {
          this.isDefaultAddress = 1
        } else if (this.defaultAdd == true) {
          this.isDefaultAddress = 0
        }
        // 空值校验
        if (this.userName === '') {
          this.showAlert("请填写收货人")
          return false
        } else if (this.contactNumber === '') {
          this.showAlert("请填写联系电话")
          return false
        } else if (this.addressDetail === '') {
          this.showAlert("请填写详细收货地址")
          return false
        } else if (this.areaInfo.province == '' || this.areaInfo.city == '' || this.areaInfo.area == '') {
          this.showAlert("请选择地区")
          return false
        }  else if (!this.isPhone(this.contactNumber)) {
          this.showAlert("联系电话格式有误")
          return false
        }
        this.totalAddress = this.areaInfo.province + this.areaInfo.city + this.areaInfo.area + this.addressDetail
        if (this.getAddressState === 0) {
          const data = {
            userName: this.userName,
            addressDetail: this.addressDetail,
            contactNumber: this.contactNumber,
            isDefaultAddress: this.isDefaultAddress,
            province: this.areaInfo.province,
            city: this.areaInfo.city,
            area: this.areaInfo.area
          }
          insertAddress(data).then(res => {
            if (res.code === SUCCESS_OK) {
              this.showAlert('保存成功')
              setTimeout(() => {
                this.$router.push('/member/setAddress')
              }, 1000)
            } else {
              this.showAlert('保存失败')
            }
          })
        } else if (this.getAddressState === 1) {
          const data = {
            id: this.id,
            userName: this.userName,
            addressDetail: this.addressDetail,
            contactNumber: this.contactNumber,
            isDefaultAddress: this.isDefaultAddress,
            province: this.areaInfo.province,
            city: this.areaInfo.city,
            area: this.areaInfo.area
          }
          updateAddress(data).then(res => {
            if (res.code == SUCCESS_OK) {
              this.showAlert('更新地址成功')
              setTimeout(() => {
                this.$router.push('/member/setAddress')
              }, 1000)
            } else {
              this.showAlert('保存失败')
            }
          })
        }
      },
      _getAddressInfo() {
      // 编辑,获取信息
        getAddressInfo(this.id).then(res => {
          if (res.code == SUCCESS_OK) {
            res = res.result
            this.userName = res.userName
            this.contactNumber = res.contactNumber
            this.areaPlaceholder = res.province + res.area + res.city
            this.province = res.province
            this.city = res.city
            this.area = res.area
            this.areaInfo.province = res.province
            this.areaInfo.city = res.city
            this.areaInfo.area = res.area
            this.addressDetail = res.addressDetail
            if (res.isDefaultAddress == 0) {
              this.defaultAdd = true
            } else if (res.isDefaultAddress == 1) {
              this.defaultAdd = false
            }
          } else {
            this.showAlert('连接出错')
          }
        })
      },
      jump: function(url) {
        this.$router.push(url);
      },
      hidePanel: function() {
        this.panelShow = false;
      },
      openLinkage: function() {
        this.panelShow = true;
      },
      // 获取三级街镇的数据
      chooseArea(e) {
        // console.log(e)
        this.areaInfo.province = e.province.value
        this.areaInfo.city = e.city.value
        this.areaInfo.area = e.area.value
        this.areaPlaceholder = e.province.value + e.city.value + e.area.value
        this.hidePanel()
      },
      // 显示加载错误
      showError(msg) {
        this.$createDialog({
          type: 'alert',
          title: '提示',
          content: msg
        }).show()
      },
      // 判断是从新增地址还是从编辑地址进入
      judeIsEdit() {
        // 0为新增页面 1为编辑页面
        if (this.getAddressState === 0) {
          return true
        } else if (this.getAddressState === 1) {
          this.id = this.getAddressId
          this._getAddressInfo()
        }
      }
    },
    mounted() {
      this.judeIsEdit()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  *,*:before,*:after{box-sizing:border-box;}
  .warp{
    background: #F4F4F4;
  }
  .address-info{
    width: 100%;
    background: #fff;
    .address-item{
      width: 100%;
      height: 0.95rem;
      border-bottom: 0.01rem solid #ddd;
      padding: 0 0.26rem;
      font-size: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .item-title{
        font-size: 0.28rem;
        color: #030303;
      }
      input{
        height: 0.9rem;
        font-size: 0.28rem;
        border: 0;
        outline: none;
        padding: 0 0.12rem;
        width: 5.4rem;
      }
      .area,
      .street {
        width: 5.4rem;
        height: 0.9rem;
        font-size: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .area-input,
      .street-input {
        display: inline-block;
        width: 5.2rem;
        text-align: right;
      }
      .area-list,
      .street-list{
        display: inline-block;
        width: 0.12rem;
        height: 0.22rem;
        text-align: center;
        background: url(../../assets/images/go-icon.png) no-repeat center center;
        background-size:100% 100%;
      }
    }
    .detail-box{
      width: 100%;
      padding: 0 0.26rem;
      height: 1.76rem;
      .address-detail{
        border: 0;
        font-size: .28rem;
        width: 100%;
        height: 1.76rem;
        padding-top: 0.28rem;
      }
    }
  }
  .default-address {
    padding: 0 0.26rem;
    height: 0.94rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.2rem;
    background: #fff;
    .default-word {
      font-size: 0.28rem;
      color: #030303;
    }

    .switch-btn {
      position: relative;
      display: block;
      width: 1.02rem;
      height: 0.62rem;
      cursor: pointer;
      border-radius: 1.5rem;
      transition: 350ms;
      background: linear-gradient(rgba(0, 0, 0, 0.06), rgba(255, 255, 255, 0)), #ddd;
      box-shadow: 0 0.07rem 0.1rem -0.1rem rgba(0, 0, 0, 0.4) inset, 0 0.05rem 0.08rem -0.01rem rgba(255, 255, 255, 0.7);
    }
    .slider-btn{
      position: absolute;
      content: '';
      width: .56rem;
      height: .56rem;
      top: 0.02rem;
      left:0.03rem;
      /*left: 0.43rem;*/
      /*background: rgba(68, 204, 102, 0.7);*/
      border-radius: 50%;
      transition: 250ms ease-in-out;
      background: linear-gradient(#f5f5f5 10%, #eeeeee);
      box-shadow: 0 0.1rem 0.15rem -0.05rem rgba(255, 255, 255, 0.9) inset;
    }
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
  }
  // .address-container {
  //   height: 300px !important;
  //   overflow-y: auto;
  // }

</style>
