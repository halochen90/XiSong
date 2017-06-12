const qiniuUploader = require("../../utils/qiniuUploader");
//index.js

// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'ECN', // 华北区
    uptoken: 'vZLH9HumQWw09YdFUp-wr3npuFk8t-D9IENOJSRJ:KYjVHRb0NJy4cz_VJvXdUXABC98=:eyJzY29wZSI6ImhhbG8iLCJkZWFkbGluZSI6MTQ5NzI3NTIzM30=',
    domain: 'http://image.halochen.com/',
    key: 'xisong.jpeg'
  };
  qiniuUploader.init(options);
}

//获取应用实例
var app = getApp()
Page({
  data: {
    imageObject: {}
  },
  //事件处理函数
  onLoad: function () {
    console.log('onLoad')
    var that = this;
  },
  
  didPressChooesImage: function () {
    var that = this;
    didPressChooesImage(that);
  }
});

function didPressChooesImage(that) {
  initQiniu();
  // 微信 API 选文件
  wx.chooseImage({
    count: 1,
    success: function (res) {
      var filePath = res.tempFilePaths[0];
      // 交给七牛上传
      qiniuUploader.upload(filePath, (res) => {
        that.setData({
          'imageObject': res
        });
      }, (error) => {
        console.error('error: ' + JSON.stringify(error));
      });
    }
  }
  )
}