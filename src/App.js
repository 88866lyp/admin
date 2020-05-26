import React, { Component } from 'react'
// import '../node_modules/antd/dist/antd.css'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Admin from './pages/admin/admin'
import Login from './pages/login/login'


// 根组件
export default class App extends Component {
    render() {
        return (
            <BrowserRouter> {/* 不带#号 */}
                <Switch> {/* 只匹配其中一个 */}
                    {/* 这里不能开启精确匹配, 否则会导致组件内部匹配路由失败, 并且不报错 */}
                    {/* <Route exact path='/login' component={Login}></Route>
                    <Route exact path='/' component={Admin}></Route> */}

                    <Route path='/login' component={Login}></Route>
                    <Route path='/' component={Admin}></Route>
                </Switch>
            </BrowserRouter>

            // <HashRouter> {/* 不带#号 */}
            //     <Switch> {/* 只匹配其中一个 */}
            //         {/* 这里不能开启精确匹配, 否则会导致组件内部匹配路由失败, 并且不报错 */}
            //         {/* <Route exact path='/login' component={Login}></Route>
            //     <Route exact path='/' component={Admin}></Route> */}

            //         <Route path='/login' component={Login}></Route>
            //         <Route path='/' component={Admin}></Route>
            //     </Switch>
            // </HashRouter>
        )
    }
}
