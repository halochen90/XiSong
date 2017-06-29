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
    wx.showActionSheet({
      itemList: ['照片', '视频'],
      success: function (res) {
        var index = res.tapIndex;
        if(index == 0){
          that.chooseImg();
        }else{
          that.chooseVideo();
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
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
         images: that.data.images
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
          videos: that.data.videos
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
        }
      }
    })
  },
 
  formSubmit: function (e) {
    wx.showLoading({
      title: '发布中..',
    })
    var that = this
    that.setData({
      disabled:true
    })
    //console.log('form发生了submit事件，携带数据为：', e.detail.value.comment)
    var imagePaths = that.data.images;
    var videoPaths = that.data.videos;
    var filePaths = imagePaths.concat(videoPaths);
    console.log("filepaths:",filePaths)
    var comment = e.detail.value.comment;
    var len = comment.replace(/(^\s*)|(\s*$)/g, "").length;
    if (filePaths.length < 1 && (len == 0)){
      wx.showToast({
        title: '请至少上传一张图片或一段视频或输入一段文字！',
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
      images:params.images
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
   
    }
  })
  //发布成功隐藏加载图
  wx.hideLoading();
  //返回首页
  wx.switchTab({
    url: '/pages/index/index'
  })
}