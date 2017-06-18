// apply.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    applyRecords:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    getApplyRecords(that);
  },

  dealApply:function(e){
    console.log(e)
    var that = this;
    var isAuth = e.detail.value.param;
    var record = e.detail.value.record;
    var index = e.detail.value.index;
    var formId = e.detail.formId;
    console.log("isAuth:" + isAuth+",record:"+record+",index:"+index);
    dealApplyAuth(isAuth, record, index,formId,that);
  }
})

function getApplyRecords(that){
  wx.request({
    url: app.REQUEST_URL + '/api/information/apply',
    method: 'GET',
    data:{},
    header:{
      'content-type':'application/json'
    },
    success:function(res){
      that.setData({
        applyRecords: res.data
      })
    }
  })
}

function dealApplyAuth(isAuth, record, index,formId,that){
  wx.request({
    url: app.REQUEST_URL + '/api/information/dealAuthApply',
    method: 'PUT',
    data: {isAuth:isAuth,id:record.id,formId:formId},
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log("apply auth:"+res.data)
      if(res.data.result == "success"){//返回success
        var records = that.data.applyRecords;
        records.splice(index,1);
        that.setData({
          applyRecords: records
        })
      } 
    }
  })
}