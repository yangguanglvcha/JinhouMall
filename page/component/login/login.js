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
    //isLogin:false,
    //getUserInfoFail: false,
    /**<view wx:if="{{!hasUserInfo && canIUse}}">
     * ①根据wxml，如果hasUserInfo为false、canIUser为true(2个条件同时满足)，才显示让用户授权的按钮，引导用户授权。 
     * ②canIUser检测button.open-type.getUserInfo功能是否可用，一般都为true 
     * ③hasUserInfo记录全局变量app.globalData.userInfo中的用户信息,如果有用户信息，则hasUserInfo为true,此时，引导用户确认授权的按钮不显示 
     * ④如果wx:if="{{!hasUserInfo && canIUse}}"的条件不满足，再判断canIUse是否为false，如果为false，说明版本太低，显示升级版本。在wxml中用wx:elif实现。
      */
  }, 
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {     
    console.log('全局变量userInfo', app.globalData.userInfo)
    console.log('CanIuse:', this.data.canIUse)  //可用，一般都返回true
    /*如果存在全局变量app.globalData.userInfo,将this.data.hasUserInfo设为true   */
    // if (app.globalData.userInfo) {      
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true   //为true时，不显示授权按钮
    //   })
    // }

    wx.getSetting({
      //success:res=>{}的写法等同于success:function(res){}
      success:res=>{
        console.log('getsetting调用成功', res) 
        if (res.authSetting['scope.userInfo']) {
          console.log('已授权',res.authSetting['scope.userInfo'])
          /*调用微信接口，获取用户信息。如果用户已授权，此接口可以直接获取用户信息，在回调函数的userInfo属性中，就是用户信息，但不含openid等敏感信息。如果未授权，则会进入fail回调函数。 */
           wx.getUserInfo({             
             success:function(res){
               app.globalData.userInfo = res.userInfo;
               /*因为异步的原因，获取用户弹窗授权的处理函数getUserInfo，可能在onLoad之后才返回，所有加callBack  */
               if(app.userInfoReadyCallback){
                 app.userInfoReadyCallback(res)
               }               
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
          this.setData({hasUserInfo:false})
        }
      }
    })
    // console.log('login-data-hasUserInfo',this.data.hasUserInfo)
    // console.log('login-data-userInfo',this.data.userInfo)
    // console.log('login-data-getuserInfo', this.data.getUserInfoFail)
    //this.login(); 改为在onLoad中执行login，调试时可以用
  },
  onShow: function () {
    console.log('onshow', this.data.canIUse)
    //如果引导用户授权的按钮出现,onShow会执行
    //this.login();   onShow都不执行，就不用谈调用login了
  },
  //获取用户信息弹窗处理
  getUserInfo: function (e) {
    console.log('getUserInfo', e)
    //这里点击同意后，会直接获取到用户信息
    if (e.detail.userInfo) {
      //经测试，点允许后，e.detail.userInfo会直接有用户信息
      console.log('是否会有userInfo',e.detail)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      /*有了e.detai.userInfo，说明用户已经同意授权，可以进入login。
      经测试，login方法中的wx.login接口会执行。
      */
      this.login();      
    }else{
      //经测试，如果点击拒绝，会执行下面的语句，即e.detail.userInfo不存在     
      wx.showToast({
        title: '您拒绝了授权',
      })
    }
    //console.log('getuserino执行后', this.data.hasUserInfo, this.data.userInfo)       
  },  
  //登录函数
  login: function () {   
    var that = this;        
    wx.login({
      success: function (res) {
        console.log('wx.login调用',res)  

       /*执行wx.login可以获取code,将来换取open-id备用。
       因为getUserInfo已经可以获取用户信息，并设hasUserInfo为true,在login中，就没有必要再进行wx.getUserInfo再获取一次用户信息了，直接进入系统即可*/

        wx.switchTab({
          url: '/page/component/index'
          //前面必须加/，原来在app.json中值为page/component/index
        })

        // wx.getUserInfo({
        //   success: function (res) {            
        //     app.globalData.userInfo = res.userInfo
        //     that.setData({
        //       //getUserInfoFail: false,
        //       userInfo: res.userInfo,
        //       hasUserInfo: true
        //     })
        //     //平台登录
        //     wx.switchTab({
        //       url: '/page/component/index'
        //       //前面必须加/，原来在app.json中值为page/component/index
        //     })            
        //   }
        // })
      }
    })
  }
})