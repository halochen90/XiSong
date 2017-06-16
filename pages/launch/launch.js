// launch.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    birthday:'2017-6-1',
    dayNum:0
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

    //获取破壳天数
    var dayNum = dateDiff(that.data.birthday,new Date().toDateString());
    that.setData({
      dayNum:dayNum
    })
  },
  watchPhoto: function(){
    var that = this;
    console.log(that.data.userInfo)
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
  var aDate, oDate1, oDate2, iDays
  aDate = sDate1.split("-")
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式  
  aDate = sDate2.split("-")
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数  
  return iDays
}