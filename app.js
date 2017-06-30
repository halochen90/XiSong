//app.js
var authTip = require("utils/authTip");
App({
  ORIGIN_REQUEST_URL: "https://request.halochen.com",
  
  SESSION:'',
  days:0,
  globalData: {
    userInfo: null,
  },
  onLaunch: function () {
    var that = this
    //获取后台接口地址
    wx.request({
      url: that.ORIGIN_REQUEST_URL + '/api/url',
      method: 'GET',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var apiUrl = res.data.apiUrl;
        var qiniu = res.data.qiniu;
        that.REQUEST_URL = apiUrl;
        that.IMAGE_DOMAIN = qiniu;
      }
    })

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




