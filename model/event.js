const { toJSON } = require('koa/lib/response')
const lodash = require('lodash')
const {
    Sequelize, Model, DataTypes
} = require('sequelize')
const { sequelize } = require('../core/db')
const { HttpExecption } = require('../core/http-execption')
const { success } = require('../lib/tip')
const { Class } = require('./calss')
const { User } = require('./user')

class Event extends Model {
    static async publishEvent(classid, openid, type = 100, eventId,target='核酸打卡') {
        if (await Class.isAdmin(classid, openid)) {
            if (!await this._isValidEventId(classid, eventId)) {
                throw new global.errs.eventIdException()
            }
            console.log(this._isValidEventId(classid, eventId))
            const members = await Class.findAll({
                where: {
                    classid
                }
            }, { raw: true })
            members.forEach(async res => {
                await Event.create({
                    classid,
                    target,
                    type,
                    memberOpenId: res.memberOpenId,
                    eventId
                })
            })
        }
        else {
            throw new global.errs.Forbidden()
        }
    }

    static async cancelEvent(classid, openid, eventId) {
        if (await Class.isAdmin(classid, openid)) {
            await Event.destroy({
                where: {
                    classid,
                    eventId,
                }
            })
            success()
        }
        else {
            throw new global.errs.Forbidden()
        }
    }

    static async getUndoMembers(classid, openid) {
        if (await Class.isAdmin(classid, openid)) {
            const members = await Event.findAll({
                raw: true,
                where: {
                    classid
                }
            })
            const temp = lodash.groupBy(members, 'eventId')
            console.log(members)
            for (let res of Object.values(temp)) {
                for (let ress of res) {
                    ress.name = await User._getUserName(ress.memberOpenId)
                    ress.id = ress.memberOpenId = ress.createdAt = ress.updatedAt = ress.deletedAt = undefined
                }
            }
            return temp
        }
        else {
            throw new global.errs.Forbidden()
        }
    }

    static async getEvent(openid) {
        const events = await Event.findAll({
            raw: true,
            where: {
                memberOpenId: openid
            }
        })
        for (let res of events) {
            res.id = res.memberOpenId = res.createdAt = res.updatedAt = res.deletedAt = undefined
        }
        return events
    }

    static async confirmEvent(classid, openid, eventId) {
        await Event.destroy({
            where: {
                classid,
                memberOpenId: openid,
                eventId
            }
        })
        success()
    }

    static async _isValidEventId(classid, eventId) {
        if (!eventId) {
            return false
        }
        const res = await Event.findOne({
            where: {
                classid,
                eventId
            }
        })
        if (res) {
            return false
        }
        else {
            return true
        }
    }
}

Event.init({
    classid: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    memberOpenId: DataTypes.STRING,
    answer: DataTypes.STRING,
    target:DataTypes.STRING,
    eventId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    tableName: 'event'
})

module.exports = { Event }