<template>
  <div class="warp">
    <div class="coupon-navbar">
      <span :class="{'active':getSuggestState === 2}"  @click="changeType(2,'意见、建议')">建议</span>
      <span :class="{'active':getSuggestState === 1}" @click="changeType(1,'投诉问题')">投诉</span>
    </div>

    <div class="content-info" >
      <textarea name=""  :placeholder="'请详细描述您的'+placeholder+'...'" v-model="content" v-if=" getSuggestState === 2"></textarea>
      <textarea name=""  :placeholder="'请详细描述您的'+placeholder+'... ...'" v-model="content" v-if=" getSuggestState === 1"></textarea>
      <div class="contact-phone">
        <span>联系方式</span>
        <input type="text" placeholder="请输入您的联系方式（QQ/电话/邮箱）" v-model="contact">
      </div>
    </div>
    <a href="javascript:;" class="btn" @click.prevent="submit()">确定</a>
    <!-- <a href="javascript:;" v-if=" getSuggestState === 2" class="history" @click="jump('historySug')">历史建议</a>
    <a href="javascript:;" v-if=" getSuggestState === 1" class="history" @click="jump('historySug')">历史投诉</a> -->
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { insertComplaint } from '@/utils/wfetch'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        placeholder: '意见、建议',
        content: '',
        contact: '',
        contactType: ''
      }
    },
    computed: {
      ...mapGetters(['getSuggestState'])
    },
    methods: {
      changeType: function(num, str) {
       // this.type = num;
        this.placeholder = str;
        this.contact = '';
        this.content = '';
        this.suggestState(num);
      },
      jump: function(url) {
        this.$router.push({ path: url });
      //  this.suggestState(type);
      },
      isQQ: function(qq) {
        var reg = /^[1-9][0-9]{4,9}$/g;
        return reg.test(qq);
      },
      isPhone: function(phone) {
        var reg =  /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[678])[0-9]{8}$/;
        return reg.test(phone);
      },
      isEmail: function(email) {
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        return reg.test(email);
      },
      submit: function() {
        if (this.content === '') {
          this.showAlert('请输入您的' + this.placeholder);
          return false;
        }
        if (this.contact === '') {
          this.showAlert('请输入您的联系方式');
          return false;
        }
        var cc = this.contact;
        if (!(this.isQQ(cc) || this.isPhone(cc) || this.isEmail(cc))) {
          this.showAlert('联系方式格式错误');
          return false;
        }
        const params = { complaintContext: this.content, complaintPhone: this.contact, complaintType: this.getSuggestState }
        /* 添加投诉或建议 */
        insertComplaint(params).then(res => {
          if (res.code === SUCCESS_OK) {
            this.showAlert(res.desc);
            this.$router.back(-1);
          } else {
            this.showAlert(res.error);
          }
        });
      },
      ...mapMutations(['suggestState'])
    },
    created: function() {
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .warp{
    background: #F4F4F4;
  }
  .coupon-navbar{
    margin: 0 auto;
    display: flex;
    justify-content: center;
    width: 30%;
    span{
      display: inline-block;
      width: 1.26rem;
      height: 0.48rem;
      text-align: center;
      line-height: 0.48rem;
      font-size: 0.26rem;
      color: #333;
      margin: 0.2rem 0;
    }
    .active{
      background: url("../../assets/images/selected2x.png") no-repeat;
      background-size:100% 100% ;
      color: #FFDA00;
    }
  }

  .content-info{
    font-size: 0;
    width: 100%;

    textarea{
      width: 100%;
      height: 3rem;
      border: 0;
      background: #fff;
      font-size: 0.3rem;
      padding: 0.35rem 0.26rem  0.35rem 0.26rem;
    }

    .contact-phone{
      width: 100%;
      height: 1rem;
      background: #fff;
      margin: 0 auto;
      margin-top: 0.2rem;
      padding: 0 0.26rem;
      line-height: 1rem;
      span{
        color:#030303;
        font-size: 0.32rem;
        display: inline-block;
        width: 22%;
      }
      input{
        display: inline-block;
        width: 78%;
        font-size: 0.3rem;
        border: 0;
      }
    }
  }
  .btn{
    margin: 0 auto;
    display: block;
    margin-top: 0.55rem;
    color: #fff;
    font-size: 0.32rem;
    width:6.1rem;
    height:0.9rem;
    line-height: 0.9rem;
    background:#FFBA00;
    border-radius:0.08rem;
  }

  .history{
    margin: 0 auto;
    display: block;
    margin-top: 3.65rem;
    color: #FFBA00;
    font-size: 0.28rem;
    text-decoration:underline solid #FFBA00;
  }
</style>
