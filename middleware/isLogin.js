const { User } = require("../model/user")


const isLogin = async (ctx, next) => {
    const openid = ctx.request.header['x-wx-openid']
    const iUser = await User._getUserFullInfo(openid)
    if((iUser.name && iUser.aliyas) == '未注册用户'){
        throw new global.errs.unLoginError()
    }
    else{
        await next()
    }
}

module.exports = {isLogin}