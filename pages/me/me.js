
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '欢迎光临晨曦之歌..',
    images: [],
    userInfo:{}
  },
  //加载函数
  onLoad: function () {
    var that = this;
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo
      })
      // console.log("me:",userInfo);
    })
  },
  
  wantPublish: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/imgup/imgup'
    })
  }
});
