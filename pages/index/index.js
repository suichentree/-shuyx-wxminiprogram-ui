//导入API对象
const API = require('../../utils/request')
//获取应用实例
const app = getApp()

Page({
  //用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: 'Shuyx Lab 工坊 欢迎您的参观！',
      imageUrl: '/static/wx_qrcode.jpg',
      path: '/pages/index/index'
    }
  },
  data: {
    msgList: [
      {title: "公告：领红包了！！！" },
      {title: "公告：过年了！！！" },
      {title: "公告：寒假到了！！！" }
    ],
    userInfo: {},
    cardCur: 0,
    swiperList: [
      {
        id: 0,
        type: 'image',
        url: '/static/111.png'
      }, {
        id: 1,
        type: 'image',
        url: '/static/222.png',
      }, {
        id: 2,
        type: 'image',
        url: '/static/333.png'
      }, {
        id: 3,
        type: 'image',
        url: '/static/444.png'
      }, {
        id: 4,
        type: 'image',
        url: '/static/555.png'
      }, {
        id: 5,
        type: 'image',
        url: '/static/666.png'
      }, {
        id: 6,
        type: 'image',
        url: '/static/777.png'
      }, {
        id: 7,
        type: 'image',
        url: '/static/888.png'
      }
    ],
    cuIconList: [
      {
        cuIcon: 'edit',
        color: 'red',
        file_src: 'https://www.suichen.xyz/static/blogFile/blogArticle/C.md',
        name: 'C'
      },
      {
        cuIcon: 'edit',
        color: 'orange',
        file_src: 'https://www.suichen.xyz/static/blogFile/blogArticle/C++.md',
        name: 'C++'
      },
      {
        cuIcon: 'edit',
        color: 'black',
        file_src: 'https://www.suichen.xyz/static/blogFile/blogArticle/java.md',
        name: 'JAVA'
      }
    ],
    cardlist: [
      {
        title: '我的博客',
        img: '/static/111.png',
        url: '../plugin/indexes'
      },
      {
        title: '我的网站',
        img: '/static/222.png',
        url: '../plugin/animation'
      },
      {
        title: '我的收藏',
        img: '/static/333.png',
        url: '../plugin/drawer'
      }
    ]
  },
  onShow: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success(user_res) {
              getApp().globalData.userInfo = user_res.userInfo
              //调用后台接口,将用户信息存储在数据库中
              wx.login({
                success(login_res) {
                  if (login_res.code) {
                    //用code换取用户openid,unionid
                    let data = {
                      code:login_res.code,
                      dto:{
                        head_url: getApp().globalData.userInfo.avatarUrl,
                        name: getApp().globalData.userInfo.nickName,
                        gender: getApp().globalData.userInfo.gender
                      }
                    }
                    API.wxLogin(data)
                    .then(function (res) {
                        console.log("res",res);
                        if(res.code === 200){
                          getApp().globalData.userInfo.userId = res.data.userId;
                          getApp().globalData.openId = res.data.openId;
                          getApp().globalData.token = res.data.token;
                        }else{
                          wx.showToast({
                            title: '微信登录失败',
                            icon: 'none'
                          });
                        }
                    }).catch(function (e) {
                      console.log("请求失败", e);
                    })
                  } else {
                    console.log('获取code失败！' + res.errMsg);
                  }
                }
              })
            }, fail() {
              console.log("获取用户信息失败");
            }
          })
        }else{
          console.log("用户尚未授权");
          //提示用户去授权
          wx.showToast({
            title: '尚未授权,请在我的页面进行授权',
            icon:'none'
          });
        }
      }
    })
  },
  nofinish:function(){
    wx.showToast({
      title: '尚未完成，敬请期待！',
      icon:"none"
    })
  }
})
