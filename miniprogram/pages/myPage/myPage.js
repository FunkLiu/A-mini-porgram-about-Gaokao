// pages/myPage/myPage.js
var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hadInfo: true,
        userInfo : {}, // 存储用户信息

        show_type : 0,

        show_infor: {
            province_name : '',
            province_type: '',
            choose_subject : null,
            score: '',
            rank: '' 
        } , 

        id_array : ['11', '12', '13', '14', '15', '21', '22', '23', '31', '32', '33', '34', '35', '36', '37', '41', '42', '43', '44', '45', '46', '50', '51', '52', '53', '54', '61', '62', '63', '64', '65'], // 省份的id数组
        province_array :['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'], // 省份名称

    },

    change_info: function(){ // 尝试重新改变信息
        var change_info = true
        const data = JSON.stringify(change_info)
        console.log(data)
        wx.navigateTo({
          url: '/pages/startPages/index?data='+encodeURIComponent(data),
        })
    },

    set_show_info(user_infor){
        if (user_infor == null){
            return
        } 
        else{ 
            if (user_infor.type == 1){// 选择高考类型
                const d = this.data
                // 所在省份
                var province_id = user_infor.province_id
                var province_name = d.province_array[d.id_array.indexOf(province_id)]
                // 选择科类
                var type_name = ''
                for(var i = 0; i < user_infor.province_type.length; ++i){
                    if (user_infor.province_type[i].checked == true){
                        type_name = user_infor.province_type[i].name 
                        break
                    }
                }
                // 选择科目
                var choose_subject = null
                if (user_infor.choose_subject.optinal_subject != null){
                    for(var i = 0; i < user_infor.choose_subject.optinal_subject.length; ++i){
                        if (user_infor.choose_subject.optinal_subject[i].checked == true){
                            if (choose_subject == null){
                                choose_subject = []
                            }
                            choose_subject.push(user_infor.choose_subject.optinal_subject[i].subject)
                        }
                    }
                }
                // 高考分数和排名
                var score = user_infor.score 
                var rank = user_infor.rank

                // 设置信息
                this.setData({
                    show_infor: {
                        province_name : province_name,
                        province_type: type_name,
                        choose_subject : choose_subject,
                        score: score,
                        rank: rank 
                    } , 
                })


            } else if (user_infor.type == 2) { // 选择分科类型
                const d = this.data
                var province_id = user_infor.province_id
                var province_name = d.province_array[d.id_array.indexOf(province_id)]
                this.setData({
                    show_infor : {
                        province_name : province_name,
                        province_type: '',
                        choose_subject : null,
                        score: '',
                        rank: '' 
                    } , 
                })

            }
        }

    },


    get_info(){
        wx.getUserProfile({
            desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              this.setData({
                userInfo: res.userInfo,
                hadInfo : true
              })
            }
        })      
    },

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
                              title: '您可以在‘我的’中进一步填写信息',
                              icon : 'none',
                              duration : 1000
                          })
                          this.setData({
                              if_in_db: false,
                              show_type: 0
                          })
                          return false
                      }
                      else{
                          console.log('该用户在数据集中')
                          this.setData({
                            if_in_db: true,
                            userInfo : res.data[0],
                            show_type : res.data[0].type
                          })
                          console.log(res.data[0])
                          this.set_show_info(res.data[0])
                          return true
                      }
                  }
              )
          }
      })  
  },

    /**
     * 生命周期函数--监听页面加载
     */
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
        this.onLoad() //切换界面强制刷新
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