//格式化时间
var app = getApp();

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}


//获取并保存session
function saveSession(code) {
  wx.request({
    url: app.REQUEST_URL + '/api/information/session',
    method: 'GET',
    data: { "code": code },
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log("请求返回的session:" + res.data.session);
      //把session存到本地
      wx.setStorage({
        key: 'session',
        data: res.data.session,
      })
    },
    fail: function (res) {
      console.log("请求session失败,res:" + res);
    }
  })
}


//获取首图
function getHeadImg(that){
  wx.request({
    url: app.REQUEST_URL + '/api/images/headImg',
    method: 'GET',
    data: {},
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log("res:",res.data);
      var myHeadImg = app.IMAGE_DOMAIN + res.data.image.name;
      that.setData({
        headImg:res.data.image,
        myHeadImg: myHeadImg
      })
      wx.setStorageSync("headImg", myHeadImg);
    }
  }) 
}

module.exports = {
  saveSession: saveSession,
  getHeadImg: getHeadImg,
  formatTime: formatTime,
  json2Form: json2Form
}
