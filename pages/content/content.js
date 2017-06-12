Page({
  didPressChooseImage: function () {
    var that = this;
    console.log(that)
    wx.previewImage({
      
      // current: "", // 当前显示图片的http链接
      urls: ["https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1255488850,1302294790&fm=26&gp=0.jpg", "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1255488850,1302294790&fm=26&gp=0.jpg"] // 需要预览的图片http链接列表
    })
  }
})