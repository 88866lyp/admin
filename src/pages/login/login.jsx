import React, { Component } from 'react'
// 导入 antd
import { Form, Input, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.less'
// 导入 接口请求函数的模块
// import { reqLogin } from '../../api'
// 导入背景图片
import logo from '../../assets/images/logo.png' // react 不支持在 img标记中 直接 引入路径
// 导入 保存数据的功能模块
// import memoryUtils from '../../utils/memoryUtils'
// 导入 storageUtils 永久存储管理工具
// import storageUtils from '../../utils/storageUtils.js'
// 导入 Redirect
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { login } from '../../redux/actions'

const Item = Form.Item // 不能写在 import 之前

// 登录的路由组件
class Login extends Component {
    render() {

        // 如果用户已经登录, 自动跳转到管理界面
        // const user = memoryUtils.user
        const user = this.props.user

        if (user && user._id) {
            return <Redirect to='/home' />
        }

        // const errorMsg = this.props.user.errorMsg

        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo" />
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <div className={user.errorMsg ? 'error-msg show' : 'error-msg'}>{user.errorMsg}</div>
                    <h2>用户登录</h2>
                    <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={this.onFinish} onFinishFailed={this.onFinishFailed} >

                        <Item name="username"
                            //声明式验证：直接使用别人定义好的验证规则进行验证
                            rules={[ // 配置对象:属性名是特定的一些名称
                                { required: true, whitespace: true, message: '用户名必须输入' },
                                { min: 4, message: '用户名至少4位' },
                                { max: 12, message: '用户名最多12位' },
                                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文,数字或下划线组成' },
                            ]} >
                            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                        </Item>

                        <Form.Item name="password" rules={[{ validator: this.validatepwd }]} >
                            <Input prefix={<LockOutlined className="site-form-item-icon" />} type="password" placeholder="密码" />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                        </Form.Item>

                    </Form> 
                </section>
            </div>
        )
    }

    // 对密码进行自定义验证
    validatepwd = (rule, value) => {
        if (!value) {
            return Promise.reject('密码必须输入');
        } else if (value.length < 4) {
            return Promise.reject('密码长度不能小于4位');
        } else if (value.length > 12) {
            return Promise.reject('密码长度不能大于12位');
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return Promise.reject('密码必须是英文,数字或下划线组成');
        } else {
            return Promise.resolve();// 验证通过
        }
    }

    // 提交表单且数据验证成功后回调事件
    // 注意: 我们接口请求函数的模块没有指定基础路径, 而且是在3000的端口发送 请求, 会报404, 没有找到该页面没人处理
    // 但是 当我们配置了基础路径 const BASE = 'http://localhost:5000' 也不会成功, 因为我们是在3000的端口请求5000的端口, 请求跨域
    onFinish = (values) => {
        // console.log('提交登录的ajax请求 ', values);

        // 请求登录
        // 把传进来的值, 解构赋值
        const { username, password } = values
        // 调用分发异步action的函数 => 发登录的异步请求, 有了结果后更新状态
        // console.log(username, password)
        this.props.login(username, password)

        // #region
        // // 第三种 优化 ajax 请求函数模块, 统一处理请求异常
        // const result = await reqLogin(username, password)
        // // console.log('请求成功了', result)

        // // 实现登录请求功能
        // // const result = response.data // {status:0,data:user} {status:1,msg:'xxx'}
        // if (result.status == 0) { // 登陆成功
        //     // 提示登录成功
        //     message.success('登录成功')

        //     // 保存 user
        //     const user = result.data
        //     memoryUtils.user = user // 只是保存在内存中
        //     storageUtils.saveUser(user) // 保存到本地中

        //     // 跳转到管理页面, 不需要再回退到登录页面
        //     // history: push()带回退 replace()替换 goback()回退, 此类跳转用在事件回调中,或做一些操作的时候
        //     this.props.history.replace('/home') // 如果登陆成功就不用了回退回来了

        // } else {//登录失败
        //     // 提示错误信息
        //     message.error(result.msg)
        // }
        //#endregion

        // #region 第二种 简化promise对象, 使用 async 和 await,消灭回调函数
        // 简化promise对象的使用: 不用再使用 .then() 来指定成功/失败的回调函数, 要想消灭回调函数, 使用 async 和 await
        // try {
        //     const response = await reqLogin(username, password)
        //     console.log('请求成功了', response.data)
        // } catch (error) {
        //     alert('请求出错了' + error.message)
        // }
        //#endregion

        //#region 第一种 使用 then() 来指定成功/失败的回调函数
        // reqLogin() 函数返回的是一个 promise 对象, 所以要用 .then() 
        // reqLogin(username, password).then(response => {
        //     console.log('成功了', response.data)
        // }).catch(error => {
        //     console.log('失败了', error)
        // }) // Alt + <- 回退
        //#endregion
    };

    // 提交表单且数据验证失败后回调事件
    onFinishFailed = ({ values, errorFields, outOfDate }) => {
        console.log('检验失败 ', values);
    }
}

export default connect(
    state => ({ user: state.user }),
    { login }
)(Login)
