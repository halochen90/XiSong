const Util = require('../../utils/util.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    videos: [],
    currentIndex: 1,
    totalPage: 1,
  },
  onShow: function () {
    var that = this;
    that.setData({
      videos: []
    })

    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session: res.data
        })

        sendRequestRecords(1, that);

      },
    })
  },

  onReachBottom: function (e) {
    var that = this;
    var currentIndex = that.data.currentIndex;
    // console.log("currentIndex:" + currentIndex);
    var totalPage = that.data.totalPage;
    if (currentIndex < totalPage) {
      sendRequestRecords(currentIndex + 1, that);
      // //console.log("加载下一页数据")
    } else {
      wx.showToast({
        title: '没有更多数据了..'
      })
    }
  },

  play: function(e){
    var that = this;
    var index = e.target.dataset.index;
    console.log("index:"+index);
    var videos = that.data.videos;
    for (var i in videos) {
      videos[i].display = false;
    }
    videos[index].display = true;
    console.log("videos:",videos)
    that.setData({
      videos: videos
    })
  },
  
  pause:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var videos = that.data.videos;
    for (var i in videos) {
      videos[i].display = true;
    }
    that.setData({
      videos: videos,
    })
  },

  ended:function(e){
    var that = this;
    var index = e.target.dataset.index;
    var videos = that.data.videos;
    for (var i in videos) {
      videos[i].display = true;
    }
    that.setData({
      videos: videos,
    })
  }

})

//发送请求获取记录
function sendRequestRecords(currentIndex, that) {
  wx.request({
    url: app.REQUEST_URL + '/api/videos/currentIndex/' + currentIndex,
    method: 'GET',
    data: {},
    header: {
      'SESSION': that.data.session,
      'content-type': 'application/json'
    },
    success: function (res) {
      var rs = res.data.items;
      for (var i in rs) {
        that.data.videos.push(rs[i]);
      }

      that.setData({
        videos: that.data.videos,
        currentIndex: currentIndex,
        totalPage: res.data.totalPage
      })

    }
  })
}
