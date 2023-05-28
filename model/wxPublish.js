const { Class } = require('./calss')
const { User } = require('./user')
const axios = require('axios').default

class PublishMsg {
    static async publishMsg(classid, dueTime, target) {
        var failPerson = []
        const users = await Class.findAll({
            raw: true,
            where: {
                classid
            }
        })
        for (let res of users) {
            var tempName = await User._getUserName(res.memberOpenId)
            // const ress = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx4177c532bd16624c&secret=d502e2aed0ae3cd27bccc4587dad4406')
            // const token = ress.data.access_token
            const result = await axios({
                method: 'post',
                url: 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send',  //非云托管环境，云托管不用token
                data: {
                    "touser": res.memberOpenId,
                    "template_id": "ftVKNuGz2hIqvNrZ0OGD2mb7NXTFs8FfUBWPuSAaErw",
                    "page": "pages/form/index",
                    "data": {
                        "thing2": {
                            "value": target
                        },
                        "time4": {
                            "value": dueTime
                        },
                        "thing6": {
                            "value": classid
                        }
                    },
                    "miniprogram_state": "formal"
                }
            })
            console.log(result)
            if (result.data.errcode) {
                failPerson.push(tempName)
            }
            //console.log(failPerson)
        }
        // console.log('final' + failPerson)
        return failPerson
    }

    static _tranDate(dueTime) {
        const date = new Date(dueTime)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        return `${year}年${month}月${day}日${hour}时${minute}分`
    }
}

module.exports = { PublishMsg }