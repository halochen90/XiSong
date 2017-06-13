const qiniuUploader = require("../../utils/qiniuUploader");
//index.js

// 初始化七牛相关参数
function initQiniu() {
  var options = {
    region: 'ECN', // 华东区
    uptoken: 'vZLH9HumQWw09YdFUp-wr3npuFk8t-D9IENOJSRJ:JNtqGTjfUQTmRpdzQTiHzQGOBm0=:eyJzY29wZSI6ImhhbG8iLCJkZWFkbGluZSI6MTQ5NzMyNTQ3M30=',
    domain: 'http://image.halochen.com/'
  };
  qiniuUploader.init(options);
}

//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '欢迎光临晨曦之歌..',
    images: [],
    userInfo:{}
  },
  //加载函数
  onLoad: function () {
    var that = this;
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo
      })
      // console.log("me:",userInfo);
    })
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
    count: 9,//最多可以选择的图片张数，默认9
    success: function (res) {
      var filePaths = res.tempFilePaths;
      // 交给七牛上传多张图片
      qiniuUploader.uploadMulti(filePaths, (res) => {
        that.data.images.push(res);
        that.setData({
          images: that.data.images
        });
        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        });

        console.log(that.data);
      }    
      
    }
  )
}