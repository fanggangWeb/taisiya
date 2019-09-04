<template>
  <div class="warp">
    <ul class="problem-list">
      <li class="problem-item">
        <p>为什么没有订单记录?</p>
        <img src="../../assets/images/go-icon.png" alt="">
      </li>
      <li class="problem-item">
        <p>为什么没有订单记录?</p>
        <img src="../../assets/images/go-icon.png" alt="">
      </li>
      <li class="problem-item">
        <p>为什么没有订单记录?</p>
        <img src="../../assets/images/go-icon.png" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App',
        type: 1
      }
    },
    methods: {
      loginType: function(id) {
        this.type = id
      },
      jump: function() {
        this.$router.push({ path: '/home' })
      }
    }

  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .problem-list{
    width: 100%;
    text-align: left;
    .problem-item{
      padding: 0.3rem 0.26rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p{
        font-size: 0.38rem;
        color: #030303;
        margin-right:0.3rem ;
      }
      img{
        width: 0.18rem;
        height: 0.33rem;
      }
    }
  }

</style>
