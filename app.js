//app.js
var authTip = require("utils/authTip");
App({
  REQUEST_URL: "https://request.halochen.com",
  globalData: {
    userInfo: null
  },
  onLaunch: function () {
    var that = this
    //调用登录接口
    wx.login({
      success: function (result) {
        if (result.errMsg == 'login:ok') {
          console.log(result.code);
        }
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
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      console.log("登录态获取失败")
    }
  },
  globalData:{
    userInfo:null
  }

})

var app = getApp();

