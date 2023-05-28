const { default: axios } = require('axios')
const Router = require('koa-router')
const lodash = require('lodash')
const { HttpExecption } = require('../../../core/http-execption')
const { success } = require('../../../lib/tip')
const { User } = require('../../../model/user')
const router = new Router({
    prefix: '/v1/user'
})


router.post('/login', async ctx => {
    //console.log(ctx.request.body)
    const rUser = ctx.request.body.user
    rUser.openid = ctx.request.header['x-wx-openid']
    await User.loginOrUpdate(rUser)
})

router.post('/cancellate', async ctx => {
    const openid = ctx.request.header['x-wx-openid']
    await User.cancellate(openid)
    success()
})

//以下两接口皆为测试接口，用于脱离云托管环境获得openid

router.get('/getid', async ctx => {
    const code = ctx.request.header.code
    const res = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wx4177c532bd16624c&secret=d502e2aed0ae3cd27bccc4587dad4406&js_code=${code}&grant_type=authorization_code`)
    console.log(res)
    ctx.body = { 'tsxt': 'ok' }
})

router.get('/sendmsg', async ctx => {
    const ress = await axios.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx4177c532bd16624c&secret=d502e2aed0ae3cd27bccc4587dad4406')
    const token = ress.data.access_token
    console.log(token)
    const openid = ctx.request.header.openid
    const res = await axios({
        method: 'post',
        url: `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${token}`,
        data: {
            "touser": openid,
            "template_id": "ftVKNuGz2hIqvNrZ0OGD2mb7NXTFs8FfUBWPuSAaErw",
            "page": "pages/form/index",
            "data": {
                "thing2": {
                    "value": "核酸打卡"
                },
                "time4": {
                    "value": "2020年7月20日"
                },
                "thing6": {
                    "value": "203060302"
                }
            },
            "miniprogram_state": "developer"
        }
    })
    console.log(res)
    ctx.body = { 'tsxt': 'ok' }
})

module.exports = router
