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
      //console.log("请求返回的session:" + res.data.session);
      //把session存到本地
      wx.setStorage({
        key: 'session',
        data: res.data.session,
      })
    },
    fail: function (res) {
      //console.log("请求session失败,res:" + res);
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
      // //console.log("res:",res.data);
      var myHeadImg = res.data.imageName;
      wx.getStorage({
        key: 'headImg',
        success: function(res) {
          var oldHeadImg = res.data;
          if(myHeadImg != oldHeadImg){//如果首图和缓存里的不一样，则更新首图，并更新缓存
            //console.log("首图有更新")
            that.setData({
              myHeadImg: myHeadImg//图片url
            })
            //异步缓存
            wx.setStorage({
              key: 'headImg',
              data: myHeadImg,
            })
          }else{
            //console.log("首图和缓存里的一样")
          }
        },
      })
      
    }
  }) 
}

module.exports = {
  saveSession: saveSession,
  getHeadImg: getHeadImg,
  formatTime: formatTime,
  json2Form: json2Form
}
