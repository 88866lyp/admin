import React, { Component } from 'react'
import { Card, Button, Modal, Table, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../utils/constants'
import LinkButton from '../../components/link-button/index'
import { reqUsers, reqDeleteUsers, reqAddOrUpdateUse } from '../../api'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import UserForm from './user-form'
//用户路由
export default class User extends Component {

    state = {
        users: [], // 所有的用户列表
        roles: [], // 所有角色列表
        isShow: false, // 标识是否显示确认框
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render: (role_id) => this.state.roles.find(role => role_id === role_id).name // 这样效率低, 每一个都要算一遍
                render: (role_id) => this.roleNames[role_id] // 有一个对象 roleNames, key 为 role_id, value为name, 角色_id:名称 这是对象字面量的方式创建对象
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                )
            },

        ]
    }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    render() {
        const { users, isShow, roles } = this.state
        const user = this.user || {}
        const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button> // 最顶层的button按钮

        return (
            <Card title={title}>
                <Table
                    bordered //边框
                    rowKey='_id' // 
                    dataSource={users} //获取的用户列表
                    columns={this.columns} //title
                    pagination={{ defaultPageSize: PAGE_SIZE }} //每页显示多少条数据
                />
                <Modal
                    title={user._id ? '修改用户' : "添加用户"}
                    visible={isShow} //显示/隐藏model框
                    onOk={this.addOrUptdateUser} //添加或更新用户
                    onCancel={() => {
                        this.setState({ isShow: false })
                        this.formRef.current.resetFields()
                    }} //隐藏model框 
                >
                    <UserForm setformRef={(formRef) => { this.formRef = formRef }}
                        roles={roles}
                        user={user}
                    />
                </Modal>
            </Card>
        )
    }

    componentDidMount() {
        this.getUsers()
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    // 根据role的数组,生成包含所有角色名的对象(属性名用角色id值)
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        // 保存
        this.roleNames = roleNames
    }

    // 删除用户
    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                const resule = await reqDeleteUsers(user._id)
                if (resule.status === 0) {
                    message.success('删除用户成功')
                    this.getUsers()
                }
            }
        })
    }

    // 创建/修改用户
    addOrUptdateUser = async () => {
        this.setState({ isShow: false })
        // 收集数据
        const user = this.formRef.current.getFieldsValue()
        this.formRef.current.resetFields();
        // 如果是更新, 需要给user指定_id
        if (this.user) {
            user._id = this.user._id
        }
        // 提交添加的请求
        const result = await reqAddOrUpdateUse(user)
        if (result.status === 0) {
            // 3. 重新显示列表
            message.success(`${this.user ? '修改' : '添加'}用户成功`)
            // 更新列表显示/根据返回信息
            this.getUsers()
        }
    }

    // 显示添加界面
    showAdd = () => {
        this.user = null
        // 去除前面保存的user
        this.setState({ isShow: true })
    }

    //显示修改页面
    showUpdate = (user) => {
        this.user = user // 保存 user, 取其中的 用户名作为  添加/更新 的标识
        this.setState({ isShow: true })
    }











}
