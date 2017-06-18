// auth.js
var Util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
  
  },

  submitForm: function(e){
    console.log("提交授权表单formId:",e.detail.formId);
    var formId = e.detail.formId;
    var name = e.detail.value.name;
    var comment = e.detail.value.comment;
    var nameLen = name.replace(/(^\s*)|(\s*$)/g, "").length;
    if (name.length > 4 || nameLen == 0){
      wx.showToast({
        title: '名字长度要求为1-4个字！'
      })
    return;
    }
    var commentLen = comment.replace(/(^\s*)|(\s*$)/g, "").length;
    if(comment.length > 50){
      wx.showToast({
        title: '备注长度不能超过50个字！'
      })
      return;
    }
    //发起授权申请
    sendAuthRequest(name,comment,formId);
  }
})

function sendAuthRequest(name, comment,formId){
  console.log("name:" + name + ",comment:" + comment +",formId:"+formId);
  wx.getStorage({
    key: 'session',
    success: function (res) {
      var session = res.data;
      wx.request({
        url: app.REQUEST_URL + '/api/information/applyAuth',
        method: 'POST',
        data: {name: name,comment:comment,formId:formId,session:session},
        header: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8" 
        },
        success: function (res) {
            console.log("已发送授权申请")
            wx.showModal({
              title: '提示',
              content: '授权申请发送成功，请耐心等待授权结果',
              showCancel:false,
              success:function(){
                wx.redirectTo({
                  url: '/pages/launch/launch',
                })
              }
            })
        }
      })
    },
    fail: function () {
      console.log("session is null");
      wx.showModal({
        title: '授权提示！',
        content: '需要您授权才能进行进入其他页面哦,建议打开授权）',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定授权')
            wx.openSetting({
              success: (res) => {
               console.log("小程序设置页面打开成功")
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消授权');
          }
        }
      })
    }
  })
 
}