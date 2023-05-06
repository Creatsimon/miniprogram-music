// pages/newUser/newUser.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp()
const ip = app.globalData.ip
import Message from 'tdesign-miniprogram/message/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: defaultAvatarUrl,
        theme: wx.getSystemInfoSync().theme,
        nickname:""
    },

    inputNickName(e){
        this.setData({
            nickname:e.detail.value
        })
    },

    showSuccessMessage() {
        Message.success({
          context: this,
          offset: [20, 32],
          duration: 3000,
          content: '账号添加成功',
        });
    },

    //添加新用户
    addUser(){
        //let avatarAddress = 'D:\img'+wx.getStorageSync('openid')+'.jpg'
        let formData = { 
            openid: wx.getStorageSync('openid'),
            nickname: this.data.nickname,
          };
        wx.uploadFile({
          url: 'http://'+ip+':8080/userinfo/addUser',
          filePath: this.data.avatarUrl,
          name: 'avatar',
          formData:formData,
          header: {
            "Content-Type": "multipart/form-data"
          },
          success:(res)=>{
              console.log(res)
              if(res.data == '200'){
                  wx.setStorageSync('isLogin', true)
                  this.showSuccessMessage()
                  setTimeout(()=>{
                    wx.navigateBack({
                        delta: 1
                    })
                  },3000)
                  
              }else{

              }
          }
        })
    },

    onChooseAvatar(e) {
        console.log(e)
        const { avatarUrl } = e.detail 
        this.setData({
          avatarUrl,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.onThemeChange((result) => {
            this.setData({
              theme: result.theme
            })
          })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})