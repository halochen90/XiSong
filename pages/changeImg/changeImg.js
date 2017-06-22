const qiniuUploader = require("../../utils/qiniuUploader");
const Util = require('../../utils/util.js');

//获取应用实例
var app = getApp()

// 初始化七牛相关参数
function initQiniu(session) {
  var options = {
    session: session
  };
  qiniuUploader.init(options);
  // //console.log(options.uptokenURL)
}


Page({
  data: {
    images: []
  },
  //加载函数
  onLoad: function () {
    var that = this;

    wx.getStorage({
      key: 'headImg',
      success: function(res) {
        that.setData({
          headImg:res.data.image
        })
      },
    })

    wx.getStorage({
      key: 'session',
      success: function (res) {
        that.setData({
          session: res.data
        })
      },
    })
  },
  chooseImg: function () {
    var that = this
    if (that.data.images.length != 0){
      wx.showToast({
        title: '只能选择一张图片！',
      })
      return;
    }

    wx.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      sizeType: ['original', 'compressed'],
      success: function (res) {
        var filePaths = res.tempFilePaths;
        for (var index in filePaths) {
          that.data.images.push(filePaths[index]);
        }
        //必须setData
        that.setData({
          images: that.data.images
        })
      }
    })
  },

  checkImage: function (e) {
    var current = e.target.dataset.src;

    wx.previewImage({
      current: current,
      urls: this.data.images,
      success: function (res) {
        //console.log(res);
      },
      fail: function () {
        //console.log('fail')
      }
    })
  },

  cencelImage: function (e) {
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
            images: images,
            disabled:false
          })
        }
      }
    })

  },

  formSubmit: function (e) {
    var that = this
    that.setData({
      disabled: true
    })
    //console.log('form发生了submit事件，携带数据为：', e.detail.value.comment)
    var filePaths = that.data.images;
    if (filePaths.length < 1) {
      that.setData({
        disabled: false
      })
      wx.showToast({
        title: '请选择一张图片！',
      })
      return;
    }

    initQiniu(that.data.session);
    //构造一个参数对象
    var param = new Object();
    param.image = null;

    var successTimes = 0;
    qiniuUploader.uploadMulti(filePaths, (res) => {
      param.image = res.key;
      successTimes++;
      if (successTimes == filePaths.length) {
        //console.log("所有图片已经上传成功！")
        sendRequest(param, that);
      }
    }, (error) => {
      wx.showToast({
        title: '图片上传失败！'
      })
      //console.error('error: ' + JSON.stringify(error));
    }, () => {
      //如果没有图片，只上传文字
      sendRequest(param, that);
    });
  }
})

function sendRequest(param, that) {
  wx.request({
    url: app.REQUEST_URL + '/api/images/newHeadImg',
    method: 'POST',
    data: {
      image: param.image
    },
    header: {
      'SESSION': that.data.session,
      'content-type': 'application/json'
    },
    success: function (res) {
      //更新缓存
      var imageUrl = res.data.imageUrl;
      // console.log("更新缓存headImgUrl:" + imageUrl);
      var headImg = {};
      headImg.image = imageUrl;
      headImg.time = Util.getCurrentTime();
      wx.setStorageSync("headImg", headImg);

      // wx.removeStorage({
      //   key: 'image',
      //   success: function (res) {
      //     console.log("更换首图清空image缓存")
      //   },
      // })

      //返回首页
      if(res.data){//true
        wx.navigateTo({
          url: '/pages/launch/launch'
        })
      }else{
        wx.showToast({
          title: '修改首图失败！',
        })
      }
    }
  })
}