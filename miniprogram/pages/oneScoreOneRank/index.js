// pages/oneScoreOneRank/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id_array : ['11', '12', '13', '14', '15', '21', '22', '23', '31', '32', '33', '34', '35', '36', '37', '41', '42', '43', '44', '45', '46', '50', '51', '52', '53', '54', '61', '62', '63', '64', '65'], // 省份的id数组
        province_array :['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'], // 省份名称
        province_index : null,
        year_arr: [],
        year_index: 0, // 时间当然是选择第一个
        student_type_arr: ['1','2','3','2073','2074'],
        student_type_name: ['理科','文科','综合','物理类','历史类'],
        student_type_index : null,
        level_num_arr: ['1','2','3'],
        level_arr : ['本科','专科', '不分层次'],
        level_index : null,
        level_special_province_id : ['11','12','31'], // 区分层次的省份
        
        headers : ['分数','本段人数','累计人数'],
        keys : ['score', 'num', 'total'],
        
        rows : [],
        tableConfig: {
            columnWidths: ['', '', ''],
            border: true,
            scroll: true,
        },

        data_num_per_page : 20, 
        page_index : '-',
        max_page : '-',
        page_arr : [],
        // 第一个选择是省份province_array,第二个选择是年份year_arr,第三个选择是高考类型对应student_type_name的一部分,第四个选择是层次对应的是level_arr的部分
        // 所以实际上只需要有后两者显示就可以
        show_student_type_arr: [],
        show_student_type_index : null,
        show_level_arr : [],
        show_level_index : null,
        show_index_arr : [], // 设置四行的显示索引

        config: null,
        year: null,
        open_id: null
    },

    first_page(){
      if(this.data.page_index > 0){
        this.setData({
          page_index : 0,
          show_page : this.data.rows.slice(0,this.data.data_num_per_page)
        })
      }
    },
    per_page(){
      if(this.data.page_index > 0){
        var start = (this.data.page_index-1) * this.data.data_num_per_page
        var end = start + this.data.data_num_per_page
        console.log(start, end)
        this.setData({
          page_index : this.data.page_index-1,
          show_page : this.data.rows.slice(start, end)
        })
      }
    },
    next_page(){
      if(this.data.page_index < this.data.max_page){
        var start = (this.data.page_index+1) * this.data.data_num_per_page
        var end = start + this.data.data_num_per_page
        console.log(start, end)
        this.setData({
          page_index : this.data.page_index+1,
          show_page : this.data.rows.slice(start, end)
        })
      }
    },
    last_page(){
      if(this.data.page_index < this.data.max_page){
        var start = (this.data.max_page - 1) * this.data.data_num_per_page
        var end = start + this.data.data_num_per_page
        console.log(start, end)
        this.setData({
          page_index : this.data.max_page-1,
          show_page : this.data.rows.slice(start,end)
        })
      }
    },
    page_choose(e){
      console.log(e)
      var page_index = Number(e.detail.value)
      var start = page_index * this.data.data_num_per_page
      var end = start + this.data.data_num_per_page
      console.log(start, end)
      this.setData({
        page_index : page_index,
        show_page : this.data.rows.slice(start,end)
      })
    },

    province_chang(province_index){
      this.setData({ // 首先设置省份index
        province_index : province_index
      })

      // 改变年份表格
      var c = this.data.config
      var province_id = this.data.id_array[this.data.province_index]
      var len = Object.keys(c.data[province_id]).length
      var year = Number(this.data.year) // 获得年份
      var year_arr = [] // 年份列表
      for(var i=0; i<len; ++i){
        year_arr.push(String(year - i))
      }
      this.setData({ // 设置年份列表
        year_arr : year_arr,
        year_index : 0
      })

      this.year_change(this.data.year)

    },

    year_change(year){
      var c = this.data.config
      var province_id = this.data.id_array[this.data.province_index]
      var type = c.data[province_id][year]
      var type_id = String(type[0].id) 
      var student_type_arr = this.data.student_type_arr
      var student_type_index = student_type_arr.indexOf(type_id)
      this.setData({ // 设置类型index
        student_type_index: student_type_index
      })
      
      // 改变高考类型和层次类型
      var level_index = null 
      var show_student_type_arr = null
      var show_student_type_index = 0
      var show_level_arr = []
      var show_level_index = 0

      var level_length = Object.keys(type.level).length -1
      for(var i=0 ; i<level_length; ++i){
        show_level_arr.push(type.level[String(i)].name)
      }
      level_index = this.data.level_arr.indexOf(show_level_arr[0])       

      if(type_id in ['1','2']){ // 文理分科
        show_student_type_arr = this.data.student_type_name.slice(0,2)
      } else if (type_id == '3'){ // 综合类型
        show_student_type_arr = this.data.student_type_name.slice(2,3)
      }else{ // 新高考
        show_student_type_arr = this.data.student_type_name.slice(3,5)
      }

      this.setData({
        level_index : level_index,
        show_student_type_arr: show_student_type_arr,
        show_student_type_index : show_student_type_index,
        show_level_arr: show_level_arr,
        show_level_index: show_level_index 
      })
    },

    research_table(){
      var limit = {
        province_id : this.data.id_array[this.data.province_index],
        year: this.data.year_arr[this.data.year_index] ,
        type : this.data.student_type_arr[this.data.student_type_index],
        line_type : this.data.level_num_arr[this.data.level_index]
      }
      console.log('查询要求:',limit)
      const db = wx.cloud.database()
      db.collection('gaokao_oneScoreOneRank').where(limit).get().then(res =>{
        var score_rank_data = res.data[0].data // 取出得到的数据

        // 调用解析一分一段数据的函数
        var arr = score_rank_data.list 
        var max_page = Math.ceil(arr.length/this.data.data_num_per_page)
        var page_arr = []
        for(var i=0; i<max_page; ++i){
          page_arr.push(i+1)
        }
        this.setData({
          page_index : 0,
          show_page : arr.slice(0,this.data.data_num_per_page),  // 五十为一页
          max_page : max_page,
          page_arr : page_arr,
          rows : arr
        })
      }) 
    },

    choose_province: function(e){
      var index = e.detail.value 
      // 改变省份,那么后续的所有都要变的
      if(index == this.data.province_index){// 如果没有变化就直接跳过
        console.log('改变的省份索引:',index)
        return 
      } else{
        this.province_chang(index)
        this.research_table()
      }
    },

    choose_year:  function(e){ // 改变年份要注意改变考生类型和层次类型
      var index = e.detail.value
      if(index == this.data.year_index){
        return 
      } else{
        console.log('改变的年份索引为:',index)
        this.setData({
          year_index: index
        })
        var y = this.data.year_arr[this.data.year_index]
        this.year_change(y)
        this.research_table()
      }
    },

    choose_student_type: function(e){
      var index = e.detail.value
      if(index == this.data.show_student_type_index){
        return 
      } else{
        console.log('改变的考生类型索引为:',index)
        var type_name = this.data.show_student_type_arr[index]
        var student_type_index =  this.data.student_type_name.indexOf(type_name)
        this.setData({
          student_type_index : student_type_index,
          show_student_type_index: index
        })
        this.research_table()
      }
    },

    choose_level: function(e){
      var index = e.detail.value
      if(index == this.data.show_level_index){
        return 
      } else{
        console.log('改变的层次类型索引为:',index)
        var level_name = this.data.show_level_arr[index]
        var level_index =  this.data.level_arr.indexOf(level_name)
        this.setData({
          level_index : level_index,
          show_level_index: index
        })
        this.research_table()
      }
    },

    getOpenID_and_province(){ // 获取openid同时获取省份,同时设置观看的效果
        wx.cloud.callFunction({
          name: 'getOpenID', 
          complete: res => {
            console.log('用户的openid为:',res.result.openId)
            this.setData({
                open_id: res.result.openId, // 赋上openId
            })    

            const db = wx.cloud.database()
            db.collection('user_infor').where({open_id: res.result.openId}).get().then(res =>{
                var id = res.data[0].province_id
                var index = this.data.id_array.indexOf(id)
                this.setData({
                    province_index: index, // 赋上省份index
                })
                console.log('用户省份索引为:',index)

                this.province_chang(index) // 将注释部分封装为函数
                this.research_table()

                
                // var province_id = this.data.id_array[index]
                // var c = this.data.config
                // var all_year = c.data[province_id]
                // var year_arr = [] // 有多少年的时间
                // for(var start_year= myDate.getFullYear(), i = 0; i<Object.keys(all_year).length; ++i){
                //   year_arr.push(String(start_year - i))
                // }
                // this.setData({ // 设置数据
                //   year_arr : year_arr,
                //   year_index : 0
                // })

                // var type = c.data[province_id][year] // 对应获得高考类型
                // if (Object.keys(type).length > 0){
                //   var type_id = String(type[0].id) 
                //   var student_type_arr = this.data.student_type_arr
                //   var student_type_index = student_type_arr.indexOf(type_id)
                //   this.setData({
                //     student_type_index: student_type_index
                //   })
                //   var level_index = null 
                //   var show_student_type_arr = null
                //   var show_student_type_index = 0
                //   var show_level_arr = null
                //   var show_level_index = 0
                //   if(province_id in this.data.level_special_province_id){ // 特殊省份有分层次的
                //     level_index = 0 // 默认为本科
                //     show_level_arr = this.data.level_arr.slice(0,2)
                //   } else{ // 其他的默认为不区分层次
                //     level_index = 2
                //     show_level_arr = this.data.level_arr.slice(2,3)
                //   }
                  
                //   if(type_id in ['1','2']){ // 文理分科
                //     show_student_type_arr = this.data.student_type_name.slice(0,2)
                //   } else if (type_id in ['3']){ // 综合类型
                //     show_student_type_arr = this.data.student_type_name.slice(2,3)
                //   }else{ // 新高考
                //     show_student_type_arr = this.data.student_type_name.slice(3,5)
                //   }

                //   this.setData({
                //     level_index : level_index,
                //     show_student_type_arr: show_student_type_arr,
                //     show_student_type_index : show_student_type_index,
                //     show_level_arr: show_level_arr,
                //     show_level_index: show_level_index 
                //   })

                //   // 接下来进行数据库查询,获取一分一段数据
                //   var limit = {
                //     province_id : province_id,
                //     type : this.data.student_type_arr[student_type_index],
                //     line_type : this.data.level_num_arr[level_index],
                //     year: year 
                //   }
                //   console.log('查询限制:',limit)
                //   db.collection('gaokao_oneScoreOneRank').where(limit).get().then(res =>{
                //     var score_rank_data = res.data[0].data // 取出得到的数据
                //       this.explain_SR_data(score_rank_data)// 调用解析一分一段数据的函数
                //   })
                // } 
            })
          }
        })
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const db = wx.cloud.database() // 声明数据库
        db.collection('province_typeCheck').get().then(res=>{
          // 输出 [{ "title": "The Catcher in the Rye", ... }]
          console.log('数据获取成功:',res['data'][0]['data'])
          var d = this.data
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

        this.getOpenID_and_province() // 获取openid

        var width = wx.getSystemInfoSync().windowWidth
        var w = String(parseInt(width/3)) + 'px'
        this.setData({
          tableConfig: {
            columnWidths: [w, w, w],
            border: true,
            scroll: true,
        },
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