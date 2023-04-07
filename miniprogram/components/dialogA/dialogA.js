// // components/dialog/dialog.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {},

    /**
     * 组件的初始数据
     */
    data: {
        //弹窗显示控制
        showModalStatus: false,
        // isShowDialog: false, //是否显示提示控件组件

        // 点击添加的数据
        tabData: {
            // title: '拒绝发货',
            val: ['库存', '跨境现货', '爆款', '新品'],
            toValIndex: null,
        }, //需要传递的值
    },
    /**
     * 组件的方法列表
     */
    methods: {
        //点击显示底部弹出
        changeRange: function () {
            this.showModal();
            console.log('我是弹窗打开----');
        },

        //底部弹出框
        showModal: function () {
            // 背景遮罩层
            var animation = wx.createAnimation({
                duration: 50,
                timingFunction: "linear",
                delay: 0
            })
            //this.animation = animation
            animation.translateY(50).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: true
            })
            setTimeout(function () {
                animation.translateY(0).step()
                this.setData({
                    animationData: animation.export()
                })
            }.bind(this), 50)
        },

        //点击背景面任意一处时，弹出框隐藏
        hideModal: function (e) {
            //弹出框消失动画
            var animation = wx.createAnimation({
                duration: 10,
                timingFunction: "linear",
                delay: 0
            })
            //this.animation = animation
            animation.translateY(10).step()
            this.setData({
                animationData: animation.export(),
            })
            setTimeout(function () {
                animation.translateY(0).step()
                this.setData({
                    animationData: animation.export(),
                    showModalStatus: false
                })
            }.bind(this), 10)
        },

        // 选择选项-----弹出框选择添加类型
        getValueTap(e) {
            console.log(e);
            let dialogid = e.currentTarget.dataset.dialogid;
            console.log(dialogid);
            this.setData({
                ['tabData.toValIndex']: dialogid, //更新
            })
            // var toNum = this.data.tabData.index;
        },
    },
    // 生命周期
    lifetimes: {
        ready: function () {

        },
    }
})