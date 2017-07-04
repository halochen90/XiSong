// test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden:true
  },



  showVideo: function(e){
    console.log(e)
    var id = e.target.dataset.id;
    this.setData({
      hidden:false
    })
  }
})