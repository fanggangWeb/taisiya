import fetch from '@/utils/fetch'
 import  qs  from 'qs'
import { HTTP } from '@/utils/config'

// 根据Id查询商品详情
export function selectMerchantProductsById(data) {
  const url = `${HTTP}/merchantProducts/mobile/selectMerchantProductsById`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}
// 根据id查询商家
export function selectBusinessById(data) {
  const url = `${HTTP}/business/selectBusinessById`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}

// 商品详情页面添加收藏
export function insertCollection(data) {
  data = qs.stringify(data)
  const url = `${HTTP}/collection/insertCollection`
  return fetch({
    url,
    method: 'post',
    data
  })
}

// 商品详情页面取消收藏
export function deleteCollection(data) {
  const url = `${HTTP}/back/collection/deleteCollection`
  return fetch({
    url,
    method: 'post',
    params:data
  })
}

// 根据商家id查询商品列表
export function selectMerchantProductsList(data) {
  const url = `${HTTP}/merchantProducts/mobile/selectMerchantProductsByBusinessId`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}

// 加载商家列表
export function selectBusinessList(data) {
  const url = `${HTTP}/business/mobile/selectBusinessList`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}

// 查询我的优惠券
export function selectConpouUserListByMoble(data) {
  const url = `${HTTP}/moble/userBasic/selectConpouUserListByMoble`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}

// 查询收货人默认收货地址
export function selectDefaultAddress() {
  const url = `${HTTP}/userAddress/selectDefaultAddress`
  return fetch({
    url,
    method: 'get'
  })
}

// 添加商品订单
export function creatCommodityOrder(data) {
  // data = JSON.stringify(data)
  const url = `${HTTP}/commodityOrder/creatCommodityOrder`
  return fetch({
    url,
    method: 'post',
    data
  })
}

// 查询热门景点列表
export function selectHotSpotsList(data) {
  const url = `${HTTP}/moble/home/selectHotSpotsList`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}

// 根据景点id查询景点详情
export function selectScenicSpotById(data) {
  const url = `${HTTP}/scenicSpot/selectScenicSpotById`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}

// 根据id查询park
export function selectParkById(data) {
  const url = `${HTTP}/park/selectParkById`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}

// 查询park列表
export function selectParkList(data) {
  const url = `${HTTP}/park/selectParkList`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}

// 查询门票订单列表
export function selectTicketOrderList(data) {
  const url = `${HTTP}/ticketOrder/mobile/selectTicketOrderList`
  return fetch({
    url,
    method: 'get',
    params: data
  })
}

// 添加门票订单
export function creatTicketOrder(data) {
  const url = `${HTTP}/ticketOrder/creatTicketOrder`
  return fetch({
    url,
    method: 'post',
    data
  })
}
