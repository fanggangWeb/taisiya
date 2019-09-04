<template>
  <div class="warp">
    <div class="body-container">
      <div class="big-title">
        <h2>{{newDetailContent.newName}}</h2>
        <span>{{newDetailContent.creatTime}}</span>
      </div>
      <div class="visit-content" v-html="newDetailContent.newContrxt">
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import { selectNewsById } from '../../utils/wfetch'
  // import PinchZoom from '@/utils/pinch-zoom.js'
  // import { setTimeout } from 'timers';
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'newDetail',
    data() {
      return {
        imgs: [
          // 'https://wx1.sinaimg.cn/mw1024/686d7361ly1fpha0mpd5uj21hc0tyws2.jpg',
          // 'https://wx1.sinaimg.cn/mw1024/686d7361ly1fpha0ncnnej21hc0zetxo.jpg',
          // 'https://wx1.sinaimg.cn/mw1024/686d7361ly1fpha0mqvu5j21hc0zkgzz.jpg',
          // 'https://wx1.sinaimg.cn/mw1024/686d7361ly1fpha0m3ufuj21hc0zkqbj.jpg'
        ],
        params: {
          id: 0
        },
        newDetailContent: {}
      }
    },
    computed: {
      ...mapGetters(['getNewsId'])
    },
    methods: {
      showImagePreview() {
        this.$createImagePreview({
          imgs: this.imgs
        }).show()
      },
      init: function() {
        // 初始化组件
        /* eslint-disable no-undef*/
        // var timer = null
        var myThis = this
        $('body').on('click', '.visit-content img', function() {
          myThis.imgs[0] = $(this).attr('src')
          myThis.showImagePreview()
          $('.cube-image-preview-counter').hide()
        })
      }
    },
    created() {
      /* eslint-disable no-undef*/
      this.init()
      /* 请求数据 */
      var data = { 'id': this.getNewsId };
      selectNewsById(data).then(res => {
        if (res.code === SUCCESS_OK) {
          this.newDetailContent = res.result;
        } else {
          this.showAlert('网络故障');
        }
      })
    },
    updated() {
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
    font-size: 0.28rem !important;
    text-align: center;
    cursor: pointer;
  }
  .body-container .visit-content img{
    max-width: 100%;
    margin-top: 0.1rem;
    height: 4.39rem;
    cursor: pointer !important;
  }
  .body-container .visit-content p{
    color: #333333;
    font-size: 16px !important;
    text-align: center;
    cursor: pointer;
  }
  .body-container .visit-content p img{
    cursor: pointer !important;
  }
</style>
