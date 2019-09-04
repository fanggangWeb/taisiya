<template>
  <div class="warp">
    <div class="body-container">
      <!--请输入游记-->
      <div>
        <textarea v-model="travelTitle" class="travel-title" placeholder="请输入游记标题" maxlength="50"></textarea>
        <!-- <p class="font-count">
          <span>可输入50字</span>
        </p> -->
      </div>
      <div class="write-travel">
        <textarea v-model="travelContext" placeholder="写点什么" class="write-area">
        </textarea>
      </div>
    </div>
    <div class="upload">
      <!-- <p class="upload-char">上传图片</p> -->
      <cube-upload
        ref="upload"
        :action="action"
        :max = 9
        :simultaneous-uploads="1"
        @file-submitted="fileSubmitted"
        @file-removed="removeFile"/>
    </div>
    <p class="btn-publish" @click="submitTravel()">
      发布
    </p>
  </div>
</template>
<script>
   import { addTravels, uploadImg } from '../../utils/wfetch'
   import { mapMutations } from 'vuex'
   const SUCCESS_OK = "rest.success"
  export default {
    name: 'travelNotes',
    data() {
      return {
        travelTitle: '',
        travelContext: '',
        fileList:[],
        fileUpload : [],
        params: {},
        validity: {},
        valid: undefined,
        action: {
          target: '//jsonplaceholder.typicode.com/photos/',
          prop: 'base64Value'
        }
      }
    },
    methods: {
      ...mapMutations(['searchState']),
      fileSubmitted(file) {
         this.fileList.push(file);
        //  将图片转换成base64格式传给后台
        var fileReader = new FileReader();
         fileReader.readAsDataURL(file.file)
        var that = this;
        fileReader.onload = function() {
          uploadImg({ file: this.result }).then(res => {
            // console.log(res)
            if (res.code === SUCCESS_OK) {
              file.uploadedUrl = res.result.filePath
              that.fileUpload.push({
                  fileName: res.result.fileName,
                  filePath: res.result.filePath,
                  fileSize: res.result.fileSize,
                  fileType: res.result.fileType,
                  url: res.result.url });
            } else {
              this.showAlert("上传失败");
            }
          })
        }
      },
      removeFile: function(file) {
        for (var i = 0; i < this.fileList.length; i++) {
          if (file.url === this.fileList[i].url) {
            this.fileList.splice(i, 1);
            this.fileUpload.splice(i, 1);
            break;
          }
        }
      },
      submitTravel: function() {
        if (this.travelTitle === '') {
          this.showAlert("请输入游记标题");
        } else if (this.travelContext === '') {
          this.showAlert("请输入游记内容");
        } else {
           console.log(this.fileUpload)
          if (this.fileUpload.length === 0) {
            this.params = { travelsContext: this.travelContext, travelsName: this.travelTitle }
          } else {
            this.params = { travelsContext: this.travelContext, travelsName: this.travelTitle, listFileUpload:this.fileUpload }
          }
          addTravels(this.params).then(res => {
            if (res.code === SUCCESS_OK) {
              // 将状态设为2，表示从个人中心进入游记列表
              this.searchState(2)
              this.$router.push({ path: '/travel' });
            } else {
              this.showAlert("连接错误");
            }
          })
        }
      }
    },
    mounted: function() {
    }

  }
</script>
<style scoped lang="less">
  .warp{
    background: #fff;
    width: 100%;
    overflow-x: hidden;
  }
  .body-container{
    width: 100%;
    padding: 0.5rem 0.32rem 0.1rem .32rem;
    position: relative;
  }
  .travel-title{
    text-align: left;
    font-size: 0.4rem;
    font-family: 'PingFang-SC-Bold';
    font-weight: bold;
    width: 100%;
    height: 1rem;
    color: #999999;
    border: none;
    line-height: 1rem;
    border-bottom: 0.5px solid #ede9e9;
    resize: none;
  }
  .travel-title::-webkit-input-placeholder{
    color: #999999;
    font-size: 0.4rem;
  }
  .font-count{
    text-align: right;
    font-size: 0.23rem;
    padding: 0.2rem 0;
    color: #666666;
  }
  .write-travel{
    width: 100%;
    min-height:3rem;
    padding: 0.38rem 0 0 0;
  }
  .write-area{
    width: 100%;
    min-height: 3rem;
    font-size: 0.32rem;
    color: #555;
    resize: none;
    border: none;
  }
  .write-area::-webkit-input-placeholder{
    color:#999999;
    font-size: 0.32rem;
  }
  .upload{
    position: relative;
    top: 0;
    padding-left: .32rem;
    display: flex;
    flex-direction: column;
    align-items: left;
    padding-bottom: .14rem;
    border-bottom:1px solid #F6F6F6;
  }
  .upload-char{
    font-family: "PingFang-SC-Regular";
    /*color:#979797;*/
    color:#333;
    font-size: 0.32rem;
    width: 100%;
    text-align: left;
  }
  .btn-publish{
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    background: #FFBA00;
    text-align: center;
    font-size: 0.36rem;
    color: #fff;
    position: fixed;
    bottom: 0;
  }
</style>
