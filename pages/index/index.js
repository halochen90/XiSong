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
      sendRequestRecords(1,that);
  },
  onReachBottom: function (e) {
    var that = this;
    var currentIndex = that.data.recordPage.currentIndex;
    var totalPages = that.data.recordPage.totalPages;
    if(currentIndex < totalPages){
      sendRequestRecords(currentIndex+1);
      console.log("加载下一页数据")
    }else{
      console.log("没有更多数据..")
    }
    console.log('使用全局方法滑动到了页面底部');
  }
})

//发送请求获取记录
function sendRequestRecords(currentIndex,that) {
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
