// pages/doctor/doctor.js
const urlApi = require('../../utils/server.api.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appId: "",
    nonceStr: "",
    package: "",
    paySign: "",
    signType: "",
    timeStamp: "",
    doctor: "",
    doctorId: "",
    date: "",
    price: "",
    departments: "",
    sickName:"",
    sickCard:"",
    ddh:""
  },

  payInfo: function(data) {
    var that = this;
    wx.request({
      url: urlApi.getMZPayInfo(),//getPayInfo(), //getInHopltalPay(),//
      method: "POST",
      data:{
        WID :app.globalData.openid,
        HISID: app.globalData.BRID,
        MONEY:data.money,
        BRID:app.globalData.BRID
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log("获取支付信息",res.data);
        var data = res.data;
        console.log()
        that.setData({
          appId: data.appId,
          nonceStr: data.nonceStr,
          package: data.package,
          paySign: data.paySign,
          signType: data.signType,
          timeStamp: data.timeStamp,
          ddh:data.ddh
        })
      }
    })
  },
 
  WXPay: function() {
    var that = this;
    wx.requestPayment({
      "appId": this.data.appId,
      "timeStamp": this.data.timeStamp,
      "nonceStr": this.data.nonceStr,
      "package": this.data.package,
      "signType": this.data.signType,
      "paySign": this.data.paySign,
      "complete": function(res) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          complete: function() {
            that.payMZSuccess();
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/home/home',
              })
            }, 2000)
          }
        })
      },
      'fail': function(res) {
        console.log("小程序支付失败：",res);
        wx.showModal({
          title: '支付失败',
          content: res.errMsg,
          complete: function() {
            setTimeout(function () {
              wx.switchTab({
                url: '/pages/home/home',
              })
            }, 2000)
          }
        });
      }
    })
  },

  payMZSuccess: function () {
    console.log("门诊门诊支付成功后调用了这个接口")
    var that = this;
    wx.request({
      url: urlApi.getMZPaySuccess(),
      method: "POST",
      data: {
        DJH: app.globalData.DJH,
        JE: app.globalData.JE,
        SFGH: 0,
        BRID: app.globalData.BRID,
        JSKLB: "巨浪微信",
        JSJE: app.globalData.JE,
        JYLSH: that.data.ddh
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("成功以后掉用的接口返回的参数", res);

      }
    })
  },

  payDom: function (options){
    this.setData({
      price: options.money,
      sickName: app.globalData.sickName,
      sickCard: app.globalData.sickCard,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.payDom(JSON.parse(options.info));
    this.payInfo(JSON.parse(options.info));
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})