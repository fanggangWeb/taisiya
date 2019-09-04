<template>
  <!-- 商城-->
  <div class="warp" style="height:100%">
<!--    <div class="topBar">
      <span class="drive" :class="{'active':typeBar === 1}" @click="jump('/map',1)">驾车</span>
      <span class="bus" @click="jump('/map/route',2)" :class="{'active':typeBar === 2}" >公交</span>
      <span class="walk" @click="jump('/map/walk',3)" :class="{'active':typeBar === 3}" >步行</span>
    </div>-->
    <div class="side-bar">
      <div v-for="item in sideList" :data-value="item.value" :key="item.value" class="bar-item" :class="'type'+item.value">
        <div class="icon"></div>
        <div class="desc">{{item.display}}</div>
      </div>
    </div>
    <div class="map_item" id="map-container"> </div>
  </div>
</template>

<script>
  const that = this
  import { mapGetters, mapMutations } from 'vuex'
  import { selectIdentificationList } from '@/utils/wfetch'
  import { getMapSideBar } from '@/api/member'
  const SUCCESS_OK = "rest.success"
  export default {
    data() {
      return {
        sideList: [],
        goByType: 0,
       // centerPoint:[106.593202, 29.54951],
        centerPoint: [], // 终点
        centerPointLng: 106.415841, // 太寺娅景区经纬度
        centerPointLat: 29.739504, // 太寺垭维度
        myPoint: [], // 起点坐标
        startName:'',
        routeS:[], // 步行方案
        startmarker: {}, // 起始图标标记
        endmarker: {},  // 终点标记
        extra_line1: {},  // 路线的起点到实际的起点之间的无道路部分
        extra_line2: {},  // 路线的终点到实际的终点之间的无道路部分
        polyline: {},  // 画转折点
        polylines: [], // 所有折线集合，方便清除路线
        start_xy:{}, // 起点
        end_xy : {}, // 终点
        markers:{}
        // typeBar: 3
      }
    },
    computed: {
      ...mapGetters(['getLng', 'getLat', 'getSellerId', 'getSceincId'])
    },
    created() {
    },
    mounted() {
      this.init()
      this.watchType()
      this._getMapSideBar()
    },
    updated() {
      // $('.icon').eq(0).addClass('active')
      document.getElementsByClassName('icon')[0].setAttribute('class', 'icon active')
    },
    methods: {
      ...mapMutations(['lng', 'lat', 'sellerId', 'sceincId']),
      init: function() {
        /* eslint-disable no-undef*/
        const mapObj = new AMap.Map('map-container', {
          center: that.centerPoint,
          zoom: 9,
          resizeEnable: true
        });
        var myThis = this;
        myThis.addSellMark()
        myThis.centerPoint = [myThis.getLng, myThis.getLat]
        myThis.mapObj = mapObj
        myThis.mapObj.plugin(['AMap.Geolocation'], function() {
          const geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //  是否使用高精度定位，默认:true
            timeout: 10000, //  超过10秒后停止定位，默认：无穷大
            maximumAge: 0, // 定位结果缓存0毫秒，默认：0
            convert: true, // 自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true, //  显示定位按钮，默认：true
            buttonPosition: 'RB',  // 定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 20), //  定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true, //  定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true, //  定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: false,  //  定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy: true  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          // ios环境切换到使用远程https定位 （放在初始化地图后面）
          if (AMap.UA.ios) {
            // 使用远程定位，见 remogeo.js
            var remoGeo = new RemoGeoLocation()
            // 替换方法
            navigator.geolocation.getCurrentPosition = function() {
              return remoGeo.getCurrentPosition.apply(remoGeo, arguments)
            }
            // 替换方法
            navigator.geolocation.watchPosition = function() {
              return remoGeo.watchPosition.apply(remoGeo, arguments)
            }
          }
          mapObj.addControl(geolocation);
          geolocation.getCurrentPosition()
          AMap.event.addListener(geolocation, 'complete', (result) => {
            myThis.startName = result.formattedAddress
            myThis.myPoint = [result.position.lng, result.position.lat]
            // myThis.drafting()
            myThis.addSellMark()
          })  //  返回定位信息
          AMap.event.addListener(geolocation, 'error', (result) => {
            myThis.showAlert("定位失败");
            // console.log(result)
          })  //  返回定位出错信息
        });
      },
      // 调用接口添加标记
      addSellMark: function(data) {
        selectIdentificationList(data).then(res => {
          if (res.code === SUCCESS_OK) {
            if (res.result.length > 0) {
              for (var i = 0; i < res.result.length; i++) {
                console.log(res)
                this.addMark(res.result[i])
              }
            }
          } else {
            this.showAlert('网络故障');
          }
        });
      },
      // 添加点标记，并使用自己的icon
      addMark: function(res) {
        var myThis = this
        var url
        var iconHtml
        if (res.businessType == 4) {
          url = require('../../assets/images/mapIcon/jingdian@2x.png')
          iconHtml = `<div class="amap-icon spot-html" style="overflow: hidden;padding:10px;width: 26px;height: 26px;border-radius: 50%;">
            <span style="position: absolute;left: 50%;top: 0;margin-left: -13px;overflow: hidden;display: block;width: 26px;height: 26px;line-height: 26px;font-size: 12px;color: #fff;text-align: center;background-color: #61C2FF;">${res.icName}</span>
          </div>`
        } else if (res.businessType == 3) {
          url = require('../../assets/images/mapIcon/shangjia@2x.png')
          iconHtml = `<div class="amap-icon spot-html" style="overflow: hidden;padding:10px;width: 26px;height: 26px;border-radius: 50%;">
            <span style="position: absolute;left: 50%;top: 0;margin-left: -13px;overflow: hidden;display: block;width: 26px;height: 26px;line-height: 26px;font-size: 12px;color: #fff;text-align: center;background-color: #FFC082;">${res.icName}</span>
          </div>`
        } else if (res.businessType == 1) {
          url = require('../../assets/images/mapIcon/qita@2x.png')
          iconHtml = `<div class="amap-icon spot-html" style="overflow: hidden;padding:10px;width: 26px;height: 26px;border-radius: 50%;">
            <span style="position: absolute;left: 50%;top: 0;margin-left: -13px;overflow: hidden;display: block;width: 26px;height: 26px;line-height: 26px;font-size: 12px;color: #fff;text-align: center;background-color: #FFC082;">${res.icName}</span>
          </div>`
        } else if (res.businessType == 5) {
          url = require('../../assets/images/mapIcon/gongce@2x.png')
          iconHtml = `<div class="amap-icon spot-html" style="overflow: hidden;padding:10px;width: 26px;height: 26px;border-radius: 50%;">
            <span style="position: absolute;left: 50%;top: 0;margin-left: -13px;overflow: hidden;display: block;width: 26px;height: 26px;line-height: 26px;font-size: 12px;color: #fff;text-align: center;background-color: #FEDC65;">${res.icName}</span>
          </div>`
        } else if (res.businessType == 6) {
          url = require('../../assets/images/mapIcon/fuwudian@2x.png')
          iconHtml = `<div class="amap-icon spot-html" style="overflow: hidden;padding:10px;width: 26px;height: 26px;border-radius: 50%;">
            <span style="position: absolute;left: 50%;top: 0;margin-left: -13px;overflow: hidden;display: block;width: 26px;height: 26px;line-height: 26px;font-size: 12px;color: #fff;text-align: center;background-color: #8DDBA1;">${res.icName}</span>
          </div>`
        } else if (res.businessType == 7) {
          url = require('../../assets/images/mapIcon/canting@2x.png')
          iconHtml = `<div class="amap-icon spot-html" style="overflow: hidden;padding:10px;width: 26px;height: 26px;border-radius: 50%;">
            <span style="position: absolute;left: 50%;top: 0;margin-left: -13px;overflow: hidden;display: block;width: 26px;height: 26px;line-height: 26px;font-size: 12px;color: #fff;text-align: center;background-color: #FF90E4;">${res.icName}</span>
          </div>`
        } else if (res.businessType == 8) {
          url = require('../../assets/images/mapIcon/tingchechang@2x.png')
          iconHtml = `<div class="amap-icon spot-html" style="overflow: hidden;padding:10px;width: 26px;height: 26px;border-radius: 50%;">
            <span style="position: absolute;left: 50%;top: 0;margin-left: -13px;overflow: hidden;display: block;width: 26px;height: 26px;line-height: 26px;font-size: 12px;color: #fff;text-align: center;background-color: #FF8C8C;">${res.icName}</span>
          </div>`
        }

        var marker = new AMap.Marker({
          map: myThis.mapObj,
          position: [res.log, res.lat],
          icon: new AMap.Icon({
            size: new AMap.Size(34, 58),  // 图标大小
            // image: res.picUrl,
            image: url,
            imageOffset: new AMap.Pixel(0, 0)
          }),
          content: iconHtml
        });
        // 给标记添加弹框
        marker.on('click', function(e) {
          // 信息窗体的内容
        var content = `<div class="info-title" style="color: white;
          letter-spacing: 2px !important;
          font-size: 0.35rem;
          background-color: #fdb900;
          line-height: 0.8rem;
          padding: 0px 0 0 10px;
          height: 0.8rem;
          letter-spacing: 1px;">${res.icName}</div>
          <div style="padding:12px 15px;width:280px;min-width:200px;">
            <p style="font-size:0.28rem;line-height:0.5rem;">地址：${res.address}</p>
            <p class="facility-type" style="font-size:0.28rem;line-height:0.5rem;margin-top:5px;">类型：${res.businessTypeDisplay}
              <button data-type="${res.businessType}" data-bid="${res.businessId}" class="facility-detail ${'detailType' + res.businessType}" style="display:none;line-height:0.5rem;float:right;height:0.5rem;width:60px;text-align:center;background:white;border:none">详情>></button>
            </p>
            <div class="goType-con" style="display:flex;flex-wrap:nowrap;margin-top:10px;">
            <button class="byFoot goType active" data-lng="${res.log}" data-lat="${res.lat}" style="border-radius:5px;text-align:center;border:rgb(185,185,185) 0.5px solid;width:62px;margin-right:0.15rem;padding-right:3px;height:33px;background:white;">
              <span class="icon active" style="display:inline-block;width:40%;height:60%;margin-top:7px;"></span>
              <span style="line-height:33px;display:inline-block;height:100%;float:right;width:60%;text-align:left">步行</span>
            </button>
            <button class="byBus goType" data-lng="${res.log}" data-lat="${res.lat}" style="border-radius:5px;text-align:center;border:rgb(185,185,185) 0.5px solid;width:62px;margin-right:0.15rem;padding-right:3px;height:33px;background:white;">
              <span class="icon" style="display:inline-block;width:40%;height:60%;margin-top:7px;"></span>
              <span style="line-height:33px;display:inline-block;height:100%;float:right;width:60%;text-align:left">公交</span>
            </button>
            <button class="byCar goType" data-lng="${res.log}" data-lat="${res.lat}" style="border-radius:5px;text-align:center;border:rgb(185,185,185) 0.5px solid;width:62px;margin-right:0.15rem;padding-right:3px;height:33px;background:white;">
              <span class="icon" style="display:inline-block;width:35%;height:60%;margin-top:7px;margin-left:1px"></span>
              <span style="line-height:33px;display:inline-block;height:100%;float:right;width:60%;text-align:center">驾驶</span>
            </button>
            <button class="confirmGo" data-lng="${res.log}" data-lat="${res.lat}" style="border-radius:5px;text-align:center;border:#fdb900 0.5px solid;width:80px;margin-right:0.2rem;padding-right:3px;height:33px;color:white;background-color:#fdb900;">
              <span class="icon" style="display:inline-block;width:30%;height:50%;margin-top:7px;"></span>
              <span style="line-height:33px;display:inline-block;height:100%;float:right;width:65%;text-align:center;margin-left:-9px">去这里</span>
            </button>
          </div>
          </div>`
          myThis.mapObj.plugin('AMap.AdvancedInfoWindow', function() {
          // 创建infoWindow实例
          // todo: 解释重要参数示意
          // const map = myThis.mapObj
          myThis.advancedInfoWindow = new AMap.AdvancedInfoWindow({
            panel: 'panel',
            placeSearch: false,
            asOrigin: false,
            asDestination: false,
            content: content,
            offset: new AMap.Pixel(0, -40)
          })
        });
          const map = myThis.mapObj
          myThis.markers = { lng:res.log, lat:res.lat }
          // myThis.selRoute(res.icName, '地址:' + res.address)
          // 打开信息窗体
          myThis.advancedInfoWindow.open(map, marker.getPosition())
        })
      },
      // 监听信息窗口的三种方式的点击事件
      watchType: function() {
        var myThis = this
        $('body').on('click', '.goType', function() {
          myThis.lng($(this).data('lng'))
          myThis.lat($(this).data('lat'))
          $(this).addClass('active')
          $(this).siblings().removeClass('active')
          $(this).children('.icon').addClass('active')
          $(this).siblings().children('.icon').removeClass('active')
          if ($(this).hasClass('byFoot')) {
            // 这里是步行
            myThis.goByType = 0
          } else if ($(this).hasClass('byBus')) {
            // 这里是公交线路
            myThis.goByType = 1
          } else {
            // 这里是驾车线路
            myThis.goByType = 2
          }
        })
        // 点击去这里
        $('body').on('click', '.confirmGo', function() {
          if (myThis.goByType === 0) {
            myThis.$router.push({ path: '/map/walk' })
          } else if (myThis.goByType === 1) {
            myThis.$router.push({ path: '/map/route' })
          } else if (myThis.goByType === 2) {
            myThis.$router.push({ path: '/map' })
          } else {
            myThis.showAlert('请选择交通类型')
          }
        })
        // 点击详情判断类型3为商家，4为景点
        $('body').on('click', '.facility-detail', function() {
          var id = $(this).data('bid')
          if ($(this).data('type') == '3') {
            myThis.sellerId(id)
            myThis.$router.push({ path:'/home/sellerDetails' })
          } else if ($(this).data('type') == '4') {
            myThis.sceincId(id)
            myThis.$router.push({ path:'/home/scenicParticulars' })
          } else {
            myThis.showAlert('该设施暂无详情')
          }
        })
        // 点击侧边导航栏改变样式调用不同参数
        $('body').on('click', '.bar-item', function() {
          var value = $(this).data('value')
          console.log(value)
          $(this).siblings().children('.icon').removeClass('active')
          $(this).children('.icon').addClass('active')
          // 重新设置中心点和缩放
          myThis.mapObj.setZoomAndCenter(14, [106.415841, 29.739504])
          // myThis.mapObj.panTo([106.415841, 29.739504])
          // myThis.mapObj.moveCamera(CameraUpdateFactory.zoomTo(12))
          if (value == 0) {
            // 说明点击的是全部显示全部
            myThis.mapObj.clearMap()
            myThis.addSellMark()
          } else {
            // 点击其他的几个地方直接穿value过去
            myThis.mapObj.clearMap()
            var data = {
              businessType: value
            }
            myThis.addSellMark(data)
          }
        })
      },
      // 获取侧边栏的菜单
      _getMapSideBar() {
        const data = { code: 'businessType' }
        getMapSideBar(data).then(res => {
          if (res.code == SUCCESS_OK) {
            var sideList = res.result
            var firstOne = { value: 0, display: '全部' }
            sideList.splice(0, 0, firstOne);
            this.sideList = sideList
          }
        })
      },
      // 点击确定后换终点
      clickChange() {
        var  myThis = this
        myThis.mapObj.remove(myThis.polylines);
        myThis.mapObj.remove(myThis.extra_line1);
        myThis.mapObj.remove(myThis.extra_line2);
        myThis.centerPoint[0] = myThis.markers.lng
        myThis.centerPoint[1] = myThis.markers.lat
        myThis.walking_route()
      },
      // 拖拽改变终点
      drafting: function() {
        var  myThis = this
        AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
          var positionPicker = new PositionPicker({
            mode: 'dragMarker',
            map: myThis.mapObj
          });
          positionPicker.on('success', function(positionResult) {
            // 清除地图上原有的路线
            myThis.mapObj.remove(myThis.polylines);
            myThis.mapObj.remove(myThis.extra_line1);
            myThis.mapObj.remove(myThis.extra_line2);
            myThis.centerPoint[0] = positionResult.position.lng
            myThis.centerPoint[1] = positionResult.position.lat
            myThis.walking_route()
          });
          positionPicker.on('fail', function(positionResult) {
            console.log('拖拽失败')
          });
          positionPicker.start(myThis.centerPoint);
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .map_item{
    height: 100%;
  }
  .side-bar{
    position: fixed;
    left: 5px;
    top: 10%;
    display: flex;
    width: 1rem;
    border-radius: 5px;
    flex-wrap: wrap;
    z-index: 10001;
    box-shadow: 6px 6px 5px #c7c7c7;
  }
  .bar-item{
    width: 100%;
    height: 1rem;
    color: black;
    background-color: white;
    display: flex;
    flex-wrap: wrap;
  }
  .icon {
    margin-top: 5px;
    height: 40%;
    width: 40%;
    margin-left: 30%;
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  .type0 .icon{
    background-image: url(../../assets/images/mapTour/全部@3x.png)
  }
  .type1 .icon{
    background-image: url(../../assets/images/mapTour/全部@3x.png)
  }
  .type3 .icon{
    background-image: url(../../assets/images/mapTour/商家@3x.png)
  }
  .type4 .icon{
    background-image: url(../../assets/images/mapTour/景点@3x.png)
  }
  .type5 .icon{
    background-image: url(../../assets/images/mapTour/公厕@3x.png)
  }
  .type6 .icon{
    background-image: url(../../assets/images/mapTour/服务点@3x.png)
  }
  .type7 .icon{
    background-image: url(../../assets/images/mapTour/餐厅@3x.png)
  }
  .type8 .icon{
    background-image: url(../../assets/images/mapTour/停车场@3x.png)
  }
  .type0 .active{
    background-image: url(../../assets/images/mapTour/全部黄@3x.png)
  }
  .type1 .active{
    background-image: url(../../assets/images/mapTour/全部黄@3x.png)
  }
  .type3 .active{
    background-image: url(../../assets/images/mapTour/商家黄@3x.png)
  }
  .type4 .active{
    background-image: url(../../assets/images/mapTour/景点黄@3x.png)
  }
  .type5 .active{
    background-image: url(../../assets/images/mapTour/公厕黄@3x.png)
  }
  .type6 .active{
    background-image: url(../../assets/images/mapTour/服务点黄@3x.png)
  }
  .type7 .active{
    background-image: url(../../assets/images/mapTour/餐厅黄@3x.png)
  }
  .type8 .active{
    background-image: url(../../assets/images/mapTour/停车场黄@3x.png)
  }
  .desc {
    width: 100%;
    font-size: 12px;
    height: 14px;
    line-height: 14px;
    text-align: center;
  }
  .info-title {
    color: white;
    font-size: 14px;
    background-color: blue;
    line-height: 26px;
    padding: 0px 0 0 6px;
    font-weight: lighter;
    letter-spacing: 1px;
  }
  .spot-html span {
    position: absolute;
    left: 25%;
    top: 8px;
    width: 50%;
    overflow: hidden;
  }
  .spot-html {
    position: relative;
    display: block;
    width: 22px;
    height: 40px;
  }
  .spot-html:before{content:''; height:12px; width:12px; border:5px solid blue; display:block; position:absolute; top:2px;
  left:0px; z-index:1; background:#fff; line-height:26px;
  border-radius:40px;-webkit-border-radius:40px;-moz-border-radius:40px; color:#fff; text-align:center;}
  .spot-html:after{content:''; height:0px; width:0px; display:block; position:absolute; bottom:2px; left:1px; border:10px
  transparent solid; border-top-color:blue; border-width:20px 10px 0px 10px; }
</style>
