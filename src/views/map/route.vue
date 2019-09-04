<template>
  <!-- 商城-->
  <div class="warp" style="height: 100%">
      <div class="topBar">
        <span class="drive" :class="{'active':typeBar === 1}" @click="jump('/map',1)">驾车</span>
        <span class="bus" @click="jump('/map/route',2)" :class="{'active':typeBar === 2}" >公交</span>
        <span class="walk" @click="jump('/map/walk',3)" :class="{'active':typeBar === 3}" >步行</span>
      </div>
      <div class="map_item" id="map-container"> </div>
       <div class="map_list">
        <ul class="map_ul">
          <li class="map_li" v-for="(item,index) in btContent" :key="index" @click="drawPlan(index)">
            <div class="msg">
              <p class="ride-line">{{item.abstractWays}}</p>
              <p class="base-info">{{item.costTime}}( {{item.distance}} ) | 步行 {{item.walkDistance}} 米 |</p>
            </div>
          </li>
        </ul>
           <div class="panel">
           <div class="top">
             <span class="name">路线推荐</span>
             <span class="close" @click="close">x</span>
           </div>
           <div class="route_abstract">
             <p class="ride-line" style="margin-bottom: 5px;">{{routeItem.abstractWays}}</p>
             <p class="base-info">{{routeItem.costTime}}( {{routeItem.distance}} ) | 步行 {{routeItem.walkDistance}} 米 |</p>
           </div>
           <div class="detail_info">
             <p>{{routeItem.naviInfo}}</p>
           </div>
         </div>
      </div>
  </div>
</template>

<script>
  const that = this
  import { selectIdentificationList } from '@/utils/wfetch'
  import { mapGetters, mapMutations } from 'vuex'
  const SUCCESS_OK = "rest.success"
  export default {
    name: 'HelloWorld',
    data() {
      return {
        // centerPoint: [106.415154, 29.739578],
        centerPoint: [],
        centerPointLng: 106.415154, // 太寺娅景区经纬度
        centerPointLat: 29.739578, // 太寺垭维度
        myPoint: [],
        /* eslint-disable no-undef*/
        mapObj:{},
        btContent :[], // 推荐路线结果显示数据
        startName: '', // 起点位置名称
        endName: '太寺垭',  // 终点位置名称
        plansData:{},  // 路线推荐结果集
        palns:[], // 推荐路线
        stmarker:{},
        endmarker:{},
        busPolyline:{},
        walkPolyline:{},
        busPolylines:[],
        walkPolylines:[],
        walkArr:[],
        busArr:[],
        typeBar:2,
        type: 0, // 画的路线是默认加载还是点击所得，0表示默认加载，1表示点击
        routeItem:{}, // 当前推荐路线
        clientHeight:0 // 屏幕可见高度
      }
    },
    computed: {
      ...mapGetters(['getLng', 'getLat'])
    },
    mounted() {
      this.clientHeight =   `${document.documentElement.clientHeight}`
      document.getElementsByClassName('map_ul')[0].style.height = (this.clientHeight - 40) * 0.5 + "px";
      document.getElementById('map-container').style.height = (this.clientHeight - 40) * 0.5 + "px";
      // console.log(this.clientHeight)
      this.init()
      var logo = document.getElementsByClassName('amap-logo')[0]
      logo.style.display = 'none'
      var copy = document.getElementsByClassName('amap-copyright')[0]
      copy.style.opacity = 0
    },
    methods: {
      ...mapMutations(['lng', 'lat']),
      jump(url, num) {
        this.$router.push({ path: url });
        this.typeBar = num
        this.lng(this.centerPoint[0])
        this.lat(this.centerPoint[1])
      },
      close: function() {
        $('.panel').css('display', 'none');
        $('.map_ul').css('display', 'block');
      },
      init: function() {
        /* eslint-disable no-undef*/
         var mapObj = new AMap.Map('map-container', {
          center: that.centerPoint,
          zoom: 10
        });
         var myThis = this;
        // 添加到vue的原形属性
        this.mapObj = mapObj
        myThis.centerPoint = [myThis.getLng, myThis.getLat]
        this.mapObj.plugin(['AMap.Geolocation'], function() {
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
            panToLocation: true,  //  定位成功后将定位到的位置作为地图中心点，默认：true
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
          geolocation.getCurrentPosition();
          // myThis.addSellMark()
          AMap.event.addListener(geolocation, 'complete', (result) => {
            myThis.startName = result.formattedAddress
            mapObj.setCenter(result.position)
            myThis.myPoint = [result.position.lng, result.position.lat]
            myThis.transfer_route()
          })  //  返回定位信息
          AMap.event.addListener(geolocation, 'error', (result) => {
            // myThis.showAlert(result.message);
            myThis.showAlert("定位失败");
          })  //  返回定位出错信息
        });
      },
      // 距离，米换算为千米
      Getdistance: function(len) {
        if (len <= 1000) {
          var s = len;
          return s + "米";
        } else {
           s = Math.round(len / 1000);
          return "约" + s + "公里";
        }
      },
      // 时间，秒换分或时
      getTime: function(time) {
        if (time < 3600) {
         var m = Math.floor(time / 60)
          return  "约" + m + "分钟";
        } else {
          var h = Math.floor(time / 3600)
          m = Math.floor((time % 3600) / 60)
          return  "约" + h + "小时" + m + '分钟';
        }
      },
      // 清空地图
      clearMap:function() {
        var myThis = this
        myThis.mapObj.clearMap();
        // myThis.addSellMark()
      },
      // 公交导航
       transfer_route:function() {
        // 默认起始地点为当前位置
         var  start_xy = new AMap.LngLat(this.myPoint[0], this.myPoint[1]);   // 起、终点
         var  end_xy = new AMap.LngLat(this.centerPoint[0], this.centerPoint[1]);
         this.clearMap();
         var that = this;
         var trans;
        // 加载公交换乘插件
         that.mapObj.plugin(["AMap.Transfer"], function() {
          var transOptions = {
            city: '重庆市',                            // 公交城市
            policy: AMap.TransferPolicy.LEAST_TIME // 乘车策略
          };
          // 构造公交换乘类
          trans = new AMap.Transfer(transOptions);
          // 返回导航查询结果
          AMap.event.addListener(trans, "complete", that.transCallBack);
          // 显示错误信息
          AMap.event.addListener(trans, "error", function(e) {
            that.showAlert(e.info)
          });
          // 根据起、终点坐标查询公交换乘路线
          trans.search(start_xy, end_xy);
        });
      },
      // 调用接口添加标记
      addSellMark: function() {
        selectIdentificationList().then(res => {
          if (res.code === SUCCESS_OK) {
            if (res.result.length > 0) {
              for (var i = 0; i < res.result.length; i++) {
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
        myThis.clearMap()
        myThis.centerPoint[0] = myThis.markers.lng
        myThis.centerPoint[1] = myThis.markers.lat
        myThis.transfer_route()
      },
      selRoute(title, msg) {
        this.$createDialog({
          type: 'confirm',
          icon: 'cubeic-alert',
          title: title,
          // toast:
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
          onConfirm: (e) => {
            var oEvent = e || event;
            oEvent.cancelBubble = true;
            oEvent.stopPropagation();
            this.clickChange()
          },
          onCancel: (e) => {
            var oEvent = e || event;
            oEvent.cancelBubble = true;
            return false
          }
        }).show()
      },
       transCallBack:function(data) {
        this.plansData = data;
        var BusArr        = [];
        var WalkArr       = [];
        // 遍历每种换乘方案
         var resLine     = {};
         var naviInfo    = [];
         var abstractWays = []; // 乘车过程
         var walkDistance = 0;
        for (var i = 0; i < this.plansData.plans.length; i++) {
          BusArr = [] // 换乘公共交通标记
          WalkArr = [] // 步行标记
          resLine = {} // 每条推荐路线整合的显示信息
          abstractWays = [] // 换乘路线简介
          walkDistance = 0 // 步行距离
          naviInfo    = [] // 换乘具体路线说明
          var btseg   =   this.plansData.plans[i].segments; // 路线主要节点
          for (var j = 0; j < btseg.length; j++) {
            naviInfo.push(btseg[j].instruction);
            if (btseg[j].transit_mode == "WALK") {
              walkDistance += btseg[j].distance
                WalkArr.push(btseg[j].transit.path);
            } else {
              abstractWays.push(btseg[j].transit.lines[0].name.slice(0, btseg[j].transit.lines[0].name.indexOf('(')))
              BusArr.push(btseg[j].transit.path);
            }
          }
          resLine.distance = this.Getdistance(this.plansData.plans[i].distance)
          resLine.naviInfo = naviInfo.join('-->')
          resLine.abstractWays = abstractWays.join('-->');
          resLine.costTime = this.getTime(this.plansData.plans[i].time);
          resLine.walkDistance = walkDistance
          this.btContent.push(resLine);
          this.busArr.push(BusArr)
          this.walkArr.push(WalkArr)
        }
        // 绘制路线默认第一条
         this.drawPlan(0)
         this.type = 1;
      },
      // 绘制路线及画出换乘方案
        drawPlan:function(index) {
          if (this.type == 1) {
            this.routeItem = this.btContent[index]
            $('.panel').css('display', 'block');
            $('.map_ul').css('display', 'none');
          }
          this.clearMap()
          this.drawBuschangeLine(this.plansData.origin, this.plansData.destination, this.busArr[index], this.walkArr[index]);
          var onmark = this.getMark(this.plansData.plans[index].segments)
          this.addMarker(onmark.onbus);
          this.mapObj.setFitView();
        },
      // 取出需要加换乘、步行图标的位置
      getMark: function(sinseg) {
        var onmark = {
          onwalk:[],
          onbus:[]
        }
        for (var a in sinseg) {
          if (sinseg[a].transit_mode == "WALK") {
            onmark.onwalk.push(sinseg[a].transit.origin);
          } else {
            onmark.onbus.push(sinseg[a].transit.on_station.location);
          }
        }
        return onmark
      },
      // 绘制路线
       drawBuschangeLine: function(startPot, endPot, BusArr, WalkArr) {
        var that = this
        // 自定义起点，终点图标
         const sicon = new AMap.Icon({
          image: require("../../assets/images/curPosition2x.png"),
          size: new AMap.Size(30, 30),
          imageOffset: new AMap.Pixel(0, 0)
        });
        var eicon = new AMap.Icon({
          image: require("../../assets/images/curPosition2x.png"),
          size: new AMap.Size(30, 30),
          imageOffset: new AMap.Pixel(0, 0)
        });
        // 绘制起点，终点
        that.stmarker = new AMap.Marker({
          map:that.mapObj,
          position:new AMap.LngLat(startPot.lng, startPot.lat), // 基点位置
          icon:sicon, // 复杂图标
          offset:{ x:0, y:0 } // 相对于基点的位置
        });
         that.endmarker = new AMap.Marker({
          map:that.mapObj,
          position:new AMap.LngLat(endPot.lng, endPot.lat), // 基点位置
          icon:eicon, // 复杂图标
          offset:{ x:-0, y:-0 } // 相对于基点的位置
        });
        // 绘制乘车的路线
         that.busPolylines = []
        for (var j in BusArr) {
          that.busPolyline = new AMap.Polyline({
            map:that.mapObj,
            path:BusArr[j],
            strokeColor:"#005cb5", // 线颜色
            strokeOpacity:0.8, // 线透明度
            strokeWeight:6 // 线宽
          });
          that.busPolylines.push(that.busPolyline)
        }
        // 绘制步行的路线
         that.walkPolylines = []
        for (var i in WalkArr) {
          that.walkPolyline = new AMap.Polyline({
            map:that.mapObj,
            path:WalkArr[i],
            strokeColor : "#6EB034", //  线颜色
            strokeOpacity : 0.6, // 线透明度
            strokeWeight : 6// 线宽
          });
          that.walkPolylines.push(that.walkPolylines)
        }
      },
       addMarker: function(busmar) {
        for (var i = 0; i < busmar.length; i++) {
          var busmarker = new AMap.Marker({
            icon : new AMap.Icon({
              image: "../../assets/images/curPosition2x.png",
              size: new AMap.Size(20, 20),
              imageOffset: new AMap.Pixel(-33, -3)
            }),
            position : busmar[i],
            offset : {
              x : -25,
              y : -25
            },
            map:that.mapObj
          });
        }
        return busmarker;
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
    /*height:50%;*/
    width: 100%;
  }
.recommend{
  display: block;
  width: .4rem;
  height: .3rem;
  background: #26a2ff;
  color: #fff;
}
  .map_list{
    background: #f4f4f4;
    overflow: scroll;
    .map_ul{
      width: 100%;
      background: white;
      overflow: scroll;
      .map_li{
        display: flex;
        flex-flow: nowrap;
        height: 1.6rem;
        align-items: center;
        margin:0 .23rem;
        border-bottom: .01rem solid #e9e9e9;
        position: relative;
        .img{
          width: 1.39rem;
          height: 1.39rem;
          img{
            width: 100%;
            height: 100%;
          }
        }
        .msg{
          padding-left: .23rem;
          text-align: left;
          width: 6.2rem;
          margin-top: 10px;
          p{
            color: #848484;
            overflow: hidden;
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 8px;
            text-overflow: ellipsis;
            display:-webkit-box;
            -webkit-line-clamp:2;
            -webkit-box-orient: vertical;
          }
        }
        &:before{
          content: '';
          clear: both;
          position: absolute;
          right: 0;
          top: .7rem;
          font-size: 20px;
          width: .16rem;
          height: .26rem;
          background: url("../../assets/images/go-icon.png");
          background-size: 100%;

        }
      }
    }
    .panel{
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      display: none;
      background: #fff;
      text-align: left;
      padding: .6rem .4rem;
      .top{
        display: flex;
        flex-flow: nowrap;
        align-items: center;
        justify-content: space-between;
        height: .6rem;
        padding-bottom: .2rem;
        .name {
          font-size: .32rem;
          color: #040404;
        }
        .close{
          font-size: .4rem;
          color: #FF0E61;
          cursor:pointer;
        }
      }
      .route_abstract{
        padding-bottom: .2rem;
        font-size: .28rem;
      }
      .detail_info{
        font-size: .26rem;
        color: #858585;
        p{
          line-height: 22px;
          font-size: 14px;
        }
      }
    }
  }

</style>
