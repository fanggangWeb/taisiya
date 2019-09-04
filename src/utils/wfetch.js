import fetch from '@/utils/fetch'
import qs from 'qs'
import { HTTP } from '@/utils/config'
// 添加投诉与建议
export  function insertComplaint(data) {
  // data = JSON.stringify(data)
  const url = '/complaint/insertComplaint'
  return fetch({
    url: HTTP + url,
    method: 'post',
    data
  })
}
// 查找投诉与建议
export  function selectComplaintList(data) {
  const url = '/complaint/selectComplaintList'
  return fetch({
    url: HTTP + url,
    method: 'get',
    params: data
  })
}
// 查询新闻详情
export  function selectNewsById(data) {
  const url = '/new/selectNewsById'
  return fetch({
    url: HTTP + url,
    method: 'get',
    params: data
  })
}
// 查询我的收货地址
export  function selectUserAddressList(data) {
  const url = '/moble/userBasic/selectUserAddressListByMoble'
  return fetch({
    url: HTTP + url,
    method: 'get',
    params: data
  })
}
//  查询景区求助人员列表
export  function selectPersonnelList(data) {
  const url = '/personnel/selectPersonnelList'
  return fetch({
    url: HTTP + url,
    method: 'get',
    params: data
  })
}
// 获取我的优惠券列表
export  function selectConpouUserList(data) {
  const url = '/moble/userBasic/selectConpouUserListByMoble'
  return fetch({
    url: HTTP + url,
    method: 'get',
    params: data
  })
}
// 商品详情页面取消收藏
export function deleteCollection(data) {
  const url = '/back/collection/deleteCollection'
  // data = qs.stringify(data)
  return fetch({
    url: HTTP + url,
    method: 'post',
    data
  })
}
// 上传图片
export function uploadImg(data) {
  const url = '/file/uploadImg'
  data = qs.stringify(data)
  return fetch({
    url: HTTP + url,
    method: 'post',
    data
  })
}
// 发布游记
export function addTravels(data) {
  const url = '/travels/insertOrUpdateTravels'
  // data = JSON.stringify(data)
  return fetch({
    url: HTTP + url,
    method: 'post',
    data
  })
}

// 游记详情
export function selectTravel(data) {
  const url = `${HTTP}/travels/moble/selectTravelsViewByIdOnMoble`
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}

// 获取商品分类列表
export function getProductClassify(data) {
  const url = `${HTTP}/firstClass/mobile/getAllFirstClassList`
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}
// 获取分类商品列表
export function getProductsByClassify(data) {
  const url = `${HTTP}/merchantProducts/mobile/selectMerchantProductsByBusinessId`
  // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}

// 查询商品订单列表
export function selectCommodityOrderList(data) {
  const url = `${HTTP}/commodityOrder/selectCommodityOrderList`
  // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}

// 生成餐点订单
export function insertFoodOrder(data) {
  const url = `${HTTP}/foodOrder/creatCommodityOrder`
  // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'post',
    data
  })
}

// 查询餐点列表
export function selectFoodList(data) {
  const url = `${HTTP}/foods/selectFoodList`
  // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}
// 查询餐点订单详情
export function selectFoodOrder(data) {
  const url = `${HTTP}/foodOrder/mobile/selectFoodOrder`
  // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}
// 查询餐点订单列表
  export function selectFoodOrderList(data) {
  const url = `${HTTP}/foodOrder/selectFoodOrderList`
  // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}

// 主页请求banner图
export function selectBannerList(data) {
  const url = `${HTTP}/moble/home/selectBannerList`
  // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}

// 获取热点景点数据
export function selectHotSpotsList(data) {
  const url = `${HTTP}/moble/home/selectHotSpotsList`
  // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}
// 获取热点商家数据
export function selectHotBusinessList(data) {
  const url = `${HTTP}/moble/home/selectHotBusinessList`
  // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}
// 获取热点游记数据
export function selectHotTravelsList(data) {
  const url = `${HTTP}/moble/home/selectHotTravelsList`
  // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}
// 获取新闻数据
export function selectHotNewsList(data) {
  const url = `${HTTP}/moble/home/selectHotNewsList`
  // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}

// 查询门票订单详情
export function selectTicketOrderDetail(data) {
  const url = `${HTTP}/ticketOrder/selectTicketOrderById`
   // data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'get',
    params:data
  })
}

// 微信支付接口
export function weixinPay(data) {
  const url = `${HTTP}/pay/wx/weixinPay`
   data = qs.stringify(data)
  return fetch({
    url: url,
    method: 'post',
    data
  })
}

// 搜索的商家的商品列表
export function getSearchProductList(num, size, productsName, lable, isUsing) {
  const data = {
    num,
    size,
    productsName,
    lable,
    isUsing
  }
  const url = `${HTTP}/merchantProducts/selectMerchantProductsList`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 查询订单详情
export function selectOrderById(data) {
  const url = `${HTTP}/commodityOrder/selectCommodityOrderById`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}

// 地图标注
export function selectIdentificationList(data) {
  // data = qs.stringify(data)
  const url = `${HTTP}/moble/home/selectIdentificationListOnHome`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
