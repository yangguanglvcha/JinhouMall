// page/component/details/details.js
var app = getApp();
Page({
  data:{
    goods: {
      // id: 1,
      // image: '',
      // itemno:'',  //增加，记录商品货号，唯一确定商品
      // title: '',
      // price: 0.01,
      // stock: '有货',
      // detail: '',
      // parameter: '',
      // service: '不支持退货'
    },
    //carts: [],    //原来没有，添加以将购物车中的信息写入缓存
    num: 1,
    totalNum: 0,
    hasCarts: false,  //购物车中是否有物品，false代表没有物品
    curIndex: 0,
    show: false,
    scaleCart: false  //
  },
  onLoad:function(options){
    /*原来在onLoad中显示图片，但出现VM23244:5 Failed to load image https://jhsc.jinhou.online:886/
应该是变量还没有初始化，改为onShow
    */
    console.log('index页面传参', options)
    if (options.mark == 'true') {
      var that = this;
      var url = app.globalData.myUrl + '?proc=getdetail&itemno=' + options.itemno;
      wx.request({
        url: url,
        success: function (res) {
          console.log('swiper传参后查询', res)
          var obj = new Object();
          //obj.image = '/'+res.data.rows[0].thumb;
          obj.image = res.data.rows[0].thumb;
          obj.itemno = res.data.rows[0].itemno;
          obj.title = res.data.rows[0].itemname;
          obj.price = res.data.rows[0].price;
          obj.stock = (res.data.rows[0].stock > 0) ? '有货' : '暂时无货';
          obj.detail = '';
          obj.service = '';
          that.setData({ goods: obj });
        }
      })
    } else {
      var obj = new Object();
      //obj.image = '/' + options.thumb;
      obj.image = options.thumb;
      obj.itemno = options.itemno;
      obj.title = options.itemname;
      obj.price = options.price;
      obj.detail = '';
      obj.service = '';
      obj.stock = (options.stock > 0) ? '有货' : '暂时无货';
      this.setData({ goods: obj })
      console.log('detail图片', this.data.goods)
    }
      
  },
  onShow:function(options){
    
  },
  //购物数量增加
  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },
  //添加到购物车,应该将购物车信息写入缓存中
  /*原来知识增加了数量，没有记录增加的产品信息
  而在onLoad中，已经将商品信息写入了this.data.goods中
  
  */

  addToCart() {
    //console.log('总数0', this.data.totalNum)  //获取不到totalNum
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;
    var carttotal = 0;
    //console.log('总数total', total)   //获取不到totalNum
    //console.log('num值', num)

    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          //total为原来购物车中的数量，num为本次增加的数量
          totalNum: num + total   //两个数量相加，重写data中的totalNum
        }) 
        self.writeToCart();       
      }, 200)
    }, 300);
    
    //console.log('总数',this.data.totalNum) //获取不到totalNum



/*
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          address: res.data
        })
      }
    })*/


  },
  writeToCart(){
    //准备写入的信息
    var obj = this.data.goods;
    obj.num = this.data.totalNum; //总数添加到obj的num中
    obj.selected = true;

    // var carts = [];
    // carts.push(obj);
    //  console.log('carts数据', carts)
    // console.log('carts数据', carts[0].title)
    /*添加购物车信息，写入数据库或缓存中    
    不能保存到缓存，因为缓存的key不能重复，会覆盖
    */
    // console.log('app中的user', app.globalData)
    // console.log('app中的user',app.globalData.userInfo.nickName)
  
    //var url = app.globalData.myUrl+'?proc=cart&itemno=' + this.data.goods.itemno + '&title=' + this.data.goods.title + '&total=' + this.data.totalNum + '&price=' + this.data.goods.price + '&nickname=' + app.globalData.userInfo.nickName+'&image='+this.data.goods.image
    var path = this.data.goods.image;
    var pathstr = path.split("/");
    var str = '';
    for(var i=0;i<pathstr.length;i++){
      str = str + pathstr[i] + "|"
    }
    //console.log(str)
    var url = app.globalData.myUrl + '?proc=cart&itemno=' + this.data.goods.itemno + '&title=' + this.data.goods.title + '&price=' + this.data.goods.price + '&total=' + this.data.totalNum + '&nickname=' + app.globalData.userInfo.nickName + '&image=' + str
    console.log(url)
    wx.request({
      url: url,
      success:function(res){

      },
      fail:function(res){
        console.log(res)
      }
    })
    
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
 
})