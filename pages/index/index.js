// index.js
// 获取应用实例
const app = getApp()
const ip = app.globalData.ip
const innerAudioContext = app.globalData.innerAudioContext 
import Message from 'tdesign-miniprogram/message/index';
Page({
    data: {
        ip: app.globalData.ip,
        tabBarValue: 0,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        canIUseGetUserProfile: false,
        canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
        playList: {}, //推荐歌单列表
        hotList: {}, //热搜列表
        searchSuggestion: {}, //搜索建议
        border: {
            color: '#f6f6f6',
        },
        phoneWidth: wx.getSystemInfoSync().screenWidth, //获取设备屏幕宽度
        baseRefresh: {
            value: false,
        },
        loadingProps: {
            size: '50rpx',
        },
        isOpenSearch: false, //判断是否打开搜索框
        actionText: '', //搜索框右侧文字
        isShowSearch: false, //判断是否展示搜索结果
        searchValue: "", //输入框里的内容
        tabPanelstyle: 'display:flex;justify-content:center;align-items:center;min-height: 120px',
        searchType: 1, //搜索类型
        searchSongCount: 0, //该搜索词下记录总数
        limit: 20, //每次加载歌曲的数量
        offset: 0, //当前在第几页
        totalPage: 0, //搜索信息的总页数
        searchSongInfo: null, //搜索的信息
        phoneHeight: wx.getSystemInfoSync().screenHeight, //获取当前设备屏幕高度
        safeHeight:wx.getSystemInfoSync().screenHeight-wx.getSystemInfoSync().safeArea.bottom,
        avatar: "https://cdn-we-retail.ym.tencent.com/retail-ui/components-exp/avatar/avatar-v2/1.png", //默认头像图片
        userAvatar: "", //微信登录用户头像
        userName: "", //微信登录用户名
        isLogin: null, //判断是否为登录状态
        openid: "", //微信用户唯一标识
        QRImg: "", //网易云登录二维码
        cloudMusicUserInfo: null, //网易云用户信息
        cur: {}, //弹出层参数
        WechatOrCloudMusic: "", //判断是微信或者网易云登录
        key: "", //获取网易云key，
        UserRecentlyListenTopThree: null, //微信用户最近播放的前三首歌曲
        userPlayList: null, //微信用户的歌单
        UserLoveSongTopThree: null, //微信用户喜欢的前三首歌曲
        visible: false, //网易云登录二维码弹出层
        cloudMusicNickName: "", //网易云用户用户名
        cloudMusicUserAvatar: "", //网易云用户头像
        openCreatePlayList: false,
        inputPlayListName: '',
        isPlay:false,
        newest:null,
        topArtist:null,
        tags:null,
        selectTag:5001,
        selectTagName:'官方',
        limit1:10,
        offset1:0,
        hasmore:true,
        JPPlayList:null,
        before:'',
        activeValues: [0],
    },

    handleChange(e) {
        this.setData({
          activeValues: e.detail.value,
        });
    },


    //前往关注歌手
    toLoverSinger() {
        wx.navigateTo({
            url: '/pages/RecentlyOrLove/RecentlyOrLove?type=3',
        })
    },

    toRecently() {
        wx.navigateTo({
            url: '/pages/RecentlyOrLove/RecentlyOrLove?type=1',
        })
    },

    toMyLove() {
        wx.navigateTo({
            url: '/pages/RecentlyOrLove/RecentlyOrLove?type=2',
        })
    },

    //加载网易云用户信息
    loadCloudMusicUserInfo(id) {
        wx.request({
            url: 'http://' + ip + ':3000/user/detail?uid=' + id,
            dataType: 'json',
            header: wx.getStorageSync('cookie'),
            success: (res) => {
                this.setData({
                    cloudMusicNickName: res.data.profile.nickname,
                    cloudMusicUserAvatar: res.data.profile.avatarUrl
                })
            }
        })
    },

    //加载网易云用户信息
    loadCloudMusicAccount() {
        let timerstamp = new Date().getTime()
        wx.request({
            url: 'http://' + ip + ':3000/login/status?cookie=' + wx.getStorageSync('cookie') + '&timerstamp=' + timerstamp,
            dataType: 'json',
            header: wx.getStorageSync('cookie'),
            success: (res) => {
                console.log(res)
                this.loadCloudMusicUserInfo(res.data.data.account.id)
            }
        })
    },

    //加载用户喜欢的歌曲前三
    loadUserLoveSongTopThree() {
        wx.request({
            url: 'http://' + ip + ':8080/userLoveSong/findUserLoveSongTopThree/' + wx.getStorageSync('openid'),
            dataType: 'json',
            success: (res) => {
                if (res.data.data != null) {
                    this.loadSongInfo(res.data.data, 2)
                }
            }
        })
    },

    //加载用户歌单
    loadUserPlayList() {
        wx.request({
            url: 'http://' + ip + ':8080/UserPlayList/findUserPlayListByOpenid/' + wx.getStorageSync('openid'),
            dataType: 'json',
            success: (res) => {
                if (res.data.data.length != 0) {
                    this.setData({
                        userPlayList: res.data.data
                    })
                }

            }
        })
    },


    //加载歌曲信息  type==1加载最近播放  type==2加载我喜欢的
    loadSongInfo(data, type) {
        console.log(data)

        wx.request({
            url: 'http://' + ip + ':3000/song/detail?ids=' + data,
            dataType: "json",
            success: (res) => {
                if (type == 1) {
                    this.setData({
                        UserRecentlyListenTopThree: res.data.songs
                    })
                } else if (type == 2) {
                    this.setData({
                        UserLoveSongTopThree: res.data.songs
                    })
                }

            }
        })


    },

    //加载微信用户最近播放的前三首歌曲
    loadUserRecentlyListenTopThree() {
        wx.request({
            url: 'http://' + ip + ':8080/UserRecentlyListen/findUserRecentlyListenTopThree/' + wx.getStorageSync('openid'),
            dataType: 'json',
            success: (res) => {
                if (res.data.data != null) {
                    this.loadSongInfo(res.data.data, 1)
                }
            }
        })
    },

    //展示成功信息
    showSuccessMessage() {
        Message.success({
            context: this,
            offset: [140, 32],
            duration: 3000,
            content: '登录成功',
        });
    },

    showSuccessMessage2(content) {
        Message.success({
            context: this,
            offset: [140, 32],
            duration: 3000,
            content: content,
        });
    },

    showErrorMessage(content) {
        Message.error({
            context: this,
            offset: [140, 32],
            duration: 3000,
            content: content,
        });
    },

    //新建歌单
    createPlayList() {
        this.setData({
            openCreatePlayList: true,
            inputPlayListName: ''
        })
    },

    inputPlayListName(e) {
        this.setData({
            inputPlayListName: e.detail.value
        })
    },

    addNewPlayList() {
        //console.log("确定")
        if (this.data.inputPlayListName == null || this.data.inputPlayListName == '') {
            this.showErrorMessage('歌单标题不能为空')
        } else {
            let data = {
                openid: wx.getStorageSync('openid'),
                playListName: this.data.inputPlayListName
            }
            wx.request({
                url: 'http://' + ip + ':8080/UserPlayList/createNewPlayList',
                method: 'POST',
                data: data,
                dataType: 'json',
                success: (res) => {
                    if (res.data.code == 200) {
                        this.showSuccessMessage2('创建歌单成功！')
                        this.setData({
                            openCreatePlayList: false
                        })
                        this.loadUserPlayList()
                    } else {
                        this.showErrorMessage('出错了请稍后再试！')
                    }
                }
            })

        }

    },

    closeDialog() {
        // const { dialogKey } = this.data;
        // this.setData({ [dialogKey]: false });
        console.log("取消")
        this.setData({
            openCreatePlayList: false
        })
    },

    checkQRState(key) {

        let timestamp2 = new Date().getTime()
        let code = 0
        wx.request({
            url: 'http://' + ip + ':3000/login/qr/check?key=' + key + '&timestamp=' + timestamp2,
            dataType: 'json',
            success: (res) => {
                code = res.data.code
                if (code == 803) {
                    wx.setStorageSync('cookie', res.data.cookie)
                    wx.setStorageSync('WechatOrCloudMusic', 'CloudMusic')
                    wx.setStorageSync('isLogin', true)
                    this.setData({
                        WechatOrCloudMusic: "CloudMusic"
                    })
                    console.log(res)
                    this.loadCloudMusicAccount()
                    this.showSuccessMessage()
                    this.onClose()

                } else if (code != 803 && this.data.visible == true) {
                    console.log("未登录")
                    setTimeout(() => {
                        this.checkQRState(this.data.key)
                    }, 2000)
                }
            }
        })



    },

    createQR(key) {
        let timestamp = new Date().getTime()
        wx.request({
            url: 'http://' + ip + ':3000/login/qr/create?key=' + key + '&qrimg=true&timestamp=' + timestamp,
            dataType: 'json',
            success: (res) => {
                this.setData({
                    QRImg: res.data.data.qrimg,
                    key: key
                })

            }
        })

    },

    //获取key
    getKey() {
        let timestamp = new Date().getTime()
        wx.request({
            url: 'http://' + ip + ':3000/login/qr/key?timestamp=' + timestamp,
            dataType: 'json',
            success: (res) => {
                this.createQR(res.data.data.unikey)
            }
        })
    },


    //点击网易云登录事件
    cloudMuiscLogin(e) {
        this.getKey()
        // const {
        //     item
        // } = e.currentTarget.dataset;
        // this.setData({
        //         cur: item,
        //     },
        //     () => {
        //         this.setData({
        //             visible: true
        //         });
        //     },
        // );

        this.setData({
            visible: true
        })

        this.checkQRState(this.data.key)


    },

    onVisibleChange(e) {
        this.setData({
            visible: e.detail.visible,
        });
    },
    onClose() {
        this.setData({
            visible: false,
        });
    },

    findUserByOpenid() {
        wx.request({
            url: 'http://' + ip + ':8080/userinfo/findUserByOpenid/' + wx.getStorageSync('openid'),
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                if (res.data.data != null) {
                    console.log(res)
                    wx.setStorageSync('nickname', res.data.data.nickname)
                    wx.setStorageSync('avatarurl', res.data.data.avatarurl)
                    wx.setStorageSync('isLogin', true)
                    this.setData({
                        userAvatar: res.data.data.avatarurl,
                        userName: res.data.data.nickname,
                        isLogin: true
                    })
                }
            }
        })
    },

    //
    logout() {
        if (wx.getStorageSync('WechatOrCloudMuisc') == 'Wechat') {
            wx.removeStorageSync('nickname')
            wx.removeStorageSync('avatarurl')
            wx.removeStorageSync('isLogin')
            wx.removeStorageSync('WechatOrCloudMuisc')
            this.setData({
                isLogin: false
            })
        }
        if (wx.getStorageSync('WechatOrCloudMuisc') == 'CloudMuisc') {
            wx.removeStorageSync('cookie')
            wx.removeStorageSync('WechatOrCloudMuisc')
            this.setData({
                isLogin: false
            })
        }

    },

    //点击微信登录事件
    Login() {
        wx.request({
            url: 'http://' + ip + ':8080/userinfo/findUserByOpenid/' + wx.getStorageSync('openid'),
            method: 'GET',
            dataType: 'json',
            success: (res) => {
                console.log(res)
                if (res.data.data == null) {
                    wx.navigateTo({
                        url: '/pages/newUser/newUser',
                    })
                } else {
                    wx.setStorageSync('nickname', res.data.data.nickname)
                    wx.setStorageSync('avatarurl', res.data.data.avatarurl)
                    wx.setStorageSync('isLogin', true)
                    wx.setStorageSync('WechatOrCloudMuisc', 'Wechat')
                    this.setData({
                        userAvatar: res.data.data.avatarurl,
                        userName: res.data.data.nickname,
                        isLogin: true,
                        openid: wx.getStorageSync('openid'),
                        WechatOrCloudMusic: "Wechat"
                    })
                    this.showSuccessMessage()
                    this.loadUserRecentlyListenTopThree()
                    this.loadUserPlayList()
                    this.loadUserLoveSongTopThree()
                }
            }
        })

        //  if(wx.getStorageSync('isLogin')==''|| wx.getStorageSync('isLogin')==null){
        //      wx.getUserInfo({
        //          desc:'desc',
        //        success:(res)=>{
        //            this.setData({
        //             userName:res.userInfo.nickName,
        //             userAvatar:res.userInfo.avatarUrl,
        //             isLogin:true
        //            })
        //            wx.setStorageSync('nickName', res.userInfo.nickName)
        //            wx.setStorageSync('avatarUrl', res.userInfo.avatarUrl)
        //            wx.setStorageSync('isLogin', true)

        //            wx.request({
        //              url: 'http://'+ip+':8080/userinfo/findUserByOpenid/'+wx.getStorageSync('openid'),
        //              method:'GET',
        //              dataType:'json',
        //              success:(res)=>{
        //                  console.log(res)
        //              }
        //            })

        //        }
        //      })
        //  }

    },

    

    //选项卡
    onTabsChange(event) {
        console.log(`Change tab, tab-panel value is ${event.detail.value}.`);
        this.setData({
            searchType: event.detail.value,
            offset: 0,
            searchSongInfo: []
        })
        this.searchSong(this.data.searchValue, event.detail.value, false)
    },

    //搜索歌曲事件
    searchSong(keyword, type, onReachBottom) {
        wx.request({
            url: 'http://' + ip + ':3000/cloudsearch?keywords=' + keyword + '&limit=' + this.data.limit + "&offset=" + this.data.offset * this.data.limit + '&type=' + type,
            dataType: "json",
            success: (res) => {
                var song = []
                if (type == 1) {
                    //歌曲
                    this.setData({
                        totalPage: res.data.result.songCount / this.data.limit
                    })
                    for (let i = 0; i < res.data.result.songs.length; i++) {
                        song.push(res.data.result.songs[i])
                    }
                } else if (type == 10) {
                    //专辑
                    this.setData({
                        totalPage: res.data.result.albumCount / this.data.limit
                    })
                    for (let i = 0; i < res.data.result.albums.length; i++) {
                        song.push(res.data.result.albums[i])
                    }
                } else if (type == 100) {
                    //歌手
                    this.setData({
                        totalPage: res.data.result.artistCount / this.data.limit
                    })
                    for (let i = 0; i < res.data.result.artists.length; i++) {
                        song.push(res.data.result.artists[i])
                    }
                } else if (type == 1004) {
                    //歌手
                    this.setData({
                        totalPage: res.data.result.mvCount / this.data.limit
                    })
                    for (let i = 0; i < res.data.result.mvs.length; i++) {
                        song.push(res.data.result.mvs[i])
                    }
                }
                console.log(song)
                if (onReachBottom == true) {
                    console.log("qwertyuio")
                    song = [...this.data.searchSongInfo, ...song]
                }
                this.data.offset++
                this.setData({
                    searchSongInfo: song
                })
            }
        })
    },

    //点击推荐搜索词
    clickSuggestion(e) {
        console.log(e.currentTarget.dataset.keyword)
        this.searchSong(e.currentTarget.dataset.keyword, this.data.searchType, false)
        this.setData({
            isOpenSearch: true,
            isShowSearch: true,
            searchValue: e.currentTarget.dataset.keyword
        })
    },

    //点击热搜名单
    clickHotList(event) {
        //console.log(event.currentTarget.dataset.keyword)

        this.setData({
            isOpenSearch: true,
            searchValue: event.currentTarget.dataset.keyword,
            isShowSearch: true,
            offset: 0
        })
        this.searchSong(event.currentTarget.dataset.keyword, this.data.searchType, false)
    },

    //搜索框输入事件
    changeHandle(e) {
        //console.log(e.detail.value)
        if (e.detail.value != '' && e.detail.value != null) {
            wx.request({
                url: 'http://' + ip + ':3000/search/suggest?keywords=' + e.detail.value + '&type=mobile',
                dataType: "json",
                success: (res) => {
                    this.setData({
                        searchSuggestion: res.data.result.allMatch,
                        searchValue: e.detail.value,
                        actionText: "搜索",
                        isShowSearch: false
                    })
                }
            })
        } else {
            this.setData({
                searchSuggestion: null,
                searchValue: e.detail.value,
                actionText: "返回",
                searchSongInfo: null,
                offset: 0
            })
        }
    },

    //点击搜素框右侧取消事件
    actionHandle() {
        if (this.data.actionText == "返回") {
            this.setData({
                isOpenSearch: false,
                searchValue: "",
                searchSuggestion: null,
                searchSongInfo: [],
                offset: 0,
                searchType: 1
            })
        } else if (this.data.actionText == '搜索') {
            //console.log(this.data.searchValue)
            this.setData({
                isShowSearch: true,
                offset: 0
            })
            this.searchSong(this.data.searchValue, this.data.searchType, false)
        }

    },

    //清除事件
    clearSearch() {
        console.log("清楚方法")
        this.setData({
            searchSuggestion: null,
            searchValue: '',
            actionText: '返回',
            searchSongInfo: [],
            offset: 0,
            searchType: 1,
            isShowSearch: false
        })
    },

    //搜索框聚焦事件
    focusHandle() {
        let word = ''
        console.log(this.data.searchValue)
        if (this.data.searchValue == '' || this.data.searchValue == null) {
            word = '返回'
        } else {
            word = '搜索'
        }
        this.setData({
            actionText: word,
        })
        if (this.data.searchSongInfo == null) {
            this.setData({
                isShowSearch: false
            })
        }
    },

    // 事件处理函数
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    //加载热门歌手
    loadTopArtist(){
        wx.request({
            url: 'http://'+ip+':3000/top/artists?offset=0&limit=10',
            dataType:'json',
            success:(res)=>{
                this.setData({
                    topArtist:res.data.artists
                })
            }
          })
    },

    //加载最新专辑
    loadAlbumNewest(){
        wx.request({
            url: 'http://'+ip+':3000/album/newest',
            dataType:'json',
            success:(res)=>{
                //console.log(res)
                this.setData({
                    newest:res.data.albums
                })
            }
          })
    },

    //加载推荐MV
    loadTJMV(){
        wx.request({
            url: 'http://'+ip+':3000/mv/first?limit=10',
            dataType:'json',
            success:(res)=>{
                console.log(res)
                this.setData({
                    TJMV:res.data.data
                })
                
            }
          })
    },

    loadTags(){
        wx.request({
            url: 'http://'+ip+':3000/playlist/highquality/tags',
            dataType:'json',
            success:(res)=>{
                this.setData({
                    tags:res.data.tags
                })
            }
          })
    },

    loadTest(){
        wx.request({
          url: 'http://'+ip+':3000/personalized/newsong',
          dataType:'json',
          success:(res)=>{
              console.log(res)
          }
        })
    },

    //加载精品歌单
    loagJPGD(tagName,isNext){
        wx.request({
            url: 'http://'+ip+':3000/top/playlist?cat='+tagName+'&limit='+this.data.limit1+'&offset='+this.data.limit1*this.data.offset1,
            dataType:'json',
            success:(res)=>{
                var playList = []
                for(let i = 0 ; i < res.data.playlists.length ; i++){
                    playList.push(res.data.playlists[i])
                    // if(i==res.data.playlists.length-1){
                    //     this.setData({
                    //         before:res.data.playlists[i].updateTime
                    //     })
                    // }
                }
                if(isNext == true){
                    playList=[...this.data.JPPlayList,...playList]
                }
                this.data.offset1++
                this.setData({
                    hasmore:res.data.more,
                    JPPlayList:playList
                })
            }
          })
    },

    //点击tag
    clickTag(e){
        
        this.setData({
            selectTag:e.currentTarget.dataset.tagid,
            selectTagName:e.currentTarget.dataset.tagname,
            hasmore:true,
            offset1:0
        })
        this.loagJPGD(e.currentTarget.dataset.tagname,false)
    },


    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        console.log("页面上拉触底事件的处理函数")
        if (this.data.offset < this.data.totalPage) {
            this.searchSong(this.data.searchValue, this.data.searchType, true)
        } else {
            this.setData({
                isFinish: true
            })
        }

        if(this.data.tabBarValue==2&&this.data.hasmore==true){
            this.loagJPGD(this.data.selectTagName,true)
        }
    },

    onLoad() {

        

        this.loadTest()

        if (wx.getStorageSync('isLogin') == true) {

            // this.setData({
            //     isLogin: wx.getStorageSync('isLogin'),
            //     userAvatar: wx.getStorageSync('avatarurl'),
            //     userName: wx.getStorageSync('nickname'),
            //     WechatOrCloudMusic: wx.getStorageSync('WechatOrCloudMusic')
            // })
        }

        if (wx.getStorageSync('isLogin') == true && wx.getStorageSync('WechatOrCloudMuisc') == 'Wechat') {
            this.Login()
            //this.loadUserRecentlyListenTopThree()
            this.loadUserPlayList()
            this.loadUserLoveSongTopThree()
        }


        if (wx.getStorageSync('isLogin') == true && wx.getStorageSync('WechatOrCloudMusic') == 'CloudMusic') {
            this.loadCloudMusicAccount()
        }

        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true,

            })
        }
    },
    

    onPullDownRefresh() {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        wx.request({
            url: 'http://' + ip + ':3000/homepage/block/page&timestamp=' + timestamp,
            dataType: "json",
            success: (res) => {
                this.setData({
                    playList: res.data.data.blocks[1].creatives
                })
            }
        })
        console.log("调用了加载推荐歌单的方法111111")
    },


    bf(){
        innerAudioContext.play()
            this.setData({
                isPlay: innerAudioContext.paused
            })
    },

    zt(){
        innerAudioContext.pause()
        this.setData({
            isPlay: innerAudioContext.paused
        })
    },

    //点击底部选项事件
    clickTabBar(event) {
        var value = event.detail.value
        console.log(value)
        if (value == "0") {
            // wx.setNavigationBarTitle({
            //     title: '我的'
            // })
            this.setData({
                tabBarValue: value
            })
        } else if (value == "1") {
            // wx.setNavigationBarTitle({
            //     title: '发现音乐'
            // })
            this.setData({
                tabBarValue: value
            })
            if (this.data.playList[0] == null) {
                this.loadPlayList()
            }
            if(this.data.newest == null){
                this.loadAlbumNewest()
            }
            if(this.data.topArtist == null){
                this.loadTopArtist()
            }
            if(this.data.TJMV == null){
                this.loadTJMV()
            }
        } else if (value == "2") {
            if(this.data.tags == null){
                this.loadTags()
            }
            this.loagJPGD(this.data.selectTagName,false)
            this.setData({
                tabBarValue: value
            })
        } else if (value == "3") {
            // wx.setNavigationBarTitle({
            //     title: '搜索'
            // })
            this.setData({
                tabBarValue: value
            })
            if (this.data.hotList[0] == null) {
                this.loadHotList()
            }
        }
        console.log("qwer" + this.data.tabBarValue.data)
    },

    //点击搜索按钮事件
    clickSearch() {
        this.setData({
            isOpenSearch: true
        })
        this.focusHandle()
    },

    //返回顶部
    onToTop(e) {
        console.log('backToTop', e);
      },

    //加载推荐歌单
    loadPlayList() {
        wx.request({
            url: 'http://' + ip + ':3000/homepage/block/page',
            dataType: "json",
            success: (res) => {
                this.setData({
                    playList: res.data.data.blocks[1].creatives
                })
            }
        })
        console.log("调用了加载推荐歌单的方法")
    },

    //加载热搜列表
    loadHotList() {
        wx.request({
            url: 'http://' + ip + ':3000/search/hot',
            dataType: "json",
            success: (res) => {
                console.log(res)
                this.setData({
                    hotList: res.data.result.hots
                })
            }
        })
        console.log("调用了加载热搜的方法")
    },

    //点击推荐歌单触发的事件
    clickPalyList(event) {
        wx.navigateTo({
            url: '/pages/playlistDetails/playlistDetails?creativeid=' + event.currentTarget.dataset.creativeid
        })
    },

    onShow() {
        if (wx.getStorageSync('isLogin') == true && wx.getStorageSync('WechatOrCloudMuisc') == 'Wechat') {
            this.loadUserRecentlyListenTopThree()
            this.loadUserPlayList()
            this.loadUserLoveSongTopThree()
        }

        console.log(innerAudioContext.paused)

        this.setData({
            isPlay:innerAudioContext.paused
        })
    },

    onReady() {

        // const systemInfo = wx.getSystemInfoSync();
        // const height = systemInfo.screenHeight - systemInfo.windowHeight - systemInfo.statusBarHeight - 44;
        // console.log('tabbar的高度为：', height);
        // this.setData({
        //     openid: wx.getStorageSync('openid'),
        //     tabHeight:height
        // })

        var query = wx.createSelectorQuery();
        query.select('#tabbar2').boundingClientRect()
        query.exec(function (res) {
            console.log(res)
        })

    }

})