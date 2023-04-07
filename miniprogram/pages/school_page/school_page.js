// pages/school_page.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        school: {},

        block_arr: [],

        base_url : 'cloud://cloud1-1gwjkmjk039b98b8.636c-cloud1-1gwjkmjk039b98b8-1313046662/school_logo/',
        file_tail : '.jpg',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var school_infor = JSON.parse(decodeURIComponent(options.data))
        console.log(school_infor)
        var block_arr = []
        block_arr.push({infor: school_infor.level_name})
        if(school_infor.f985 == '1'){
            block_arr.push({infor: '985'})
        }
        if(school_infor.f211 == '1'){
            block_arr.push({infor: '211'})
        }
        if(school_infor.dual_class_name != ''){
            block_arr.push({infor: school_infor.dual_class_name})
        }
        
        this.setData({
            block_arr : block_arr,
            school : school_infor
        })
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