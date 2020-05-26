// 包含 n 个 action creator 函数的模块
// 同步action: 对象 {type: 'xxx' , data: 数据值}
// 异步action: 函数  dispatch => {}
import { SET_HEAD_TITLE, RECEIVE_USER, SHOW_ERROR_MSG, RESET_USER } from './action-types'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'

// 设置头部标题的同步 action 
export const setHeaderTitle = (headTitle) => ({
    type: SET_HEAD_TITLE,
    data: headTitle
})

// 接收用户信息的同步 action 
export const receiveUser = (user) => ({
    type: RECEIVE_USER,
    user
})

// 退出登录的同步 action 
export const showErrorMsg = (errorMsg) => ({
    type: SHOW_ERROR_MSG,
    errorMsg
})

// 显示错误信息的同步 action 
export const logout = () => {
    // 删除local中的user
    storageUtils.removeUser()
    // 返回action对象
    return { type: RESET_USER }
}


// 登录的 异步 action
export const login = (username, password) => {
    return async dispatch => {
        // 1. 执行异步ajax请求
        const result = await reqLogin(username, password) // {status:0,data:user}{status:1,msg:"xxx"}
        // 2. 如果成功了, 分发一个成功的同步action
        if (result.status === 0) {
            const user = result.data
            // 保存到 local 中
            storageUtils.saveUser(user)
            // 分发接收用户的同步 action
            dispatch(receiveUser(user))
        } else {// 2. 如果失败了, 分发一个失败的同步action
            const msg = result.msg
            // message.error(msg)
            dispatch(showErrorMsg(msg))
        }
    }
}