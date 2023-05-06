// pages/playlistDetails/playlistDetails.js
const app = getApp()
const ip = app.globalData.ip
Page({
    /**
     * 页面的初始数据
     */
    data: {
        playList:{},//歌单详情数据
        dialogKey: '',//弹出框参数
        allSong: [], //歌单所有歌曲信息
        width: wx.getSystemInfoSync().screenWidth,
        height:wx.getSystemInfoSync().screenHeight, //获取当前设备屏幕宽度
        limit: 20, //每次加载歌曲的数量
        offset: 0, //当前在第几页
        allSongNum: 0 , //该歌单下共有多少首歌曲
        totalPage:0,
        creativeId :"",
        isFinish : false,
        imageOnTop:false
        
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

    clickIcon(event){
        let songId = event.currentTarget.dataset.songid
        console.log("点击右侧icon"+songId)
    },

    toPlay(event){
        let songId = event.currentTarget.dataset.songid
        wx.navigateTo({
          url: '/pages/play/play?songId='+songId,
        })
    },

    //处理多个歌手信息
    manySinger(singers){
        let singer = ""
        for(let i = 0 ; i < singers.length ; i++){
            if(i == singers.length-1){
                singer=singer+singers[i].name
            }else{
                singer=singer+singers[i].name+"/"
            }
        }
        return singer 
    },

    //加载歌曲
    // loadSong(id){
    //     wx.request({
    //         url: 'http://localhost:3000/song/url?id='+id,
    //         dataType: "json",
    //         success: (res) => {
    //             console.log(res.data.data[0].url)
    //         }
    //     })
    // },

    //加载歌单中所有歌曲
    loadAllSong(creativeId , onReachBottom){
        wx.request({
            url: 'http://'+ip+':3000/playlist/track/all?id='+creativeId+"&limit="+this.data.limit+"&offset="+this.data.offset*this.data.limit,
            dataType: "json",
            success: (res) => {
                console.log(res)
                var song = []
                for(let i = 0 ; i < res.data.songs.length ; i++){
                    let info={}
                    if(res.data.songs[i].ar.length>1){
                        info = {id:res.data.songs[i].id,name:res.data.songs[i].name,singer:this.manySinger(res.data.songs[i].ar),pic:res.data.songs[i].al.picUrl} 
                    }else{
                        info = {id:res.data.songs[i].id,name:res.data.songs[i].name,singer:res.data.songs[i].ar[0].name,pic:res.data.songs[i].al.picUrl} 
                    }
                    song.push(info)   
                }
                if(onReachBottom==true){
                    song=[...this.data.allSong,...song]
                }
                this.data.offset++
                this.setData({
                    allSong :song
                })
                
            }
        })
    },

    // loadOtherSong(){

    // }

    //加载歌单详情书事件
    loadPlaylistDetails(creativeId){
        wx.request({
            url: 'http://'+ip+':3000/playlist/detail?id='+creativeId,
            dataType: "json",
            success: (res) => {
                
                if(res.data.playlist.trackCount%this.data.limit==0){
                    this.setData({
                        totalPage: res.data.playlist.trackCount/this.data.limit
                    })
                }else{
                    this.setData({
                        totalPage: (res.data.playlist.trackCount-(res.data.playlist.trackCount%this.data.limit))/this.data.limit+1
                    })
                }
                this.setData({
                    playList:res.data
                })
                console.log(res.data.playlist.trackCount/20)
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let creativeId = options.creativeid
        this.setData({
            creativeId:creativeId
        })
        this.loadPlaylistDetails(creativeId)
        this.loadAllSong(creativeId,false)
        
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
        if(this.data.offset<this.data.totalPage){
            this.loadAllSong(this.data.creativeId,true)
        }else{
            this.setData({
                isFinish : true
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        
    }
})