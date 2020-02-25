// page/component/login/login.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userInfo:{},
    hasUserInfo:false,
    isLogin:false,
    getUserInfoFail: false,
  }, 
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {   
    //return
    console.log('全局变量userInfo', app.globalData.userInfo)
    console.log('CanIuse:', this.data.canIUse)
    //如果存在全局变量userInfo,将this.data.hasUserInfo设为true
    if (app.globalData.userInfo) {      
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true   //为true时，不显示授权按钮
      })
    }
    /*如果全局的userInfo不存在，再获取wx.canIUser的返回值，看用户是否点击了允许授权  */
    // if (this.data.canIUse) {
    //   console.log('canIUse', this.data.canIUse)
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     //this.userInfoReadyCallback = res => {
    //     console.log('callback', res)
    //     app.globalData.userInfo = res.userInfo
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // }



    wx.getSetting({
      success:res=>{
        console.log('getsetting调用成功', res) 
        if (res.authSetting['scope.userInfo']) {
          console.log('已授权',res.authSetting['scope.userInfo'])
          //获取用户信息弹窗处理
           wx.getUserInfo({             
             success:function(res){
               app.globalData.userInfo = res.userInfo;
               //getUserInfo可能在onLoad之后才返回，所有加callBack
               if(app.userInfoReadyCallback){
                 app.userInfoReadyCallback(res)
               }
               console.log('wx.getUserInfo执行')
               console.log('已授权时app全局变量', app.globalData.userInfo)
               //平台登录
               wx.switchTab({
                 url: '/page/component/index'
                 //前面必须加/，原来在app.json中值为page/component/index
               })  
             }             
           })          
        }
        //如果res.authSetting['scope.userInfo']不存在，转到授权窗口
        else{
          console.log('wx.getsetting用户暂未授权')
          this.setData({hasUserInfo:false,isLogin:true})
        }
      },      
      fail:function(res){
        //用户点拒绝，也不能触发fail
        console.log('getsetting-fail', res)
      }
    })
    console.log('login-data-hasUserInfo',this.data.hasUserInfo)
    console.log('login-data-userInfo',this.data.userInfo)
    console.log('login-data-getuserInfo', this.data.getUserInfoFail)
    //this.login(); 改为在onLoad中执行login，调试时可以用
  },
  onShow: function () {
    console.log('onshow', this.data.canIUse)
    //this.login();
  },
  //获取用户信息弹窗处理
  getUserInfo: function (e) {
    console.log('getUserInfo', e)
    //这里点击同意后，会直接获取到用户信息吗
    if (e.detail.userInfo) {
      //经测试，点允许后，e.detail.userInfo会直接有用户信息
      console.log('是否会有userInfo',e.detail)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      /*有了e.detai.userInfo，说明用户已经同意，可以进入login
      经测试，wx.login会执行
      */
      this.login();
      // wx.switchTab({
      //   url: '/page/component/index'
      // }) 
    }else{
      //经测试，如果点击拒绝，会执行下面的语句，即e.detail.userInfo不存在
      console.log('拒绝授权')
      wx.showToast({
        title: '您拒绝了授权',
      })
    }
    console.log('getuserino执行后', this.data.hasUserInfo, this.data.userInfo)
       
  },  
  //登录函数
  login: function () {   
    var that = this;        
    wx.login({
      success: function (res) {
        console.log('wx.login调用',res)        

        wx.getUserInfo({
          success: function (res) {            
            app.globalData.userInfo = res.userInfo
            that.setData({
              getUserInfoFail: false,
              userInfo: res.userInfo,
              hasUserInfo: true
            })
            //平台登录
            wx.switchTab({
              url: '/page/component/index'
              //前面必须加/，原来在app.json中值为page/component/index
            })            
          },
          fail: function (res) {            
            console.log('wx.login中的wx.getUserInfo失败',res);
            that.setData({
              getUserInfoFail: true
            })
          }
        })
      }
    })
  },
  //跳转设置页面授权
  openSetting: function () {
    var that = this
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          console.log('openSetting',res);
          //尝试再次登录
          that.login()
        }
      })
    } else {
      console.log('openSetting失败');
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新进入小程序->点击授权按钮'
      })
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
   
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})