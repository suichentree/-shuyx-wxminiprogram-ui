import * as echarts from '../../ec-canvas/echarts.js';
const API = require('../../utils/api')

//饼图的数据
var option_pie = {
  backgroundColor: 'white',
  tooltip: {
    trigger: 'item',
    formatter: '{b}：{c} ({d}%)'
  },
  legend: {
    left: 'center',
    top: 'bottom',
    data: ['正确率', '错误率']
  },
  series: [
    {
      name: '访问来源',
      type: 'pie',
      radius: [50, 80],
      center: ['50%', '50%'],
      roseType: 'radius', //是否展示为玫瑰图,
      label: {
        formatter: '{b}: {d}%',
        fontSize: 13
      },
      data: [
        { value: 10, name: '正确率' },
        { value: 5, name: '错误率' }
      ]
    }
  ]
};
//折线图的数据
var option_line = {
  backgroundColor: 'white',
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 50
    },
    {
      start: 0,
      end: 50
    }
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    textStyle: {
      fontSize: 13
    },
    left: 'center',
    top: 'top',
    data: ['总数', '正确', '错误']
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320, 111, 122, 333, 444, 564, 523, 663],
      type: 'line',
      smooth: true,
      name: "总数"
    },
    {
      data: [320, 952, 561, 994, 1221, 1120, 1020, 111, 112, 333, 424, 534, 529, 653],
      type: 'line',
      smooth: true,
      name: "正确"
    }
    ,
    {
      data: [620, 352, 501, 1094, 1111, 1720, 1520, 101, 152, 313, 414, 514, 523, 643],
      type: 'line',
      smooth: true,
      name: "错误"
    }
  ]
};

//初始化饼图
function initPieChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option_pie);
  return chart;
}

//初始化折线图
function initLineChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  chart.setOption(option_line);
  return chart;
}

Page({
  data: {
    question_option:null,
    isShow:false,
    optionList:null,
    exam_id:null,
    user_exam_id:null,
    ec: {
      onInit: initPieChart
    },
    ac: {
      onInit: initLineChart
    }
  },onLoad:function(options){
    console.log("获取上一个页面传来的exam_id值",options.exam_id);
    this.setData({
      exam_id: options.exam_id
    })
  },onShow: function () {
    let that=this;
    //获取测试结果数据渲染图表
    API.result({
      userId: getApp().globalData.userInfo.userId,
      examId: this.data.exam_id
    }).then(res=>{
      //赋值user_exam_id
      that.setData({
        user_exam_id: res.data[0].user_exam_id
      })

      //渲染饼图
      option_pie.series[0].data[0].value=res.data[0].right_num;
      option_pie.series[0].data[1].value=res.data[0].error_num;
      
      //渲染折线图
      var lineData=res.data[1];
      var x_data=[];
      var sum_data = [];
      var right_data = [];
      var error_data = [];
      for (let i = 0; i < lineData.length;i++){
        x_data.push(lineData[i].time_num);
        sum_data.push(lineData[i].sum_num);
        right_data.push(lineData[i].right_num);
        error_data.push(lineData[i].error_num);
      }
      //赋值x轴数据
      option_line.xAxis.data=x_data;
      //赋值折线点数据
      option_line.series[0].data = sum_data;
      option_line.series[1].data = right_data;
      option_line.series[2].data = error_data;
    }).catch(e=>{
      wx.showToast({
        title: '服务器开了点小差，请稍后刷新页面！！！',
        icon:"none"
      })
    });

    //获取用户问题数据，进行问题分析
    API.questionAnalyse({
        userId: getApp().globalData.userInfo.userId,
        examId: this.data.exam_id
    }).then(res=>{
      that.setData({
        optionList:res.data
      })
    }).catch(e=>{
      wx.showToast({
        title: '请求用户选项数据失败，请稍后刷新页面！！！',
        icon: "none"
      })
    });
  },
  goIndex:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  showOption:function(e){
    let that=this;
    console.log("showOption方法接受参数,questionid", e.currentTarget.dataset.questionid)

    API.optionAnalyse({
        questionId: e.currentTarget.dataset.questionid,
        userExamId: that.data.user_exam_id
    }).then(res=>{
        that.setData({
          isShow:true,
          question_option:res.data
        })
    }).catch(e=>{
        wx.showToast({
          title: '服务器开了点小差，请稍后刷新页面！！！',
          icon: "none"
        })
    });
  }
});