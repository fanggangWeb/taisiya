<template>

  <div id="city">
    <div class="bg"></div>
    <div class="city">
      <div>
        <!-- <v-touch v-on:panup="methodFunc(1,'panup')" v-on:pandown="methodFunc(1,'pandown')" > -->
          <p v-for="(item,index) in province" v-if="province.length > 0" :class="{'active':index == 0}">
            <span>{{item.name}}</span>
          </p>
          <p v-if="province.length == 0" class="active"><span>请选择</span></p>
        <!-- </v-touch> -->
        <span class="line">-</span>
      </div>
      <div>
        <!-- <v-touch v-on:panup="methodFunc(2,'panup')" v-on:pandown="methodFunc(2,'pandown')" > -->
          <p :class="{'active':index == 0}" v-for="(item,index) in city"
             v-if="city.length > 0">
            <span>{{item.name}}</span>
          </p>
          <p v-if="city.length == 0" class="active"><span>请选择</span></p>
        <!-- </v-touch> -->
        <span class="line">-</span>
      </div>
      <div>
        <!-- <v-touch v-on:panup="methodFunc(3,'panup')" v-on:pandown="methodFunc(3,'pandown')" > -->
          <p v-for="(item,index) in township" :class="{'active':index == 0}"
             v-if="township.length > 0">
            <span>{{item.name}}</span>
          </p>
          <p v-if="township.length == 0" class="active"><span>请选择</span></p>
        <!-- </v-touch> -->
      </div>
    </div>
    <div class="determine" @click="determine">
      <p>确定</p>
    </div>
    <div class="cencel" @click="cencel">
      <p>取消</p>
    </div>
  </div>

</template>
<script>


  const Countrys = require('../utils/countrys ');
  export default {
    props: ['panelShow'],
    data() {
      return {
        showModel: this.panelShow,
        provinceIndex: 0,
        cityIndex: 0,
        townshipIndex: 0,
        province: [{ name: "省份" }],
        city: [{ name: "城市" }],
        township: [{ name: "区" }]
      }
    },
    created() {
     // console.log(this.info.type)
      for (var p of Countrys.countrys[0].provinces) {
        this.province.push({ code: p.code, name: p.name });
        for (var i of p.citys) {
          this.city.push({ code: i.code, name: i.name });
          // if (i.countys.length>0){
          for (var j of i.countys) {
            this.township.push({ code: j.code, name: j.name });
          }
        }
      }
    },
    watch: {

    },
    methods: {
      methodFunc(index, type) {
        console.log(index)
        var self = this;
        var nowIndex = index == 1 ? self.provinceIndex : index === 2 ? self.cityIndex : self.townshipIndex;
        $(".city").children('div').eq(index).find('div').animate({ "top": "0rem" });
        $(".city").children('div').eq(index).find('div').children('p').removeClass('active');
        $(".city").children('div').eq(index).find('div').children('p').eq(0).addClass('active');
        if (type == 'panup') {
          nowIndex += 1;
          if ($(".city").children('div').eq(index - 1).find('p').length == nowIndex) {
            return false;
          }
          if (index == 1) {
            self.provinceIndex += 1;
            self.cityIndex = 0;
            self.townshipIndex = 0;
            $(".city").children('div').eq(2).find('div').animate({ "top": "0rem" });
            $(".city").children('div').eq(2).find('div').children('p').eq(0).addClass('active');
          } else if (index == 2) {
            self.cityIndex += 1;
            self.townshipIndex = 0;
          } else {
            self.townshipIndex += 1;
          }

          $(".city").children('div').eq(index - 1).find('div').animate({ "top": "-" + nowIndex * 0.7 + "rem" });
        } else if (type == 'pandown') {
          if (nowIndex == 0) {
            return false;
          }
          nowIndex -= 1;
          $(".city").children('div').eq(index).find('div').animate({ "top": "0rem" });
          $(".city").children('div').eq(index).find('div').children('p').removeClass('active');
          $(".city").children('div').eq(index).find('div').children('p').eq(0).addClass('active');
          if (index == 1) {
            $(".city").children('div').eq(2).find('div').animate({ "top": "0rem" });
            $(".city").children('div').eq(2).find('div').children('p').eq(0).addClass('active');
            self.provinceIndex -= 1;
            self.cityIndex = 0;
            self.townshipIndex = 0;
          } else if (index == 2) {
            self.cityIndex -= 1;
            self.townshipIndex = 0;
          } else {
            self.townshipIndex -= 1;
          }
          $(".city").children('div').eq(index - 1).find('div').animate({ "top": "-" + nowIndex * 0.7 + "rem" });
        }
        $(".city").children('div').eq(index - 1).find('div').children('p').removeClass('active');
        $(".city").children('div').eq(index - 1).find('div').children('p').eq(nowIndex).addClass('active');
        var requestIndex = index == 1 ? 2 : index == 2 ? 3 : 3;
        if (index == 3) {
          return false;
        }
        this.queryData(requestIndex)
      },
      queryData(index) {
        var self = this;
        self.showModel = true;
        var requestObj = {
          id: ''
        }
        if (index == 2) {
          requestObj.id = self.province[self.provinceIndex].id
        } else if (index == 3) {
          requestObj.id = self.province[self.cityIndex].id
        }
        if (index == 1) {
          self.$store.getters.getProvince.map(v => {
            self.province.push(v)
          })
          self.city = [{
            name: '城市'
          }]
          self.township = [{
            name: '区县'
          }]
        } else if (index == 2) {
          self.city = [{
            name: '城市'
          }]
          self.township = [{
            name: '区县'
          }]
          if (!requestObj.id) {
            return false;
          }
          self.$store.getters.getProvince.map(v => {
            self.city.push(v)
          })
        } else if (index == 3) {
          self.township = [{
            name: '区县'
          }]
          if (!requestObj.id) {
            return false;
          }
          self.$store.getters.getProvince.map(v => {
            self.township.push(v)
          })
        }
      },
      cencel() {
        var self = this;
        this.hidePanel();
        self.showModel = false;
        self.provinceIndex = 0;
        self.cityIndex = 0;
        self.townshipIndex = 0;
      },
      hidePanel() {
        var self = this;
        self.$emit('hidePanel');
      },
      determine() {
        var self = this;
        var name = '';
        var id = '';
        var province = self.province[self.provinceIndex].name;
        var city = self.city[self.cityIndex].name;
        var township = self.township[self.townshipIndex].name;
        if (province != '省份' && city != '城市' && township != '区县') {
          name = province + '-' + city + '-' + township;
          id = self.township[self.townshipIndex].id;
          self.consignmentPlace.address = name;
          self.consignmentPlace.id = id;
          self.cencel();
        } else if (province == '省份') {
          this.$vux.toast.text('您还没有选择省份!');
        } else if (city == '城市') {
          this.$vux.toast.text('您还没有选择城市!');
        } else if (township == '区县') {
          this.$vux.toast.text('您还没有选择区县!');
        }
      }
    }
  }
</script>
<style scoped lang="less">
  #city {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
  }

  .bg {
    background: black;
    width: 100%;
    height: 100%;
    opacity: .4;
  }

  .city {
    position: fixed;
    bottom: 1.6rem;
    width: 100%;
    height: 2.2rem;
    overflow: hidden;
    background: white;
    display: flex;
    padding-bottom: .4rem;
    div {
      position: relative;
      height: 100%;
      text-align: center;
      flex: 1;
      p {
        height: .7rem;
        font-size: .28rem;
        &.active {
          font-weight: bold;
        }
      }
      p:first-child {
        margin: 0.8rem 0 0 0;
      }

      .line {
        position: absolute;
        right: 0;
        top: .8rem;
        color: #000;
        font-size: .28rem;
      }
    }

  }

  .cencel {
    width: 100%;
    height: .8rem;
    baclground: white;
    position: fixed;
    bottom: .0rem;
    left: 0;
    background: white;
    line-height: .8rem;
    text-align: center;
    border-top: 0.01rem solid #CCCCCC;
    p{
      color: #0a0a0a;
      font-size: .28rem;
    }
  }

  .determine {
    width: 100%;
    height: .8rem;
    baclground: white;
    position: fixed;
    bottom: .8rem;
    left: 0;
    background: white;
    line-height: .8rem;
    text-align: center;
    border-top: 0.01rem solid #CCCCCC;
    p{
      color: #0a0a0a;
      font-size: .28rem;
    }
  }
</style>
