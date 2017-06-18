//app.js
App({
  REQUEST_URL: "https://request.halochen.com",
  globalData: {
    userInfo: null
  },
  onLaunch: function () {
    
  },
  getUserInfo:function(cb){
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        that.globalData.userInfo = res.userInfo
        typeof cb == "function" && cb(that.globalData.userInfo);
      }
    });
  }

})

var app = getApp();

