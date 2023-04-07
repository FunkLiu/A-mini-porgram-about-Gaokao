
// pages/fillApplication.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        width : null,
        height : null,
        show_infor : '',
        id_array : ['11', '12', '13', '14', '15', '21', '22', '23', '31', '32', '33', '34', '35', '36', '37', '41', '42', '43', '44', '45', '46', '50', '51', '52', '53', '54', '61', '62', '63', '64', '65'], // 省份的id数组
        province_array :['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'], // 省份名称
        province_index : null,
        province_id : null,

        gaokao_num : {},

        base_url : 'cloud://cloud1-1gwjkmjk039b98b8.636c-cloud1-1gwjkmjk039b98b8-1313046662/school_logo/',
        file_tail : '.jpg',

        tag_set : {} ,

        search_limit : {
            city_arr : [],
            f985 : false,
            f211 : false,
            dual_class : false,
            school_nature_arr : [], 
            school_type_arr : []
        },
        school_arr : [],

        hideFlag: true,//true-隐藏 false-显示
        animationData: {},
        
        put_up : {},
        choose_type : '',
        put_up_righgt_index : 0,
        take_up_explain : {}
    },

    choose_left(e){
        console.log(e)
        var  new_index = Number(e.currentTarget.dataset.put_up_righgt_index)
        this.setData({
            put_up_righgt_index : new_index-1
        })
    },
    choose_right(e){
        console.log(e)
    },
    get_right_index(e){
        console.log(e)
        var right_index = Number(e.currentTarget.dataset.index)
        var left_index = this.data.put_up_righgt_index
        var put_up = this.data.put_up
        put_up[left_index].children[right_index].checked = !(put_up[left_index].children[right_index].checked)
        console.log(this.data.school_areas)
        console.log(this.data.school_areas_orgin)
        this.setData({
            put_up : put_up
        })
    },

    get_key_word_and_search(e){ // 检索四大筛选
        var school_areas = this.data.school_areas
        var school_special = this.data.school_special
        var school_nature = this.data.school_nature
        var school_type = this.data.school_type

        var city_arr = []
        for(var i=0; i<school_areas.length; ++i){ // 选中的城市
            for(var j=0; j<school_areas[i].children.length; ++j){
                if (school_areas[i].children[j]['checked']){
                    city_arr.push(school_areas[i].children[j]['name'])
                }
            }
        }

        var f985 = school_special[0].children[0]['checked']
        var f211 = school_special[0].children[1]['checked']
        var dual_class = school_special[0].children[2]['checked']
        
        var school_nature_arr =  []
        for(var i=0; i<school_nature[0].children.length; ++i){
            if (school_nature[0].children[i]['checked']){
                school_nature_arr.push(school_nature[0].children[i]['name'])
            }
        }

        var school_nature_arr =  []
        for(var i=0; i<school_nature[0].children.length; ++i){
            if (school_nature[0].children[i]['checked']){
                school_nature_arr.push(school_nature[0].children[i]['name'])
            }
        }
        
        var school_type_arr = []
        for(var i=0; i<school_type[0].children.length; ++i){
            if (school_type[0].children[i]['checked']){
                school_type_arr.push(school_type[0].children[i]['name'])
            }
        }

        var search_limit = {
            city_arr : city_arr,
            f985 : f985,
            f211 : f211,
            dual_class : dual_class,
            school_nature_arr : school_nature_arr, 
            school_type_arr : school_type_arr
        }

        console.log(search_limit)
        this.get_school_infor(this.data.introduce_school_arr, search_limit) // 重新挑选
        this.hideModal()
    },

    reset_check_box(e){
        var choose_type = this.data.choose_type 
        var choose_type_orgin = this.data.choose_type + '_orgin'
        console.log(choose_type_orgin)
        var new_ele = choose_type
        this.setData({
            put_up : this.data[choose_type_orgin],
            [new_ele] : this.data[choose_type_orgin],
        }) // 全部重置，回到原始状态
        var choose_type_orgin_new = this.deepClone(this.data[choose_type_orgin])
        this.setData({
            [choose_type_orgin] : choose_type_orgin_new
        })
        console.log(this.data.school_areas_orgin)
    },

    write_show_infor(parms){
        var show_infor = ''
        // 展示省份
        var province_id = parms.province_id
        var province_index = this.data.id_array.indexOf(province_id)
        var province_name = this.data.province_array[province_index]
        show_infor += (province_name + '/')
        // 展示选科类型
        for(var i=0; i<parms.province_type.length; ++i){
            var item = parms.province_type[i]
            if (item.checked){
                show_infor += (item.name + '/')
                break
            }
        }
        // 展示分数
        show_infor += (parms.score + '分')
        this.setData({
            show_infor : show_infor
        })
    },

    changeRange2(e) {
        var _this = this;
        _this.popup.changeRange(); //调用子组件内的函数
    },

    get_school_infor(school_arr, search_limit){ // 传入一个列表参数，获取推荐学校的所有学校

        const db = wx.cloud.database()
        const _ = db.command
        var search_condition = {
            school_id : _.in(school_arr)
        }
        // 学校位置
        var city_arr = search_limit.city_arr
        if(city_arr.length > 0){
            search_condition['city_name'] = _.in(city_arr)
        }
        // 大学特色
        if(search_limit.f985 == true){
            search_condition['f985'] = '1'
        }
        if(search_limit.f211 == true){
            search_condition['f211'] = '1'
        }
        if(search_limit.dual_class == true){
            search_condition['dual_class_name'] = '双一流'
        }
        // 办学性质
        var school_nature_arr = search_limit.school_nature_arr
        if(school_nature_arr.length > 0){
            search_condition['nature_name'] = _.in(school_nature_arr)
        }
        // 大学类型
        var school_type_arr = search_limit.school_type_arr
        if(school_type_arr.length > 0){
            search_condition['type_name'] = _.in(school_type_arr)
        }

        console.log('查询条件为',search_condition)
        db.collection('school_mainInfor').where(search_condition).get().then(
            res =>{
                console.log("共计",res.data.length,"的学校的信息")
                this.setData({
                    school_arr : res.data
                })
            }
        )
    },

    introduce_school(parms){ // 这里将会根据传入的参数获取学校
        var province_id = parms.province_id
        var province_type = null
        for(var i=0; i<parms.province_type.length; ++i){
            var item = parms.province_type[i]
            if (item.checked){
                province_type = item.id
                break
            }
        }

        const db = wx.cloud.database() // 连接数据库，查询推荐学校
        db.collection('introduce_school').where({province_id: province_id}).get().then(res => {
            console.log('查询成功，获得数据长度',res.data.length)
            var total_num = null
            var index = 0
             // 在得到的数据中查询必要信息
            for(var i=0; i<res.data[0].data.length; ++i){
                if (toString(province_type) == toString(res.data[0].data[i].type)){
                    total_num = res.data[0].data[i].total_num
                    index = i 
                    break
                }
            }
            // 计算
            var rank = Number(parms.rank)
            var center_index = Math.ceil(res.data[0].data[index].data.length * (rank / Number(total_num)))
            var start_index = Math.max(0, center_index-5) 
            var end_index = Math.min(res.data[0].data[index].data.length, center_index+50)
            
            console.log(start_index, end_index)
            var arr = res.data[0].data[index].data
            var introduce_school_set = new Set()
            for(var i=start_index; i<end_index; ++i){
                for(var j=0; j<arr[i].length; ++j){
                    introduce_school_set.add(arr[i][j])
                }
            }
            var introduce_school_arr = [...introduce_school_set]
            console.log(introduce_school_arr)

            this.setData({
                province_id : province_id,
                introduce_school_arr : introduce_school_arr
            })
            this.get_school_infor(introduce_school_arr, this.data.search_limit)
        })
    },

    navigate_to_school(e){
        console.log(e)
        var pass_school = JSON.stringify(this.data.school_arr[e.currentTarget.dataset.index])
        // console.log(pass_school)
        wx.navigateTo({
          url: '/pages/school_page/school_page?data='+encodeURIComponent(pass_school),
        })
    },

    /**
     * 候选询问界面
     */     
    check_user_in_database_and_navigate(params) {
        wx.cloud.callFunction({
            name: 'getOpenID', 
            complete: res => {
                console.log('用户的openid为:',res.result.openId)
                this.setData({
                    open_id: res.result.openId, // 赋上openId
                })
                const db = wx.cloud.database()
                db.collection('user_infor').where({open_id: res.result.openId}).get().then(res =>{
                        if(res.data.length < 1 || res.data[0].type != 1){ // 只要没有数据或者不是高考类型就需要修改
                            wx.showModal({
                                title: '检测到你还未填写信息或者类型不为高考',
                                content: '是否前往“我的”界面填写或者修改信息，否则将返回主界面',
                                showCancel: true,//是否显示取消按钮
                                cancelText:"否",//默认是“取消”
                                cancelColor:'skyblue',//取消文字的颜色
                                confirmText:"是",//默认是“确定”
                                confirmColor: 'skyblue',//确定文字的颜色
                                success: function (res) {
                                   if (res.cancel) {
                                    wx.navigateBack() // 返回上一层
                                   } else {
                                      //点击确定
                                      wx.switchTab({
                                        url: '/pages/myPage/myPage',
                                      })
                                   }
                                },
                                fail: function (res) { },//接口调用失败的回调函数
                                complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
                            })
                            return false
                        }
                        else{
                            console.log('该用户在数据集中，准备查询信息')
                            this.setData({
                              userInfo : res.data[0],
                            })
                            console.log(res.data[0])
                            wx.showToast({
                                title: '正在自动推荐',
                                icon : 'loading',
                                duration :  800+Math.random()*700   // 这里加入随机数，有加载内味了
                              })
                            this.write_show_infor(res.data[0])
                            this.introduce_school(res.data[0])
                            return true
                        }
                    }
                )
            }
        })  
    },

    // ----------------------------------------------------------------------modal
    // 显示遮罩层
    showModal: function (event) {
         // 响应事件处理
        var choose_type = event.currentTarget.dataset.show_arr
        this.setData({
            put_up : this.data[choose_type],
            choose_type : choose_type
        })
        var that = this;
        that.setData({
        hideFlag: false
        })
     // 创建动画实例
        var animation = wx.createAnimation({
            duration: 400,//动画的持续时间
            timingFunction: 'ease',//动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
        })
        this.animation = animation; //将animation变量赋值给当前动画
        var time1 = setTimeout(function () {
        that.slideIn();//调用动画--滑入
        clearTimeout(time1);
        time1 = null;
     }, 100)
     },
     // 隐藏遮罩层
    hideModal: function () {
         var that = this;
         var animation = wx.createAnimation({
             duration: 400,//动画的持续时间 默认400ms
             timingFunction: 'ease',//动画的效果 默认值是linear
         })
         this.animation = animation
         that.slideDown();//调用动画--滑出
         var time1 = setTimeout(function () {
              that.setData({
              hideFlag: true
          })
          clearTimeout(time1);
          time1 = null;
         }, 220)//先执行下滑动画，再隐藏模块
     },
    hideModalAndReset: function () {
        var that = this;
        var animation = wx.createAnimation({
            duration: 400,//动画的持续时间 默认400ms
            timingFunction: 'ease',//动画的效果 默认值是linear
        })
        this.animation = animation
        this.reset_check_box() // 重置 
        this.setData({
            put_up_righgt_index : 0
        })
        that.slideDown();//调用动画--滑出
        var time1 = setTimeout(function () {
             that.setData({
             hideFlag: true
        })
        
        clearTimeout(time1);
        time1 = null;
        }, 220)//先执行下滑动画，再隐藏模块
        
     },
     //动画 -- 滑入
     slideIn: function () {
        this.animation.translateY(0).step() // 在y轴偏移，然后用step()完成一个动画
        this.setData({
        //动画实例的export方法导出动画数据传递给组件的animation属性
        animationData: this.animation.export()
     })},
        //动画 -- 滑出
     slideDown: function () {
        this.animation.translateY(300).step()
        this.setData({
        animationData: this.animation.export(),
     })},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var width = wx.getSystemInfoSync().windowWidth // 获取窗口宽度
        var height = wx.getSystemInfoSync().windowHeight // 获取窗口高度
        this.setData({
            width : width,
            height : height
        })

        const db = wx.cloud.database()
        db.collection('city_config').get().then(res =>{
            var body = res.data[0].body
            var school_areas = body.areas
            for(var i=0; i<school_areas.length; ++i){
                var ans = null
                for(var j=0; j<school_areas[i].children.length; ++j){
                    school_areas[i].children[j]['checked'] = false
                    if (school_areas[i].children[j]['name'] == '全省'){
                        ans = j
                    }
                }
                if (ans != null){
                    school_areas[i].children.splice(ans, 1)
                }
            }

            var school_special_arr = body.tags.tags.slice(0,3) // 大学特色
            for(var i=0; i<school_special_arr.length; ++i){
                school_special_arr[i]['checked'] = false
            }
            var school_special = [{
                children : school_special_arr,
                name : '大学特色'
            }]

            var school_nature_arr =  body.tags.nature   // 办学类型
            for(var i=0; i<school_nature_arr.length; ++i){
                school_nature_arr[i]['checked'] = false
            }
            var school_nature = [{
                children : school_nature_arr,
                name : '办学性质'
            }]
            
            var school_type_arr = body.tags.type // 大学类型
            for(var i=0; i<school_type_arr.length; ++i){
                school_type_arr[i]['checked'] = false
            }
            var school_type = [{
                children : school_type_arr,
                name: '大学类型'
            }]
            var school_areas_orgin = this.deepClone(school_areas)
            var school_special_orgin = this.deepClone(school_special)
            var school_nature_orgin = this.deepClone(school_nature)
            var school_type_orgin = this.deepClone(school_type)
            console.log(school_type)
            this.setData({
                tag_set : res.data[0].body,
                school_areas: school_areas,
                school_special : school_special,
                school_nature : school_nature,
                school_type : school_type,
                school_areas_orgin: school_areas_orgin,
                school_special_orgin : school_special_orgin,
                school_nature_orgin : school_nature_orgin,
                school_type_orgin : school_type_orgin,
            })
            console.log(school_areas)
        })
        this.check_user_in_database_and_navigate()
    },

    deepClone(obj){
        let _obj = JSON.stringify(obj),
            objClone = JSON.parse(_obj);
        return objClone
    },   
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.popup = this.selectComponent("#dialog"); //获取
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