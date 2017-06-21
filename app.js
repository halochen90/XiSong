//app.js
var authTip = require("utils/authTip");
App({
  REQUEST_URL: "https://request.halochen.com",
  // REQUEST_URL: "https://192.168.0.31:8443",
  IMAGE_DOMAIN: "https://resource.halochen.com/",
  SESSION:'',
  days:0,
  globalData: {
    userInfo: null,
  },
  onLaunch: function () {
    var that = this
    //调用登录接口
    wx.login({
      success: function (result) {
        wx.getUserInfo({
          success: function (res) {
            that.globalData.userInfo = res.userInfo
            typeof cb == "function" && cb(that.globalData.userInfo)
          },
          fail: function () {
            authTip.alertAuthTip();
          }
        })
      }
    })  
  },

  getUserInfo:function(cb){
    var that = this
    if(that.globalData.userInfo){
      typeof cb == "function" && cb(that.globalData.userInfo)
    }else{
      //console.log("登录态获取失败")
    }
  }
})




