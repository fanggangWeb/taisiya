<template>
  <!-- 商城-->
  <div class="warp">
    <!-- top search-->
    <div class="content">
      <div class="scenicSpot_list">
        <cube-index-list ref="indexList" :options="options"  @pulling-up="onPullingUp" @pulling-down="onPullingDown">
          <cube-index-list-item  v-for="(item, index) in scenicList.list" :key="index" >
            <div class="scenic-item" @click="jump('scenicSpot/detail',item.id)">
              <div class="img"><img :src="item.picUrl"/></div>
              <div class="infos">
                <span class="name">{{item.parkName}}</span>
                <span class="price"><font>￥</font>{{item.ticket}}</span>
              </div>
            </div>
          </cube-index-list-item>
        </cube-index-list>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { selectParkList } from '@/utils/lkfetch'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        scenicList: {},
        num:1,
        size:10,
        nextUpLoad:true,
        pullDownRefresh: '',
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
        }
      }
    },
    methods: {
      ...mapMutations(['parkId']),
      jump: function(url, id) {
        this.$router.push({ path: url });
        this.parkId(id);
      },
      getList() {
        this.num = 1;
        selectParkList({ num: this.num, size: this.size }).then(res => {
          if (res.code === SUCCESS_OK) {
            console.log(res)
            this.scenicList = res.result;
            if (res.result.isLastPage) {
              this.nextUpLoad = false;
            }
          } else {
            this.showAlert('网络故障');
          }
        })
      },
      onPullingDown() {
        setTimeout(() => {
          this.num = 1;
          // 请求数据
          this.getList()
          // Call forceUpdate after finishing data load.
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      onPullingUp() {
        // Mock async load.

        setTimeout(() => {
          if (this.nextUpLoad) {
            this.num++;
            this.scenicList = [];
            // 请求数据
            selectParkList({ num: this.num, size: this.size }).then(res => {
              // console.log(res)
              if (res.code === SUCCESS_OK) {
                if (res.result.list.length > 0) {
                  this.scenicList = this.scenicList.concat(res.result);
                  if (res.result.isLastPage) {
                    this.nextUpLoad = false;
                  }
                }
              } else {
                this.showAlert('网络故障');
              }
            })
          } else {
            this.showAlert('没有更多数据了');
          }
          this.$refs.indexList.forceUpdate()
        }, 1000)
      }
    },
    created() {
      this.getList()
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .content {
    display: flex;
    margin: .23rem;
    .scenicSpot_list {
        width: 100%;
        .scenic-item {
          position: relative;
          width: 100%;
          margin-bottom: .2rem;
          .img{
            height: 3rem;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .infos {
            width: 100%;
            position: absolute;
            height: 1.08rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            left: 0;
            bottom: 0;
            background: rgba(0,0,0,0.4);
            .name{
              color: white;
              font-size: 16px;
              height: 1.08rem;
              line-height: 1.08rem;
              padding-left: .23rem;
              max-width: 85%;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .price{
              font-size: .4rem;
              padding-right: .23rem;
              color: #ff4a26;
              font{
                font-size: .2rem;
              }
            }
          }
        }
    }
  }

</style>
