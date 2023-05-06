// pages/playList/playList.js
import ActionSheet, { ActionSheetTheme } from 'tdesign-miniprogram/action-sheet/index';
const app = getApp() //引入app
const innerAudioContext = app.globalData.innerAudioContext //引入全局变量
const ip = app.globalData.ip
Page({

    /**
     * 页面的初始数据
     */
    data: {
        width: wx.getSystemInfoSync().screenWidth,
        height: wx.getSystemInfoSync().screenHeight,
        type: null, //判断页面类型
        ip: ip, //ip地址
        limit: 15,
        offset: 0,
        totalPage: 0,
        WechatOrCloudMuisc: wx.getStorageSync('WechatOrCloudMuisc'),
        songInfo: null,
        playListInfo: null,
        count:null,
        showDeletePlayList:false
    },


    handleAction() {
        ActionSheet.show({
          theme: ActionSheetTheme.List,
          selector: '#t-action-sheet',
          context: this,
          align: 'left',
          description: '操作',
          items: [
            {
              label: '删除',
              icon: 'delete',
            }
          ],
        });
      },
      handleSelected(e) {
        //console.log(e.detail);
        if(e.detail.selected.label=='删除'){
            this.setData({
                showDeletePlayList:true
            })
            console.log('11')
        }
      },

      closeDialog(e){
        this.setData({
            showDeletePlayList:false
        })
        console.log(e)
      },

      deletePlayList(){
          let data = {
              id:this.data.playListInfo.id,
              openid:this.data.playListInfo.openid
          }
          wx.request({
            url: 'http://'+ip+':8080/UserPlayList/deletePlayList',
            method:'POST',
            data:data,
            dataType:'json',
            success:(res)=>{
                console.log(res)
               if(res.data.code == 200){
                wx.navigateBack({
                    delta:1
                })
               } 
            }
          })
          console.log('删除')
      },

    //加载该歌单下一共有多少首歌曲
    loadCount(id){

        let data = {
            playListId: id,
            openid: wx.getStorageSync('openid')
        }

        wx.request({
          url: 'http://'+ip+':8080/UserPlayListInfo/findUserPlayListInfoCount',
          method:'POST',
          data:data,
          dataType:'json',
          success:(res)=>{
              console.log(res)
              this.setData({
                  count:res.data.data
              })
          }
        })
    },

    loadWechatUserPlayListInfo(id) {
        wx.request({
            url: 'http://' + ip + ':8080/UserPlayList/findUserPlayListById/' + id,
            dataType: 'json',
            success: (res) => {
                this.setData({
                    playListInfo: res.data.data
                })
            }
        })
    },

    loadSongToWechat(songIds) {
        wx.request({
            url: 'http://' + ip + ':3000/song/detail?ids=' + songIds,
            dataType: "json",
            success: (res) => {
                this.setData({
                    songInfo: res.data.songs
                })
            }
        })
    },

    loadPlayListSongIds(id) {
        let data = {
            playListId: id,
            openid: wx.getStorageSync('openid')
        }
        wx.request({
            url: 'http://' + ip + ':8080/UserPlayListInfo/findUserPlayListInfo',
            method: 'POST',
            data: data,
            dataType: 'json',
            success: (res) => {
                this.loadSongToWechat(res.data.data)
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (wx.getStorageSync('WechatOrCloudMuisc') == 'Wechat') {
            wx.setNavigationBarTitle({
                title: options.name,
            })
            this.loadWechatUserPlayListInfo(options.id)
            this.loadPlayListSongIds(options.id)
            this.loadCount(options.id)
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