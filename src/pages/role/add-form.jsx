import React, { Component } from 'react'
// 导入 antd 组件
import { Form, Input } from 'antd'
// 类型校验
import ReactTypes from 'prop-types'

// 添加角色的form组件
export default class AddForm extends Component {
    formRef = React.createRef();

    static contextTypes = {
        setformRef: ReactTypes.func
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

        return (
            <Form ref={this.formRef} initialValues={{ roleName: '' }}>

                <Form.Item label="角色名称" name='roleName' rules={[{ required: true, message: "角色名称必须输入" }]} {...formItemLayout}>
                    <Input placeholder='请输入角色名称'></Input>
                </Form.Item>

            </Form>
        )
    }
}

