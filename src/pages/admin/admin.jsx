import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
// import memoryUtils from '../../utils/memoryUtils'
import { connect } from 'react-redux'
// 导入整体页面结构
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/header/header'
// 引入路由组件
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charst/bar'
import Line from '../charst/line'
import Pie from '../charst/pie'

import NotFound from '../not-found/not-found'
const { Footer, Sider, Content } = Layout;

// 后台管理的路由组件
class Admin extends Component {
    render() {
        
        const user = this.props.user
        // 如果内存中没有存储user==> 当前没有登录
        if (!user || !user._id) {
            // 自动跳转到登录(在render()中)
            return <Redirect to='/login' />
        }

        return (
            // <div>Hello {user.username}</div>
            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <LeftNav></LeftNav>
                </Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{ margin: 30, backgroundColor: "#fff" }}>
                        <Switch>
                            <Redirect exact from='/' to="/home" />
                            <Route path="/home" component={Home} ></Route>
                            <Route path="/category" component={Category} ></Route>
                            <Route path="/product" component={Product} ></Route>
                            <Route path="/role" component={Role} ></Route>
                            <Route path="/user" component={User} ></Route>
                            <Route path="/charts/bar" component={Bar} ></Route>
                            <Route path="/charts/line" component={Line} ></Route>
                            <Route path="/charts/pie" component={Pie} ></Route>
                            <Route component={NotFound} />  {/*上面没有一个匹配, 直接显示*/}
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#ccc' }}>推荐使用谷歌浏览器,可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>
        )
    }
}

export default connect(
    state => ({ user: state.user }),
    {}
)(Admin)
