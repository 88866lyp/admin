import React, { Component } from 'react'
// 导入 antd 组件
import { Form, Input, Select } from 'antd'
// 类型校验
import ReactTypes from 'prop-types'
const Option = Select.Option

// 添加角色的form组件
export default class UserForm extends Component {
    formRef = React.createRef();

    static contextTypes = {
        setformRef: ReactTypes.func,
        roles: ReactTypes.array,
        user: ReactTypes.object
    }

    UNSAFE_componentWillMount() {
        this.props.setformRef(this.formRef)
    }

    render() {
        // 指定Item布局的配置对象, 会约束所有 Item
        const formItemLayout = {
            labelCol: { span: 4 }, // 左侧label的宽度
            wrapperCol: { span: 15 }, // 指定右侧包裹的宽度
        };

        const { roles, user } = this.props

        return (
            <Form ref={this.formRef} initialValues={{
                username: user.username,
                password: user.password,
                phone: user.phone,
                email: user.email,
                role_id: user.role_id,

            }} {...formItemLayout}>

                <Form.Item label="用户名" name='username' rules={[{ required: true, message: "用户名称必须输入" }]}>
                    <Input placeholder='请输入用户名称'></Input>
                </Form.Item>

                {user._id ? null : (
                    <Form.Item label="密码" name='password' rules={[{ required: true, message: "密码必须输入" }]}>
                        <Input placeholder='请输入密码' type='password'></Input>
                    </Form.Item>
                )}

                <Form.Item label="手机号" name='phone' rules={[{ required: true, message: "手机号必须输入" }]}>
                    <Input placeholder='请输入手机号'></Input>
                </Form.Item>

                <Form.Item label="邮箱" name='email' rules={[{ required: true, message: "邮箱必须输入" }]}>
                    <Input placeholder='请输入邮箱'></Input>
                </Form.Item>

                <Form.Item label="角色" name='role_id' rules={[{ required: true, message: "邮箱必须输入" }]}>
                    <Select>
                        {
                            roles.map(role => <Option value={role._id} key={role._id} >{role.name}</Option>)
                        }
                    </Select>
                </Form.Item>

            </Form>
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const user = nextProps.user // 接收到最新的 parentId
        this.onFill(user)
    }
    // 动态更新数据
    // setFieldsValue, 为要动态修改对象的集合,不能直接写为 this.formRef.current.setFieldsValue(user) 
    // 这样存在 bug, 因为在 子页面中动态修改了表格中的数据, 即使关掉之后点击创建用户还是保留了数据, 他读取的是 const { roles, user } = this.props 这里面的user
    onFill = (user) => {
        this.formRef.current.setFieldsValue({
            username: user.username,
            password: user.password,
            phone: user.phone,
            email: user.email,
            role_id: user.role_id,
        })
    }; //数据域进行控制
}

