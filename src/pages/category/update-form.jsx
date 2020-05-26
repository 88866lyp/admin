import React, { Component } from 'react'
// import PropTypes from 'prop-types' // 用这个版本会报错
import ReactTypes from 'prop-types'
import { Form, Input } from 'antd'

// 更新分类的form组件
export default class UpdateForm extends Component {

    formRef = React.createRef();  //通过 ref 获取数据域

    static contextTypes = {
        categoryName: ReactTypes.string,
        setformRef: ReactTypes.func
    }

    UNSAFE_componentWillMount() {
        this.props.setformRef(this.formRef)
    }

    onFill = (value) => { this.formRef.current.setFieldsValue({ username: value }) }; //数据域进行控制

    // 重置数据
    render() {
        const { categoryName } = this.props // 表单默认值，只有初始化以及重置时生效 initialValues={{ username: categoryName }}
        return (
            <Form ref={this.formRef} initialValues={{ username: categoryName }} onValuesChange={this.onValuesChange}>
                <Form.Item name='username' rules={[{ required: true, message: "分类名称不能为空" }]}>
                    <Input placeholder='请输入分类名称' />
                </Form.Item>
            </Form>
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps) { // 当父组件通过点击事件传递过来 categoryName 后, 通过this.formRef.current.setFieldsValue({ username: value }) 动态更新 状态
        const value = nextProps.categoryName
        this.onFill(value)
    }
    
    onValuesChange = (changedValues, allValues) => {
        const value = changedValues.username
        this.props.cc(value)
    }
}



