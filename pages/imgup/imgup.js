const qiniuUploader = require("../../utils/qiniuUploader");
//获取应用实例
var app = getApp()
Page({
  data: {
    images: []
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
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var filePaths = that.data.images;
    qiniuUploader.uploadMulti(filePaths, (res) => {
      var params;
      params.images = filePaths;
      sendRequest(params);
    }, (error) => {
      console.error('error: ' + JSON.stringify(error));
    });
  }
})

function sendRequest(params) {
  wx.request({
    url: 'test.php',
    method: 'POST',
    data: {
      x: '',
      y: ''
    },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res.data)
    }
  })
}