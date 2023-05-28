// app.js
//import regeneratorRuntime from 'regenerator-runtime'
// import{
//     Request
// }from './utils/http.js'

App({
    async onLaunch() {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力');
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                env: 'cloud1-2gl24jm1a888b4b1',
                traceUser: true,
            });
        }

        this.globalData = {
            hasLogin: false,
            hasName:false
        };

        if (wx.getStorageSync('user')) {     //开机查询是否已登录
            this.globalData.hasLogin = true
        }
        
        // Request({url:'event/get'}).then(res=>{
        //     //console.log(res)
        //     this.globalData.events = res
        // })

    },

    async call(obj, number=0){
        const that = this
        if(that.cloud == null){
          that.cloud = new wx.cloud.Cloud({
            resourceAppid: 'wx4177c532bd16624c', // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
            resourceEnv: 'prod-1gadj5n1ef1640f7', // 微信云托管的环境ID
          })
          await that.cloud.init() // init过程是异步的，需要等待 init 完成才可以发起调用
        }
        try{
          const result = await that.cloud.callContainer({
            path: '/v1/' + obj.url, // 填入业务自定义路径和参数，根目录，就是 / 
            method: obj.method||'GET', // 按照自己的业务开发，选择对应的方法
            // dataType:'text', // 如果返回的不是 json 格式，需要添加此项
            header: {
              'X-WX-SERVICE': 'koa-va3h', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
              // 其他 header 参数
            },
            data:obj.data
            // 其余参数同 wx.request
          })
          console.log(`微信云托管调用结果${result.errMsg} | callid:${result.callID}`)
          return result.data // 业务数据在 data 中
        } catch(e){
          const error = e.toString()
           // 如果错误信息为未初始化，则等待300ms再次尝试，因为 init 过程是异步的
          if(error.indexOf("Cloud API isn't enabled")!=-1 && number<3){
            return new Promise((resolve)=>{
              setTimeout(function(){
                resolve(that.call(obj,number+1))
              },300)
            })
          } else {
            throw new Error(`微信云托管调用失败${error}`)
          }
        }
      }

});