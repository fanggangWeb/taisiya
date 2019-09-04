
import Vue from 'vue'
import Vuex from 'vuex'
import user from './module/user'
Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user
  },
	state: {
		// 有一个搜索系统，搜索需要跳到景点列表等，默认状态为0，我的搜索跳转的状态为1,个人中心跳转到游击列表状态为2
		searchState: sessionStorage.getItem('searchState') || 0, // searchState: 0,
		// 搜索系统输入的值
		searchValue: sessionStorage.getItem('searchValue'), // searchValue: '',
    userName: sessionStorage.getItem('userName'), // userName: '',
    suggestState: sessionStorage.getItem('suggestState') || 2, // suggestState: 2, // 投诉建议状态
    sceincId: sessionStorage.getItem('sceincId'), // sceincId: 0, // 景点id
    sellerName: sessionStorage.getItem('sellerName'), // sellerName: '', // 商家名称
    sellerId: sessionStorage.getItem('sellerId'), // sellerId: 0, // 商家id
    productId: sessionStorage.getItem('productId'), // productId: 0, // 产品id
    travelId: sessionStorage.getItem('travelId'), // travelId: 0, // 游记id
    newsId: sessionStorage.getItem('newsId'), // newsId: 0,  // 新闻id
    parkId: sessionStorage.getItem('parkId') || '478685de47c04442bd71663f55407693', // parkId: 0, // 公园id
    parkOrderId: sessionStorage.getItem('parkOrderId'), // parkOrderId: 0, // 门票订单id
    foodOrderId: sessionStorage.getItem('foodOrderId'), // foodOrderId: 0, // 点餐订单id
    productOrderId: sessionStorage.getItem('productOrderId'), // productOrderId: 0, // 商品订单id
    couponId: sessionStorage.getItem('couponId'), // couponId: '',  // 优惠券id
    couponFaceValue: sessionStorage.getItem('couponFaceValue') || 0, // couponFaceValue: 0, // 优惠券金额
    couponType: sessionStorage.getItem('couponType'), // couponType: 0, // 优惠券类型
    buyCount: sessionStorage.getItem('buyCount'), // buyCount: 0, // 购买数量
    subtotal: sessionStorage.getItem('subtotal'), // 金额小计
    lng: sessionStorage.getItem('lng') || 106.415841, // lng:106.415841, // 经度值
    lat: sessionStorage.getItem('lat') || 29.739504, // lat:29.739504, // 纬度值
    userLng: sessionStorage.getItem('userLng'), // userLng:0, // 用户经度值
    userLat: sessionStorage.getItem('userLat'), // 用户纬度值
    // 收货地址是编辑还是新增页面 0为新增 1为编辑
    addressState: sessionStorage.getItem('addressState') || 0, // addressState: 0,
    addressId: sessionStorage.getItem('addressId'), // addressId: '',  // 收货地址的id
    address: sessionStorage.getItem('address'), // address: '', // 收货地址
    addressName: sessionStorage.getItem('addressName'), // addressName: '', // 收货人
    addressTel: sessionStorage.getItem('addressTel'), // addressTel: '', // 收货人电话
    isChooseAddress: sessionStorage.getItem('isChooseAddress'), // isChooseAddress: 0,  // 是否能选择收货地址 0为不能选择从编辑地址进入  1为能选择从商品页面进入
    isChoose: sessionStorage.getItem('isChoose') || 0, // isChoose: 0, // 判断收货地址是否首次默认加载  0是  1不是
    searchLabelId: sessionStorage.getItem('searchLabelId'), // searchLabelId: '', // 存储搜索系统 标签的id
    toUrl: sessionStorage.getItem('toUrl'), // toUrl: '',
    foodList: sessionStorage.getItem('foodList') || '', // foodList:[],  // 点餐购物车
    orderDetailType: sessionStorage.getItem('orderDetailType') || 0, // orderDetailType: 0, // 进入订单详情的入口，0表示支付页面进入，1表示订单列表进入
    proPayState: sessionStorage.getItem('proPayState') || 0, // proPayState: 0 // 商品支付状态，从订单列表立即支付进入为1，从商品页进入为0
    limitPrice: sessionStorage.getItem('limitPrice') || 0, // 订单确认页面的价格 去限制优惠券的选取范围
    couponLimit: sessionStorage.getItem('couponLimit') || 0, // 优惠券的限制使用价格
    foodSellId: sessionStorage.getItem('foodSellId')
  },
	getters: {
		getSearchState: state => state.searchState,
		getsearchValue: state => state.searchValue,
    getUserName:state => state.userName,
    getSceincId:state => state.sceincId,
    getSuggestState:state => state.suggestState,
    getSellerId:state => state.sellerId,
    getSellerName: state => state.sellerName,
    getProductId:state => state.productId,
    getTravelId:state => state.travelId,
    getNewsId:state => state.newsId,
    getParkId:state => state.parkId,
    getParkOrderId:state => state.parkOrderId,
    getFoodOrderId:state => state.foodOrderId,
    getProductOrderId:state => state.productOrderId,
    getCouponId: state => state.couponId,
    getCouponFaceValue: state => state.couponFaceValue,
    getCouponType: state => state.couponType,
    getBuyCount: state => state.buyCount,
    getSubtotal: state => state.subtotal,
    getAddressState: state => state.addressState,
    getAddressId: state => state.addressId,
    getIsChooseAddress: state => state.isChooseAddress,
    getIsChoose: state => state.isChoose,
    getAddress: state => state.address,
    getAddressName: state => state.addressName,
    getAddressTel: state => state.addressTel,
    getLng: state => state.lng,
    getLat: state => state.lat,
    getUserLng: state => state.userLng,
    getUserLat: state => state.userLat,
    getSearchLabelId: state => state.searchLabelId,
    getFoodList: state => state.foodList,
    getToUrl: state => state.toUrl,
    getOrderDetailType: state => state.orderDetailType,
    getProPayState: state => state.proPayState,
    getLimitPrice: state => state.limitPrice,
    getCouponLimit: state => state.couponLimit,
    getFoodSellId: state => state.foodSellId
  },
	mutations: {
		test(state, data) {
      state.test = data
      sessionStorage.setItem('test', data)
		},
		searchState(state, data) {
      state.searchState = data
      sessionStorage.setItem('searchState', data)
		},
		searchValue(state, data) {
      state.searchValue = data
      sessionStorage.setItem('searchValue', data)
		},
    userName(state, data) {
      state.userName = data
      sessionStorage.setItem('userName', data)
    },
    sceincId(state, data) {
      state.sceincId = data
      sessionStorage.setItem('sceincId', data)
    },
    suggestState(state, data) {
      state.suggestState = data
      sessionStorage.setItem('suggestState', data)
    },
    sellerId(state, data) {
      state.sellerId = data
      sessionStorage.setItem('sellerId', data)
    },
    sellerName(state, data) {
      state.sellerName = data
      sessionStorage.setItem('sellerName', data)
    },
    productId(state, data) {
      state.productId = data
      sessionStorage.setItem('productId', data)
    },
    travelId(state, data) {
      state.travelId = data
      sessionStorage.setItem('travelId', data)
    },
    newsId(state, data) {
      state.newsId = data
      sessionStorage.setItem('newsId', data)
    },
    parkId(state, data) {
      state.parkId = data
      sessionStorage.setItem('parkId', data)
    },
    parkOrderId(state, data) {
      state.parkOrderId = data
      sessionStorage.setItem('parkOrderId', data)
    },
    foodOrderId(state, data) {
      state.foodOrderId = data
      sessionStorage.setItem('foodOrderId', data)
    },
    productOrderId(state, data) {
      state.productOrderId = data
      sessionStorage.setItem('productOrderId', data)
    },
    couponId(state, data) {
      state.couponId = data
      sessionStorage.setItem('couponId', data)
    },
    couponFaceValue(state, data) {
      state.couponFaceValue = data
      sessionStorage.setItem('couponFaceValue', data)
    },
    addressState(state, data) {
      state.addressState = data
      sessionStorage.setItem('addressState', data)
    },
    addressId(state, data) {
      state.addressId = data
      sessionStorage.setItem('addressId', data)
    },
    couponType(state, data) {
      state.couponType = data
      sessionStorage.setItem('couponType', data)
    },
    buyCount(state, data) {
      state.buyCount = data
      sessionStorage.setItem('buyCount', data)
    },
    subtotal(state, data) {
      state.subtotal = data
      sessionStorage.setItem('subtotal', data)
    },
    isChooseAddress(state, data) {
      state.isChooseAddress = data
      sessionStorage.setItem('isChooseAddress', data)
    },
    isChoose(state, data) {
      state.isChoose = data
      sessionStorage.setItem('isChoose', data)
    },
    addressName(state, data) {
      state.addressName = data
      sessionStorage.setItem('addressName', data)
    },
    addressTel(state, data) {
      state.addressTel = data
      sessionStorage.setItem('addressTel', data)
    },
    address(state, data) {
      state.address = data
      sessionStorage.setItem('address', data)
    },
    lng(state, data) {
      state.lng = data
      sessionStorage.setItem('lng', data)
    },
    lat(state, data) {
      state.lat = data
      sessionStorage.setItem('lat', data)
    },
    userLng(state, data) {
      state.userLng = data
      sessionStorage.setItem('userLng', data)
    },
    userLat(state, data) {
      state.userLat = data
      sessionStorage.setItem('userLat', data)
    },
    searchLabelId(state, data) {
      state.searchLabelId = data
      sessionStorage.setItem('searchLabelId', data)
    },
    foodList(state, data) {
      state.foodList = data
      sessionStorage.setItem('foodList', data)
    },
    toUrl(state, data) {
      state.toUrl = data
      sessionStorage.setItem('toUrl', data)
    },
    orderDetailType(state, data) {
      state.orderDetailType = data
      sessionStorage.setItem('orderDetailType', data)
    },
    proPayState(state, data) {
      state.proPayState = data
      sessionStorage.setItem('proPayState', data)
    },
    limitPrice(state, data) {
      state.limitPrice = data
      sessionStorage.setItem('limitPrice', data)
    },
    couponLimit(state, data) {
      state.couponLimit = data
      sessionStorage.setItem('couponLimit', data)
    },
    foodSellId(state, data) {
      state.foodSellId = data
      sessionStorage.setItem('foodSellId', data)
    }
	},
	actions:{}
})
// // 生成 mutations 方法
// function generate(name) {
// 		return function(state, value) {
// 				state[name] = value || state[name]
// 		}
// }
// // 为每个 state 字段生成对应的 mutations 方法
// Object.keys(store.state).forEach((key) => {
// 				store.mutations[key] = generate(key)
// 		})
export default store
