import React, { Component } from 'react'
// 导入样式文件
import './index.less'
// 导入 日期组件
import { formateDate } from '../../utils/dateUtils'
// 导入 内存中保存的当前登录的 username
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'
// 导入 jsonp 请求的接口请求函数
import { reqWeather } from '../../api'
// 导入 withRouter
import { withRouter } from 'react-router-dom'
// 导入 数据库 menuList
import menuList from '../../config/menuConfig.js'
// 导入 modal 对话框
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
// 导入 Button 按钮
import LinkButton from '../link-button'
// 导入 connect 
import { connect } from 'react-redux'
import {logout} from '../../redux/actions'

class Header extends Component {

    state = {
        currentTime: formateDate(Date.now()), // 当前时间字符串格式, 但那这是一个固定的值
        dayPictureUrl: '', // 天气图片 url
        weather: '', // 天气文本 
    }

    render() {
        // 对 state 中的数据解构赋值
        const { currentTime, dayPictureUrl, weather } = this.state
        // 获取 登录者名称
        const username = this.props.user.username
        // 得到当前需要显示的title
        // const title = this.getTitle()
        const title = this.props.headTitle

        return (
            <div className="header">
                <div className='header-top'>
                    <span>欢迎, {username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>{title}</div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt="weather" />
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
    // 第一次 render() 之后执行一次
    // 一般在此执行异步操作: 发 ajax 请求 / 启动定时器
    componentDidMount() {
        // 获取当前时间
        this.getTime()
        // 获取当前天气
        this.getWeather()
    }

    // 退出登录
    logout = () => {
        // 显示对话框
        Modal.confirm(
            {

                title: '您确定退出后台管理系统吗?',
                icon: <ExclamationCircleOutlined />,
                onOk: () => {
                    // console.log('OK');
                    // 清除保存的 usre 数据
                    // storageUtils.removeUser()
                    // memoryUtils.user = {}
                    this.props.logout()


                    // 跳转到 login
                    // this.props.history.replace('/login')
                }
            }
        )
    }

    // 利用 setInterval(()=>{},1000) 实现循环定时器, 得到动态的时间
    getTime = () => {
        // 每隔1秒获取当前时间, 并更新状态数据 currentTime
        this.intervalId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            this.setState({ currentTime }) // 每隔1秒更新一次
        }, 1000)
    }

    // 获取天气情况的事件
    getWeather = async () => {
        // 调用接口请求异步获取数据
        const { dayPictureUrl, weather } = await reqWeather('北京')
        // 更新状态
        this.setState({ dayPictureUrl, weather })
    }

    getTitle = () => {
        // 得到当前请求路径
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.key === path) { //如果当前item对象的key 与path一样,item的title就是需要显示的title
                title = item.title
            } else if (item.children) {
                //在所有子 item 中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                // 如果有值才说明有匹配的
                if (cItem) {
                    // 取出他的title
                    title = cItem.title
                }
            }
        })
        return title
    }

    // 当前组件卸载之前调用
    componentWillUnmount() {
        // 清除定时器
        clearInterval(this.intervalId)
    }
}

export default connect(
    state => ({ headTitle: state.headTitle, user: state.user }),
    {logout}
)(withRouter(Header))
