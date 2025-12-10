// subExam/history/history.js
const API = require("../../utils/api")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history_list: null
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //查询该用户做过的最近的测试历史记录
    let that = this;
    API.getHistoryList({
      userId : getApp().globalData.userInfo.userId
    }).then(res=>{
      that.setData({
        history_list:res.data
      })
    }).catch(e=>{
      wx.showToast({
        title: '服务器开了点小差，请稍后刷新页面！！！',
        icon: "none"
      })
    });
  },
  toResult:function(e){
    console.log("toResult方法，接收参数examid", e.currentTarget.dataset.src)
    //跳转到结果页面
    wx.navigateTo({
      url: '/subExam/result/result?exam_id=' + e.currentTarget.dataset.src
    })
  }
})