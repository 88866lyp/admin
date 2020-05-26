import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import './index.less'
import logo from '../../assets/images/logo.png'
// 导入数组列表 , 默认导出的可以取任何名字
import menuList from '../../config/menuConfig'
// import memoryUtils from '../../utils/memoryUtils'
// 导入 connect 
import { connect } from 'react-redux'
import { setHeaderTitle } from '../../redux/actions'
const { SubMenu } = Menu;

// 左侧导航的组件
class LeftNav extends Component {
    // 根据 menu 的数据数组生成对应的标签数组
    // 使用 map + 递归调用
    // getMenuNodes_map = (menuList) => {
    //     return menuList.map(item => {
    //#region map() 方法
    /**
     *   {
             title: '首页', // 菜单标题名称
             key: '/home', // 对应的path
             icon: 'home', // 图标名称
             isPublic: true, // 公开的
             children:[], // 可能有可能没有
         }
 
         <Menu.Item key="/home">
                <Link to='/home'>
                    <PieChartOutlined />
                    <span>首页</span>
                </Link>
        </Menu.Item>
 
        <SubMenu
                key="sub1"
                title={
                    <span>
                        <MailOutlined />
                        <span>商品</span>
                    </span>
                }
            >
            <Menu.Item/>
            <Menu.Item/>
        <SubMenu/>
     */
    //#endregion
    //         if (!item.children) {
    //             return (
    //                 <Menu.Item key={item.key}>
    //                     <Link to={item.key}>
    //                         {React.createElement(item.icon, null, null)}
    //                         <span>{item.title}</span>
    //                     </Link>
    //                 </Menu.Item>
    //             )
    //         } else {
    //             return (
    //                 <SubMenu
    //                     key={item.key}
    //                     title={
    //                         <span>
    //                             {React.createElement(item.icon, null, null)}
    //                             <span>{item.title}</span>
    //                         </span>
    //                     }
    //                 >
    //                     {this.getMenuNodes_map(item.children)}
    //                 </SubMenu>
    //             )
    //         }
    //     })
    // }

    // 判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        // 1. 如果当前用户是 admin 
        // 2. 如果当前item 是公开的
        // 3. 当前用户有此item的权限: key在没在menus中
        const { key, isPublic } = item
        const menus = this.props.user.role.menus
        const username = this.props.user.username

        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) { // 4. 如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false
    }

    // 根据 menu 的数据数组生成对应的标签数组
    // 通过 reduce + 递归调用
    getMenuNodes_reduce = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            // 如果当前用户有item对应的权限, 才需要显示对应的菜单项
            if (this.hasAuth(item)) { // 单独封装成一个函数, 判断当前用户对这个 item 有没有权限, 也就是看对应的key在没在用户的权限内
                // 向pre中添加<Menu.Item>
                if (!item.children) {
                    // 判断item是否是当前对应的item
                    if (item.key == path || path.indexOf(item.key) === 0) {
                        // 更新 redux 中的 headTitle 的状态
                        this.props.setHeaderTitle(item.title)
                    }

                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={() => this.props.setHeaderTitle(item.title)}>
                                {React.createElement(item.icon, null, null)}
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    // 查找一个与当前请求路径匹配的子Item
                    // const cItem = item.children.find(cItem => cItem.key === path)
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)

                    // console.log(cItem)
                    // 如果存在, 说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }

                    //向pre中添加<SubMenu>
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    {React.createElement(item.icon, null, null)}
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes_reduce(item.children)}
                        </SubMenu>
                    ))
                }
            }
            return pre // 当前统计的结果作为下一次的传入
        }, [])
    }

    // 在 render() 之前 拿到 openKey
    // 因为, 好处 在刷新, 还是用之前的缓存好的数据, 性能得到了提升
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes_reduce(menuList)
    }

    render() {
        // debugger
        // 得到当前请求的路由路径
        let path = this.props.location.pathname
        // console.log('render()', path)

        if (path.indexOf('/product') === 0) { // 当前请求的是商品或其子路由
            path = '/product'
        }
        // 得到需要打开菜单项的key
        const openKey = this.openKey


        return (
            <div className='left-nave'>
                <Link to='/' className="left-nave-header">
                    <img src={logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]} // 动态匹配路径,当前选中的菜单项 key 数组
                    defaultOpenKeys={[openKey]} // 初始展开的 SubMenu 菜单项 key 数组
                >
                    {
                        // this.getMenuNodes_map(menuList)
                        // this.getMenuNodes_reduce(menuList)
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}
/**
 * withRouter 高阶组件:
 * 包装非路由组件，返回一个新的组件
 * 新的组件向非路由组件传递3个属性: history / location / match
 */
export default connect(
    state => ({user:state.user}),
    { setHeaderTitle }
)(withRouter(LeftNav))

/* <Menu.Item key="/home">
                        <Link to='/home'>
                            <PieChartOutlined />
                            <span>首页</span>
                        </Link>
                    </Menu.Item>

                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <MailOutlined />
                                <span>商品</span>
                            </span>
                        }
                    >
                        <Menu.Item key="/category">
                            <Link to='/category'>
                                <MailOutlined />
                                <span>商品</span>
                            </Link>
                        </Menu.Item>

                        <Menu.Item key="/product">
                            <Link to='/product'>
                                <MailOutlined />
                                <span>商品管理</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu> */