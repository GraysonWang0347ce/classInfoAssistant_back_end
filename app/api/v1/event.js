const Router = require('koa-router')
const { HttpExecption, publishEventException } = require('../../../core/http-execption')
const { success } = require('../../../lib/tip')
const { Event } = require('../../../model/event')
const { PublishMsg } = require('../../../model/wxPublish')
const router = new Router({
    prefix: '/v1/event'
})

router.post('/publish', async ctx => {     // v1/event/publish?classid=xxx&eventid=xxx&type=xxx
    const classid = ctx.request.query.classid
    const eventId = ctx.request.query.eventid
    const type = parseInt(ctx.request.query.type)
    const openid = ctx.request.header['x-wx-openid']
    const dueTime = ctx.request.body.duetime
    const target = ctx.request.body.target
    await Event.publishEvent(classid, openid, type, eventId,target)
    const failpp = await PublishMsg.publishMsg(classid, dueTime, target)
    ctx.body = {failpp}
})

router.post('/publish/cancel', async ctx => {      // v1/event/publish/cancel?classid=xxx&eventid=xxx
    const classid = ctx.request.query.classid
    const eventId = parseInt(ctx.request.query.eventid)
    const openid = ctx.request.header['x-wx-openid']
    await Event.cancelEvent(classid, openid, eventId)
})

router.get('/getUndo', async ctx => {        // v1/event/getUndo?eventid=xxx
    const openid = ctx.request.header['x-wx-openid']
    const classid = ctx.request.query.classid
    ctx.body = await Event.getUndoMembers(classid, openid)
})

router.get('/get', async ctx => {
    const openid = ctx.request.header['x-wx-openid']
    ctx.body = await Event.getEvent(openid)
})

router.post('/confirm', async ctx => {      // v1/event/confirm?eventId=xxx
    const openid = ctx.request.header['x-wx-openid']
    const classid = parseInt(ctx.request.query.classid)
    const eventId = ctx.request.query.eventId
    await Event.confirmEvent(classid, openid, eventId)
})

module.exports = router