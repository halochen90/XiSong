//获取应用实例
var app = getApp()
Page({
  data: {
    preUrl:"http://image.halochen.com/",
    images:[],
    currentIndex:1,
    totalPages:1
  },
  //事件处理函数
  onLoad: function () {
    var that = this;
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
    var currentIndex = that.data.currentIndex;
    var totalPages = that.data.totalPages;
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
  console.log("获取相册数据。。")
  wx.request({
    url: app.REQUEST_URL + '/api/images/currentIndex/'+ currentIndex,
    method: 'GET',
    data: {},
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      //填充images
      var rs = res.data.images;
      for(var i in rs){
        that.data.images.push(rs[i]);
      }
      
      that.setData({
        images: that.data.images,
        currentIndex: currentIndex,
        totalPages: res.data.totalPages
      })
      
    }
  })
}
