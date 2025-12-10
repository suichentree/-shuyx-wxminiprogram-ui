const app = getApp()
var log = require('../../utils/log.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //article将用来存储towxml数据
    article: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //显示加载模态框
    this.setData({
      loadModal: true
    })

    //加载md文件数据
    //获取上一个页面传递过来的参数
    console.log(options.file_src)
    const that = this;
    //请求markdown文件或html，并转换为内容
    wx.request({
      url: options.file_src,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        console.log("加载md数据成功");
        //将markdown或html内容转换为towxml数据
        let data = app.towxml.toJson(
          res.data,               // `markdown`或`html`文本内容
          'markdown'              // `markdown`或`html`
        );
        //前台初始化小程序数据（2.1.2新增，如果小程序中无相对资源需要添加`base`根地址，也无`audio`内容可无需初始化）
        data = app.towxml.initData(data, {
          base: 'https://www.suichen.xyz/static/blogFile/',    // 需要解析的内容中相对路径的资源`base`地址
          app: that                     // 传入小程序页面的`this`对象，以用于音频播放器初始化
        });
        //设置文档显示主题，默认'light'
        data.theme = 'light';
        //设置数据
        that.setData({
          article: data
        });
      }, fail() {
        console.log("加载md数据失败");
      }, complete() {
        console.log("加载md数据完成");
        //关闭加载模态框
        that.setData({
          loadModal: false
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    log.info('this is show.js onShow ff')
  }
})