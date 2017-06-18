
//获取应用实例
var app = getApp()
var authTip = require("../../utils/authTip");

Page({
  data: {
    motto: '欢迎光临晨曦之歌..',
    images: [],
    userInfo:{},
    isAdmin:false
  },
  //加载函数
  onLoad: function () {
    console.log("me onload")
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        // console.log("获取用户信息成功:",res)
        that.setData({
          userInfo:res.userInfo
        })
      },
      fail: function () {
        authTip.alertAuthTip("/pages/me/me");
      }
    })
    //判断当前用户是否是管理员
    isAdmin(that);
  },
  
  wantPublish: function () {
    var that = this;
    wx.navigateTo({
      url: '/pages/imgup/imgup'
    })
  },
  dealAuthApply: function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/apply/apply',
    })
  }
});

function isAdmin(that){
  wx.getStorage({
    key: 'session',
    success: function(res) {
      var session = res.data;
      wx.request({
        url: app.REQUEST_URL + "/api/information/role",
        method:'GET',
        data:{
          session:session
        },
        header: {
          'content-type': 'application/json'
        },
        success:function(result){
          console.log("isAdmin:",result.data.isAdmin);
            var isAdmin = result.data.isAdmin;
            if(isAdmin){
              that.setData({
                isAdmin:true
              })
            }
        }
      })
    },
  })
}
