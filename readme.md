# classInfoAssistant 服务器文档    
## author vx：wxnybxsl
### <font color=LightSlateBlue>post:  </font><font color=Crimson>**/v1/user/login**</font>

    body：{  
        'user':{
            'name':'xxx',
            'avatarUrl':'xxx',
            'aliyas':'xxx'
        } 
    }
    header:{
        'openid':'xxx'
    }
#### 用户登录,如已登录则为更新信息  
##### 成功时返回：
    {
        'msg':'success',  
        'errorCode':0（成功）,
        'code':200
    }
***
### <font color=LightSlateBlue>post:  </font><font color=Crimson>**/v1/user/cancellate**</font>
    header:{
        'openid':'xxx'
    }
#### 注销所有信息  
##### 成功时返回：
    {
        'msg':'success',  
        'errorCode':0（成功）,
        'code':200
    }
##### 错误码：
{
    //已删除或未注册
    'msg':'No such person',
    'code': 400,
    'errorCode':10000(参数类错误)
}
***
### <font color=LightSlateBlue>post:  </font><font color=Crimson>**/v1/class?status=xxx&classid=xxx**</font>

`header：{  
      openid  
}`<br/>

#### 创建、加入或退出班级，

> status=100为创建  
status=200为加入  
status=300为退出  
##### 成功时返回：
    {
        'msg':'success',  
        'errorCode':0（成功）,
        'code':200
    }
##### 错误码：
    {
        //请求status参数不在合法范围内
        'msg':'Invalid status code',
        'code': 400,
        'errorCode':10000(参数类错误)
    }
    {
        //原始请求人不是班级创建者
        'msg':'Forbidden',
        'code': 401,
        'errorCode':10001(权限类错误)
    }
    {
        //退出时，重复退出
        'msg':'Already quited',
        'code': 400,
        'errorCode':10002(逻辑类错误)
    }
    {
        //创建时，班级已存在
        'msg':'Class already exists',
        'code': 400,
        'errorCode':10002(逻辑类错误)
    }
    {
        //加入时，重复加入
        'msg':'Already joined the class',
        'code': 400,
        'errorCode':10002(逻辑类错误)
    }
    {
        //加入时，找不到目标班级
        'msg':'No such class',
        'code': 400,
        'errorCode':10000(参数类错误)
    }
     {
        //幽灵用户（未登录但加入班级）
        'msg':'unLogin',
        'code': 401,
        'errorCode':10001(权限类错误)
    }
***
### <font color=LightSlateBlue>get:  </font><font color=Crimson>**/v1/class/latest**</font>
`header：{  
      openid  
}`<br/>
#### 获取所加入的班级信息 
##### 成功时返回：
    {
        'count':x  //共加入了x个班级
        'class':[
            [
                {
                    'name':'xxx',
                    'aliyas':'xxx',
                    'avatarUrl':'xxx',
                    'classid':xxx
                },
                {
                    'name':'xxx',
                    'aliyas':'xxx',
                    'avatarUrl':'xxx',
                    'classid':xxx
                }
            ],
            [
                {
                    'name':'xxx',
                    'aliyas':'xxx',
                    'avatarUrl':'xxx',
                    'classid':xxx
                }
            ]
        ]
    }
***
### <font color=LightSlateBlue>post:  </font><font color=Crimson>**/v1/class/promote?status=xxx&classid=xxx**</font>
    header：{  
        openid（班级创建者）
    }
    body:{
        tarName（被改变权限者）:'xxx',
        aliyas:'xxx' //两步验证防止重名 
    }
#### 提高/降低权限等级（仅创建者可用），  
> status=1为提高  
status=0为降低    
##### 成功时返回：
    {
        'msg':'success',  
        'errorCode':0（成功）,
        'code':200
    }
##### 错误码：
    {
        //原始请求人不是班级创建者
        'msg':'Forbidden',
        'code': 401,
        'errorCode':10001(权限类错误)
    }
    {
        'msg':'No such person',
        'code':400,
        'errorCode':10000(参数类错误)
    }
***
### <font color=LightSlateBlue>post:  </font><font color=Crimson>**/v1/class/delete?classid=xxx**</font>
    header：{  
        openid:'xxx'  
    }
    body:{
        tarName:'xxx',
        aliyas:'xxx', (两步认证防止重名)
    }
#### 删除班级中的某个成员 （管理员方法）
> tarName为被删除的成员姓名
> aliyas为微信昵称
> originOpenId需为管理员身份
##### 成功时返回：
    {
        'msg':'success',  
        'errorCode':0（成功）,
        'code':200
    }
##### 错误码：
    {
        //请求status参数不在合法范围内
        'msg':'Forbidden',
        'code': 401,
        'errorCode':10001(权限类错误)
    }
***
### <font color=LightSlateBlue>post:  </font><font color=Crimson>**v1/event/publish?classid=xxx&eventid=xxx&type=xxx**</font>
    header：{  
        openid  
    }
    body:{
        duetime:xxx,
        target:xxx
    }
#### 发布事件（管理员方法）
> type为事件类型，  
> 100为无需回答只需确认型（核酸打卡统计）  
> 200为地点打卡型  
> 300为需要回答型（tbd）
##### 成功时返回：
    {
        'msg':'Success',  
        'errorCode':0(成功),
        'code':200
    }
##### 错误码：
    {
        //事件id重复或为空
        'msg':'Inapproprate event id',
        'code': 400,
        'errorCode':10000(参数类错误)
    }
    {
        //非管理员操作
        'msg':'Unauthorized',
        'code': 401,
        'errorCode':10001(权限类错误)
    }
***
### <font color=LightSlateBlue>post:  </font><font color=Crimson>**v1/event/publish/cancel?classid=xxx&eventid=xxx**</font>
`header：{  
      openid  
}`<br/>
#### 清除当前班级、事件id所有人的待完成事件(管理员方法)  
##### 成功时返回：
    {
        'msg':'success',  
        'errorCode':0（成功）,
        'code':200
    }
##### 错误码：
    {
        //不能传入空的事件id
        'msg':'eventId needed',
        'code': 400,
        'errorCode':10000(参数类错误)
    }
    {
        //非管理员操作
        'msg':'Unauthorized',
        'code': 401,
        'errorCode':10001(权限类错误)
    }
***
### <font color=LightSlateBlue>get:  </font><font color=Crimson>**v1/event/getUndo?classid=xxx**</font>
`header：{  
      openid
}`<br/>
#### 获取所有未完成当前事件人物（管理员方法） 
##### 成功时返回：
    {
        xxx:[                     //xxx为eventId
            {
                classid:xxx,
                type:xxx,
                answer:'',
                eventId:'xxx',
                name:'xxx'
            }
        ]
    }
##### 错误码：
    {
        //非管理员操作
        'msg':'Unauthorized',
        'code': 401,
        'errorCode':10001(权限类错误)
    }
    {
        //未找到该用户
        'msg':'No such person',
        'code': 404,
        'errorCode':10000(参数类错误)
    }
***
### <font color=LightSlateBlue>get:  </font><font color=Crimson>**/v1/event/get**</font>
`header：{  
      openid 
}`<br/>
#### 获取该用户所有未完成事件    
##### 成功时返回： 
    {
        'count':xx    //总未完成事件数
        'rows':[
            {
                'classid':xxx,
                'type':x00,
                'answer':'xxx',
                'eventId':xxx
            }
        ]
    }
***
### <font color=LightSlateBlue>post:  </font><font color=Crimson>**/v1/event/confirm?eventId=xxx&classid=xxx**</font>
`header：{  
      openid 
}`<br/>
#### 用户确认当前事件  
##### 成功时返回：
    {
        'msg':'Comfirmed',  
        'errorCode':0（成功）,
        'code':200
    }
***





