const {
    Sequelize, Model, DataTypes
} = require('sequelize')
const { sequelize } = require('../core/db')
const { HttpExecption } = require('../core/http-execption')
const { success } = require('../lib/tip')

class User extends Model {
    static async loginOrUpdate(user) {
        const userS = await User.findOne({
            where: {
                openid: user.openid
            }
        })
        //console.log(userS)
        if (!userS) {
            if(!user.aliyas){
                user.aliyas = user.name
            }
            await User.create(user)
            success()
        }
        else {
            await userS.update({
                name: user.name,
                avatarUrl: user.avatarUrl,
                aliyas: user.aliyas
            })
            success()
        }
    }

    static async _getUserName(tarOpenid) {
        const user = await User.findOne({
            where: {
                openid: tarOpenid
            }
        })
        if (user) {
            return user.name
        }
        else {
            throw new global.errs.personNotFoundException()
        }
    }

    static async _getUserFullInfo(tarOpenid) {
        const user = await User.findOne({
            where: {
                openid: tarOpenid
            }
        })
        if (user) {
            return {
                name: user.name,
                aliyas: user.aliyas,
                avatarUrl: user.avatarUrl
            }
        }
        else {
            return {
                name:'未注册用户',
                aliyas:"未注册用户",
                avatarUrl:''
            }
        }
    }

    static async _getOpenIdByName(tarName, aliyas) {
        const iUser = await User.findOne({
            where: {
                name: tarName,
                aliyas
            }
        })
        if (!iUser) {
            throw new global.errs.personNotFoundException()
        }
        return iUser.openid
    }

    static async cancellate(openid) {
        const { Class } = require('./calss')
        const { Event } = require('./event')
        const user = await User.findOne({
            where: {
                openid
            }
        })
        if (!user) {
            throw new global.errs.alreadyCancallatedException()
        }
        return sequelize.transaction(async t => {
            await User.destroy({
                where:{
                    openid
                }
            },{transaction:t})
            await Class.destroy({
                where:{
                    memberOpenId:openid
                }
            },{transaction:t})
            await Event.destroy({
                where:{
                    memberOpenId:openid
                }
            },{transaction:t})
        })
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    openid: {
        type: DataTypes.STRING,
        unique: true
    },
    avatarUrl: DataTypes.STRING,
    aliyas: DataTypes.STRING,
    name: DataTypes.STRING
}, {
    sequelize,
    tableName: 'user'
})

module.exports = { User }