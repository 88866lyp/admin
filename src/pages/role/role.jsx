import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
import { reqRoles, reqAddddRoles, reqUpdateRoles } from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
// import memoryUtils from '../../utils/memoryUtils'
import { formateDate } from '../../utils/dateUtils'
// import storageUtils from '../../utils/storageUtils'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'

//角色路由
class Role extends Component {

    state = {
        roles: [
            // {
            //     "menus": [
            //         "/home",
            //         "/products",
            //         "/category",
            //         "/product",
            //         "/role"
            //     ],
            //     "_id": "5e7abef6a748f315a84c7279",
            //     "name": "角色1",
            //     "create_time": 1585102582323,
            //     "__v": 0,
            //     'auth_time': 1558410638946,
            //     'auth_name': "meixi"
            // },
            // {
            //     "menus": [
            //         "/home",
            //         "/products",
            //         "/category",
            //         "/product",
            //         "/role"
            //     ],
            //     "_id": "5e7abef6a748f315a84c7273",
            //     "name": "角色2",
            //     "create_time": 1585102582323,
            //     "__v": 0,
            //     'auth_time': 1558410638946,
            //     'auth_name': "admin"
            // },
            // {
            //     "menus": [
            //         "/home",
            //         "/products",
            //         "/category",
            //         "/product",
            //         "/role"
            //     ],
            //     "_id": "5e7abef6a748f315a84c7277",
            //     "name": "角色3",
            //     "create_time": 1585102582323,
            //     "__v": 0,
            //     'auth_time': 1558410638946,
            //     'auth_name': "Cluo"
            // }
        ], // 角色数组
        role: {}, // 选中的 role
        isShowAdd: false, // 是否显示添加页面
        isShowAuth: false, // 是否显示角色权限页面
    }

    // 该方法需要在 componentWillMount 调用
    initColumn = () => { // 初始化列的函数
        this.columns = [ // 数组里面指定我有几列
            { title: '角色名称', dataIndex: 'name' },// 每一列定义成一个对象, 定义标题 title:'角色名称' 和 dataIndex: 'name'
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            { title: '授权人', dataIndex: 'auth_name' }
        ]
    }

    // 打开页面就要看到列表
    UNSAFE_componentWillMount() {
        this.initColumn()
    }

    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }

    render() {

        const { roles, role, isShowAdd, isShowAuth } = this.state

        const title = (
            <span>
                <Button type="primary" onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button>&nbsp;&nbsp;
                <Button type="primary" disabled={!role._id} onClick={() => this.setState({ isShowAuth: true })}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey='_id'
                    dataSource={roles}
                    columns={this.columns}
                    pagination={{ defaultPageSize: PAGE_SIZE }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        rowSelection: (role) => { // 选择某个radio的回调
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow={this.onRow}
                />

                <Modal
                    title="添加角色"
                    visible={isShowAdd} // 显示隐藏
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({
                            isShowAdd: false, // 隐藏 modal 框
                        })
                        this.formRef.current.resetFields();
                    }}
                >
                    <AddForm
                        setformRef={(formRef) => { this.formRef = formRef }}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth} // 显示隐藏
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({
                            isShowAuth: false, // 隐藏 modal 框
                        })
                    }}
                >
                    <AuthForm role={role} ref={this.auth} />
                </Modal>

            </Card>
        )
    }

    onRow = (role) => {
        return {
            onClick: event => { // 点击行
                // console.log('role onClick', role) //{menus: Array(0), _id: "5e886b15d5c4110a4cc6fdfd", name: "刘经理", create_time: 1585998613120, __v: 0}
                this.setState({
                    role // 点击更新 选中的 角色 _id  disabled={!role._id}更新禁用状态
                })
            }
        }
    }

    componentDidMount() {
        this.getRoles()
    }

    // 获取 角色列表
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    // 添加角色
    addRole = async () => {
        // 进行表单验证, 只能通过了才向下处理
        const roleName = this.formRef.current.getFieldValue('roleName')
        this.formRef.current.resetFields();
        if (roleName !== '') {
            // 隐藏确认框
            this.setState({
                isShowAdd: false
            })
            // 请求添加
            const result = await reqAddddRoles(roleName)
            // 根据结果提示/更新列表显示
            if (result.status === 0) {
                message.success('添加角色成功')
                // 3. 重新显示列表
                // this.getRoles()
                // 新产生的角色
                const role = result.data
                // 更新 roles 状态
                // const roles = this.state.roles // Rect 不建议这样直接操作 状态
                // roles.push(role)
                // this.setState({
                //     roles
                // })

                // 更新 roles 状态: 基于原本状态数据更新, 对象形式更新是 函数形式更新的 简写方式
                this.setState(state => ({ // 这中函数方式更新是原始的写法,  另外他还接受一个参数 props
                    roles: [...state.roles, role]
                }))

            } else {
                message.error('添加角色失败')
            }

        }
    }

    // 更新角色
    updateRole = async () => {
        // 隐藏确认框
        this.setState({
            isShowAuth: false
        })

        const role = this.state.role
        // 得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = this.props.user.username

        // 请求更新
        const result = await reqUpdateRoles(role)
        if (result.status === 0) {
            // this.getRoles()
            // 如果当前更新的是自己角色的权限, 强制退出
            if (role._id === this.props.user.role_id) {
                this.props.logout()
                // memoryUtils.user = {}
                // storageUtils.removeUser()
                // this.props.history.replace('/login')
                message.success('当前用户角色权限修改了,请重新登录!')
            } else {
                message.success('设置角色权限成功了')
                this.setState({
                    roles: [...this.state.roles]
                })
            }
        }
    }
}

export default connect(
    state => ({ user: state.user }),
    { logout }
)(Role)






