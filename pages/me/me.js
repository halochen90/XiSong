
//获取应用实例
var app = getApp()
var authTip = require("../../utils/authTip");

Page({
  data: {
    welcome: '欢迎光临晨曦之歌..',
    images: [],
    userInfo:{},
    role:0,
  },
  //加载函数
  onLoad: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        // //console.log("获取用户信息成功:",res)
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

//每次打开页面都会触发
  onShow: function(){
    var that = this;
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session: res.data
        })
        sendRequestApplyNum(that);
      },
    })
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
  },
  changeImg: function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/changeImg/changeImg',
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
        header: {
          'SESSION': session,
          'content-type': 'application/json'
        },
        success:function(result){
          //console.log("role:",result.data.role);
            var role = result.data.role;
            that.setData({
              role:role
            })
        }
      })
    },
  })
}

function sendRequestApplyNum(that){
  wx.request({
    url: app.REQUEST_URL + "/api/information/apply/totalNum",
    method: 'GET',
    header: {
      'SESSION': that.data.session,
      'content-type': 'application/json'
    },
    success: function (result) {
      //console.log("totalNum:", result.data.totalNum);
      var applyNum = result.data.totalNum;
      that.setData({
        applyNum: applyNum
      })
    }
  })
}
