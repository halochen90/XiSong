const qiniuUploader = require("../../utils/qiniuUploader");

// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'ECN', // 华东区
    uptokenURL: 'https://api.halochen.com:8443/api/qiniu/token',
    domain: 'http://image.halochen.com/'
  };
  qiniuUploader.init(options);
}

//获取应用实例
var app = getApp()
Page({
  data: {
    images: [],
    nickName: ''
  },
  //加载函数
  onLoad: function () {
    var that = this;
    app.getUserInfo(function (userInfo) {
      that.setData({
        nickName: userInfo.nickName
      })
    })
  },
  chooseImg:function () {
   var that = this
   wx.chooseImage({
    cuont: 9,
    sourceType: ['album', 'camera'],
    sizeType: ['original', 'compressed'],
    success: function(res) {
      var filePaths = res.tempFilePaths;
      for(var index in filePaths){
        that.data.images.push(filePaths[index]);
      }
       that.setData({
         images: that.data.images
       })
    }
   }) 
  },

  checkImage: function(e) {
    var current = e.target.dataset.src;
    
    wx.previewImage({
     current: current,
     urls: this.data.images,
        success: function(res) {
          console.log(res);
        },
        fail: function() {
          console.log('fail')
        }
   })
 },

  cencelImage:function(e){

  },
 
  formSubmit: function (e) {
    var that = this
    console.log('form发生了submit事件，携带数据为：', e.detail.value.comment)
    var filePaths = that.data.images;
    if(filePaths.length < 1){
      wx.showToast({
        title: '请至少上传一张图片！',
      })
      return;
    }

    initQiniu();
    //构造一个参数对象
    var params = new Object();
    params.nickName = that.data.nickName;
    params.comment = e.detail.value.comment;
    params.images = [];

    var successTimes = 0;
    qiniuUploader.uploadMulti(filePaths, (res) => {
      params.images.push(res.key);
      successTimes ++;
      if (successTimes == filePaths.length) {
        console.log("所有图片已经上传成功！")
        sendRequest(params);
      }
    }, (error) => {
      wx.showToast({
        title: '图片上传失败！'
      })
      console.error('error: ' + JSON.stringify(error));
    });
  }
})

function sendRequest(params) {
  wx.request({
    url: 'https://api.halochen.com:8443/api/records',
    method: 'POST',
    data: {
      nickname:params.nickName,
      comment:params.comment,
      images:params.images
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      //返回首页
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  })
}