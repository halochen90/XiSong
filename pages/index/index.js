//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    preUrl:"http://image.halochen.com/",
    recordPage:{},
    records:[],
    currentIndex:1
  },
  //事件处理函数
  onLoad: function () {
    var that = this;

    //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   });
    // })
  },
  // 每次进入页面都会调用
  onShow: function(){
    var that = this;
    //重新获取第一页的10条记录
    that.setData({
      recordPage: {},
      records: [],
      currentIndex: 1
    })
    sendRequestRecords(1, that);
  },
  //预览图片
  checkImage: function (e) {
    //接收点击事件传过来的参数
    var current = e.target.dataset.src;
    var preUrl = e.target.dataset.preurl;

    //一条记录中的图片集合对象
    var preImages = e.target.dataset.images;
    var srcs = [];
    for (var index in preImages){
      srcs.push(preUrl + preImages[index].name);
    }
  
    wx.previewImage({
      current: current,
      urls: srcs,
      success: function (res) {
        console.log(res);
      },
      fail: function () {
        console.log('fail')
      }
    })
  },
  onReachBottom: function (e) {
    var that = this;
    var currentIndex = that.data.recordPage.currentIndex;
    var totalPages = that.data.recordPage.totalPages;
    if(currentIndex < totalPages){
      sendRequestRecords(currentIndex+1,that);
      // console.log("加载下一页数据")
    }else{
      wx.showToast({
        title: '没有更多数据了..'
      })
      // console.log("没有更多数据..")
    }
  }
})

//发送请求获取记录
function sendRequestRecords(currentIndex,that) {
  wx.request({
    url: app.REQUEST_URL + '/api/records/currentIndex/'+ currentIndex,
    method: 'GET',
    data: {},
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      //填充records
      var rs = res.data.records;
      for(var i in rs){
        that.data.records.push(rs[i]);
      }
      
      that.setData({
        recordPage:res.data,
        records: that.data.records,
        currentIndex: currentIndex
      })
      // console.log(that.data.records);
    }
  })
}
