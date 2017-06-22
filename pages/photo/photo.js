const Util = require('../../utils/util.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    images:[],
    currentIndex:1,
    totalPage:1
  },
  onShow: function () {
    var that = this;
    that.setData({
      images: []
    })
    
    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session: res.data
        })

        sendRequestRecords(1, that);

        //获取images缓存
        // var image = wx.getStorageSync("image");
        // console.log("image:", image)
        // var time = image.time;
        // if (Util.isValid(time)) {
        //   console.log("在有效时间内，从缓存获取images");
        //   that.setData({
        //     images: image.images
        //   })
        // } else {
        //   sendRequestRecords(1, that);
        // }
      
      },
    })
  },
  //预览图片
  checkImage: function (e) {
    //接收点击事件传过来的参数
    var current = e.target.dataset.src;

    //一条记录中的图片集合对象
    var preImages = e.target.dataset.images;
    var srcs = [];
    for (var index in preImages){
      srcs.push(preImages[index].name);
    }
  
    wx.previewImage({
      current: current,
      urls: srcs,
      success: function (res) {
        //console.log(res);
      },
      fail: function () {
        //console.log('fail')
      }
    })
  },
  onReachBottom: function (e) {
    var that = this;
    var currentIndex = that.data.currentIndex;
    console.log("currentIndex:" + currentIndex);
    var totalPage = that.data.totalPage;
    if(currentIndex < totalPage){
      sendRequestRecords(currentIndex+1,that);
      // //console.log("加载下一页数据")
    }else{
      wx.showToast({
        title: '没有更多数据了..'
      })
      // //console.log("没有更多数据..")
    }
  }
})

//发送请求获取记录
function sendRequestRecords(currentIndex,that) {
  //console.log("获取相册数据。。")
  wx.request({
    url: app.REQUEST_URL + '/api/images/currentIndex/'+ currentIndex,
    method: 'GET',
    data: {},
    header: {
      'SESSION': that.data.session,
      'content-type': 'application/json'
    },
    success: function (res) {
      var rs = res.data.items;
      for (var i in rs) {
        that.data.images.push(rs[i]);
      }

      that.setData({
        images: that.data.images,
        currentIndex: currentIndex,
        totalPage: res.data.totalPage
      })

      //缓存image
      // var image = wx.getStorage({
      //   key: 'image',
      //   success: function(res) {//更新缓存
      //     console.log("更新image缓存")
      //     var image = res.data;
      //     image.images = that.data.images;
      //     image.currentIndex = currentIndex;
      //     wx.setStorage({
      //       key: 'image',
      //       data: image,
      //     })
      //   },
      //   fail:function(){//新建缓存
      //     console.log("新的image缓存")
      //     var image = {};
      //     image.images = that.data.images;
      //     image.time = Util.getCurrentTime();
      //     image.currentIndex = currentIndex;
      //     wx.setStorage({
      //       key: 'image',
      //       data: image,
      //     })
      //   }
      // })


    }
  })
}
