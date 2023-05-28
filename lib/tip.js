const { HttpExecption } = require("../core/http-execption");

function success(msg='Success',errorCode=0,code=200){
    throw new HttpExecption(msg,errorCode,code)
}

module.exports = {success}