//导入API对象
const API = require('../../utils/request')
// subExam/aq/aq.js
Page({

  /**
   * 页面的初始数据
   * select_options：用户选择的选项数据
   */
  data: {
    select_options:null,
    question_info:null,
    question_pageNo:0,
    exam_id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //赋值exam_id
    this.setData({
      exam_id: options.exam_id
    })
    //查询测试题目信息
    let data = {
      exam_id: this.data.exam_id
    }
    //获取题目列表
    API.questionList({exam_id: this.data.exam_id})
    .then(res=>{
      that.setData({
        question_info: res.data
      });
    }).catch(e=>{
      console.log("查询测试题目信息失败")
      wx.showToast({
        title: '网络出现了问题？',
        icon:"none"     
      })
    });
    //获取用户测试进度
    API.examProgress({exam_id: this.data.exam_id,user_id: getApp().globalData.userInfo.userId})
    .then(res=>{
      that.setData({
        question_pageNo: res.data.exam_pageNo
      });
    }).catch(e=>{
      console.log("查询测试进度接口失败")
      wx.showToast({
        title: '网络出现了问题？',
        icon:"none"     
      })
    });
  },
  /**
   * 单选框选中事件
   */
  radioSelect:function(e){
    this.setData({
      select_options: e.detail.value
    })
  },
  /**
   * 多选框选中事件
   */
  checkboxSelect:function(e){
    this.setData({
      select_options: e.detail.value
    })
  },
  /**
   * 下一题
   */
  toNext:function(e){
    if (this.data.select_options){
      if (e.currentTarget.dataset.qt === '单选题'){
        //单选题答题接口
        let that = this;
        API.danxueAnswer({
          userId: getApp().globalData.userInfo.userId,
          examId: this.data.exam_id,
          questionId: this.data.question_info[this.data.question_pageNo].questionId,
          optionId:this.data.select_options,
          pageNo: this.data.question_pageNo + 1
        }).then(res=>{
        }).catch(e=>{
          wx.showToast({
            title: '单选答题接口调用失败',
            icon: "none"
          })
        });
      } else if (e.currentTarget.dataset.qt === '多选题'){
          //多选题答题接口
        let that = this;
        API.duoxueAnswer({
          userId: getApp().globalData.userInfo.userId,
          examId: this.data.exam_id,
          questionId: this.data.question_info[this.data.question_pageNo].questionId,
          optionIds: this.data.select_options,
          pageNo: this.data.question_pageNo + 1
        }).then(res=>{
          
        }).catch(e=>{
          wx.showToast({
            title: '多选答题接口调用失败',
            icon: "none"
          })
        });
      }else{
        wx.showToast({
          title: "无法失败的题目类型",
          icon: "none"
        })
      }
    }else{
      wx.showToast({
        title: '请答题！！！',
        icon: "none"
      })
    }

    //当用户做到最后一题
    if (this.data.question_pageNo + 1 === this.data.question_info.length) {
      //跳转到结果页面
      wx.redirectTo({
        url: '/subExam/result/result?exam_id=' + this.data.exam_id
      })
    } else {
      //换题目，用户选择数据清空
      this.setData({
        question_pageNo: this.data.question_pageNo + 1,
        select_options: null
      })
    }
  }
})