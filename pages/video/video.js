const Util = require('../../utils/util.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    videos: [],
    totalPage: 1,
  },
  onLoad: function () {
    var that = this;
    that.setData({
      videos: [],
      currentIndex: 1
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

  onPullDownRefresh: function () {
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh();
    //设置下拉刷新标识
    that.setData({
      isPullDown: true
    })
  },

  onReachBottom: function (e) {
    var that = this;
    //如果是下拉刷新操作，不执行操作
    if (that.data.isPullDown == true) {
      that.setData({
        isPullDown: false
      })
      return false;
    }

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

//如果切换到其他页面，则结束播放的视频
  onHide: function () {
    var that = this;
  
    var videos = that.data.videos;
    for (var i in videos) {
      videos[i].display = true;
    }
  
    that.setData({
      videos: videos
    })
  },

  play: function(e){
    var that = this;
    var index = e.target.dataset.index;
    var videos = that.data.videos;
    for (var i in videos) {
      videos[i].display = true;
    }
    videos[index].display = false;
    // console.log("videos:",videos)
    that.setData({
      videos: videos
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
