const { HttpExecption } = require('../core/http-execption')
const config = require('../config/config')

const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        console.log(error)
        const isDev = config.environment === 'dev'
        const isHttpException = error instanceof HttpExecption
        console.log(error instanceof HttpExecption)
        if (isDev && !isHttpException) {
            throw error
        }

        if (isHttpException) {
            ctx.body = {
                msg: error.msg,
                errorCode: error.errorCode,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = error.code
        }
        else {
            ctx.body = {
                msg: '发生意外错误',
                errorCode: 9999,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = 500
        }
    }
}

module.exports = catchError