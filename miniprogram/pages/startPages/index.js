// pages/startPages/index.js

Page({

    /**
     * 页面的初始数据
     */
    data:{
        from_my_page: false,

        open_id : "",

        year : "", // 当前的年份
        collecting : true,
        is_display : false,
        is_gaokao : true, // 选择高考为true, 反之分科为false
        id_array : ['11', '12', '13', '14', '15', '21', '22', '23', '31', '32', '33', '34', '35', '36', '37', '41', '42', '43', '44', '45', '46', '50', '51', '52', '53', '54', '61', '62', '63', '64', '65'], // 省份的id数组
        province_array :['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'], // 省份名称
        province_index : "",
        province_id : '11',
        config : "", // 配置
        province_type: "",

        special_province: ['11','12','31'], // 实行本科批和专科分开的省份

        gaokao_type : "",
        
        max_score : 750, // 其实可以设置为""的
        show_limit : '',

        all_subject : ['物理','历史','化学','生物','地理','政治','信息'], // 全部学科
        show_subject : "", // 展示的学科
        marked_subject : "",

        score : '', // 分数
        rank: '', // 排名

        user_infor: { // 用户填写的信息
          open_id: "",
          type : "",   // 表示咨询类型,1-高考,2-分科
          province_id : "",
          province_type : "",
          choose_subject : {
            primary_subject : "", // 有了，这是多余的
            optinal_subject : "" 
          },
          score : '',
          rank : ""
        }
    },

    province_choose:function(e){ // 选择省份
      var d = this.data

      this.setData({ // 设置数据
        province_index: e.detail.value,
        province_id: d['id_array'][e.detail.value],
      })
      
      var province_id = d.id_array[e.detail.value]
      var t = d['config']['data'][province_id][d['year']] // 配置科类
      var type = []
      for(var i=0; ; ++i){
        i = String(i);
        if (i in t){
          if (i == 0){
            t[i]['checked'] = true //默认选中第一个
          }
          else{
            t[i]['checked'] = false 
          }
          type.push(t[i])
        }else{
          break
        }
      }

      this.setData({ // 设置高考省份的种类
        province_type: type
      })

      console.log('选择省份',e.detail.value,this.data['province_id'])
      console.log(d['province_type'])

      // 设置高考最大分数限制
      const db = wx.cloud.database() // 连接到数据库

      var research_limit = { // 查询条件
        type : String(t[0]['id']), // 转化为string
        year: d.year,
        province_id : d.province_id
      }

      console.log(research_limit)

      db.collection('gaokao_oneScoreOneRank').where(research_limit).get().then(res=>{
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        console.log('数据获取成功:',res.data)
        var max_one = 0
        for(var j=0; j<res.data.length; ++j){
          var mark_arr = (res.data[j].data.list[0].score).split("-")
          for (var i=0, len=mark_arr.length; i<len; ++i){
            max_one = Math.max(max_one, Number(mark_arr[i]))
          }
      }
        console.log(max_one)
        this.setData({
          max_score: max_one,
          show_limit: '(0-' + String(max_one) + ')'
        })
      })

      // 设置高考选课类型
      var show_subject = ""
      if(research_limit.type == '2073' || research_limit.type == '2074'){
        show_subject = d.all_subject.slice(2,6) // 只用选择2到6
      } else if (research_limit.type == '3'){ // 综合科目
        if (d.province_array[d.province_index] == '浙江'){
          show_subject = d.all_subject.slice(0,7)
        } else{
          show_subject = d.all_subject.slice(0,6)
        }
      } else{
        show_subject = ""
      }
      console.log(show_subject)
      if (show_subject != ""){  // 不为空时
        for(var i=0; i<show_subject.length; ++i){ // 改变
          show_subject[i] = {
            subject : show_subject[i],
            checked : false
          }
        }
        
      }
      this.setData({
        show_subject : show_subject
      })
    },

    subject_explain_gaokao:function(e){
      console.log(e)
      console.log(e.detail.value)
      var d = this.data
      var ty = String(d.province_type[0].id)

      var show_subject = d.show_subject
      var new_index = "" 
      
      for(var j = 0; j<show_subject.length; ++j){
        show_subject[j].checked = false 
        for(var i = 0; i<e.detail.value.length; ++i){
          if(show_subject[j].subject == e.detail.value[i]){
            show_subject[j].checked = true 
            if (i == e.detail.value.length -1){
              new_index = j
            }
            break
          }
        }
      }

      if(ty == '2073' || ty == '2074'){
        if(e.detail.value.length  > 2){
          wx.showToast({
            title: '最多选择2个科目',
            icon : 'none',
            duration : 1000
          })
          show_subject[new_index].checked = false // 最新的元素为false
        }
      } else if (ty == '3'){
        if(e.detail.value.length  > 3){
          wx.showToast({
            title: '最多选择3个科目',
            icon : 'none',
            duration : 1000
          })
          show_subject[new_index].checked = false // 最新的元素为false
        }
      }

      this.setData({ // 重置元素
        show_subject: show_subject
      })
    },

    score_to_rank: function(e){
      var s = e.detail.value
      var d = this.data

      console.log(s)
      if (isNaN(s)){
        return
      }
      if (Number(s) > Number(d.max_score)){ // 数字大于最高分
        s = d.max_score
      }
      this.setData({ // 把高考分数收入
        score: s
      })

      var type = "" 
      for(var i=0; i< d.province_type.length; ++i){
        if (d.province_type[i].checked){
          type = d.province_type[i].id 
        }
      }
      
      var line_type = '3' // 只需要关注综合分数线
      if (d.special_province.indexOf(d.province_id) != -1){
        line_type = '1' // 只关注本科批次
      }

      const db = wx.cloud.database()
      var research_limit = { // 查询条件
        line_type: line_type ,
        type : String(type), // 转化为string
        year: d.year,
        province_id : d.province_id
      }
      console.log(research_limit)
      db.collection('gaokao_oneScoreOneRank').where(research_limit).get().then(res=>{
        for(var i=0; i<res.data.length; ++i){
          var dict = res.data[i].data.search
          var score_string = d.score
          console.log(score_string)
          if (score_string in dict){
            var rank = dict[score_string].total
            this.setData({
              rank: rank
            })
            console.log(rank)
            break
          }
        }
      })

      return {
        value : d.score
      }
    },

    input_rank: function(e){
      this.setData({
        rank: e.detail.value
      })
    },

    type_explain:function(e){ // 一般不同科类的分数是一样的,这里不需要在设置了
      console.log('当前为',e.detail.value)
      var t_p = this.data.province_type
      for (let i = 0, len = t_p.length; i < len; ++i) {
        t_p[i].checked = (t_p[i].id == e.detail.value)
      }

      this.setData({
        province_type : t_p,
        score: '',
        rank: ''
      })
      console.log(t_p)
    },
 
    makeSure:function(){ // 保证页面的执行
      var d = this.data 
      
      console.log(d)
      if (d.is_gaokao){ // 选择高考
        var ty = String(d.province_type[0].id) 
        var show_subject = d.show_subject
        if(ty == '2073' || ty == '2074'){ // 新高考
          var res = ''
          var count = 0 // 选择科项
          for(var i=0; i<show_subject.length; ++i){
            if(show_subject[i].checked){
              count += 1
            }
          }
          if (count != 2){
            res += '必须选择2科\n'
          }   
           // 分数和排名界定
          if (d.score == ""){
            res += '未填写分数\n'
          }
          if (d.score == ""){
            res += '未填写排名'
          }
          if (res != ''){
            wx.showToast({
              title: res,
              icon : 'none',
              duration : 1000
            })
            return
          }
        } else if (ty == '3'){ // 综合科目
          var res = ''
          var count = 0 // 选择科项
          for(var i=0; i<show_subject.length; ++i){
            if(show_subject[i].checked){
              count += 1
            }
          }
          if (count != 3){
            res += '必须选择3科\n'
          }    
           // 分数和排名界定
          if (d.score == ""){
            res += '未填写分数\n'
          }
          if (d.score == ""){
            res += '未填写排名'
          }
          if (res != ''){
            wx.showToast({
              title: res,
              icon : 'none',
              duration : 1000
            })
            return
          }
        } else{
          var res = ''
          if (d.score == ""){
            res += '未填写分数\n'
          }
          if (d.score == ""){
            res += '未填写排名'
          }
          if (res != ''){
            wx.showToast({
              title: res,
              icon : 'none',
              duration : 1000
            })
            return
          }
        }
        var user_infor = { // 用户填写的信息
          open_id : d.open_id,
          type : 1,   // 表示咨询类型,1-高考,2-分科
          province_id : d.province_id,
          province_type : d.province_type, // 新高考的首选科目也在这里面了
          choose_subject : {
            optinal_subject : d.show_subject 
          },
          score : d.score,
          rank : d.rank
        }
      } else{ // 选择分科
        if (d.province_type == ""){
          wx.showToast({
            title: '必须选择省份',
            icon : 'none',
            duration : 1000
          })
          return 
        }
        var user_infor = { // 用户填写的信息
          type : 2,   // 表示咨询类型,1-高考,2-分科
          province_id : d.province_id,
          province_type : d.province_type, // 新高考的首选科目也在这里面了
          choose_subject : {
            optinal_subject : "" 
          },
          score : "",
          rank : ""
        }
      }
      this.setData({
        collecting : false,
        user_infor: user_infor
      })

      const db = wx.cloud.database()
      var doc_id = "" // 是否更新云存储的信息
      db.collection('user_infor').where({
        open_id: d.open_id
      }).get().then(res => {
        console.log('获得用户数据长度:',res.data[0])
        if (res.data.length >= 1){
           var doc_id = res.data[0]._id
          console.log('doc_id:',doc_id)
          db.collection('user_infor').doc(doc_id).set({
            data: user_infor
          })
        } else{
          db.collection('user_infor').add({
            data:  user_infor // 传入数据
          }).then(res => {
            console.log(res)
          })
        }
      })

      if (d.from_my_page == true){ // 从my_page来的
        wx.switchTab({ // 主界面
          url: '/pages/myPage/myPage'
        })
      } else{
        wx.switchTab({ // 主界面
          url: '/pages/index/index'
        })
      }
    },

    choose_gaokao:function(){ // 选择高考
      this.setData({
        is_gaokao : true,
        is_display: true
      })
      
    },

    choose_subject:function(){ // 选择分科
      this.setData({
        is_gaokao : false ,
        is_display: true
      })
    },

    getOpenID(){
      wx.cloud.callFunction({
        name: 'getOpenID', 
        complete: res => {
          console.log('用户的openid为:',res.result.openId)
          this.setData({
            open_id: res.result.openId // 赋上openId
          })
        }
      })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      
      this.getOpenID() // 必须先获取openid

      const db = wx.cloud.database() // 声明数据库

      db.collection('province_typeCheck').get().then(res=>{
        // 输出 [{ "title": "The Catcher in the Rye", ... }]
        console.log('数据获取成功:',res['data'][0]['data'])
        // 确定高考年份
        var year_arr = Object.keys(res.data[0].data.data['11'])
        var max_year = 0
        for(var i=0; i<year_arr.length; ++i){
          max_year = Math.max(max_year, Number(year_arr[i]))
        }

        this.setData({
          config: res['data'][0]['data'], // 从数据库获取配置文件
          year: String(max_year)
        })
      })

      try{
        //解构目标数据
        var pass_data = JSON.parse(decodeURIComponent(options.data))
        console.log(pass_data)
        //直接使用结构之后的数据
        
        if (pass_data == true){
          this.setData({
            from_my_page: true
          })
          return 
        }
      } catch{ // 直接忽略 
      }

      db.collection('user_infor').where({
        open_id : this.open_id
      }).get().then(res => {
        if(res.data.length >= 1){
          // 跳转到主界面
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
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