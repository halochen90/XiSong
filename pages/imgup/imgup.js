const qiniuUploader = require("../../utils/qiniuUploader");
//获取应用实例
var app = getApp()

// 初始化七牛相关参数
function initQiniu(session) {
  var options = {
    session:session,
    region: 'ECN', // 华东区
    uptokenURL: app.REQUEST_URL + '/api/qiniu/token',
    domain: 'http://image.halochen.com/'
  };
  qiniuUploader.init(options);
  // console.log(options.uptokenURL)
}


Page({
  data: {
    images: [],
    nickName: ''
  },
  //加载函数
  onLoad: function () {
    var that = this;

    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session: res.data
        })
      },
    }),
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
      //必须setData
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
    var that = this;
    var index = e.target.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除该图片？',
      success: function (res) {
        if (res.confirm) {
          var images = that.data.images;
          images.splice(index, 1);
          that.setData({
            images: images
          })
        }
      }
    })

  },
 
  formSubmit: function (e) {
    var that = this
    that.setData({
      disabled:true
    })
    console.log('form发生了submit事件，携带数据为：', e.detail.value.comment)
    var filePaths = that.data.images;
    var comment = e.detail.value.comment;
    var len = comment.replace(/(^\s*)|(\s*$)/g, "").length;
    if(filePaths.length < 1 && (len == 0)){
      wx.showToast({
        title: '请至少上传一张图片或输入一段文字！',
      })
      return;
    }

    initQiniu(that.data.session);
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
        sendRequest(params,that);
      }
    }, (error) => {
      wx.showToast({
        title: '图片上传失败！'
      })
      console.error('error: ' + JSON.stringify(error));
    }, () => {
      //如果没有图片，只上传文字
      sendRequest(params,that);
    });
  }
})

function sendRequest(params,that) {
  wx.request({
    url: app.REQUEST_URL + '/api/records',
    method: 'POST',
    data: {
      nickname:params.nickName,
      comment:params.comment,
      images:params.images
    },
    header: {
      'SESSION': that.data.session,
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