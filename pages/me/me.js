
//获取应用实例
var app = getApp()
var authTip = require("../../utils/authTip");

Page({
  data: {
    images: [],
    userInfo:{},
    role:0,
  },
  //加载函数
  onLoad: function () {
    console.log("me onload")
    console.log("app days:" + app.days);
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        // console.log("获取用户信息成功:",res)
        that.setData({
          userInfo:res.userInfo,
          days: app.days
        })
      },
      fail: function () {
        authTip.alertAuthTip("/pages/me/me");
      }
    })
    //判断当前用户的角色
    getRole(that);
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

function getRole(that){
  wx.getStorage({
    key: 'session',
    success: function(res) {
      var session = res.data;
      wx.request({
        url: app.REQUEST_URL + "/api/information/role",
        method:'GET',
        data:{
         
        },
        header: {
          'SESSION': app.SESSION,
          'content-type': 'application/json'
        },
        success:function(result){
          console.log("role:",result.data.role);
            var role = result.data.role;
            that.setData({
              role:role
            })
        }
      })
    },
  })
}
