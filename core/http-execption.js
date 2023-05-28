
class HttpExecption extends Error {
    constructor(msg = '服务器异常', errorCode = '0', code = 400) {
        super()
        this.errorCode = errorCode
        this.code = code
        this.msg = msg
    }
}

class classExistExecption extends HttpExecption {
    constructor() {
        super()
        this.msg = 'Class Already Exists'
        this.code = 400
        this.errorCode = 10000
    }
}

class joinedExecption extends HttpExecption {
    constructor() {
        super()
        this.msg = 'Already joined the class',
            this.code = 400
        this.errorCode = 10000
    }
}

class notFoundException extends HttpExecption {
    constructor() {
        super()
        this.msg = 'No such class',
            this.code = 400
        this.errorCode = 10000
    }
}

class personNotFoundException extends notFoundException {
    constructor() {
        super()
        this.msg = 'No such person'
    }
}

class alreadyCancallatedException extends notFoundException{
    constructor(){
        super()
        this.msg = 'Cancellated'
    }
}

class Forbidden extends HttpExecption {
    constructor() {
        super()
        this.msg = 'Forbidden',
            this.code = 401
        this.errorCode = 10001
    }
}

class eventIdException extends HttpExecption {
    constructor() {
        super()
        this.msg = 'Inappropriate event id',
            this.code = 400
        this.errorCode = 10000
    }
}

class quitedException extends HttpExecption {
    constructor() {
        super()
        this.msg = 'Already quited',
        this.code = 400
        this.errorCode = 10002
    }
}

class publishEventException extends HttpExecption {
    constructor() {
        super()
        this.msg = 'success'
        this.code = 200
        this.errorCode = 0
        this.failPeople = ''
    }
}

class unLoginError extends HttpExecption{
    constructor(){
        super()
        this.msg = 'unLogin'
        this.code = 401
        this.errorCode = 10002
    }
}




module.exports = {
    HttpExecption,
    classExistExecption,
    joinedExecption,
    notFoundException,
    Forbidden,
    personNotFoundException,
    eventIdException,
    quitedException,
    publishEventException,
    unLoginError,
    alreadyCancallatedException,
}