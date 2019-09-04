<template>
  <div class="warp">
    <div class="body-container">
      <div class="big-title">
        <h2>{{DetailContent.travelsName}}</h2>
        <span>{{DetailContent.nickName}}&nbsp;&nbsp;&nbsp;{{DetailContent.creatime}}</span>
      </div>
      <div class="visit-content" v-html="DetailContent.travelsContext">
      </div>
      <!-- <div class="img-list" v-for="(item,index) in DetailContent.listPicUrl" :key="index" v-if="index%3===0">
        <div  :class="{'img-item1':type === 1,'img-item2':type === 2,'img-item3':type === 3} ">
          <img :src="item" alt=""  >
        </div>
      </div> -->
      <div class="img-list">
        <div  class="img-item">
          <img v-gallery:groupName v-for="(item,index) in DetailContent.listPicUrl" :key="index" :src="item" >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { selectTravel } from '../../utils/wfetch'
  import { mapGetters } from 'vuex'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'newDetail',
    data() {
      return {
        DetailContent: {},
        type: 1
      }
    },
    computed: {
      ...mapGetters(['getTravelId'])
    },
    methods: {
    },
    mounted() {
    },
    created() {
      /* 请求数据 */
      selectTravel({ 'id': this.getTravelId }).then(res => {
        if (res.code === SUCCESS_OK) {
         // console.log(res)
          this.DetailContent = res.result;
          var len = this.DetailContent.listPicUrl.length
          if (len >= 3) {
            this.type = 1
          } else if (len === 2) {
            this.type = 2
          } else {
            this.type = 3
          }
        } else {
          this.showAlert('网络故障');
        }
     })
    }
  }
</script>
<style scoped lang="less">
  /*详情页标题*/
  *{
    text-align: left;
  }
  .body-container {
    width: 100%;
    margin: 0 auto;
    padding: 0.27rem 0.32rem;
    text-align: center;
    background: #fff;
  }
  .body-container .big-title{
    border-bottom: 0.001rem solid #eceaea;
  }
  .body-container .big-title h2{
    width: 100%;
    line-height: 0.5rem;
    font-weight: 700;
    font-size: 0.4rem;
    margin: 0 auto;
  }
  .body-container .big-title span{
    display: block;
    color: #d7d7d7;
    width: 100%;
    /*margin: 0 auto;*/
    line-height: 0.65rem;
  }
  /*详情页内容*/
  .body-container .visit-content {
    padding: 0.27rem 0;
    color: #333333;
    font-size: 0.28rem;
    line-height: 0.5rem;
  }
  .body-container .visit-content img{
    width: 100%;
    margin-top: 0.1rem;
    height: 4.39rem;
  }
.ravelImg{
  width: 100%;
}
  .img-list{
    width: 100%;
    display: flex;
    justify-content: space-between;
    max-height: 6rem;
    margin-bottom: .1rem;
  }
  .img-item {
    max-width: 100%;
  }
  .img-item1{
    width: calc(100% / 3);
    display: block;
    height: 2rem;
  }
  .img-item2{
    width: calc(100% / 2);
    display: block;
    height: 3.5rem;
  }
  .img-item3{
    margin: 0 auto;
    width: 80%;
    display: block;
    height: 5rem;
  }
  .img-item1 img,.img-item2 img, .img-item3 img{
    width: 100%;
    height: 100%;
  }
</style>
