// 能发送异步ajax请求的函数模块
// 封装axios的库
// 函数的返回值是promise对象
// 1.优化: 
//    1. 统一处理请求异常
//    思路: 通过 .then() 或 .catch() 接受异常
//    在外层包一个自己创建的 promise 对象
//    在请求出错时,不去 reject(error), 而是显示错误提示
// 2.优化:
//    异步得到不是reponse, 而是response.data
//    在请求成功resolve()时: resolve(response.data)
//    

import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = 'GET') {// 这里可以设置形参默认值 type = 'GET'

     return new Promise((resolve, reject) => { // 如果要实现 外层包裹一个promise 就可以.then了
          let promise
          //1.执行异步ajax请求
          if (type === 'GET') { //发送 GIT 请求
               promise = axios.get(url, { // 就不能 return 了, 因为要用到两个 promise 变量,所以需要在外面定义一个promise
                    params: data // 指定请求参数
               })
          } else { //发送 post 请求
               promise = axios.post(url, data)
          }
          //2.如果成功了,调用resolve(value)
          promise.then(response => {
               resolve(response.data)

               //3如果失败了,因为是统一处理请求异常,不能调用reject(reason),而是提示异常信息
          }).catch(error => {
               // reject(error) // 这时内部就不能再调用 reject() 了
               message.error('请求出错了:' + error.message) // 这样外面就不用了处理错误了,因为这里面已经处理完了
          })
     })

     // if (type === 'GET') { //发送 GIT 请求
     //      return axios.get(url, {
     //           params: data // 指定请求参数
     //      })
     // } else { //发送 post 请求
     //      return axios.post(url, data)
     // }
}