function alertAuthTip(currentPage){
  wx.showModal({
    title: '授权提示！',
    content: '需要您授权才能进行进入其他页面,建议打开授权）',
    success: function (res) {
      if (res.confirm) {
        //console.log('用户点击确定授权')
        wx.openSetting({
          success: (res) => {
            //console.log("小程序设置页面打开成功");
              //console.log("page:"+currentPage)
              wx.reLaunch({//关闭所有页面，重新打开某个页面
                url: currentPage,
              })
          }
        })
      } else if (res.cancel) {
        //console.log('用户点击取消授权');
      }
    }
  })
}

module.exports = {
  alertAuthTip: alertAuthTip,
}