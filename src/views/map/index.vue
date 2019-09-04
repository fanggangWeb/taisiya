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
  // const that = this
  import { mapGetters, mapMutations } from 'vuex'
  import { selectIdentificationList } from '@/utils/wfetch'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        // centerPoint: [106.415497, 29.7401],
        centerPoint: [],
        centerPointLng: 106.415841, // 太寺娅景区经纬度
        centerPointLat: 29.739504, // 太寺垭维度
        myPoint: [],
        typeBar:1,
        markers:[]
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
        var myThis = this;
        myThis.centerPoint = [myThis.getLng, myThis.getLat]
        console.log(myThis.centerPoint)
        /* eslint-disable no-undef*/
        const mapObj = new AMap.Map('map-container', {
          center: myThis.centerPoint,
          zoom: 15
        });
        // const centerPoint = this.centerPoint
       // let myPoint = this.myPoint
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
            // mapObj.setCenter(result.position)
            myThis.myPoint = [result.position.lng, result.position.lat]
            mapObj.plugin('AMap.DragRoute', function() {
              // path 是驾车导航的起、途径和终点，最多支持16个途经点
              const path = [];
              path.push(myThis.myPoint);
              path.push(myThis.centerPoint);
              const route = new AMap.DragRoute(mapObj, path, AMap.DrivingPolicy.LEAST_FEE)
              // 查询导航路径并开启拖拽导航
              route.search()
            })
            myThis.myPoint = [result.position.lng, result.position.lat]
          })  //  返回定位信息
          AMap.event.addListener(geolocation, 'error', (result) => {
            myThis.showAlert('定位失败')
          })  //  返回定位出错信息
        });
    /*    // 创建一个 Marker 实例：
        const marker = new AMap.Marker({
          position: myThis.centerPoint,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
          label: {
            content: '太寺垭',
            offset: new AMap.Pixel(-7, -25)
          }
        });
        mapObj.add(marker);*/
        // 将创建的点标记添加到已有的地图实例：
        // myThis.addSellMark()
      },
      // 驾车路线
      createRoute() {
        // this.clearMap()
        // path 是驾车导航的起、途径和终点，最多支持16个途经点
        const path = [];
        path.push(this.myPoint);
        path.push(this.centerPoint);
        // console.log(this.centerPoint)
        const route = new AMap.DragRoute(this.mapObj, path, AMap.DrivingPolicy.LEAST_FEE)
        // 查询导航路径并开启拖拽导航
        route.search()
        // console.log(34)
      },
      // 清空地图
      clearMap:function() {
        var myThis = this
        myThis.mapObj.clearMap();
        myThis.addSellMark()
      },
      // 调用接口添加标记
      addSellMark: function() {
         var myThis = this
        selectIdentificationList().then(res => {
          if (res.code === SUCCESS_OK) {
            if (res.result.length > 0) {
              for (var i = 0; i < res.result.length; i++) {
                myThis.addMark(res.result[i])
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
        myThis.clearMap()
        myThis.centerPoint[0] = myThis.markers.lng
        myThis.centerPoint[1] = myThis.markers.lat
        myThis.createRoute()
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
            // this.clearMap()
          },
          onCancel: () => {
            return false
          }
        }).show()
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
