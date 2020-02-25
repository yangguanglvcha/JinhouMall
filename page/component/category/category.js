Page({
    data: {
        category: [
            {name:'男单',id:'guowei'},
            {name:'女单',id:'shucai'},
            {name:'男凉',id:'chaohuo'},
            {name:'女凉',id:'dianxin'},
            {name:'休闲',id:'cucha'},
            {name:'正装',id:'danfan'}
        ],
        detail:[],
        curIndex: 0,
        isScroll: false,
        toView: 'guowei'
    },
    onReady(){
        var self = this;
        wx.request({
            url:'http://www.gdfengshuo.com/api/wx/cate-detail.txt',
            success(res){
                console.log(res.data)
                self.setData({
                    detail : res.data.result
                })
            }
        });
        
    },
    switchTab(e){
        this.setData({
            toView : e.target.dataset.id,
            curIndex : e.target.dataset.index
        })
    }
    
})