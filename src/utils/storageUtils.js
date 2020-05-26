/**
 * 进行 local 数据存储管理的工具模块
 */
// 引入这个库针对低版本的 浏览器, 另外就是语法简介
import store from 'store'

// 为保证 'user_key' 不出错, 定义一个常量
const USER_KEY = 'user_key'

export default {
    // 保存user
    saveUser(user) {
        // 注意: 内存中默认只能保存字符串类型的数据, 所以要用到 JSON.stringify(user) 转换
        // localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY, user)
    },

    // 读取user
    getUser() {
        // 注意: 获取的时候应该获取的是对象所以要用到 JSON.parse()
        // 如果取不到值返回一个空对象, 注意要加引号, 因为parse(转换的是JSON格式的字符串)
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },

    // 删除user
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }

}