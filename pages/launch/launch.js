// launch.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birthday:'2017-6-1',
    days:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    })
  },

  onShow:function(){
    var that = this;
    //获取破壳天数
    var d = new Date();
    var today = d.getFullYear()+ "-" + (d.getMonth() + 1) + "-" + d.getDate();
    
    var num = dateDiff(that.data.birthday,today);
    console.log("num:" + num)
    that.setData({
      days: num
    })
    console.log("days:"+that.data.days)
  },

  watchPhoto: function(){
    var that = this;
    wx.switchTab({
      url: '/pages/index/index',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
function dateDiff(sDate1, sDate2) {    //sDate1和sDate2是2002-12-18格式  

  var aDate, oDate1, oDate2, iDays;
  aDate = sDate1.split("-");  
  oDate1 = new Date(aDate[0] + "/" + aDate[1] + "/" + aDate[2])    //2002-12-18格式 
  aDate = sDate2.split("-")
  oDate2 = new Date(aDate[0] + '/' + aDate[1] + '/' + aDate[2]) 
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数 
  
  return iDays;
}