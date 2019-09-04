<template>
  <div class="warp" style="width:100%;height:100%">
      <div class="travel-notes">
        <ul class="travel-list">
          <cube-index-list ref="indexList" :options="options" @pulling-up="onPullingUp" @pulling-down="onPullingDown">
            <h3 v-if="isData" style="margin-top: 20px;text-align:center">暂无更多数据~</h3>
            <cube-index-list-item v-for="(tmp, index) in travelList" :key="index">
              <li class="" @click="jump('travel/travelDetail', tmp.id)">
                <!--左侧文字-->
                <div class="lf-word">
                  <span class="modal-title" v-if="tmp.travelsName.length > 15">{{tmp.travelsName.slice(0,15)}}...</span>
                  <span class="modal-title" v-else>{{tmp.travelsName}}</span>
                  <div class="author-info">
                    <div  class="basic-info">
                      <i>
                        <img class="profile-photo" :src="tmp.userHeadPicUrl" alt="" />
                      </i>
                      <p class="user-name">{{tmp.nickName}}</p>
                    </div>
                    <div class="publish-time">{{tmp.creatTime}}</div>
                    <div v-if="getSearchState==2" class="delete" @click.stop="delItem(tmp)">删除</div>
                  </div>
                </div>
                <!--右侧图片-->
                <div class="rg-img">
                  <img class="modal-img" :src="item.url" alt="" v-for="(item,index2) in tmp.listFileUpload" v-if="index2<1" />
                </div>
              </li>
            </cube-index-list-item>
          </cube-index-list>
          <span></span>
        </ul>
      </div>
    <div v-if="getSearchState==2" class="write-travel" @click="jump('travel/travelNotes')"></div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { myTravelItem, defaultTravelList, delTravelItem } from '@/api/member'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        isData: false,
        travelList: [],
        num: 1,
        size: 6,
        options: {
          pullDownRefresh: {
            stop: 55,
            txt: '刷新成功'
          },
          pullUpLoad:  {
            // txt: {
            //   more: '没有更多数据'
            // }
          }
        }
      }
    },
    computed: {
      ...mapGetters(['getsearchValue', 'getSearchState', 'getSearchLabelId'])
    },
    methods: {
      ...mapMutations(['travelId', 'searchState']),
      jump: function(url, id) {
        this.$router.push({ path: url });
        this.travelId(id);
      },
      delItem(tmp) {
        this.showBtn('确认删除游记吗', this._delItem, tmp.id)
      },
      // 封装删除游记的方法
      _delItem(id) {
        delTravelItem(id).then(res => {
          if (res.code == SUCCESS_OK) {
            this.showAlert('删除游记成功')
            this.num = 1
            this.judgeIfSearch()
          } else {
            this.showAlert(res.desc)
          }
        })
      },
      // 个人中心跳转过来加载的游记列表
      _myTravelItem() {
        myTravelItem(this.num, this.size).then(res => {
          if (res.code == SUCCESS_OK) {
            this.travelList = res.result.list
            if (res.result.list.length < 1) {
              this.isData = true
            } else {
              this.isData = false
            }
          } else {
            this.showAlert('连接错误')
          }
        })
      },
      // 首页跳入该页面加载的列表
      _defaultTravelList(travelsName, lable) {
        defaultTravelList(this.num, this.size, travelsName, lable).then(res => {
          if (res.code == SUCCESS_OK) {
          //  console.log(res)
            this.travelList = res.result.list
            if (res.result.list.length < 1) {
              this.isData = true
            } else {
              this.isData = false
            }
          } else {
            this.showAlert('连接错误')
          }
        })
      },
      onPullingDown() {
        this.num = 1
        setTimeout(() => {
          // 请求数据,分为三种情况,状态0首页点击进入,状态1搜索页面进入,状态2个人中心进入游记
          if (this.getSearchState === 0) {
            // 首页进入
            this._defaultTravelList()
          } else if (this.getSearchState === 1) {
            // 搜索进入
            this._defaultTravelList(this.getsearchValue, this.getSearchLabelId)
          } else if (this.getSearchState === 2) {
            this._myTravelItem()
          }
          this.$refs.indexList.forceUpdate()
        }, 1000)
      },
      onPullingUp() {
        this.num++
        setTimeout(() => {
          // 请求数据,分为三种情况,状态0首页点击进入,状态1搜索页面进入,状态2个人中心进入游记
          if (this.getSearchState === 0) {
            // 首页进入
            defaultTravelList(this.num, this.size).then(res => {
              // 判断是否是最后一页
              if (res.code == SUCCESS_OK) {
                if (res.result.total <= this.travelList.length) {
                  this.showAlert('已为您加载全部数据')
                } else {
                  this.travelList = this.travelList.concat(res.result.list)
                }
              } else {
                this.showAlert('连接错误')
              }
            })
          } else if (this.getSearchState === 1) {
            // if (res.result.isLastPage == true) {
            //     this.showAlert('已为您加载全部数据')
            //   } else {}
            // 搜索进入
            defaultTravelList(this.num, this.size, this.getsearchValue, this.getSearchLabelId).then(res => {
              // 判断是否是最后一页
              if (res.code == SUCCESS_OK) {
                if (res.result.total <= this.travelList.length) {
                  this.showAlert('已为您加载全部数据')
                } else {
                  this.travelList = this.travelList.concat(res.result.list)
                }
              } else {
                this.showAlert('连接错误')
              }
            })
          } else if (this.getSearchState === 2) {
            myTravelItem(this.num, this.size).then(res => {
              if (res.code == SUCCESS_OK) {
                 if (res.result.total <= this.travelList.length) {
                    this.showAlert('已为您加载全部数据')
                  } else {
                    this.travelList = this.travelList.concat(res.result.list)
                  }
              } else {
                this.showAlert('连接错误')
              }
            })
          }
          this.$refs.indexList.forceUpdate()
        }, 1500)
      },
      // 封装判断是从常规入口进入还是从搜索页面进入，调用不同的接口，搜索传入searchValue
      judgeIfSearch() {
        if (this.getSearchState == 0) {
          // 这里是常规入口，也就是从首页进来的，调取列表接口写在这
          this._defaultTravelList()
        } else if (this.getSearchState == 1) {
          // 这里是搜索的入口，调用搜索的接口，传入搜索的getsearchValue
          this._defaultTravelList(this.getsearchValue, this.getSearchLabelId)
        } else if (this.getSearchState == 2) {
          // 这里是个人中心点击我的游记的入口
          this._myTravelItem()
        } else {
          // 如果拿不到state或者出现其他值，直接返回首页
          this.$router.push({ path: '/' })
        }
      }
    },
    mounted() {
      /* 请求数据 */
      // this.$api.get('/moble/home/selectHotTravelsList', this.params).then(res => {
      //   this.travelList = res.result.list;
      // })
      this.judgeIfSearch()
      console.log(this.getsearchValue)
      // this.search = this.getSearchState
      // console.log(this.getSearchState)
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  *,*:before,*:after{
    box-sizing:border-box;
    text-align: left;
  }
  .travel-notes{
    width: 100%;
    height: 100%;
    background: #fff;
    // padding: 0 0.19rem 0 0.2rem;
    .travel-list{
      height: 100%;
      li{
        width: 100%;
        height: 2.6rem;
        border-bottom: 0.5px solid #e8e5e5;
        padding: 3px 5px;
        display: flex;
        justify-content: space-between;
        .lf-word{
          position: relative;
          width: 4.34rem;
          margin-top: 2%;
          height: 83%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .modal-title{
            display: block;
            font-size: 0.38rem;
            width: 3.54rem;
            color: #030303;
            line-height: .5rem;
          }
          .author-info{
            .basic-info{
              height: 0.5rem;
              display: flex;
              align-items: center;
              i{
                width: 0.48rem;
                height: 0.48rem;
              }
              .profile-photo{
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
              .user-name{
                position: relative;
                top: 3px;
                font-size: 0.24rem;
                color: #666;
                margin-left: 0.16rem;
              }
            }
            .publish-time{
              font-size: 0.2rem;
              color: #BABABA;
              margin-left: 0.64rem ;
            }
            .delete {
              font-size: 12px;
              position: absolute;
              bottom: -6px;
              right: 5px;
              color: #a4a4a4;
              width: 40px;
              text-align: center;
              height: 30px;
              line-height: 30px;
              border-radius: 6px;
            }
          }
        }
        .rg-img{
          width: 30%;
          height: 80%;
          margin-top: 2%;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      li:last-child{
        border: 0;
      }
    }
  }

  .write-travel{
    position: fixed;
    width: 1.18rem;
    height: 1.18rem;
    bottom: 0.93rem;
    z-index: 2;
    right: 0.43rem;
    background: url("../../assets/images/write2x.png") no-repeat;
    background-size: 100% 100%;
  }
</style>
