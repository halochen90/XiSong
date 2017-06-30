const qiniuUploader = require("../../utils/qiniuUploader");
//获取应用实例
var app = getApp()

// 初始化七牛相关参数
function initQiniu(session) {
  var options = {
    session:session
  };
  qiniuUploader.init(options);
  // //console.log(options.uptokenURL)
}


Page({
  data: {
    contentType:0,//默认为0照片、视频都可以选，1：照片，2：视频
    images: [],
    videos:[]
  },
  //加载函数
  onLoad: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        that.setData({
          nickName: res.userInfo.nickName,
        })
      }
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

  chooseContent:function(){
    var that = this;
    var contentType = that.data.contentType;
    if(contentType == 0){
      var contentList = ['照片', '视频'];
      wx.showActionSheet({
        itemList: contentList,
        success: function (res) {
          var index = res.tapIndex;
          if (index == 0) {
            that.chooseImg();
          } else {
            that.chooseVideo();
          }
        },
        fail: function (res) {
          console.log(res.errMsg)
        }
      })
    } else if (contentType == 1){//已选过照片则只能选照片
      that.chooseImg();
    } else {//已选了视频则只能再选视频
      that.chooseVideo();
    } 
  },

  chooseImg:function () {
   var that = this
   wx.chooseImage({
    count: 9,
    sourceType: ['album', 'camera'],
    sizeType: ['original', 'compressed'],
    success: function(res) {
      var filePaths = res.tempFilePaths;
      for(var index in filePaths){
        that.data.images.push(filePaths[index]);
      }
      //必须setData
       that.setData({
         images: that.data.images,
         contentType: 1
       })
    }
   }) 
  },

  chooseVideo:function(){
    var that = this;
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        var filePath = res.tempFilePath;
        that.data.videos.push(filePath);
        console.log("videos:",that.data.videos)
        that.setData({
          videos: that.data.videos,
          contentType: 2
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
          //console.log(res);
        },
        fail: function() {
          //console.log('fail')
        }
   })
 },

  cancelImage:function(e){
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
          if (that.data.images.length == 0){//图片都删完了，可以选择发照片或视频
            that.setData({
              contentType: 0
            })
          }
        }
      }
    })
  },

  cancelVideo:function(e){
    var that = this;
    var index = e.target.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定删除该视频？',
      success: function (res) {
        if (res.confirm) {
          var videos = that.data.videos;
          videos.splice(index, 1);
          that.setData({
            videos: videos
          })
          if (that.data.videos.length == 0) {//视频都删完了，可以选择发照片或视频
            that.setData({
              contentType: 0
            })
          }
        }
      }
    })
  },
 
  formSubmit: function (e) {
    var that = this
    that.setData({
      disabled:true
    })
    //console.log('form发生了submit事件，携带数据为：', e.detail.value.comment)
    var imagePaths = that.data.images;
    var videoPaths = that.data.videos;
    var filePaths = imagePaths.concat(videoPaths);
    var comment = e.detail.value.comment;
    var len = comment.replace(/(^\s*)|(\s*$)/g, "").length;
    if (filePaths.length < 1 && (len == 0)){
      wx.showToast({
        title: '请至少上传一张图片或一段视频或输入一段文字！',
      })
      that.setData({
        disabled: false
      })
      return;
    }

    wx.showLoading({
      title: '发布中..',
    })

    initQiniu(that.data.session);
    //构造一个参数对象
    var params = new Object();
    params.nickName = that.data.nickName;
    params.comment = e.detail.value.comment;
    params.files = [];

    var successTimes = 0;
    qiniuUploader.uploadMulti(filePaths, (res) => {
      params.files.push(res.key);
      successTimes ++;
      if (successTimes == filePaths.length) {
        //console.log("所有图片已经上传成功！")
        sendRequest(params,that);
      }
    }, (error) => {
      wx.showToast({
        title: '图片上传失败！'
      })
      //console.error('error: ' + JSON.stringify(error));
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
      files:params.files,
      contentType:that.data.contentType
    },
    header: {
      'SESSION': that.data.session,
      'content-type': 'application/json'
    },
    success: function (res) {
      // console.log("start clear storage");

      // wx.removeStorageSync("record");
      
      // wx.removeStorage({
      //   key: 'image',
      //   success: function(res) {
      //     console.log("清空image缓存")
      //   },
      // })

      // console.log("end clear storage");

      wx.hideLoading();
      //返回首页
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  })  
}