// pages/singer/singer.js
const app = getApp()
const ip = app.globalData.ip
Page({

    /**
     * 页面的初始数据
     */
    data: {
        width: wx.getSystemInfoSync().screenWidth, //获取当前设备屏幕宽度
        height: wx.getSystemInfoSync().screenHeight, //获取当前设备屏幕高度
        singerInfo: {}, //歌手信息
        littleHotSongs: {}, //少许的歌手热门歌曲
        fixs: false, //判断是否滑动到设定值
        statusBarHeight: 0, //状态栏高度
        Albums: {},
        EP: {},
        newAlbums: {},
        newAlbumsTime: null,
        likeSinger: null,
        isLoveSinger: null,
        singerId: null,
        artisName:'',
        mvInfo:null,
        visible:false
    },

    checkSingerInfo(){
        this.setData({
            visible:true
        })
    },

    onVisibleChange(e) {
        this.setData({
          visible: e.detail.visible,
        });
      },
    
    //加载MV
    loadMVInfo(singerId){
        wx.request({
          url: 'http://'+ip+':3000/artist/mv?id='+singerId,
          dataType:'json',
          success:(res)=>{
              this.setData({
                  mvInfo:res.data.mvs
              })
          }
        })
    },

    //跳转到MV详情
    checkMV(){
        wx.navigateTo({
            url: '/pages/songAndAlbumInfo/songAndAlbumInfo?singerId=' + this.data.singerInfo.artist.id + '&type=1004',
        })
    },

    //跳转到单曲与EP详情
    checkEP() {
        wx.navigateTo({
            url: '/pages/songAndAlbumInfo/songAndAlbumInfo?singerId=' + this.data.singerInfo.artist.id + '&type=10',
        })
    },

    //跳转专辑详情
    checkAlbums() {
        wx.navigateTo({
            url: '/pages/songAndAlbumInfo/songAndAlbumInfo?singerId=' + this.data.singerInfo.artist.id + '&type=100',
        })
    },

    //跳转到歌手全部歌曲
    checkAllSongs(){
        wx.navigateTo({
            url: '/pages/songAndAlbumInfo/songAndAlbumInfo?singerId=' + this.data.singerInfo.artist.id + '&type=1000',
        })
    },

    //跳转歌曲详情
    checkSongs() {
        wx.navigateTo({
            url: '/pages/songAndAlbumInfo/songAndAlbumInfo?singerId=' + this.data.singerInfo.artist.id + '&type=1',
        })
    },

    //过滤专辑/单曲与EP
    filterAlbum(data, type) {
        //var datas = JSON.parse(data)
        var album = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].type == type) {
                album.push(data[i])
            }
            if (album.length == 6) {
                break;
            }
        }
        if (type == '专辑') {
            this.setData({
                Albums: album
            })
        } else if (type == 'Single') {
            this.setData({
                EP: album
            })
        }
    },

    //加载真专辑
    loadRealAlbum(singerId, size) {
        wx.request({
            url: 'http://' + ip + ':3000/artist/album?id=' + singerId + '&limit=' + size,
            dataType: 'json',
            success: (res) => {
                console.log(res)
                this.filterAlbum(res.data.hotAlbums, '专辑')
                this.filterAlbum(res.data.hotAlbums, 'Single')
            }
        })
    },

    formatDate(time) {
        var date = new Date(time);
        var YY = date.getFullYear();
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        // return YY + MM + DD + " " + hh + mm + ss;
        return YY + '年' + MM + '月' + DD + '日';
    },

    //加载专辑事件
    loadAlbum(singerId) {
        wx.request({
            url: 'http://' + ip + ':3000/artist/album?id=' + singerId + '&limit=1',
            dataType: 'json',
            success: (res) => {
                console.log(res)
                this.loadRealAlbum(singerId, res.data.artist.albumSize)
                this.setData({
                    newAlbums: res.data.hotAlbums,
                    newAlbumsTime: this.formatDate(res.data.hotAlbums[0].publishTime)
                })
            }
        })
    },

    //监听用户滑动事件
    onPageScroll(e) {
        console.log(e.scrollTop)
        if (e.scrollTop > this.data.width) {
            this.setData({
                fixs: true,
                artisName:this.data.singerInfo.artist.name
            })
        } else if (e.scrollTop < this.data.width) {
            this.setData({
                fixs: false,
                artisName:''
            })
        }
    },

    //查询是否是关注歌手
    checkIsLoveSinger(id) {
        let data = {
            singerId: id,
            openid: wx.getStorageSync('openid')
        }
        wx.request({
            url: 'http://' + ip + ':8080/userLoveSinger/findByOpenidAndSingerId',
            method: 'POST',
            data: data,
            dataType: 'json',
            success: (res) => {
                if (res.data.code == 200) {
                    this.setData({
                        isLoveSinger: true
                    })
                } else {
                    this.setData({
                        isLoveSinger: false
                    })
                }
            }
        })
    },

    //关注歌手
    loveSinger() {

        //console.log("123456789")
        let data = {
            singerId: this.data.singerId,
            openid: wx.getStorageSync('openid'),
            singerAvatar:this.data.singerInfo.artist.img1v1Url,
            singerName:this.data.singerInfo.artist.name
        }

        wx.request({
            url: 'http://' + ip + ':8080/userLoveSinger/addUserLoveSinger',
            method: 'POST',
            data: data,
            dataType: 'json',
            success: (res) => {
                console.log(res)
                if (res.data.code == 200) {
                    this.checkIsLoveSinger(this.data.singerId)
                }
            }
        })

    },

    //取消关注歌手
    cancelLoveSinger() {
        let data = {
            singerId: this.data.singerId,
            openid: wx.getStorageSync('openid')
        }

        wx.request({
            url: 'http://' + ip + ':8080/userLoveSinger/delUserLoveSinger',
            method: 'POST',
            data: data,
            dataType: 'json',
            success: (res) => {
                if (res.data.code == 200) {
                    this.checkIsLoveSinger(this.data.singerId)
                }
            }
        })
    },

    //加载相似歌手
    loadLikeSinger(id) {
        let cook = 'NMTID=00OR12J-0ecIHblFEjThbcwM-MApcwAAAGHDYWR8A; MUSIC_U=1deeaf46b00a4542aa23caedbce624f8e0bc6783e5adde3dfee9b2582f936d90519e07624a9f005349f173992094204799c30efe1a4d8be452d368cc0d2f58c88d844ab9fdda4422d4dbf082a8813684; __csrf=08028cb51c69298adcd737f0e3becc67'
        wx.request({
            url: 'http://' + ip + ':3000/simi/artist?id=' + id,
            header: {
                cookie: cook
            },
            dataType: "json",
            success: (res) => {
                console.log(res)
                var likeSinger = []
                for (let i = 0; i < 6; i++) {
                    likeSinger.push(res.data.artists[i])
                }
                this.setData({
                    likeSinger: likeSinger
                })
            }
        })
    },

    //加载歌手信息
    loadSinger(singerId) {
        wx.request({
            url: 'http://' + ip + ':3000/artists?id=' + singerId,
            dataType: "json",
            success: (res) => {
                let hotSongs = []
                for (let i = 0; i < 5; i++) {
                    hotSongs.push(res.data.hotSongs[i])
                }
                this.setData({
                    singerInfo: res.data,
                    littleHotSongs: hotSongs
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let singerId = options.singerId
        this.checkIsLoveSinger(options.singerId)
       
        this.loadSinger(singerId)
        this.loadAlbum(singerId)
        this.loadLikeSinger(singerId)
        this.loadMVInfo(singerId)
        this.setData({
            singerId: singerId,
            statusBarHeight: wx.getSystemInfoSync().statusBarHeight
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