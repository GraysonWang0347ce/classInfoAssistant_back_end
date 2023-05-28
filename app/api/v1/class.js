const Router = require('koa-router')
const { HttpExecption } = require('../../../core/http-execption')
const { isLogin } = require('../../../middleware/isLogin')
const { Class } = require('../../../model/calss')
const router = new Router({
    prefix: '/v1/class'
})

router.post('/', isLogin, async ctx => {
    const status = parseInt(ctx.request.query.status)          //查询参数，/v1/class?ststus=xxx&classid=xxx,status == 100为创建，200为加入，300为退出
    const classid = ctx.request.query.classid
    const openid = ctx.request.header['x-wx-openid']
    switch (status) {
        case 100:
            await Class.createClass(openid, classid)
            break;
        case 200:
            await Class.joinClass(openid, classid)
            break;
        case 300:
            await Class.quitClass(openid, classid)
        default:
            throw new HttpExecption(msg = 'Invalid status code', code = 400)
    }
})

router.get('/latest', async ctx => {
    const openid = ctx.request.header['x-wx-openid']
    ctx.body = await Class.getClass(openid)
})

router.post('/delete', async ctx => {
    const tarName = ctx.request.body.tarName
    const aliyas = ctx.request.body.aliyas
    const originOpenId = ctx.request.header['x-wx-openid']
    const classid = ctx.request.query.classid
    await Class.deleteMember(classid, tarName, originOpenId, aliyas)
})

router.post('/promote', async ctx => {     // /class/promote?status=xxx&classid=xxx status == 1为提高权限 , prompteOpenid,OriginOpenId in body
    const status = ctx.request.query.status
    const classid = ctx.request.query.classid
    const creatorOpenId = ctx.request.header['x-wx-openid']
    const tarName = ctx.request.body.tarName
    const aliyas = ctx.request.body.aliyas
    await Class.promote(classid, creatorOpenId, tarName, status, aliyas)
})

module.exports = router