<template>
  <div class="parkcontainer">
    <div v-html="this.content" class="contentPark">
    </div>
  </div>
</template>
<script>
import { selectParkOnContext } from '@/api/member'
const SUCCESS_OK = "rest.success"
export default {
  data() {
    return {
      imgs: [],
      content: ''
    }
  },
  methods: {
    getParkContext() {
      selectParkOnContext().then(res => {
        if (res.code == SUCCESS_OK) {
          console.log(res)
          this.content = res.result
        } else {
          this.showAlert(res.desc)
        }
      })
    },
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
        $('body').on('click', '.contentPark img', function() {
          myThis.imgs[0] = $(this).attr('src')
          myThis.showImagePreview()
          $('.cube-image-preview-counter').hide()
        })
      }
  },
  mounted() {
    this.getParkContext()
    this.init()
  }
}
</script>
<style>
.parkcontainer{
  padding: 10px
}
.contentPark{
  cursor: pointer;
}
.contentPark  img{
  width: 100% !important;
}
.contentPark p img{
  width: 100% !important;
}
</style>

