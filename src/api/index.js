/**
要求:能根据接口文档定义接口请来
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise

基本要求:能根据接口文档定义接口请求函数
 */

import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'

// 设置基础路径
// const BASE = 'http://localhost:5000'
const BASE = '/api'

// 登录
//  export function reqLogin( username,password){
//     return ajax.('/login',{username,password},'POST')
//  }
// 传递的参数要根据接口文档来写, 千万不能写错, 要注意 (username, password) 与 { username, password } 要一致
export const reqLogin = (username, password) => ajax(BASE + '/login', { username, password }, 'POST')

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })

// 添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(BASE + '/manage/category/add', { categoryName, parentId }, 'POST')

// 更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(BASE + '/manage/category/update', { categoryId, categoryName }, 'POST')

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

//搜索商品分页列表(根据商品名称/商品描述)
// searchType: 搜索的类型, productName/productDesc
// 注意: 如果想要让一个变量的值作为属性名的时候要加括号 
export const reqSearchProducts = ({ searchName, searchType, pageNum, pageSize }) => ajax(BASE + '/manage/product/search', { [searchType]: searchName, pageNum, pageSize })
// Es6对象字面量
// var heat = '50%';
// var field = 'rock';
// var music = {
//     [field]: heat
// }
// console.log(music); // Object {rock: "50%"}

// 更新商品状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 修改商品
// export const reqUpdateProduct = (Product) => ajax(BASE + '/manage/product/update', Product, 'POST')

// 获取所有角色的列表
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色
export const reqAddddRoles = (roleName) => ajax(BASE + '/manage/role/add', { roleName }, "POST")

// 更新角色
export const reqUpdateRoles = (role) => ajax(BASE + '/manage/role/update', role, "POST")

// 获取所有用户的列表
export const reqUsers = () => ajax(BASE + '/manage/user/list')

// 删除用户
export const reqDeleteUsers = (userId) => ajax(BASE + '/manage/user/delete', { userId }, "POST")

// 添加&修改用户
export const reqAddOrUpdateUse = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, "POST")

//jsonp 请求的接口请求函数
export const reqWeather = (city) => {
    // 我们所有接口请求函数都要返回一个 peromise 对象
    return new Promise((resolve, reject) => { // 执行器函数
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            //如果成功了
            if (!err && data.status === 'success') {
                // 取出需要的数据
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve({ dayPictureUrl, weather })
                // console.log({ dayPictureUrl, weather })
            } else {
                //如果失败了
                message.error('获取天气信息失败!')
            }
        })
    })
}
// reqWeather('北京')

/*
jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). 本质: jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端: 通过script标签发请求, 在发请求前准备了一个用来处理响应数据的回调函数
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求经过处理产生结果数据,并返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
 */
