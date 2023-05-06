// pages/MV/MV.js
const app = getApp()
const ip = app.globalData.ip
Page({

    /**
     * 页面的初始数据
     */
    data: {
        MVUrl:'',//MV地址
        width:wx.getSystemInfoSync().screenWidth,
        height:wx.getSystemInfoSync().screenHeight,
        MVInfo:null, //当前MV详细信息
        simiMVInfo:null,//当前MV下的相似MV
        fixs:false,
        MVName:''
    },

    onPageScroll(e) {
        console.log(e.scrollTop)
        if (e.scrollTop > this.data.width) {
            this.setData({
                fixs: true,
                MVName:this.data.MVInfo.artistName
            })
        } else if (e.scrollTop < this.data.width) {
            this.setData({
                fixs: false,
                MVName:''
            })
        }
    },

    //点击更多视频
    switchMV(e){
        this.loadMV(e.currentTarget.dataset.mvid)
        this.loadMVInfo(e.currentTarget.dataset.mvid)
        this.loadSimiMVInfo(e.currentTarget.dataset.mvid)
    },

    //加载相似mv
    loadSimiMVInfo(id){
        wx.request({
            url: 'http://'+ip+':3000/simi/mv?mvid='+id,
            dataType:'json',
            success:(res)=>{
                console.log(res)
                this.setData({
                    simiMVInfo:res.data.mvs
                })
            }
          })
    },

    //加载mv详情
    loadMVInfo(id){
      wx.request({
        url: 'http://'+ip+':3000/mv/detail?mvid='+id,
        dataType:'json',
        success:(res)=>{
            //console.log(res)
            this.setData({
                MVInfo:res.data.data
            })
        }
      })  
    },

    //加载mv地址
    loadMV(id){
        wx.request({
          url: 'http://'+ip+':3000/mv/url?id='+id,
          dataType:'json',
          success:(res)=>{
              //console.log(res)
              this.setData({
                  MVUrl:res.data.data.url
              })
          }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadMV(options.MVId)
        this.loadMVInfo(options.MVId)
        this.loadSimiMVInfo(options.MVId)
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