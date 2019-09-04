<template>
  <div class="warp">
    <div class="header">
      <div class="banner-list" >
        <swiper :options="swiperOption" v-if="bannerList.length>0"  @click.native="doSome"  ref="mySwiper">
          <!-- 这部分放你要渲染的那些内容 -->
          <swiper-slide v-if="bannerList.length>0" v-for="item in bannerList" :key="item.id">
            <img class="banner-img" img :src="item.picDisplay" alt=""/>
          </swiper-slide>
          <!-- 这是轮播的小圆点 -->
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>
      <div class="top-search">
        <div class="search-box">
          <img src="../../assets/images/search-icon.png" class="search-icon" alt="" />
          <input type="text" class="search" @click="search()" placeholder="请输入要搜索的内容"/>
        </div>
      </div>
    </div>
    <div class="hot-spot">
      <div class="title-box">
        <span class="part-title">热门景点</span>
        <span  class="show-more" @click="jump('/home/scenic')"></span>
      </div>
      <div  class="scenic-list">
        <div  v-for="item in  scenicList" class="scenic-item" :key="item.id" @click="jump('/home/scenicParticulars', item.id, 1)">
          <img class="scenic-img" img :src="item.picUrl"  alt="">
          <div class="scenic-info">
            <h2 class="scenic-title">{{item.spotName}}</h2>
            <!-- <p class="scenic-abstract">{{item.spotContext}}</p> -->
          </div>
        </div>
      </div>
    </div>
    <div class="main-content">
      <!--推荐商家-->
      <!-- <div class="recommend-sell">
        <div class="title-box">
          <span class="part-title">推荐商家</span>
          <span  class="show-more" @click="jump('/home/sellerList')"></span>
        </div>
        <div class="recommend-list" >
          <swiper :options="swiperOption1"  ref="mySwiper1"> -->
            <!-- 这部分放你要渲染的那些内容 -->
              <!-- <swiper-slide v-for="(item,index) in shopList" :key="index" class=" recommend-item" @click.native="jump('home/sellerDetails', item.id, 2)">
                <div class="sell-img">
                  <a href="javascript:;">
                    <img img :src="item.picUrl[0]" alt="" />
                  </a>
                </div>
                <div class="recommend-info-box">
                  <span class="recommend-name">{{item.businessName}}</span>
                </div>
            </swiper-slide>
          </swiper>
        </div>
      </div> -->
      <!-- 单个的视频 -->
      <div class="scenic-video">
        <div class="title-box">
          <span class="part-title">景区视频</span>
        </div>
        <div class="video-show">
          <video :src="videoSrc" preload="meta" controls poster="../../assets/images/scenicsopt-img.jpg"></video>
        </div>
      </div>
      <!--游记攻略-->
      <div class="travel-notes">
        <div class="title-box">
          <span class="part-title">游记攻略</span>
          <span  class="show-more" @click="jump('travel')"></span>
        </div>
        <ul class="travel-list">
          <li  v-for="item in  travelsList" class="" :key="item.id" @click="jump('/travel/travelDetail', item.id, 3)">
            <!--左侧文字-->
            <div class="lf-word">
              <!-- <span class="modal-title" v-if="item.travelsName.length <=15">{{item.travelsName}}</span>
              <span class="modal-title" v-else>{{item.travelsName.slice(0,15)}}...</span> -->
              <span class="modal-title">{{item.travelsName}}</span>
              <!-- <div class="author-info">
                <div  class="basic-info">
                  <img class="profile-photo" img :src="item.userHeadPicUrl" alt="" />
                  <p class="user-name">{{item.nickName}}</p>
                </div>
                <div class="publish-time">{{item.creatTime}}</div>
              </div> -->
            </div>
            <!--右侧图片-->
            <div class="rg-img">
              <img class="modal-img" :src="tmp.url" v-for="(tmp,index2) in item.listFileUpload" :key="tmp.url" v-if="index2<1"/>
            </div>
          </li>
        </ul>
      </div>
      <!--新闻资讯-->
      <div class="news-info">
        <div class="title-box">
          <span class="part-title">新闻资讯</span>
          <span class="show-more" @click="jump('/home/newInformation')"></span>
        </div>
        <ul class="news-list">
          <li v-for="item in  newsList"  class="clearfix" :key="item.id" @click="jump('/home/newDetail', item.id, 4)">
            <!--左侧图片-->
            <div class="lf-img">
                <img img :src="item.picUrl" alt="" />
            </div>
            <!--右侧文字-->
            <div class="news-item">
              <div class="news-content">
                <!-- <div  class="news-title" v-if="item.newName.length < 12">{{item.newName}}</div>
                <div  class="news-title" v-else>{{item.newName.slice(0,12)}}...</div> -->
                <div  class="news-title">{{item.newName}}</div>
                <!-- <div  class="news-abstract" v-if="item.newContrxt.length < 20">{{item.newContrxt}}</div>
                <div  class="news-abstract" v-else>{{item.newContrxt.slice(0,20)}}...</div> -->
                <div  class="news-abstract">{{item.newContrxt}}</div>
              </div>
              <p class="news-time">{{item.creatTime}}</p>
            </div>
          </li>
        </ul>
      </div>
      <!--我的底线-->
      <p class="low-line ">-------- 我们的底线 --------</p>
      </div>
  </div>
</template>
<script>
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  import 'vue-awesome-swiper/node_modules/swiper/dist/css/swiper.css'
  import { selectHotNewsList, selectHotTravelsList, selectHotBusinessList, selectHotSpotsList, selectBannerList } from '@/utils/wfetch'
  import { mapMutations, mapGetters } from 'vuex'
  import { getParkVideo } from '@/api/member'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    components: {
      swiper,
      swiperSlide
    },
    data() {
      const bannerList = [];
      const scenicList = [];
      const shopList = [];
      const travelsList = [];
      const newsList = [];
      return {
        // videoSrc: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
        videoSrc: '',
        msg: 'Welcome to Your Vue.js App',
        bannerList: bannerList,
        scenicList: scenicList,
        shopList: shopList,
        travelsList: travelsList,
        newsList: newsList,
        size:4,
        num: 1,
        swiperOption: {
          // 是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          // notNextTick: true,
          pagination: '.swiper-pagination',
          // 所有配置均为可选（同Swiper配置）
          //
          // slidesPerView: 2,
          loop: true,
          loopAdditionalSlides:-1,
          loopedSlides :8,
          speed: 500,
          autoplay: 3000,
          autoplayDisableOnInteraction: false,
          paginationClickable: true,
          mousewheelControl: true,
          observer: true,
          observeParents: true,
          debugger: true,
          // onSlideChangeEnd: swiper => {
          //   // 这个位置放swiper的回调方法
          //   // console.log(swiper.realIndex)
          //   //  this.page = swiper.realIndex + 1;
          //   // this.index = swiper.realIndex;
          // },
          preventLinksPropagation: false   // 阻止点击事件冒泡
        },
        swiperOption1: {
          slidesPerView: 2.2,
          spaceBetween: 30,
          slidesOffsetAfter: 100,
          resistanceRatio: 0,
          notNextTick:true
        }
      }
    },
    computed: {
      ...mapGetters(['getToken']),
      swiper() {
        return this.$refs.mySwiper.swiper;
      },
      swiper1() {
        return this.$refs.mySwiper1.swiper;
      }
    },
    methods: {
      doSome() {
        // 获取第一张轮播图的真实index序号
        var index = this.$refs.mySwiper.swiper.realIndex
        var item = this.bannerList[index]
        this.bannerGo(item)
      },
      // 获取首页的景区视频
      _getParkVideo() {
        getParkVideo().then(res => {
          if (res.code == SUCCESS_OK) {
            this.videoSrc = res.result
          }
        })
      },
      handleClickSlide(index) {
        console.log('handleClickSlide current index', index);
      },
      ...mapMutations(['sceincId', 'productId', 'sellerId', 'travelId', 'newsId', 'searchState']),
      bannerGo(item) {
        // 1是商品管理 2是景点管理 3是新闻资讯 4是商家管理 5游记攻略 6其他
        if (item.bannerUrlType == 1) {
          this.productId(item.businessId)
          this.$router.push({ path: '/home/detail' })
        } else if (item.bannerUrlType == 2) {
          this.sceincId(item.businessId)
          this.$router.push({ path: '/home/scenicParticulars' })
        } else if (item.bannerUrlType == 3) {
          this.newsId(item.businessId)
          this.$router.push({ path: '/home/newDetail' })
        } else if (item.bannerUrlType == 4) {
          this.sellerId(item.businessId)
          this.$router.push({ path: '/home/sellerDetails' })
        } else if (item.bannerUrlType == 5) {
          this.travelId(item.businessId)
          this.$router.push({ path: '/travel/travelDetail' })
        } else if (item.bannerUrlType == 6) {
          window.location.href = item.bannerUrl
        }
      },
      // 点击搜索框跳转搜索系统
      search() {
        this.$router.push({ path: '/search' })
      },
      jump: function(url, id, idState) {
        // 首页的商家列表 景点列表点击查看更多时更改搜索状态为0
        this.searchState(0)
        this.$router.push({ path: url });
        switch (idState) {
          case 1:
            this.sceincId(id);
            break;
          case 2:
            this.sellerId(id);
            break;
          case 3:
            this.travelId(id);
            break;
          case 4:
            this.newsId(id);
            break;
        }
      }
    },
    created: function() {
      const that = this;
      const params = { num: this.num, size: this.size, isHome: 0 };
      const data = { bannertype: '1' }
      /* 请求数据 */
      this._getParkVideo()
      selectBannerList(data).then(res => {
        if (res.code === SUCCESS_OK) {
          that.bannerList = res.result.list;
          that.$nextTick(function() {
            this.swiper.slideTo(0, 0, false);
            // this.swiper1.slideTo(0, 0, false);
          })
        } else {
          that.showAlert('获取轮播图失败');
        }
      });
      /* 获取景点数据 */
      selectHotSpotsList(params).then(res => {
        if (res.code === SUCCESS_OK) {
          that.scenicList = res.result.list;
        } else {
          that.showAlert('获取景点列表失败');
        }
      });
      /* 获取商家数据 */
      selectHotBusinessList(params).then(res => {
        if (res.code === SUCCESS_OK) {
          that.shopList = res.result.list;
      /*    that.$nextTick(function() {
          })*/
        } else {
          that.showAlert('获取商家列表失败');
        }
      });
      /* 获取旅游数据 */
      selectHotTravelsList(params).then(res => {
        if (res.code === SUCCESS_OK) {
          // console.log(res)
          that.travelsList = res.result.list;
        } else {
          that.showAlert('获取游记列表失败');
        }
      });
      /* 获取新闻列表 */
      selectHotNewsList(params).then(res => {
        if (res.code === SUCCESS_OK) {
          // console.log(res)
          that.newsList = res.result.list;
        } else {
          that.showAlert('获取新闻列表失败');
        }
      })
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @font-color:#030303;
  .swiper-pagination-bullet{
    width: 0.2rem;
    height: 0.06rem;
    display: inline-block;
    background: #fff;
    opacity: 0.5;
  }
  .swiper-pagination-bullet-active {
    opacity: 1;
    background: #fff;
  }
  input:-ms-input-placeholder{
    color: white;opacity:1;
  }

  input::-webkit-input-placeholder{
    color: white;opacity:1;
  }
  .warp{
    position: relative;
    background-color: #F4F4F4;
    text-align: left;
  }
  *,*:before,*:after{box-sizing:border-box;}
  .header{
    width: 100%;
    height: 3.4rem;
    position: relative;
    .banner-list{
      width: 100%;
      height: 3.4rem;
      img{
        width: 100%;
        height: 3.4rem;
      }
    }
    .top-search{
      position: absolute;
      top: 0.32rem;
      left: 0.7rem;
      z-index: 1000;
      width: 6rem;
      height: 0.65rem;
      background: rgba(101,101,101,0.6);
      // background:url("../../assets/images/searchinput2x.png") center center ;
      background-size:100% 100%;
      opacity: 0.7;
      border-radius: 18px;
    }
     .search-box{
      width:100%;
      height: 0.65rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .search-icon{
      height: 0.26rem;
      width: 0.26rem;
    }
    .search{
      font-size: 14px;
      width: 50%;
      height: 100%;
      padding-left: 0.2rem;
      border: 0;
      background: rgba(255,255,255,0);
      line-height: 0.62rem
    }
  }
  .title-box{
    margin-top: .3rem;
    margin-bottom: 0.21rem;
    display: flex;
    justify-content: space-between;
    .part-title{
      font-size: 0.34rem;
      font-weight: bold;
      color: @font-color;
    }
    .show-more{
      display: inline-block;
      width:1.34rem;
      height: 0.25rem;
      background: url("../../assets/images/showMore2x.png") no-repeat;
      background-size: 100% 100%;
    }
  }
  .hot-spot{
    background: url("../../assets/images/background2x.png") no-repeat ;
    background-size: 100% 100%;
    padding: 0.1rem 0.26rem 0.24rem 0.26rem;
    width: 100%;
    position: relative;
    top: -.1rem;
    z-index: 1000;
    .scenic-list{
      width: 100%;
      display: flex;
      flex-flow: wrap;
      justify-content: space-between;
      .scenic-item{
        width: 3.44rem;
        height: 2.3rem;
        position: relative;
        margin-bottom: 0.08rem;
        .scenic-img{
          width: 100%;
          height: 100%;
        }
        .scenic-info{
          position: absolute;
          top: 0;
          left: 0;
          margin-top: 0.4rem;
          margin-left: 0.24rem;
          width: 3rem;
          .scenic-title{
            font-size: 15px;
            height: 20px;
            line-height: 20px;
            font-weight: bold;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: white;
          }
          .scenic-abstract{
            margin-top: 0.15rem;
            color: #BEBEBE;
            width: 100%;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .main-content{
    width: 100%;
    margin-top: .1rem;
    background-color: #F4F4F4;
    .recommend-sell{
      padding: 0.1rem 0 0.1rem 0.26rem ;
      background: #fff;
      width: 100%;
      .title-box{
        margin-right: 0.26rem;
      }
      .recommend-item{
        margin-right: 60px;
        .sell-img{
          width: 3.36rem;
          height: 3.36rem;
          img{
            border-radius:0.06rem ;
            width: 100%;
            height: 100%;
          }
        }
        .recommend-info-box{
          /*height: .7rem;*/
          display: flex;
          flex-direction: column;
          margin-top: 10px;
          width: 3.3rem;
          height: 20px;
          line-height: 20px;
          .recommend-name{
            display: block;
            font-size: 14px;
            color: @font-color;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          .recommend-content{
            display: block;
            font-size: 12px;
            color: #BABABA;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
    }
    .scenic-video{
      padding: 0.1rem 0.26rem 0.1rem 0.26rem ;
      background: #fff;
      width: 100%;
      box-sizing: border-box;
      .title-box{
        margin-right: 0.26rem;
      }
      .video-show {
        width: 100%;
        video {
          width: 100%;
        }
      }
    }
    .travel-notes{
      width: 100%;
      background: #fff;
      margin-top: 0.2rem;
      padding: 0.1rem 0.26rem 0rem 0.26rem;
      .travel-list{
        li{
          width: 100%;
          border-bottom: 0.5px solid #ddd;
          padding:  7px 0;
          display: flex;
          justify-content: space-between;
          .lf-word{
            width: 4.28rem;
            /*height: 2.08rem;*/
            display: flex;
            flex-direction: column;
            justify-content: center;
            .modal-title{
              display: block;
              height: 20px;
              font-size: 16px;
              font-weight: bold;
              line-height: 20px;
              width: 4.24rem;
              color: @font-color;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap
            }
            .author-info{
              .basic-info{
                height: 0.5rem;
                display: flex;
                align-items: center;
                .profile-photo{
                  width: 0.48rem;
                  height: 0.48rem;
                  border-radius: 50%;
                }
                .user-name{
                  font-size: 0.24rem;
                  color: #666;
                  margin-left: 0.16rem;
                }
              }
              .publish-time{
                font-size: 0.22rem;
                color: #BABABA;
                margin-left: 0.64rem ;
              }
            }
          }
          .rg-img{
            width: 2.4rem;
            height: 2.04rem;
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
    .news-info{
      margin-top: 0.2rem;
      background: #fff;
      padding: 0.1rem 0.26rem 0rem 0.26rem;
      .title-box{
        margin-bottom: 0.28rem;
      }
      li{
        padding: 7px 0 7px 0;
        border-bottom: 0.5px solid #ddd;
        display: flex;
        justify-content: space-between;
        .lf-img{
          width: 2.1rem;
          height: 2.1rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .news-item{
          position: relative;
          padding-left: 0.2rem;
          width: 4.7rem;
          height: 1.8rem;
          margin-top:0.15rem;
          display: flex;
          flex-direction: column;
          // justify-content: space-between;
          .news-title{
            display: block;
            height: 20px;
            line-height: 20px;
            font-size: 16px;
            color: @font-color;
            font-weight: bold;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .news-abstract{
            margin-top: 12px;
            line-height: 20px;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .news-time{
            position: absolute;
            bottom: 0;
            color: #C6C6C6;
            font-size: 0.22rem;
          }
        }
      }
    }
    .low-line{
      width: 100%;
      font-size: 0.2rem;
      margin: 0.4rem 0 0.9rem 0;
      display: inline-block;
      text-align: center;
      color: #8C8C8C;
    }
  }
</style>
