// page/component/new-pages/user/user.js
var app = getApp();
Page({
  data:{
    thumb:'',
    nickname:'',
    orders:[],
    hasAddress:false,
    address:{},
    ordermoney:0  //原来没有，订单总金额
  },
  onLoad(){
    var self = this;
    /**
     * 获取用户信息
     */        
    wx.getUserInfo({
      success: function(res){
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    });   
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function (res) {
        console.log('缓存中地址', res.data)
        self.setData({
          hasAddress: true,
          address: res.data
        })
      },
      fail:function(res){
        console.log('缓存中没有address信息')
      }
    })    


  },
  onShow(){
        /**
     * 发起请求获取订单列表信息
     */
    var self = this;
    //var url = app.globalData.myUrl + '?proc=getorders&nickname='+this.data.nickname;
    var url = app.globalData.myUrl + '?proc=getorders&nickname=' + app.globalData.userInfo.nickName;
    console.log('我的url',url)
    wx.request({
      url:url,
      //url: 'http://www.gdfengshuo.com/api/wx/orders.txt',
      success(res){
        console.log('获取的订单',res)
        if(res.data.errno==1){
          return;
        }else{
          self.setData({
            orders: res.data.rows,
            ordermoney: res.data.rows[0].ordermoney
          })
        }        
      }
    })
  
  },
  /**
   * 发起支付请求
   */
  payOrders(){
    wx.requestPayment({
      timeStamp: 'String1',
      nonceStr: 'String2',
      package: 'String3',
      signType: 'MD5',
      paySign: 'String4',
      success: function(res){
        console.log(res)
      },
      fail: function(res) {
        wx.showModal({
          title:'支付提示',
          content:'<text>',
          showCancel: false
        })
      }
    })
  }
})