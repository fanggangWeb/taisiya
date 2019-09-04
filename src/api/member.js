import fetch from '@/utils/fetch'
import { HTTP } from '@/utils/config'
import qs from  'qs'
// 获取个人中心的商品订单列表
export function getOrderList(orderStatue, num, size) {
  const data = {
    orderStatue, //  订单状态
    num,
    size
  }
  const url = `${HTTP}/moble/userBasic/selectCommodityOrderListByMoble`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 个人中心取消商品订单
export function cancelCommodity(id) {
  const data = { id }
  const url = `${HTTP}/commodityOrder/cancellationCommodityOrderById`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 获取个人中心的收货地址
export function getAddressList(num, size) {
  const data = {
    num,
    size
  }
  const url = `${HTTP}/moble/userBasic/selectUserAddressListByMoble`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 个人中心 我的游记接口
export function myTravelItem(num, size) {
  const data = {
    num,
    size
  }
  const url = `${HTTP}/moble/userBasic/selectTravelsViewByIdOnMoble`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 首页点击游记查看更多,获取游记列表
export function defaultTravelList(num, size, travelsName, lable) {
  const data = {
    num,
    size,
    travelsName,
    lable
  }
  const url = `${HTTP}/travels/selectTravelsList`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 个人中心保存收货地址
export function insertAddress(data) {
  // const data = {
  //   userName,
  //   addressDetail,
  //   contactNumber,
  //   isDefaultAddress
  // }
  const url = `${HTTP}/userAddress/insertUserAddress`
  return fetch({
    url,
    method: 'post',
    data
  })
}
// 个人中心编辑 更新收货地址
export function updateAddress(data) {
  // const data = {
  //   id,
  //   userName,
  //   addressDetail,
  //   contactNumber,
  //   isDefaultAddress
  // }
  const url = `${HTTP}/userAddress/updateUserAddress`
  return fetch({
    url,
    method: 'post',
    data
  })
}
// 根据收货的id查询id具体信息
export function getAddressInfo(id) {
  const data = { id }
  const url = `${HTTP}/userAddress/selectUserAddressListById`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 个人中心 收货地址设为默认地址
export function setDefaultAddress(id) {
  const data = { id }
  const url = `${HTTP}/userAddress/settingDefaultAddressById`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 个人中心 收货地址删除地址
export function delAddress(ids) {
  const data = { ids }
  const url = `${HTTP}/userAddress/deleteUserAddress`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 获取景点的门票订单列表 0未支付，1已支付
export function getSenicOrder(num, size, isPay) {
  const data = {
    num,
    size,
    isPay
  }
  const url = `${HTTP}/ticketOrder/mobile/selectTicketOrderList`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 删除门票订单列表
export function delSenicOrder(ids) {
  const data = {
    ids
  }
  const url = `${HTTP}/ticketOrder/deleteTicketOrder`
  return fetch({
    url,
    method: 'get',
    params: data
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
// 获取景区的经典列表 同时也是搜索系统的景区搜索接口
export function seclectSenicList(num, size, spotName, lable) {
  const data = {
    num,
    size,
    spotName,
    lable
  }
  const url = `${HTTP}/scenicSpot/selectScenicSpotList`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 获取商家的列表，同时也是搜索系统的商家搜索接口
export function seclectBusinessList(num, size, businessName, lable) {
  const data = {
    num,
    size,
    businessName,
    lable
  }
  const url = `${HTTP}/business/selectBusinessList`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 获取新闻的列表，同时也是搜索系统的新闻搜索接口
export function seclectNewsList(num, size, newName, lable) {
  const data = {
    num,
    size,
    newName,
    lable
  }
  const url = `${HTTP}/new/selectNew`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 获取餐票订单列表 个人中心和订餐公用列表 flage都传1
export function selectFoodOrderList(num, size, isPay, orderStatue) {
  const data = {
    num,
    size,
    isPay,
    orderStatue
  }
  const url = `${HTTP}/foodOrder/selectFoodOrderList`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 根据id查询某个订单的订单详情
export function selcetOrderDetail(id) {
  const data = {
    id
  }
  const url = `${HTTP}/foodOrder/mobileSelectFoodOrder`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 根据不同的code获取搜索的标签
export function getLabelList(code) {
  let data = {
    code
  }
  data = qs.stringify(data)
  const url = `${HTTP}/dictBasic/selectDictBasic`
  return fetch({
    url,
    method: 'post',
    data
  })
}
// 个人中心修改头像和用户昵称
export function updataUserInfo(data) {
  data = qs.stringify(data)
  const url = `${HTTP}/moble/register/updateUser`
  return fetch({
    url,
    method: 'post',
    data
  })
}
// export function getCode() {
//   const url = `${HTTP}/wxLogin/getCode`
//   return fetch({
//     url,
//     method: 'get'
//   })
// }
// 个人中心获取用户名头像和昵称
export function getUserInfo() {
  const url = `${HTTP}/sUsers/getUserById`
  return fetch({
    url,
    method: 'get'
  })
}
// 个人中心 商品订单 确认收货
export function confirmPro(id) {
  const data = { id }
  const url = `${HTTP}/commodityOrder/confirmationReceipt`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 个人中心 商品订单 删除订单
export function delProOrder(id) {
  const data = { id }
  const url = `${HTTP}/commodityOrder/deleteCommodityById`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 个人中心 我的游记 删除游记
export function delTravelItem(ids) {
  const data = { ids }
  const url = `${HTTP}/travels/deleteTravelsByIds`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 个人中心 我的收藏 收藏列表
export function getCollectList(data) {
  const url = `${HTTP}/moble/userBasic/selectUserControllerByIdOnMoble`
  data = qs.stringify(data)
  return fetch({
    url,
    method: 'post',
    data
  })
}
// 地图侧边栏 获得设施的类型
export function getMapSideBar(data) {
  const url = `${HTTP}/dictBasic/selectDictBasic`
  data = qs.stringify(data)
  return fetch({
    url,
    method: 'post',
    data
  })
}
// 从后台获取商家的id，先获取后在获取列表
export function selectBusinessOnId() {
  const url = `${HTTP}/business/mobile/selectBusinessOnId`
  return fetch({
    url,
    method: 'get'
  })
}
// 删除餐品订单cancelType类型【1：取消订单 2：删除订单】
export function deleteFoodOrderByIds(data) {
  const url = `${HTTP}/foodOrder/cancelFoodOrder`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 景区详情展示
export function selectParkOnContext(data) {
  const url = `${HTTP}/park/selectParkOnContext`
  return fetch({
    url,
    method: 'post',
    data
  })
}
// 获取首页的视频地址
export function getParkVideo(data) {
  const url = `${HTTP}/moble/home/selectParkVideoOnHome`
  return fetch({
    url,
    method: 'get',
    data
  })
}
// 景区门票 发起申请退票 type为2
export function weixinRefund(data) {
  const url = `${HTTP}/pay/wx/weixinRefund`
  data = qs.stringify(data)
  return fetch({
    url,
    method: 'post',
    data
  })
}
// 查看物流
export function express(data) {
  const url = `${HTTP}/commodityOrder/selectExpressInformationById`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
