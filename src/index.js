// 入口文件
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import store from './redux/store'
// 1. 登陆后,刷新后依然是已登陆状态(维持登陆)
// 2. 登陆后,关闭浏览器后打开浏览器访问依然是已登陆状态(自动登陆)
// 3. 登陆后,访问登陆路径自动跳转到管理界面
// 一运行就把 user 保存到内存中
// import storageUtils from './utils/storageUtils'
// import memoryUtils from './utils/memoryUtils'
//读取Local中保存user,保存到内存中
// const user = storageUtils.getUser()
// memoryUtils.user = user

// 将 APP 组件标签渲染到 index 页面的div上
ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root'))




