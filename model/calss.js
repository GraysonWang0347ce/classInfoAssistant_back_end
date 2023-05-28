const {
    Sequelize, Model, DataTypes
} = require('sequelize')
const { sequelize } = require('../core/db')
const { HttpExecption } = require('../core/http-execption')
const { success } = require('../lib/tip')
const { User } = require('./user')

class Class extends Model {
    static async getClass(openid) {
        const iUser = await Class.findAndCountAll({
            raw: true,
            where: {
                memberOpenId: openid
            }
        })
        iUser.class = []
        for (let key of iUser.rows) {
            const temp = await Class._getAllMembers(key.classid)
            //console.log("temp: " + temp.dataValues)
            let cid = key.classid
            var members = []
            for (let keys of temp) {
                const info = await User._getUserFullInfo(keys.memberOpenId)
                const ins = await Class.findOne({
                    where: {
                        classid: cid,
                        memberOpenId: keys.memberOpenId
                    }
                })
                if (ins && ins.permission) {
                    info.isAdmin = true
                }
                else {
                    info.isAdmin = false
                }
                info.classid = cid
                members.push(info)
            }
            iUser.class.push(members)
        }
        delete iUser.rows
        return iUser
    }

    static async deleteMember(classid, tarName, originOpenId, aliyas) {
        if (await Class.isAdmin(classid, originOpenId)) {
            const openId = await User._getOpenIdByName(tarName, aliyas)
            const beD = await Class.findOne({
                where: {
                    classid,
                    memberOpenId: openId
                }
            })
            if (beD.permission == 'admin') {
                throw new global.errs.Forbidden()
            }
            else {
                await Class.destroy({
                    where: {
                        classid,
                        memberOpenId: openId
                    }
                })
            }
            success()
        } else {
            throw new global.errs.Forbidden()
        }
    }

    static async quitClass(openid, classid) {        //退出当前班级，当创建者退出即整个班级信息都删除
        const iUser = await Class.findOne({
            where: {
                classid,
                memberOpenid: openid
            }
        })
        if (!iUser) {
            throw new global.errs.quitedException()  //鉴别重复退出
        }
        if (iUser.creatorOpenId === openid) {
            await Class.destroy({
                where: {
                    classid
                }
            })
            success()
        }
        else {
            await iUser.destroy()
            success()
        }
    }

    static async createClass(openid, classid) {
        const iClass = await Class.findOne({
            where: {
                classid
            }
        })
        if (iClass) {
            throw new global.errs.classExistExecption()
        }
        else {
            await Class.create({
                classid,
                creatorOpenId: openid,
                memberOpenId: openid,
                permission: 'admin'
            })
            success()
        }
    }

    static async joinClass(openid, classid) {
        const finder = await Class.findOne({
            where: {
                classid,
                memberOpenId: openid
            }
        })
        if (finder) {
            throw new global.errs.joinedExecption()    //鉴别重复加入
        }
        const iClass = await Class.findOne({
            where: {
                classid
            }
        })
        if (!iClass) {
            throw new global.errs.notFoundException()
        }
        else {
            await Class.create({
                classid,
                memberOpenId: openid
            })
            success()
        }
    }

    static async promote(classid, creatorOpenId, tarName, status, aliyas) {       //提升or降低等级，status == 1 为提升
        const iUser = await Class.findOne({
            where: {
                classid,
                creatorOpenId
            }
        })
        if (!iUser) {
            throw new global.errs.Forbidden()
        }
        else {
            if (status == 1) {
                const rOpenId = await User._getOpenIdByName(tarName, aliyas)
                if (!rOpenId) {
                    throw new global.errs.personNotFoundException()
                }
                const readyUser = await Class.findOne({
                    where: {
                        classid,
                        memberOpenId: rOpenId
                    }
                })
                await readyUser.update({
                    permission: 'admin'
                })
                success()
            }
            else if (status == 0) {
                const rOpenId = await User._getOpenIdByName(tarName, aliyas)
                if (!rOpenId) {
                    throw new global.errs.personNotFoundException()
                }
                const readyUser = await Class.findOne({
                    where: {
                        classid,
                        memberOpenId: rOpenId
                    }
                })
                await readyUser.update({
                    permission: ''
                })
                success()
            }
        }
    }

    static async isAdmin(classid, openid) {
        const iUser = await Class.findOne({
            where: {
                classid,
                memberOpenId: openid
            }
        })
        if (!iUser || iUser.permission != 'admin') {
            return false
        }
        else {
            return true
        }
    }

    static async _getAllMembers(classid) {
        const mates = await Class.findAll({
            raw: true,
            where: {
                classid
            }
        })
        return mates   // typeof array
    }
}

Class.init({
    classid: DataTypes.INTEGER,
    creatorOpenId: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    permission: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    memberOpenId: DataTypes.STRING
}, {
    sequelize,
    tableName: 'class'
})

module.exports = { Class }