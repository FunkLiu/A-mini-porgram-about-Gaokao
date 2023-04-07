// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud1
})

// 云函数入口函数
const db = wx.cloud.database()
exports.main = async (event, context) => {
    console.log('****',event.access_token)
    var options = {
        method: 'POST',
        uri: 'https://api.weixin.qq.com/tcb/databasemigrateimport?access_token='+event.access_token,
        body : {
            env : 'cloud1',
            collections: 'gaokao_oneScoreOneRank',
            file_path : '',
            file_type : 1,
            stop_on_error : false,
            confict_mode : 1
        },
        json: true
    }
}