const {Sequelize,Model} = require('sequelize')
const {unset, clone, isArray} = require('lodash')
const {
    dbName,
    host,
    port,
    user,
    password
} = require('../config/config').database

const sequelize = new Sequelize(dbName,user,password,{
    dialect:'mysql',
    host,
    port,
    logging:true,
    timezone: '+08:00',
    define:{
        timestamps:true,
        paranoid:false,
        createdAt:'createdAt',
        updatedAt:'updatedAt',
    }
})

sequelize.sync({
    force:false
})

Model.prototype.toJSON= function(){
    // let data = this.dataValues
    let data = clone(this)
    unset(data, 'updatedAt')
    unset(data, 'createdAt')
    unset(data, 'deletedAt')
    unset(data, 'id')
}

module.exports = {sequelize}