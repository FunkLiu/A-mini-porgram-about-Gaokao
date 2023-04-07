// index.js
// const app = getApp()

const db = wx.cloud.database()


Page({

    /**
     * 页面的初始数据
     */
    data: {
        open_id: null,
        if_in_db: false,
        useInfor : {}, // 存储用户信息
    },

    navigate_to_fillApplication(){
        if ( !this.data.if_in_db ){
            wx.show({
              title: '请先前往‘我的’中进一步填写信息',
              icon : 'none',
            })
            return 
        }
        console.log('前往填写高考志愿')
        wx.navigateTo({
          url: '/pages/fillApplication/fillApplication',
        })
    },

    navigate_to_oneScoreOneRank: function(e){
        console.log('跳转到一分一段')
        wx.navigateTo({
          url: '/pages/oneScoreOneRank/index',
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */

    check_user_in_database(params) {
        wx.cloud.callFunction({
            name: 'getOpenID', 
            complete: res => {
                console.log('用户的openid为:',res.result.openId)
                this.setData({
                    open_id: res.result.openId, // 赋上openId
                })
                const db = wx.cloud.database()
                db.collection('user_infor').where({open_id: res.result.openId}).get().then(res =>{
                        if(res.data.length < 1){
                            wx.showToast({
                                title: '为了更加完善的功能\n您可以在‘我的’中进一步填写信息',
                            })
                            this.setData({if_in_db: false})
                            return false
                        }
                        else{
                            console.log('该用户在数据集中')
                            this.setData({if_in_db: true})
                            return true
                        }
                    }
                )
            }
        })  
    },

    onLoad: function (options) {
        this.check_user_in_database()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
