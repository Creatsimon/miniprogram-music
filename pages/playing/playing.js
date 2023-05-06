// pages/play/play.js

const app = getApp() //引入app
const innerAudioContext = app.globalData.innerAudioContext //引入全局变量
const ip = app.globalData.ip
import Message from 'tdesign-miniprogram/message/index';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        song: {},
        songDetail: [],
        test: "false",
        isPlay: "",
        songId: "",
        phoneWidth: wx.getSystemInfoSync().screenWidth, //获取手机屏幕宽度
        phoneHeight: wx.getSystemInfoSync().screenHeight, //获取手机屏幕高度
        width: 0,
        height: 0,
        allTime: "00:00", //当前歌曲播放的总时间
        currentTime: "00:00", //当前播放到的时间
        ProValue: 0,
        ProMin: 0,
        ProMax: 10,
        isOpenLyrics: false, //判断是否打开歌词
        lyrics: "",
        currentTimes: 0,
        lyricsInfo: [],
        lyricsInfo2: [],
        visible: true,
        marquee1: {
            speed: 10,
            loop: 0,
            delay: 5000
        },
        nameLength: 0,
        singer: "",
        singerLength: 0,
        playIndex: 0,
        index: 0,
        top: null,
        viewId: null,
        top1: [],
        test: null,
        isLove: null,
        isLogin: wx.getStorageSync('isLogin'),
        WechatOrCloudMuisc: wx.getStorageSync('WechatOrCloudMuisc'),
        visible1: false,
        addPlayListState: false,
        userPlayList: null,
        isScroll: false, //判断是否滑动
        ip: ip,
        songNameWidth: 0,
        singerNameWidth: 0,
        isTranslation: true,
        isWW: null,
        songOrAlbum: false,
        singerInfos: {},
        barHeight:wx.getMenuButtonBoundingClientRect().height+wx.getSystemInfoSync().statusBarHeight
    },

    onBack() {
        wx.navigateBack();
      },
      onGoHome() {
        wx.reLaunch({
          url: '/pages/index/index',
        });
      },

    onVisibleChangeSongOrAlbum(e) {
        this.setData({
            songOrAlbum: e.detail.visible,
        });
    },

    //加载微信用户的歌单
    loadWechatUserPlayList() {
        wx.request({
            url: 'http://' + ip + ':8080/UserPlayList/findUserPlayListByOpenid/' + wx.getStorageSync('openid'),
            dataType: 'json',
            success: (res) => {
                this.setData({
                    wechatUserPlayList: res.data
                })
            }
        })
    },


    //滑动开始事件
    starScroll() {
        this.setData({
            isScroll: true
        })
    },

    //滑动结束事件
    finishScroll() {
        setTimeout(() => {
            this.setData({
                isScroll: false
            })
        }, 3000)

    },

    //监控滑动事件
    onScroll(e) {

        this.setData({
            isScroll: true
        })

    },

    showSuccessMessage(content) {
        Message.success({
            context: this,
            offset: [100, 32],
            duration: 3000,
            content: content,
        });
    },

    showWarnMessage(content) {
        Message.warning({
            context: this,
            offset: [100, 32],
            duration: 3000,
            content: content,
        });
    },

    //检查这首歌是否在我喜欢里
    checkThisSongIsLove(songId) {
        if (wx.getStorageSync('isLogin') == true && wx.getStorageSync('WechatOrCloudMuisc') == 'Wechat') {
            let data = {
                openid: wx.getStorageSync('openid'),
                songId: songId
            }
            wx.request({
                url: 'http://' + ip + ':8080/userLoveSong/findUserLoveSongByOpenidAndSongId',
                data: data,
                dataType: 'json',
                success: (res) => {
                    if (res.data.code == 200) {
                        this.setData({
                            isLove: true
                        })
                    } else if (res.data.code == 900) {
                        this.setData({
                            isLove: false
                        })
                    }
                }
            })
        }
    },

    //从我喜欢里移除
    removeMyLove() {
        if (wx.getStorageSync('isLogin') == true && wx.getStorageSync('WechatOrCloudMuisc') == 'Wechat') {
            let data = {
                openid: wx.getStorageSync('openid'),
                songId: this.data.songId
            }
            wx.request({
                url: 'http://' + ip + ':8080/userLoveSong/deleteUserLoveSongByOpenidAndSongId',
                data: data,
                dataType: 'json',
                success: (res) => {
                    if (res.data.code == 200) {
                        this.showSuccessMessage("以从我喜欢里移除！")
                        this.checkThisSongIsLove(this.data.songId)
                        this.setData({
                            visible1: false
                        })
                    }
                }
            })
        }
    },

    //添加到我的喜欢
    addMyLove() {
        if (wx.getStorageSync('isLogin') == true && wx.getStorageSync('WechatOrCloudMuisc') == 'Wechat') {
            let data = {
                openid: wx.getStorageSync('openid'),
                songId: this.data.songId
            }
            wx.request({
                url: 'http://' + ip + ':8080/userLoveSong/addUserLoveSong',
                data: data,
                dataType: 'json',
                success: (res) => {
                    if (res.data.code == 200) {
                        this.showSuccessMessage("已添加到我喜欢！")
                        this.checkThisSongIsLove(this.data.songId)
                        this.setData({
                            visible1: false
                        })
                    }

                }
            })
        }
    },

    updatePlayListInfo(playListId){
        let data = {
            id: playListId,
            openid: wx.getStorageSync('openid'),
            playListPic:this.data.songDetail[0].al.picUrl
        }

        wx.request({
          url: 'http://'+ip+':8080/UserPlayList/updatePlayList',
          method:'POST',
          data:data,
          dataType:'json',
          success:(res)=>{

          }
        })
    },

    //添加到我的歌单
    addMyPlayList(e) {
        console.log(e.currentTarget.dataset.id)
        let data = {
            playListId: e.currentTarget.dataset.id,
            openid: wx.getStorageSync('openid'),
            songId: this.data.songId
        }
        wx.request({
            url: 'http://' + ip + ':8080/UserPlayListInfo/addUserPlayListInfo',
            method: 'POST',
            data: data,
            dataType: 'json',
            success: (res) => {
                if (res.data.data == 200) {
                    this.showSuccessMessage('添加到歌单成功！')
                    this.updatePlayListInfo(e.currentTarget.dataset.id)
                    this.onClose()
                } else if (res.data.data == 600) {
                    this.showWarnMessage('该歌曲已在该歌单！')
                }
            }
        })
    },

    //打开到我的歌单
    openMyPlayList() {
        if (wx.getStorageSync('isLogin') == true && wx.getStorageSync('WechatOrCloudMuisc') == 'Wechat') {
            wx.request({
                url: 'http://' + ip + ':8080/UserPlayList/findUserPlayListByOpenid/' + wx.getStorageSync('openid'),
                dataType: 'json',
                success: (res) => {
                    console.log(res)
                    this.setData({
                        userPlayList: res.data.data
                    })
                }
            })
        }
        this.setData({
            addPlayListState: true,
            visible1: false
        })
    },

    addPlayListStateChange(e) {
        this.setData({
            addPlayListState: e.detail.visible,
        });
    },
    onClose() {
        this.setData({
            addPlayListState: false,
        });
    },

    //点击播放界面更多按钮
    more(e) {
        this.setData({
            visible1: true
        });
    },

    onVisibleChange(e) {
        this.setData({
            visible1: e.detail.visible,
        });
    },

    loadSingerInfo() {
        var singerInfo = []
        for (let i = 0; i < this.data.songDetail[0].ar.length; i++) {
            wx.request({
                url: 'http://' + ip + ':3000/artist/detail?id=' + this.data.songDetail[0].ar[i].id,
                dataType: 'json',
                success: (res) => {
                    singerInfo.push(res.data.data.artist)
                }
            })
        }

        this.setData({
            singerInfos: singerInfo
        })

    },

    //跳转到歌手详情
    openSingerOrAlbum() {



        this.setData({
            songOrAlbum: true
        })


        //console.log(this.data.songDetail[0].ar[0].id)
        // wx.navigateBack({
        //     delta: 1
        // })
        // wx.navigateTo({
        //     url: '/pages/singer/singer?singerId=' + this.data.songDetail[0].ar[0].id,
        // })
    },

    //点击歌词播放
    clickLyricPlay(e) {
        innerAudioContext.seek(e.currentTarget.dataset.time)
        //console.log(e.currentTarget.dataset.index)
        // if(this.data.isPlay==false){
        //     innerAudioContext.play();
        // }
        innerAudioContext.play();
        this.setData({
            isPlay: true,
            playIndex: e.currentTarget.dataset.index
        })
    },

    //关闭歌词
    closeLyric() {
        this.setData({
            isOpenLyrics: false
        })

    },

    //加载歌词事件
    loadLyrics(songId) {
        wx.request({
            url: 'http://' + ip + ':3000/lyric?id=' + songId,
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                console.log(res)
                var lyric = []
                var lyric2 = []
                let arr = res.data.lrc.lyric.split("\n");
                let len = arr.length;
                if (res.data.tlyric.lyric != null || res.data.tlyric.lyric != '') {
                    let arr2 = res.data.tlyric.lyric.split("\n");
                    let len2 = arr2.length;
                    for (let i = 0; i < len2; i++) {
                        let temp_row = arr2[i];
                        //console.log("原始数据"+temp_row + typeof temp_row+'类型') //例如[00:18.290]背靠着背 坐在地毯上
                        //再将字符串用]分割开来 //  ['[00:59.370', '就是和你一起慢慢变老'] 此时形成一个新数组 
                        let new_arr = temp_row.split("]");
                        //console.log("用】分割后的"+new_arr +"数组长度"+new_arr.length)
                        /*
                        pop 移除最后一个数组元素 这里需要注意的是 其实是得到数组最后一个元素 而打印原数组 才是少了最后一个元素 比如 var arr [1,2,3,4]  pop后的数组就是[4]  原来的数     组 是[1,2,3]
                        */
                        let text = new_arr.pop(); //这里得到的就是 歌词那一句 就是和你一起慢慢变老
                        // console.log("得到歌词"+text)
                        //console.log('-------------------------------------')
                        new_arr.forEach((element) => {
                            //创建一个新对象，用于组装数据
                            let obj = {};
                            let time_arr = element.substr(1, element.length - 1).split(":"); //  ['03', '40.088']
                            //console.log(time_arr)

                            // 注意 ['03', '40.088'] 第一个单位是分钟 需要转化成秒   time_arr[0] * 60     后面的我们需要四舍五入取整  Math.ceil方法将 x 向上舍入到最接近的整数。  Math.ceil(time_arr[1]   40.0       // 88 就是41


                            // 相加得到的就是秒 parseInt() 函数可解析一个字符串，并返回一个整数。 因为以后这里需要 监听播放器的播放时间 用歌词中的时间来匹配播放器时间，
                            // 从而匹配上播放的歌词
                            let s = parseInt(time_arr[0]) * 60 + Math.round(time_arr[1]);



                            obj.time = s;
                            obj.text = text;
                            lyric2.push(obj);
                        });
                    }
                    this.setData({
                        lyricsInfo2: lyric2,
                        isWW: true
                    })
                }

                if (lyric2.length == 0) {
                    this.setData({
                        isWW: false
                    })
                }
                //console.log(lyric2[1].text)
                for (let i = 0; i < len; i++) {
                    let temp_row = arr[i];
                    //console.log("原始数据"+temp_row + typeof temp_row+'类型') //例如[00:18.290]背靠着背 坐在地毯上
                    //再将字符串用]分割开来 //  ['[00:59.370', '就是和你一起慢慢变老'] 此时形成一个新数组 
                    let new_arr = temp_row.split("]");
                    //console.log("用】分割后的"+new_arr +"数组长度"+new_arr.length)
                    /*
                    pop 移除最后一个数组元素 这里需要注意的是 其实是得到数组最后一个元素 而打印原数组 才是少了最后一个元素 比如 var arr [1,2,3,4]  pop后的数组就是[4]  原来的数     组 是[1,2,3]
                    */
                    let text = new_arr.pop(); //这里得到的就是 歌词那一句 就是和你一起慢慢变老
                    // console.log("得到歌词"+text)
                    //console.log('-------------------------------------')
                    new_arr.forEach((element) => {
                        //创建一个新对象，用于组装数据
                        let obj = {};
                        let time_arr = element.substr(1, element.length - 1).split(":"); //  ['03', '40.088']
                        //console.log(time_arr)

                        // 注意 ['03', '40.088'] 第一个单位是分钟 需要转化成秒   time_arr[0] * 60     后面的我们需要四舍五入取整  Math.ceil方法将 x 向上舍入到最接近的整数。  Math.ceil(time_arr[1]   40.0       // 88 就是41


                        // 相加得到的就是秒 parseInt() 函数可解析一个字符串，并返回一个整数。 因为以后这里需要 监听播放器的播放时间 用歌词中的时间来匹配播放器时间，ll

                        // 从而匹配上播放的歌词
                        let s = parseInt(time_arr[0]) * 60 + Math.round(time_arr[1]);
                        obj.time = s;
                        obj.text = text;
                        if (res.data.tlyric.lyric != null) {
                            for (let j = 0; j < lyric2.length; j++) {
                                if (lyric2[j].time == s) {
                                    obj.text2 = lyric2[j].text;
                                    break;
                                }
                            }
                            //console.log(lyric2[2].time)
                        } else {
                            obj.text2 = null;
                        }

                        lyric.push(obj);
                    });
                }

                //console.log(lyric2)
                this.setData({
                    lyricsInfo: lyric,
                    lyrics: res.data.lrc.lyric
                })

            }
        })
    },

    calculationHeight() {
        this.setData({
            top1: []
        })
        var that = this
        for (let j = 0; j < this.data.lyricsInfo.length; j++) {
            var query = wx.createSelectorQuery();
            query.select('#play' + j).boundingClientRect()
            query.exec(function (res) {
                that.data.top1.push(res[0].height)
            })
        }
    },

    openTranslation() {
        this.setData({
            isTranslation: true
        })

        this.calculationHeight()


    },

    closeTranslation() {
        this.setData({
            isTranslation: false
        })

        this.calculationHeight()

    },

    //打开歌词事件
    openLyrics() {

        this.setData({
            isOpenLyrics: true
        })
        if (this.data.top1.length == 0) {
            var that = this
            for (let j = 0; j < this.data.lyricsInfo.length; j++) {
                var query = wx.createSelectorQuery();
                query.select('#play' + j).boundingClientRect()
                query.exec(function (res) {
                    that.data.top1.push(res[0].height)
                })
            }
        }

        //console.log(lyric)
    },



    //拖动进度条中 
    sliderChanging: function (e) {
        innerAudioContext.pause()
        this.setData({
            isPlay: false,
            currentTime: this.formatTime(e.detail.value),
            playIndex: 0
        });
    },
    //拖动进度条 
    sliderChange: function (e) {
        innerAudioContext.seek(e.detail.value);
        // if(this.data.isPlay==false){
        //     innerAudioContext.play();
        // }
        innerAudioContext.play();
        this.setData({
            isPlay: true,
            playIndex: 0
        });
    },

    //处理多个歌手信息
    manySinger(singers) {
        let singer = ""
        for (let i = 0; i < singers.length; i++) {
            if (i == singers.length - 1) {
                singer = singer + singers[i].name
            } else {
                singer = singer + singers[i].name + "/"
            }
        }
        return singer
    },

    //加载歌曲相关信息
    loadSongInfo(id) {
        wx.request({
            url: 'http://' + ip + ':3000/song/detail?ids=' + id,
            dataType: "json",
            success: (res) => {
                console.log(res)
                console.log("nnn" + res.data.songs[0].name.length)
                let singer = ""
                if (res.data.songs[0].ar.length > 1) {
                    singer = this.manySinger(res.data.songs[0].ar)
                } else {
                    singer = res.data.songs[0].ar[0].name
                }
                innerAudioContext.title = res.data.songs[0].name
                innerAudioContext.epname = res.data.songs[0].al.name
                innerAudioContext.singer = singer
                innerAudioContext.coverImgUrl = res.data.songs[0].al.picUrl
                this.setData({
                    songDetail: res.data.songs,
                    nameLength: res.data.songs[0].name.length,
                    singer: singer,
                    singerLength: singer.length
                })
            }
        })
    },



    audioPause() {
        innerAudioContext.pause()
        this.setData({
            isPlay: innerAudioContext.paused
        })
        // console.log("当前播放到："+innerAudioContext.currentTime+"秒")
    },

    audioPlay: function () {
        if (this.data.currentTime == '00:00') {
            innerAudioContext.src = this.data.song[0].url
        } else {
            innerAudioContext.play()
            this.setData({
                isPlay: innerAudioContext.paused
            })
        }
        // console.log("这首歌一共有:"+innerAudioContext.duration+"秒")
    },



    //加载歌曲
    loadSong(id) {
        wx.request({
            url: 'http://' + ip + ':3000/song/url?id=' + id,
            method: 'GET',
            dataType: "json",
            success: (res) => {
                this.setData({
                    song: res.data.data,
                })
                // innerAudioContext.autoplay = true
                // innerAudioContext.src = res.data.data[0].url

                // 设置了 src 之后会自动播放
                //innerAudioContext.src = res.data.data[0].url
                this.setData({
                    allTime: this.formatTime(Math.ceil(innerAudioContext.duration)),
                    isPlay: innerAudioContext.paused
                })
            }
        })
    },

    loadSong2(id) {
        wx.request({
            url: 'http://' + ip + ':3000/song/url?id=' + id,
            dataType: "json",
            success: (res) => {
                this.setData({
                    song: res.data.data,
                    isPlay: innerAudioContext.paused
                })
            }
        })
    },

    //格式化时长 
    formatTime: function (s) {
        let t = '';
        s = Math.floor(s);
        if (s > -1) {
            let min = Math.floor(s / 60) % 60;
            let sec = s % 60;
            if (min < 10) {
                t += "0";
            }

            t += min + ":";
            if (sec < 10) {
                t += "0";
            }
            t += sec;
        }

        return t;
    },

    addUserHistoryPlay(songId) {
        let data = {
            openid: wx.getStorageSync('openid'),
            songid: songId
        }
        wx.request({
            url: 'http://' + ip + ':8080/UserRecentlyListen/addOrUpdateUserRecentlyListen',
            dataType: 'json',
            data: data,
            success: (res) => {

            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.setStorageSync('songId', options.songId)
        this.loadSongInfo(options.songId)
        this.loadSong(options.songId)
        this.loadLyrics(options.songId)
        if (wx.getStorageSync('isLogin') == true && wx.getStorageSync('WechatOrCloudMuisc') == 'Wechat') {
            this.addUserHistoryPlay(options.songId)
            this.checkThisSongIsLove(options.songId)
        }
        this.setData({
            songId: options.songId,
            allTime: this.formatTime(Math.ceil(innerAudioContext.duration)),

        })

        //监听音频播放完成事件
        innerAudioContext.onEnded(() => {
            this.setData({
                isPlay: false,
                currentTime: "00:00",
                ProValue: 0,
                playIndex: 0,
                top: 0,
                songId: options.songId
            })
        })

        //监听音频播放进度更新事件
        innerAudioContext.onTimeUpdate(() => {
            this.setData({
                isPlay: !innerAudioContext.paused,
                currentTime: this.formatTime(Math.ceil(innerAudioContext.currentTime)),
                currentTimes: innerAudioContext.currentTime,
                ProMax: innerAudioContext.duration.toFixed(0),
                ProMin: 0,
                ProValue: innerAudioContext.currentTime.toFixed(0),
            })
            if (!this.data.lyricsInfo.length) return;

            //let index = this.data.lyricsInfo.length - 1
            for (let i = 1; i <= this.data.lyricsInfo.length; i++) {
                if (i == this.data.lyricsInfo.length) {
                    this.setData({
                        index: i - 1,
                        playIndex: i - 1
                    })
                    break;
                } else {
                    if (this.data.lyricsInfo[i].time >= innerAudioContext.currentTime) {
                        this.setData({
                            index: i - 1,
                            playIndex: i - 1
                        })
                        break;
                    }
                }

            }

            if (this.data.isOpenLyrics == true && this.data.top1.length != 0 && this.data.viewId !== this.data.playIndex && this.data.isScroll == false) {

                let height = 0
                for (let j = 0; j < this.data.playIndex; j++) {
                    height += this.data.top1[j]
                }
                this.setData({
                    top: height,
                    viewId: this.data.playIndex
                })

            }


            //console.log(index,this.data.lyricsInfo[index].text);
            //         let index = this.data.lyricsInfo.length -1
            //   for(let i =0; i<this.data.lyricsInfo.length;i++){
            //     const info = this.data.lyricsInfs[i]
            //     if(info.time > audioContext.currentTime * 1000){
            //       index = i-1
            //       break
            //     }
            //   }
            //   console.log(index,this.data.lyricsInfo[index].text);
        })

        innerAudioContext.onPlay(() => {
            innerAudioContext.duration

            this.setData({
                allTime: this.formatTime(Math.ceil(innerAudioContext.duration))
            })
        })


    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

        //this.loadSingerInfo()

        var that = this
        var query = wx.createSelectorQuery();
        query.select('#songName').boundingClientRect()
        query.exec(function (res) {
            that.setData({
                songNameWidth: res[0].width
            })
        })

        var query = wx.createSelectorQuery();
        query.select('#singerName').boundingClientRect()
        query.exec(function (res) {
            that.setData({
                singerNameWidth: res[0].width
            })
        })

        this.setData({
            test: getCurrentPages(),
        })

        wx.setNavigationBarColor({
            backgroundColor: '#ffffff',
            frontColor: '#ffffff',
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