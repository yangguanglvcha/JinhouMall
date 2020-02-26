var app = getApp();
Page({
  data: {
    goods:[],
    imgUrls: [
      {'mark':true,
      'url':'../../image/gxxl.jpg',
        'itemno':'J2138A3'},
      {'mark':true,
      'url':'/image/nx1.jpg',
        'itemno':'J2138A3'},
      {'mark':true,
      'url':'/image/zxx.jpg',
        'itemno':'J2138A3',
      'postId':3}
    ],
    indexmenu:[
      {'icon':'/image/icon_07.png',
      'text':'爆款销售',
      'url':'page/component/category'},
      {'icon':'/image/icon_01.png',
      'text':'新品发布',
      'url':''},
      {'icon':'/image/icon_03.png',
      'text':'加盟咨询',
      'url':''}
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    imageUrl:''
  }, 
  onSelect: function (res) {
    //console.log('swiper参数', res)
    wx.navigateTo({
      url: '/page/component/details/details?itemno='+res.currentTarget.dataset.itemno+'&mark='+res.currentTarget.dataset.mark
    })
  },
  onLoad: function () {
    this.setData({imageUrl:app.globalData.imageUrl})
    var that = this;
    var url = app.globalData.myUrl + '?proc=getlist';
    wx.request({
      url: url,
      success: function (res) {
        console.log('从数据表中获取的数据', res)
        // var goods = new Object();
        // goods.itemname = res.data.
        that.setData({goods:res.data.rows})
      }
    })

  },
})