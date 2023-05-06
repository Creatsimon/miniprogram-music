// pages/songAndAlbumInfo/songAndAlbumInfo.js
const app = getApp()
const ip = app.globalData.ip
Page({

    /**
     * 页面的初始数据
     */
    data: {
        width: wx.getSystemInfoSync().screenWidth, //获取当前设备屏幕宽度
        height: wx.getSystemInfoSync().screenHeight, //获取当前设备屏幕高度
        singerId: "",
        type: null, //类型
        hotSongs: {}, //歌手热门歌曲
        allSongs: null, //歌手全部歌曲
        EP: null, //单曲或EP
        Albums: null, //专辑
        limit: 20, //每条数量
        offset: 0,
        totalPage: 0, //总数
        pic: "",
        MVInfo:null,//歌手MV信息
        hasMore:true,
    },

    loadMV(singerId,onReachBottom){
        wx.request({
            url: 'http://' + ip + ':3000/artist/mv?id=' + singerId + '&limit=' + this.data.limit + "&offset=" + this.data.offset * this.data.limit,
            dataType: "json",
            success: (res) => {
                console.log(res)
                var mv = []
                for (let i = 0; i < res.data.mvs.length; i++) {
                    mv.push(res.data.mvs[i])
                }
                if (onReachBottom == true) {
                    mv = [...this.data.MVInfo, ...mv]
                }
                this.data.offset++
                this.setData({
                    MVInfo: mv,
                    hasMore:res.data.hasMore
                })
            }
        })
    },

    filterAlbum(data, type) {
        //var datas = JSON.parse(data)
        var album = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].type == type) {
                album.push(data[i])
            }
        }
        if (type == '专辑') {
            this.setData({
                Albums: album
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
            }
        })
    },

    //加载专辑事件
    loadAlbum(singerId) {
        wx.request({
            url: 'http://' + ip + ':3000/artist/album?id=' + singerId + '&limit=1',
            dataType: 'json',
            success: (res) => {
                console.log(res)
                this.loadRealAlbum(singerId, res.data.artist.albumSize)
            }
        })
    },

    loadEP(singerId, onReachBottom) {
        wx.request({
            url: 'http://' + ip + ':3000/artist/album?id=' + singerId + '&limit=' + this.data.limit + "&offset=" + this.data.offset * this.data.limit,
            dataType: "json",
            success: (res) => {
                var song = []
                this.setData({
                    totalPage: res.data.artist.albumSize / this.data.limit
                })
                for (let i = 0; i < res.data.hotAlbums.length; i++) {
                    if (res.data.hotAlbums[i].type == 'Single') {
                        song.push(res.data.hotAlbums[i])
                    }
                }
                if (onReachBottom == true) {
                    song = [...this.data.EP, ...song]
                }
                this.data.offset++
                this.setData({
                    EP: song
                })
            }
        })
    },

    //加载单个歌曲信息
    async loadSong(ids,onReachBottom) {
        var pic = ''
            wx.request({
                url: 'http://' + ip + ':3000/song/detail?ids=' + ids,
                dataType: 'json',
                success: (res) => {  
                    var songs = []
                    for(let i = 0 ; i < res.data.songs.length ; i++){
                        songs.push(res.data.songs[i])
                    }
                    if(onReachBottom==true){
                        songs=[...this.data.allSongs,...songs]
                    }
                    this.setData({
                        allSongs:songs
                    })
                }
            })
           
    },

    //加载歌手全部歌曲
    loadSongs(singerId, onReachBottom) {
        wx.request({
            url: 'http://' + ip + ':3000/artist/songs?id=' + singerId + '&limit=' + this.data.limit + "&offset=" + this.data.offset * this.data.limit,
            dataType: "json",
            success: (res) => {
                console.log(res)
                //var song = []
                var ids = ''
                this.data.totalPage = res.data.total / this.data.limit
                for (let i = 0; i < res.data.songs.length; i++) {
                    //var pic = null
                    // let data = {
                    //     id: res.data.songs[i].id,
                    //     ar: res.data.songs[i].ar,
                    //     name: res.data.songs[i].name,
                    // }

                    if(i==res.data.songs.length-1){
                        ids+=res.data.songs[i].id
                    }else{
                        ids+=res.data.songs[i].id+','
                    }

                    //song.push(data)
                }
                if (onReachBottom == true) {
                    this.loadSong(ids,onReachBottom)
                }else{
                    this.loadSong(ids,onReachBottom)
                }
                 this.data.offset++
                // this.setData({
                //     allSongs: song
                // })
            }
        })
    },

    //加载热门歌曲
    loadHotSongs(singerId) {
        wx.request({
            url: 'http://' + ip + ':3000/artist/top/song?id=' + singerId,
            dataType: "json",
            success: (res) => {
                console.log(res)
                this.setData({
                    hotSongs: res.data.songs,
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options.type == 1) {
            wx.setNavigationBarTitle({
                title: '歌曲排行',
            })
            this.loadHotSongs(options.singerId)
        } else if (options.type == 10) {
            wx.setNavigationBarTitle({
                title: '单曲与EP',
            })
            this.loadEP(options.singerId, false)
        } else if (options.type == 100) {
            wx.setNavigationBarTitle({
                title: '专辑',
            })
            this.loadAlbum(options.singerId)
            //this.loadAlbums(options.singerId,false)
        } else if (options.type == 1000) {
            wx.setNavigationBarTitle({
                title: '全部歌曲',
            })
            this.loadSongs(options.singerId, false)
            //this.loadAlbums(options.singerId,false)
        }else if (options.type == 1004) {
            wx.setNavigationBarTitle({
                title: 'MV',
            })
            this.loadMV(options.singerId, false)
            //this.loadAlbums(options.singerId,false)
        }
        console.log(options.singerId + "/" + options.type)
        this.setData({
            type: options.type,
            singerId: options.singerId
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
        if (this.data.type == 10) {
            this.loadEP(this.data.singerId, true)
        }
        if (this.data.type == 1000) {
            this.loadSongs(this.data.singerId, true)
        }
        if(this.data.type==1004&&this.data.hasMore==true){
            this.loadMV(this.data.singerId, true)
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})