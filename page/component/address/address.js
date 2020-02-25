// page/component/new-pages/user/address/address.js
var plugin = requirePlugin("myPlugin");

Page({
  data:{
    address:{
      name:'',
      phone:'',
      detail:'', 
      addstr:'山东省威海市环翠区'   //原来没有，根据省市区选择器的需要添加的属性
    },
    // 初始数据
    value: [370000, 371000, 371002],    
  },
  onRChange(e) {
    //this.setData({ value: [370000, 371000, 371002]});
    //this.setData({'address.addstr':e.detail});
    // 注意：由于组件父子通宵需要用到自定义事件，所以初始数据value不会被改变
    //console.log('当前数据', JSON.stringify(e.detail)); // 当前数据 {"value":[340000,340100,340181],"label":["安徽省","合肥市","巢湖市"]}
    //console.log('初始数据', this.data.value);// 初始数据 (3) [310000, 310000, 310113]    
    //console.log('当前位置', e.detail);
    //console.log('省市区位置', e.detail.label[0]+e.detail.label[1]);    
    this.setData({ 'address.addstr': e.detail.label[0] + e.detail.label[1] +e.detail.label[2]});
  }, 
  onLoad(){
    //console.log('本插件从腾讯地图拉取的省市区信息，数据格式与iview级联格式一致。')
    // 调用插件API接口
    //console.log('获取全部数据', plugin.getAddressList()) // 获取全部数据 {addressList: Array(34)}
    var self = this;
    
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          address : res.data
        })
      }
    })
  },
  formSubmit(){
    console.log('form保存时地址',this.data.address)
    var self = this;
    if(self.data.address.name && self.data.address.phone && self.data.address.detail){
      //this.setData({'address.addstr':''})
      wx.setStorage({
        key: 'address',
        data: self.data.address,        
        success(){
          console.log('写入地址', self.data.address)                  
          wx.showToast({
            title: '保存成功',
            showCancel:false
          })
          wx.navigateBack();
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整资料',
        showCancel:false
      })
    }
  },
  bindName(e){
    this.setData({
      'address.name' : e.detail.value
    })
  },
  bindPhone(e){
    this.setData({
      'address.phone' : e.detail.value
    })
  },
  bindDetail(e){
    this.setData({
      'address.detail' : e.detail.value      
    })
  }
})