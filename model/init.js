const requireDirectory = require('require-directory')
const Router = require('koa-router')

class Init {
    static initCore(app) {
        Init.app = app
        Init.initRouters()
        Init.loadConfig()
        Init.loadHttpException()
    }

    static loadConfig(path = '') {
        const configPath = path || process.cwd() + '/config/config.js'
        const config = require(configPath)
        global.config = config
    }

    static initRouters() {
        const apiDirectory = `${process.cwd()}/app/api`
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule
        })
        function whenLoadModule(obj) {
            if (obj instanceof Router) {
                Init.app.use(obj.routes())
            }
        }
    }

    static loadHttpException() {
        const  errors  = require('../core/http-execption')
        global.errs = errors
        //console.log(global.errs)
    }
}

module.exports = Init