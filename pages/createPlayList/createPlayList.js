// pages/createPlayList/createPlayList.js
const app = getApp()
const ip = app.globalData.ip
import Message from 'tdesign-miniprogram/message/index';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        playListPic: null,
        playListName: null,
        playListDesc: null,
        theme: wx.getSystemInfoSync().theme,
    },

    showSuccessMessage(content) {
        Message.success({
            context: this,
            offset: [20, 32],
            duration: 3000,
            content: content,
        });
    },

    showErrorMessage(content) {
        Message.error({
          context: this,
          offset: [20, 32],
          duration: 5000,
          content: content,
        });
      },

    onChooseAvatar(e) {

        this.setData({
            playListPic: e.detail,
        })
    },


    onUpload() {
        
        if(this.data.playListPic != null && this.data.playListName != null&&this.data.playListName!==''){
            let userPlayList = {
                openid: wx.getStorageSync('openid'),
                playListName: this.data.playListName,
                playListDescription: this.data.playListDesc
            }
    
            wx.uploadFile({
                url: 'http://' + ip + ':8080/UserPlayList/addNewUserPlayList', // 仅为示例，非真实的接口地址
                filePath: this.data.playListPic.avatarUrl,
                name: 'file',
                formData: userPlayList,
                header: {
                    "Content-Type": "multipart/form-data"
                },
                success: (res) => {
                    if (res.data == '200') {
                        this.showSuccessMessage('新建歌单成功！')
                    }
                    setTimeout(() => {
                        wx.navigateBack({
                            delta: 1
                        })
                    }, 3000)
                }
            });
        }else{
            if(this.data.playListPic == null){
                if(this.data.playListName == null || this.data.playListName == ''){
                    this.showErrorMessage('请选择歌单图片并填入歌单名称!')
                }else if(this.data.playListName != null){
                    this.showErrorMessage('请选择歌单图片!')
                }
            }else if(this.data.playListName == null || this.data.playListName == ''){
                if(this.data.playListPic == null){
                    this.showErrorMessage('请选择歌单图片并填入歌单名称!')
                }else if(this.data.playListPic != null){
                    this.showErrorMessage('请填入歌单名称!')
                }
            }
        }

        

    },


    //输入歌单描述事件
    inputPlayListDesc(e) {
        this.setData({
            playListDesc: e.detail.value
        })
    },

    //输入歌单名事件
    inputPlayListName(e) {
        this.setData({
            playListName: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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