// page/component/new-pages/cart/cart.js
var app = getApp();
Page({
  data: {
    carts:[],               // 购物车列表
    hasList:false,          // 列表是否有数据
    totalPrice:0,           // 总价，初始为0
    selectAllStatus:true    // 全选状态，默认全选
  },  
  /**
   * 提交订单到数据库。需保存用户信息，收货人，地址，电话
   */
  submitorder(){
    if (this.data.totalPrice == 0) {
      wx.showModal({
        title: '提示',
        content: '没有选择物品，金额为0',
        showCancel: false
      })
      return
    }    
    
    /**
     * 获取本地缓存 地址信息
     */    
    var addvalue = wx.getStorageSync('address')   
    //console.log('address',addvalue)   
    if (!addvalue){
      //console.log('cart-submitorder缓存中没有address信息')
      wx.showModal({
        title: '提示',
        content: '地址信息不全，请填写完整信息',
        showCancel:false,
        success: function (res) {
          wx.switchTab({
            url: '../user/user',
          })
        }
      })
      return  
    }

    // console.log('此时订单',this.data.carts)
    // console.log('此时totalPrice', this.data.totalPrice)
    // console.log('此时订单sele', this.data.carts[0].selected)
    // console.log('此时订单msg', this.data.carts.length)
    //遍历数组，选中的才提交
    var obj = [];
    
        
    this.data.carts.forEach(function(value,index){
      if (value.selected){
        //console.log(value)
        //console.log(value.itemno)
        var msg = new Object();
        // msg.id = index;
        // msg.value = value;        
        //obj.push(value)        
        msg.itemno = value.itemno;
        msg.num = value.num;
        msg.price = value.price;
        msg.image = value.image;
        msg.nickname = app.globalData.userInfo.nickName;
        msg.address = addvalue.addstr+addvalue.detail
        msg.tel = addvalue.phone
        obj.push(msg)        
      }
    })
    
    //保存到数据库
    var url = app.globalData.myUrl + '?proc=submitorder';
    wx.request({
      url: url,      
      data: JSON.stringify(obj),
      method:'POST',
      success:function(res){        
        wx.showModal({
          title: '提示',
          content: '订单已提交，工作人员会尽快联系您',
          showCancel:false,
          success:function(res){
            wx.switchTab({
              url: '../user/user',
            })
          }
        })
      }
    })
    //提交订单后，后台需要清空购物车
  },  
  onShow() {
    //console.log('状态：cart.js中的onshow执行')
    //原来获取购物车信息写在noShow中，但有时不能执行，改到onLoad中
    //请求后台，获取购物车信息
    var url = app.globalData.myUrl + '?proc=getcarts&nickname=' + app.globalData.userInfo.nickName;
    //console.log('cart.js中url',url)
    var that = this;
    wx.request({
      url: url,
      success: function (res) {
        //console.log('获取的购物车数据', res)
        if(res.data.errno==1){
          //如果购物车为空
          that.setData({hasList:false})
        }else{
          that.setData({
            hasList: true,
            carts: res.data.rows
          })
        }        
      }
    })
    this.getTotalPrice();    
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    //console.log('selectList',e)
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    const selected = carts[index].selected;
    carts[index].selected = !selected;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 删除购物车当前商品
   */
  deleteList(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    carts.splice(index,1);
    this.setData({
      carts: carts
    });
    if(!carts.length){
      this.setData({
        hasList: false
      });
    }else{
      this.getTotalPrice();
    }
  },

  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;

    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    num = num + 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    //console.log('minusCount',e)
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    if(num <= 1){
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    this.setData({
      carts: carts
    });
    this.getTotalPrice();
  },

  /**
   * 计算总价
   */
  getTotalPrice() {
    let carts = this.data.carts;                  // 获取购物车列表
    let total = 0;
    for(let i = 0; i<carts.length; i++) {         // 循环列表得到每个数据
      if(carts[i].selected) {                     // 判断选中才会计算价格
        total += carts[i].num * carts[i].price;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  }

})