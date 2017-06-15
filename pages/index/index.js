//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    preUrl:"http://image.halochen.com/",
    recordPage:{}
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      });
    }),
    //获取第一页的10条记录
      sendRequest(1,that);
  }
})

//发送请求获取记录
function sendRequest(currentIndex,that) {
  wx.request({
    url: 'https://api.halochen.com:8443/api/records/currentIndex/'+ currentIndex,
    method: 'GET',
    data: {},
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
     that.setData({
       recordPage:res.data
     })
     console.log(that.data.recordPage);
    }
  })
}
