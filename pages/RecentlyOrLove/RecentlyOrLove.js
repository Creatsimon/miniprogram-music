// pages/RecentlyOrLove/RecentlyOrLove.js
const app = getApp() //引入app
const innerAudioContext = app.globalData.innerAudioContext //引入全局变量
const ip = app.globalData.ip
Page({

    /**
     * 页面的初始数据
     */
    data: {
        width:wx.getSystemInfoSync().screenWidth,
        height:wx.getSystemInfoSync().screenHeight,
        type:null, //判断页面类型
        ip:ip ,//ip地址
        limit: 15,
        offset:0,
        totalPage:0,
        songInfo:null,
        wechatuserRecentlyList:null,
        WechatOrCloudMuisc:wx.getStorageSync('WechatOrCloudMuisc'),
        singerInfos:[]
    },

    //加载歌手信息
    loadLoveSingerInfo(data){

        var singerInfo = []
        for(let i = 0 ; i < data.length ; i++){
            wx.request({
              url: 'http://'+ip+':3000/artist/detail?id='+data[i].singerId,
              dataType:'json',
              success:(res)=>{
                  this.data.singerInfos.push(res.data.data.artist)
              }
            })
        }
        // console.log(singerInfo)
        // this.setData({
        //     singerInfos:singerInfo
        // })

    },

    //取消关注歌手
    cancelLoveSinger(e) {
        let data = {
            singerId: e.currentTarget.dataset.singerid,
            openid: wx.getStorageSync('openid')
        }
        console.log(e.currentTarget.dataset.singerid)
        console.log(e.currentTarget.singerid)
        wx.request({
            url: 'http://' + ip + ':8080/userLoveSinger/delUserLoveSinger',
            method: 'POST',
            data: data,
            dataType: 'json',
            success: (res) => {
                if (res.data.code == 200) {
                    this.loadLoveSingerIds()
                }
            }
        })

        
    },

    //加载歌手
    loadLoveSingerIds(){
        wx.request({
          url: 'http://'+ip+':8080/userLoveSinger/findByOpenid/'+wx.getStorageSync('openid'),
          dataType:'json',
          success:(res)=>{
              //this.loadLoveSingerInfo(res.data.data)
              this.setData({
                  singerInfos:res.data.data
              })
          }
        })
    },

    //分页加载
    loadSong(songIds, onReachBottom) {
        wx.request({
            url: 'http://' + ip + ':3000/song/detail?ids=' + songIds + '&limit=' + this.data.limit + "&offset=" + this.data.offset * this.data.limit,
            dataType: "json",
            success: (res) => {
                var song = []
                for (let i = 0; i < res.data.songs.length; i++) {
                        song.push(res.data.songs[i])
                }
                if (onReachBottom == true) {
                    song = [...this.data.songInfo, ...song]
                }
                this.data.offset++
                this.setData({
                    songInfo: song
                })
            }
        })
    },



    //加载多首歌曲
    loadSongToWechat(songIds) {
        wx.request({
            url: 'http://' + ip + ':3000/song/detail?ids=' + songIds ,
            dataType: "json",
            success: (res) => {
                this.setData({
                    wechatuserRecentlyList: res.data.songs
                })
            }
        })
    },

    //加载最近听的50首歌曲id字符连串
    loadSongIdsToRecently(){
        wx.request({
          url: 'http://'+ip+':8080/UserRecentlyListen/findUserRecentlyListen/'+wx.getStorageSync('openid'),
          dataType:'json',
          success:(res)=>{
              this.loadSongToWechat(res.data.data)
          }
        })
    },

    //加载歌曲id字符连串
    loadSongIdsToLove(){
        wx.request({
            url: 'http://'+ip+':8080/userLoveSong/findUserLoveSong/'+wx.getStorageSync('openid'),
            dataType:'json',
            success:(res)=>{
                this.loadSongToWechat(res.data.data)
            }
          })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options.type)
        if(options.type == 1){
            wx.setNavigationBarTitle({
              title: '最近播放',
            })
            if(wx.getStorageSync('WechatOrCloudMuisc')=='Wechat'){
                console.log("测试")
                this.loadSongIdsToRecently()
            }
        }else if(options.type == 2){
            wx.setNavigationBarTitle({
                title: '我的喜欢',
              })
              if(wx.getStorageSync('WechatOrCloudMuisc')=='Wechat'){
                console.log("测试")
                this.loadSongIdsToLove()
            }
        }else if(options.type == 3){
            wx.setNavigationBarTitle({
                title: '关注艺人',
              })
              if(wx.getStorageSync('WechatOrCloudMuisc')=='Wechat'){
                console.log("测试")
                this.loadLoveSingerIds()
            }
        }
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