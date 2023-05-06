// pages/album/album.js
const app = getApp()
const ip = app.globalData.ip
Page({

    /**
     * 页面的初始数据
     */
    data: {
        width: wx.getSystemInfoSync().screenWidth, //获取当前设备屏幕宽度
        height: wx.getSystemInfoSync().screenHeight, //获取当前设备屏幕高度
        barHeight:wx.getSystemInfoSync().statusBarHeight,
        albumInfo: {}, //专辑信息
        publishTime: "",
        cur: {},
        albumName:'',
        isNotLookAlbumName:false,
        albumNameHeight:0
    },

    //更新播放列表
    updatePlayList(){
        wx.request({
            url: 'http://'+ip+':8080/redis/getPlayListRedis',
            dataType:'json',
            success:(res)=>{
                //app.gglobalData.playList=res.data.data
            }
          })
    },

    //产生播放列表
    createPlayList(){
        let songs = this.data.albumInfo.songs
        var playList = []
        for(let i = 0 ; i < songs.length ; i++){


            let data = {
                id:songs[i].id,
                albumPic:songs[i].al.picUrl,
                songName:songs[i].name,
                songSingers:songs[i].ar
            }

            playList.push(data)

        }

        wx.request({
          url: 'http://'+ip+':8080/redis/playListRedis',
          method:'POST',
          data:playList,
          dataType:'json',
          success:(res)=>{
              //console.log(res)
              if(res.data.code==200){
                  this.updatePlayList()
              }
          }
        })

    },

    //滑动
    onPageScroll(e) {
        if(e.scrollTop>= (this.data.height*0.01+this.data.width+this.data.albumNameHeight-this.data.barHeight)){
           this.setData({
            albumName:this.data.albumInfo.album.name,
            isNotLookAlbumName:true
           })
        }else if(e.scrollTop<(this.data.height*0.01+this.data.width+this.data.albumNameHeight-this.data.barHeight)){
            this.setData({
                albumName:'',
                isNotLookAlbumName:false
            })
        }
    },

    check(e) {
        const { item } = e.currentTarget.dataset;
  
        this.setData(
          {
            cur: item,
          },
          () => {
            this.setData({ visible: true });
          },
        );
      },
      onVisibleChange(e) {
        this.setData({
          visible: e.detail.visible,
        });
      },


    //转换为时间格式
    formatDate(time) {
        var date = new Date(time);
        var YY = date.getFullYear() + '-';
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        // return YY + MM + DD + " " + hh + mm + ss;
        return YY + MM + DD;
    },

    loadAlbum(albumId) {
        wx.request({
            url: 'http://' + ip + ':3000/album?id=' + albumId,
            dataType: "json",
            success: (res) => {
                console.log(res)
                this.setData({
                    albumInfo: res.data,
                    publishTime: this.formatDate(res.data.album.publishTime)
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let albumId = options.albumId
        console.log(albumId)
        this.loadAlbum(albumId)
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        var that = this
        var query = wx.createSelectorQuery();
        query.select('#albumNameId').boundingClientRect()
        query.exec(function (res) {
            that.setData({
                albumNameHeight: res[0].height
            })
        })
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