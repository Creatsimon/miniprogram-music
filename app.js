// app.js

App({
  onLaunch() {
    // 展示本地存储能力
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    var phoneWidth = wx.getSystemInfoSync().windowWidth
    var phoneHeight = wx.getSystemInfoSync().windowHeight

    // 登录
    if(wx.getStorageSync('openid')==''||wx.getStorageSync('openid')==null){
        wx.login({
            success: (res) => {
              wx.request({
                url: 'http://'+this.globalData.ip+':8080/login/toLogin/'+res.code,
                method:'get',
                dataType:'json',
                success:(res)=>{
                    if(res.data.code==200){
                        wx.setStorageSync('openid', res.data.data.openid)
                    }
                }
              })
            },
          })
      }
  },
  globalData: {
    userInfo: null,
    innerAudioContext : wx.getBackgroundAudioManager(),
    // ({
    //     useWebAudioImplement: false, // 是否使用 WebAudio 作为底层音频驱动，默认关闭。对于短音频、播放频繁的音频建议开启此选项，开启后将获得更优的性能表现。由于开启此选项后也会带来一定的内存增长，因此对于长音频建议关闭此选项
    
    // }),
    songId: null,
    phoneWidth: wx.getSystemInfoSync().windowWidth,
    phoneHeight: wx.getSystemInfoSync().windowHeight,
    ip:"192.168.50.79",//此处填写自己本机IP
    playList:null
  }
  
})
