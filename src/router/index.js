import Vue from 'vue'
import Router from 'vue-router'

const _import = require('./_import_' + process.env.NODE_ENV)

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    name: 'home',
    component: _import('home/index')
  },
  {
    path: '/login',
    name: 'login',
    component: _import('login/login')
  },
  {
    path: '/travel',
    component: _import('travel/view'),
    children: [
      {
        path: '/',
        component: _import('travel/travelitem')
      },
      {
        path: 'travelDetail',
        component: _import('travel/travelDetail')
      }
    ]
  },
  {
    path: '/register',
    name: 'register',
    component: _import('register/index')
  }, {
    path: '/home',
    component: _import('home/view'),
    children: [
      {
        path: '/',
        component: _import('home/index')
      },
      {
        path: 'sellerDetails',
        component: _import('home/sellerDetails')
      },
      {
        path: 'sellerList',
        component: _import('home/sellerList')
      },
      {
        path: 'detail',
        component: _import('home/detail')
      },
      {
        path: 'newInformation',
        component: _import('home/newInformation')
      },
      {
        path: 'newDetail',
        component: _import('home/newDetail')
      },
      {
        path: 'orderConfirm',
        component: _import('home/orderConfirm')
      },
      {
        path: 'orderDetail',
        component: _import('home/orderDetail')
      },
      {
        path: 'scenic',
        component: _import('home/scenic')
      },
      {
        path: 'scenicParticulars',
        component: _import('home/scenicParticulars')
      }
    ]
  }, {
    path: '/shop',
    component: _import('shop/view'),
    children: [
      {
        path: '/',
        component: _import('shop/index')
      },
      {
        path: 'detail',
        component: _import('shop/detail')
      }
    ]
  }, {
    path: '/order',
    component: _import('order/view'),
    children: [
      {
        path: '/',
        component: _import('order/index')
      },
      {
        path: 'detail',
        component: _import('order/detail')
      },
      {
        path: 'detailList',
        component: _import('order/detailList')
      },
      {
        path: 'orderConfirm',
        component: _import('order/orderConfirm')
      }
    ]
  }, {
    path: '/orderFood',
    component: _import('orderFood/view'),
    children: [
      {
        path: '/',
        component: _import('orderFood/index')
      },
      {
        path: 'buy',
        component: _import('orderFood/buy')
      },
      {
        path: 'detail',
        component: _import('orderFood/detail')
      },
      {
        path: 'order',
        component: _import('orderFood/order')
      }
    ]
  }, {
    path: '/scenicSpot',
    component: _import('scenicSpot/view'),
    children: [
      {
        path: '/',
        component: _import('scenicSpot/index')
      },
      {
        path: 'detail',
        component: _import('scenicSpot/detail')
      },
      {
        path: 'order',
        component: _import('scenicSpot/order')
      },
      {
        path: 'orderConfirm',
        component: _import('scenicSpot/orderConfirm')
      },
      {
        path: 'orderDetail',
        component: _import('scenicSpot/orderDetail')
      }
    ]
  }, {
    path: '/member',
    component: _import('member/view'),
    children: [
      {
        path: '/',
        component: _import('member/index')
      },
      {
        path: 'setAddress',
        component: _import('member/setAddress')
      },
      {
        path: 'coupon',
        component: _import('member/coupon')
      },
      {
        path: 'comAndSug',
        component: _import('member/comAndSug')
      },
      {
        path: 'historySug',
        component: _import('member/historySug')
      },
      {
        path: 'personalData',
        component: _import('member/personalData')
      },
      {
        path: 'collection',
        component: _import('member/collection')
      },
      {
        path: 'addAddress',
        component: _import('member/addAddress')
      },
      {
        path: 'resort',
        component: _import('member/resort')
      },
      {
        path: 'avatar',
        component: _import('member/avatar')
      },
      {
        path: 'nickname',
        component: _import('member/nickname')
      }
    ]
  }, {
    path: '/travel',
    component: _import('travel/view'),
    children: [
      {
        path: '/',
        component: _import('travel/travelitem')
      },
      {
        path: 'travelDetail',
        component: _import('travel/travelDetail')
      },
      {
        path: 'travelNotes',
        component: _import('travel/travelNotes')
      }
    ]
  }, {
    path: '/map',
    component: _import('map/view'),
    children: [
      {
        path: '/',
        component: _import('map/index')
      },
      {
        path: 'route',
        component: _import('map/route')
      },
      {
        path: 'walk',
        component: _import('map/walk')
      },
      {
        path: 'walkFac',
        component: _import('map/walkFac')
      }
    ]
  }, {
    path: '/search',
    component: _import('search/view'),
    children: [{
        path: '/',
        component: _import('search/index')
      }, {
        path: 'commodity',
        component: _import('search/commodityList')
      }
    ]
  }, {
    path: '/park',
    component: _import('park/park')
  }
]

export default new Router({
  base: 'dist',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
