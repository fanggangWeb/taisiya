<template>
  <div class="warp">
    <div class="body-container">
        <!-- 最后一版视频 -->
        <!-- <div class="video-playback">
          <video :src="spotDetail.videoFileIdDisplay" preload="meta" webkit-playsinline="true" playsinline="true" controls></video>
        </div> -->
        <!-- <h3 style="position: relative;top: 13px;font-size: 0.3rem;text-align: left; padding: 0 10px; color: #999;">语音介绍</h3> -->
        <!--音频-->
        <!-- <div class="audio" style="margin-top:20px">
          <audio :src="spotDetail.audioFileIdDisplay" preload="meta" controls="controls">
            Your browser does not support the audio element.
          </audio>
        </div> -->
        <!-- <div class="audio-controls">
          <audio id="article_audio" class='article_audio' controls>
            <source src="/static/audio/Ivan.mp3"></source>
          </audio>
          <div class="audio_box">
            <a id="play_btn" class="play_btn" @click="playAudio"></a>
            <div id="pgs" class="pgs" @click="pgsClick">
              <div id="progress" class="pgs-play"></div>
              <div id="circle" class="circle" @touchstart.capture="touchStart" @touchend.capture="touchEnd"></div>
            </div>
            <span id="playedTime" class="playedTime">00:00</span>
          </div>
        </div> -->
      <!-- </div> -->
      <!--景点介绍-->
      <div class="scenic-info">
        <p v-if="spotDetail.spotName!==''">{{spotDetail.spotName}}</p>
        <div class="spotContext" v-if="spotDetail.spotContext" v-html="spotDetail.spotContext"></div>
      </div>
    </div>
  </div>
</template>
<script>
  // let vm = null
  import { mapGetters } from 'vuex'
  // import { videoPlayer } from 'vue-video-player';
  import { selectScenicSpotById } from '@/utils/lkfetch';
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'scenicParticulars',
    data() {
      return {
        imgs: [],
        spotDetail: {
          spotName: '',
          spotContext: '',
          videoFileIdDisplay: '',
          audioFileIdDisplay: ''
        }
      }
    },
    computed: {
      ...mapGetters(['getSceincId', 'getSceincId'])
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
        $('body').on('click', '.spotContext img', function() {
          myThis.imgs[0] = $(this).attr('src')
          myThis.showImagePreview()
          $('.cube-image-preview-counter').hide()
        })
      }
    },
    mounted() {
      /* 根据景点id查询景点详情*/
      selectScenicSpotById({ id: this.getSceincId }).then(res => {
        if (res.code == SUCCESS_OK) {
          this.spotDetail = res.result;
          // this.videoSrc = res.result.videoFileIdDisplay
          this.$nextTick()
          // this.playerOptions.sources.src = res.result.videoFileIdDisplay
        } else {
          this.showAlert(res.error);
        }
      });
      this.init()
      // this.audio = document.getElementById("article_audio");
      // this.totalWidth = document.getElementById("pgs").offsetWidth - (document.getElementById('circle').style.width / 1.4);  // 进度条长度
      // this.audio.addEventListener('timeupdate', this.updateProgress, false);
      // this.audio.addEventListener('ended', () =>  {
      //   this.audio.pause();
      //   document.getElementById('play_btn').classList.remove('on')
      // }, false);
    }
  }
</script>
<style scoped lang="less">
  .body-container{
    width: 100%;
    max-width: 7.5rem;
    margin: 0 auto;
    background: #fff;
  }
  // .top-container{
  //   width: 100%;
  // }
  // .video-playback{
  //   height: 4.5rem;
  // }
  // .video-playback video{
  //   width: 100%;
  //   height: 100%;
  //   // border: 0.01rem solid;
  //   border: none;
  //   display: block;
  //   overflow: hidden;
  // }
  .scenic-info{
    padding-top: 0.33rem;
  }
  .scenic-info p{
    // padding: 0.27rem 0;
    font-size: 0.34rem;
    font-family: "PingFang-SC-Bold";
    font-weight: bold;
    text-align: center;
  }
  .scenic-info div{
    padding: 0.33rem 0.27rem;
    text-align: justify;
    font-family:"PingFang SC";
    font-size: 0.28rem;
    color: #858585;
  }
  span.video-child{
    font-family: "PingFang-SC-Regular";
    color: #999999;
    font-size: 0.24rem;
  }
</style>
