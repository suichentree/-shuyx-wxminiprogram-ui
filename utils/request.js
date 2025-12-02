//API_BASE_URL 首域名
const API_BASE_URL = "http://localhost:38016";
// const API_BASE_URL = "https://www.suichen.xyz:9090";

//内容配置1,用于表单传参
const contentType1 = "application/x-www-form-urlencoded";
//内容配置2,用于json传参，
const contentType2 = "application/json"; 

//创建header请求头对象
function createHeader(contentType){
  let h={};
  if(getApp().globalData.token != null){
    h['token'] = getApp().globalData.token;
  }
  h['Content-Type'] =contentType;
  return h;
}

//封装request方法
const request = (url, method, data,contentType) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: API_BASE_URL + url,
      method: method,
      data: data,
      header: createHeader(contentType),
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete() {
        // 加载完成
      }
    })
  })
}

module.exports = {
  //微信登录
  wxRegister: data => request('/api/applet/user/wxLogin', 'POST', data, contentType1),
  //测试列表
  getExamList: data => request('/api/applet/exam/getExamList', 'POST', data, contentType1),
  //问题列表
  questionList: data => request('/api/applet/exam/questionList', 'POST', data, contentType1),
  //获取用户测试进度
  examProgress: data => request('/api/applet/exam/examProgress', 'POST', data, contentType1),
  //单选答题
  danxueAnswer: data => request('/api/applet/exam/danxue_Answer', 'POST', data, contentType1),
  //多选答题
  duoxueAnswer: data => request('/api/applet/exam/duoxue_Answer', 'POST', data, contentType1),
  //计算测试结果
  result: data => request('/api/applet/exam/result', 'POST', data, contentType1),
  //问题分析
  questionAnalyse: data => request('/api/applet/exam/questionAnalyse', 'POST', data, contentType1),
  //选项分析
  optionAnalyse: data => request('/api/applet/exam/optionAnalyse', 'POST', data, contentType1),
  //历史记录
  getHistoryList: data => request('/api/applet/exam/history', 'POST', data, contentType1),
  //获取用户个人信息
  getUserINFO: data => request('/api/applet/user/getUserInfo', 'POST', data, contentType1),
  //保存用户个人信息
  saveUserINFO: data => request('/api/applet/user/saveUserInfo', 'POST', data, contentType1),
}