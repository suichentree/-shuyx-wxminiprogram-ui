var util = require('../../utils/util.js');
//加载js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    versionNumber: getApp().globalData.version,
    starCount: 11,
    forksCount: 22,
    visitTotal: 33,
    user_id:0,
    user_info:null
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onshow")
    // 设置用户信息
    this.setData({
      user_id: getApp().globalData.userInfo.userId,
      user_info:getApp().globalData.userInfo
    });
  },
  //用户登录
  wxLogin:function(){
    console.log("个人信息页,初始化用户信息!!!")
    
    let that = this;
    //当从全局变量中读取不到userInfo数据,即页面显示未登录状态时。
    wx.getUserInfo({
      success: function (get_res) {
        console.log("wx_getUserinfo", get_res)
        getApp().globalData.userInfo = get_res.userInfo;
        wx.login({
          success: function (login_res) {
            console.log("获取用户登录凭证code成功");
            //调用后台初始化用户接口，将用户信息存入数据库中
            wx.request({
              url: getApp().globalData.current_server + "/shu/user/initUserInfo",
              method: "POST",
              header: {
                'content-type': 'application/x-www-form-urlencoded',
              },
              data: {
                code: login_res.code,
                head: getApp().globalData.userInfo.avatarUrl,
                name: getApp().globalData.userInfo.nickName,
                gender: getApp().globalData.userInfo.gender
              },
              success: function (res) {
                console.log("初始化用户信息接口调用成功,userId =" + res.data.userId);
                getApp().globalData.userInfo.userId = res.data.userId;
                getApp().globalData.openId = res.data.openId;
                getApp().globalData.unionId = res.data.unionId;
                //刷新页面
                that.onShow();
              }, fail: function (res) {
                console.log("初始化用户信息接口调用失败");
              }
            });
          }
        })
      }
    });
  },
  toUserInfo:function(){
    wx.navigateTo({
      url: '/subMe/userinfo/userinfo',
    })
  },
  toMsg:function(){
    wx.navigateTo({
      url: '/subMe/msg/msg',
    })
  },
  nofinish: function () {
    wx.showToast({
      title: '尚未完成，敬请期待！',
      icon: "none"
    })
  },showQrcode:function(){
    wx.previewImage({
      urls: ['/static/wx_qrcode.jpg'],
      current: '/static/wx_qrcode.jpg' // 当前显示的图片链接      
    })
  },
  toExam:function(){
    wx.navigateTo({
      url: '/subExam/aq/aq'
    })
  },
  toHistory:function(){
    wx.navigateTo({
      url: '/subExam/history/history'
    })
  },
  //小程序的版本更新订阅消息申请
  updateSubscription: function () {
    let that = this;
    wx.requestSubscribeMessage({
      tmplIds: ['Z76fZ-_gUEIrwtckSET4_5jGi-88nxY3j1wwgGw6j9U'],
      success: function (res) {
        console.log("小程序的版本更新订阅消息---成功");
        console.log(res);
        //发送订阅消息
        that.sendUpdateSubscriptionMessage();
      
      }, fail: function (res) {
        console.log("小程序的版本更新订阅消息---失败");
        console.log(res);
      }, complete(){
        console.log("小程序的版本更新订阅消息---后续");
      }
    })
  },
  //若同意向用户发送版本更新订阅消息
  sendUpdateSubscriptionMessage:function(){
    //获取当前时间
    let time = util.formatTime(new Date());
    
    let that = this;
    let ACCESS_TOKEN = null;
    //1.获取接口调用凭证access_token
    wx.request({
      url: getApp().globalData.current_server + "/shu/common/getAccessToken",
      method: "GET",
      success: function (res) {
        console.log("获取接口调用凭证access_token---success");
        ACCESS_TOKEN = res.data.access_token;
      }, fail: function () {
        console.log("获取接口调用凭证access_token---fail");
      },complete(){
          //2.发送消息
          if (ACCESS_TOKEN != null) {
            wx.request({
              url: "https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=" + ACCESS_TOKEN,
              method: "POST",
              data: {
                touser: getApp().globalData.openId,
                template_id: "Z76fZ-_gUEIrwtckSET4_5jGi-88nxY3j1wwgGw6j9U",
                page: "index",
                miniprogram_state: "formal",
                data: {
                  "character_string1": {
                    "value": getApp().globalData.version
                  }, 
                  "time2": {
                    "value": time
                  },
                  "thing3": {
                    "value": "修复已知问题,版本升级！"
                  }
                }
              },
              success: function (res) {
                if(res.data.errcode === 0){
                  console.log("服务端发送版本更新订阅消息成功")
                }else{
                  console.log("服务端发送版本更新订阅消息失败")
                }
              }, fail: function () {
                console.log("服务端发送版本更新订阅消息失败")
              }
            })
          } else {
            console.log("获取接口调用凭证access_token失败，无法发送版本更新订阅消息")
          }
      }
    })
  }
})