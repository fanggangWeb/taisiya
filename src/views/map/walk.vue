<template>
  <!-- 商城-->
  <div class="warp" style="height:100%">
    <div class="topBar">
      <span class="drive" :class="{'active':typeBar === 1}" @click="jump('/map',1)">驾车</span>
      <span class="bus" @click="jump('/map/route',2)" :class="{'active':typeBar === 2}" >公交</span>
      <span class="walk" @click="jump('/map/walk',3)" :class="{'active':typeBar === 3}" >步行</span>
    </div>
    <div class="map_item" id="map-container"> </div>
  </div>
</template>

<script>
  const that = this
  import { mapGetters, mapMutations } from 'vuex'
  import { selectIdentificationList } from '@/utils/wfetch'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
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
        markers:{},
        typeBar: 3
      }
    },
    computed: {
      ...mapGetters(['getLng', 'getLat'])
    },
    mounted() {
      this.init()
    },
    methods: {
      ...mapMutations(['lng', 'lat']),
      jump(url, num) {
        this.$router.push({ path: url });
        this.typeBar = num
        this.lng(this.centerPoint[0])
        this.lat(this.centerPoint[1])
      },
      init: function() {
        /* eslint-disable no-undef*/
        const mapObj = new AMap.Map('map-container', {
          center: that.centerPoint,
          zoom: 15,
          resizeEnable: true
        });
        var myThis = this;
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
            myThis.drafting()
            // myThis.addSellMark()
          })  //  返回定位信息
          AMap.event.addListener(geolocation, 'error', (result) => {
            myThis.showAlert("定位失败");
            // console.log(result)
          })  //  返回定位出错信息
        });
      },
      // 调用接口添加标记
      addSellMark: function() {
        selectIdentificationList().then(res => {
          if (res.code === SUCCESS_OK) {
            if (res.result.length > 0) {
              for (var i = 0; i < res.result.length; i++) {
             //   console.log(res)
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
         var  myThis = this
         var marker = new AMap.Marker({
          map: myThis.mapObj,
          position: [res.log, res.lat],
          icon: new AMap.Icon({
          size: new AMap.Size(34, 58),  // 图标大小
          image: res.picUrl,
          imageOffset: new AMap.Pixel(0, 0)
          })
        });
        marker.on('click', function(e) {
          myThis.markers = { lng:res.log, lat:res.lat }
          myThis.selRoute(res.icName, '地址:' + res.address)
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
      selRoute(title, msg) {
        this.$createDialog({
          type: 'confirm',
          icon: 'cubeic-alert',
          title: title,
          content: msg,
          confirmBtn: {
            text: '到这去',
            active: true,
            disabled: false
          },
          cancelBtn: {
            text: '取消',
            active: false,
            disabled: false
          },
          onConfirm: () => {
            this.clickChange()
          },
          onCancel: () => {
            return false
          }
        }).show()
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
      },
      // 步行导航
       walking_route: function() {
         var myThis = this
         myThis.start_xy =  new AMap.LngLat(myThis.myPoint[0], myThis.myPoint[1])
         myThis.end_xy  = new AMap.LngLat(myThis.centerPoint[0], myThis.centerPoint[1])
          var MWalk
          this.mapObj.plugin(["AMap.Walking"], function() {
            MWalk = new AMap.Walking(); // 构造路线导航类
            AMap.event.addListener(MWalk, "complete", myThis.walk_routeCallBack); // 返回导航查询结果
            MWalk.search(myThis.start_xy, myThis.end_xy); // 根据起终点坐标规划步行路线
          });
       },
      // 导航结果展示
      walk_routeCallBack: function(data) {
        this.routeS = data.routes;
        if (this.routeS.length <= 0) {
          this.showAlert('未查找到任何结果! 建议：1.请确保所有字词拼写正确；2.尝试不同的关键字；尝试更宽泛的关键字。')
        } else {
          // 输出步行路线指示
          this.walkingDrawLine();
        }
      },
      // 绘制步行导航路线
       walkingDrawLine: function() {
         var myThis = this
         var steps = []
         for (var i = 0; i < myThis.routeS.length; i++) {
           for (var j = 0; j < myThis.routeS[i].steps.length; j++) {
             steps.push(myThis.routeS[i].steps[j])
           }
         }
        // 起点、终点图标
        var sicon = new AMap.Icon({
          image: require("../../assets/images/curPosition2x.png"),
          size:new AMap.Size(30, 30),
          imageOffset: new AMap.Pixel(0, 0)
        });
         myThis.startmarker = new AMap.Marker({
          icon : sicon, // 复杂图标
          visible : true,
          position : myThis.start_xy,
          map:myThis.mapObj,
          offset : {
            x : -10,
            y : -10
          }
        });
        // 起点到路线的起点 路线的终点到终点 绘制无道路部分
         var extra_path1 = [];
         myThis.extra_line1 = {}
         extra_path1.push(myThis.start_xy);
         extra_path1.push(steps[0].path[0]);
         myThis.extra_line1 = new AMap.Polyline({
          map: myThis.mapObj,
          path: extra_path1,
          strokeColor: "#9400D3",
          strokeOpacity: 0.7,
          strokeWeight: 4,
          strokeStyle: "dashed",
          strokeDasharray: [10, 5]
        });
        var extra_path2 = [];
         myThis.extra_line2 = {}
        var path_xy = steps[(steps.length - 1)].path;
         extra_path2.push(myThis.end_xy);
         extra_path2.push(path_xy[(path_xy.length - 1)]);
         myThis.extra_line2 = new AMap.Polyline({
          map: myThis.mapObj,
          path:  extra_path2,
          strokeColor: "#9400D3",
          strokeOpacity: 0.7,
          strokeWeight: 4,
          strokeStyle: "dashed",
          strokeDasharray: [10, 5]
        });
         myThis.polylines = []
        for (var s = 0; s < steps.length; s++) {
          var drawpath = steps[s].path;
          myThis.polyline = new AMap.Polyline({
            map: myThis.mapObj,
            path: drawpath,
            strokeColor: "#9400D3",
            strokeOpacity: 0.7,
            strokeWeight: 4
          });
          myThis.polylines.push(myThis.polyline)
        }
        myThis.mapObj.setFitView();
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .topBar{
    width: 100%;
    height:.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color:#fff ;
    .drive,.bus,.walk{
      display: inline-block;
      width: 33.33%;
      height: .8rem;
      font-size: .28rem;
      line-height: .8rem;
      cursor:pointer;
    }
    .active{
      background-color: #F4F4F4;
    }
  }
  .map_item{
    height: calc(100% - 0.8rem);
  }
</style>
