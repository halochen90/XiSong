const Util = require('../../utils/util.js');
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    records:[],
    totalPage:1,
    session:null
  },
  
  // 每次进入页面都会调用
  onLoad: function(){
    var that = this;
    //获取第一页的10条记录
    that.setData({
      records: [],
      currentIndex: 1
    })
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session:res.data
        })
      
        sendRequestRecords(1, that);
        
      },
    }) 
  },

//如果切换到其他页面，则结束播放的视频
  onHide:function(){
    var that = this;
    var records = that.data.records;
    for (var i in records) {
      if (records[i].contentType == 2) {
        var videos = records[i].videos;
        for (var j in videos) {
          videos[j].display = true;
        }
      }
    }
    
    that.setData({
      records: records,
    })
  },

  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
    //设置下拉刷新标识
    that.setData({
      isPullDown:true
    })
  },

  play: function (e) {
    var that = this;
    var index = e.target.dataset.index;
    var recordIndex = e.target.dataset.recordindex;

    var records = that.data.records;
    for (var i in records) {
      if (records[i].contentType == 2){
        var videos = records[i].videos;
        for(var j in videos){
          videos[j].display = true;
        }
      }
    }
    records[recordIndex].videos[index].display = false;
    console.log("records:", records)
    that.setData({
      records: records,
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
        console.log("预览成功：",res)
      },
      fail: function () {
        console.log('fail')
      }
    })
  },
  onReachBottom: function (e) {
    var that = this;
    //如果是下拉刷新操作，不执行操作
    if (that.data.isPullDown == true){
      that.setData({
        isPullDown:false
      })
      return false;
    }

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

    }
  })
}
