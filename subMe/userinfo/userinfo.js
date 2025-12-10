const API = require("../../utils/api")
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ages: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35'],
    ages_index: 0,
    region: ['北京市', '北京市', '东城区'],
    modalName: null,
    u_email: "",
    u_phone: "",
    u_headimg: "",
    u_nickname: "",
    u_gender: ""
  },
  // 页面加载事件
  onShow: function () {
    let that = this;
    this.setData({
      u_headimg: getApp().globalData.userInfo.avatarUrl,
      u_gender: getApp().globalData.userInfo.gender,
      u_nickname: getApp().globalData.userInfo.nickName
    })
    //获取用户个人信息
    API.getUserINFO({
      userId: getApp().globalData.userInfo.userId
    }).then(res=>{
        console.log("获取用户个人信息", res);
        //将个人信息赋值给页面
        //赋值年龄
        let s = res.data.user_info.age - 15;
        console.log(s)
        if (s >= 0) {
          that.setData({
            ages_index: s
          })
        } else {
          that.setData({
            ages_index: 0
          })
        }
        //赋值地址
        var strs = new Array(); //定义一数组
        strs = res.data.user_info.address.split(","); //字符分割 
        that.data.region[0] = strs[0];
        that.data.region[1] = strs[1];
        that.data.region[2] = strs[2];
        that.setData({
          region: that.data.region
        })
        //赋值电话,邮箱
        that.setData({
          u_phone: res.data.user_info.phone,
          u_email: res.data.user_info.email
        })
    }).catch(e=>{

    });
  },
  AgeChange: function (e) {
    this.setData({
      ages_index: e.detail.value
    })
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  updatePhone: function (e) {
    this.setData({
      u_phone: e.detail.value
    })
  },
  updateEmail: function (e) {
    this.setData({
      u_email: e.detail.value
    })
  },
  showModal: function (e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal: function (e) {
    //关闭模态框
    this.setData({
      modalName: null,
    })
  },
  saveUserInfo: function () {
    let isSave = true;
    //将参数包装成对象
    let obj = {
      f_head: this.data.u_headimg,
      f_name: this.data.u_nickname,
      f_gender: this.data.u_gender,
      f_email: this.data.u_email,
      f_phone: this.data.u_phone,
      f_regin: this.data.region,
      f_age: this.data.ages[this.data.ages_index]
    }
    //遍历该对象
    for (let key in obj) {
      if (obj[key] === "" || obj[key] === "undefined" || obj[key] === " " || obj[key] === undefined || obj[key] === null) {
        wx.showToast({
          title: "信息未填写完整,(╯°口°)╯︵ ┻━┻ ",
          icon: "none"
        })
        isSave = false;
        break;
      }
    }
    //校验电话
    if (!(/^1[3456789]\d{9}$/.test(obj['f_phone']))) {
      console.log("手机号码有误，请重填");
      wx.showToast({
        title: "手机号码有误，请重填",
        icon: "none"
      })
    } else {
      console.log("手机号码正确");
    }
    //校验邮箱
    if (!(/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(obj['f_email']))) {
      console.log("邮箱有误，请重填");
      wx.showToast({
        title: "邮箱有误，请重填",
        icon: "none"
      })
    } else {
      console.log("邮箱正确");
    }
    //保存用户个人信息接口
    if (isSave) {
      console.log("是否保存个人信息", isSave);
      API.saveUserINFO({
          userId: getApp().globalData.userInfo.userId,
          head: obj['f_head'],
          name: obj['f_name'],
          gender: obj['f_gender'],
          age: obj['f_age'],
          address: obj['f_regin'],
          email: obj['f_email'],
          phone: obj['f_phone'],
      }).then(res=>{
          if (res.code == 200) {
            console.log("保存个人信息成功")
            wx.showToast({
              title: "保存成功",
              icon: "none"
            })
          } else {
            wx.showToast({
              title: "保存失败",
              icon: "none"
            })
          }
      }).catch(e=>{
        console.log("保存个人信息失败",e)
      });
    } else {
      console.log("是否保存个人信息", isSave)
    }

  }
})