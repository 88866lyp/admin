import React, { Component } from 'react'
// 导入 antd 组件
import { Form, Select, Input } from 'antd'
// 类型校验
import ReactTypes from 'prop-types'
const Option = Select.Option

// 添加分类的form组件
export default class AddForm extends Component {
    // 通过 Form.useForm 对表单数据域进行交互。
    // 注意 useForm 是 React Hooks 的实现，只能用于函数组件，如果是在 class component 下，你也可以通过 ref 获取数据域
    // 注意 ref={this.formRef} 必须加在这里面 --> <Form ref={this.formRef} > </Form>  
    formRef = React.createRef();

    // onGenderChange = value => {
    //     this.formRef.current.setFieldsValue({ // class 创建的组建中想要动态修改 initialValues={{ parentId: parentId }} name 的值, 必须通过 this.formRef.current.func 调用相关事件
    //       note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    //     });
    //   };

    static contextTypes = {
        categorys: ReactTypes.array, //一级分类的组件
        parentId: ReactTypes.string, // 父分类的ID
        setformRef: ReactTypes.func
    }

    UNSAFE_componentWillMount() {
        this.props.setformRef(this.formRef)
    }

    render() {
        const { categorys, parentId } = this.props // 引入 父组件传递过来的数据
        return (
            // 注意: initialValues={{ parentId: parentId }} 为表单默认值，只有初始化以及重置时生效, 必须放到 From 中
            // 其中 属性名为 需要控制的 Form.Item中的 name 的属性值
            // 其中 属性值为 指定的或自定义的数据或字符串
            // onValuesChange 属性 用于 字段值更新时触发回调事件
            <Form ref={this.formRef} initialValues={{ parentId: parentId }} onValuesChange={this.onValuesChange}>

                <Form.Item name="parentId" rules={[{ required: true }]}>
                    {/* onChange={this.onCurrencyChange} 为监听事件, 被调用函数监听到数据变化后, 会动态更改 name 的属性值 */}
                    <Select onChange={this.onCurrencyChange}  >

                        <Option value='0'>一级分类</Option>
                        {
                            categorys.map(item => <Option value={item._id} key={item._id}>{item.name}</Option>)
                        }

                    </Select>

                </Form.Item>
                {/* 注意: 每个 Input 必须用 Form.Item 进行包裹, 并且如果想要 对内部数据进行控制必须添加 name 属性*/}
                <Form.Item name='categoryName' rules={[{ required: true }]}>
                    <Input placeholder='请输入分类名称'></Input>
                </Form.Item>

            </Form>
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps) { // 当父组件通过点击事件切换一级/二级分类时更新 parentId 后, 通过this.formRef.current.setFieldsValue({ parentId: value }) 动态更新 parentId 的状态
        this.onReset() // 当 parentId 更新前先把 数据清空
        const value = nextProps.parentId // 接收到最新的 parentId
        this.onFill(value)
    }

    // 动态更新数据
    onFill = (value) => { this.formRef.current.setFieldsValue({ parentId: value }) }; //数据域进行控制

    // 重置数据
    onReset = () => {
        this.formRef.current.resetFields();
    };

    onValuesChange = (changedValues, allValues) => { // 该事件用于 字段值更新时触发回调事件
        const parentId = allValues.parentId
        const categoryName = allValues.categoryName
        this.props.tt({ parentId, categoryName }) // 通过回调函数, 子向父传值, 把填入的 分类名称和添加的商品传递给父组件
    }
}

