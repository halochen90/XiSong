const Util = require('../../utils/util.js');
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    records:[],
    currentIndex:1,
    totalPage:1,
    session:null
  },
  
  // 每次进入页面都会调用
  onShow: function(){
    var that = this;
    //重新获取第一页的10条记录
    that.setData({
      records: []
    })
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session:res.data
        })
      
        sendRequestRecords(1, that);
        
        //获取records缓存
        // var record = wx.getStorageSync("record");
        // console.log("record:",record)
        // var time = record.time;
        // if(Util.isValid(time)){
        //   console.log("在有效时间内，从缓存获取records");
        //   that.setData({
        //     records: record.records
        //   })
        // }else{
        //   sendRequestRecords(1, that);
        // }
      },
    })
    
  },
  //预览图片
  checkImage: function (e) {
    //接收点击事件传过来的参数
    var current = e.target.dataset.src;

    //一条记录中的图片集合对象
    var preImages = e.target.dataset.images;
    var srcs = [];
    for (var index in preImages){
      srcs.push(preImages[index].name);
    }
  
    wx.previewImage({
      current: current,
      urls: srcs,
      success: function (res) {
        // console.log(res);
      },
      fail: function () {
        console.log('fail')
      }
    })
  },
  onReachBottom: function (e) {
    var that = this;
    var currentIndex = that.data.currentIndex;
    // console.log("currentIndex:"+currentIndex);
    var totalPage = that.data.totalPage;
    if(currentIndex < totalPage){
      sendRequestRecords(currentIndex+1,that);
      // console.log("加载下一页数据")
    }else{
      wx.showToast({
        title: '没有更多数据了..'
      })
      // console.log("没有更多数据..")
    }
  }
})

//发送请求获取记录
function sendRequestRecords(currentIndex,that) {
  // console.log("index session:"+that.data.session)
  wx.request({
    url: app.REQUEST_URL + '/api/records/currentIndex/'+ currentIndex,
    method: 'GET',
    header: {
      'SESSION': that.data.session,
      'content-type': 'application/json'
    },
    success: function (res) {
      // console.log("获取到的records:",res.data)
      //填充records
      var rs = res.data.items;
      for (var i in rs) {
        that.data.records.push(rs[i]);
      }

      // console.log("totalpage:"+res.data.totalPage);
      that.setData({
        records: that.data.records,
        currentIndex: currentIndex,
        totalPage: res.data.totalPage
      })

      // console.log(res)
    
      //缓存record
      // var record = wx.getStorage({
      //   key: 'record',
      //   success: function(res) {
      //     console.log("更新record缓存")
      //     var record = res.data;
      //     record.records = that.data.records;
      //     record.time = Util.getCurrentTime();
      //     record.currentIndex = currentIndex;

      //     wx.setStorage({
      //       key: 'record',
      //       data: record,
      //     })
      //   },
      //   fail:function(){
      //     console.log("新的record缓存")
      //     var record = {};
      //     record.records = that.data.records;
      //     record.time = Util.getCurrentTime();
      //     record.currentIndex = currentIndex;
      
      //     wx.setStorage({
      //       key: 'record',
      //       data: record,
      //     })
      //   }
      // })  

      // console.log("that.data.records:",that.data.records);
    }
  })
}
