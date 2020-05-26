import React, { PureComponent } from 'react'
// 导入 antd 组件
import { Form, Input, Tree } from 'antd'
// 类型校验
import ReactTypes from 'prop-types'
import menuList from '../../config/menuConfig.js'
const { TreeNode } = Tree;

// 添加分类的form组件
export default class AddForm extends PureComponent { 
    formRef = React.createRef();

    static contextTypes = {
        role: ReactTypes.object
    }

    UNSAFE_componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList) // 放在这里面的好处 是 只 渲染一次
    }

    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => { // 第一个参数为 遍历累积的回调函数

            pre.push(
                <TreeNode title={item.title} key={item.key} >
                    {item.children ? this.getTreeNodes(item.children) : null}  {/*判断是否有子级, 有的话递归*/}
                </TreeNode>
            )

            return pre // 每一个遍历最终都要 返回 pre, 这个pre的初始值是一个空数组, 但是在返回之前要先赛一个 结构
        }, []) // 第二个参数为初始的 [], 因为最重要生成一个新的数组
    }

    constructor(props) {
        super(props)
        // 根据传入的角色的menus生成初始状态
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    render() {
        console.log('authform')
        const { role } = this.props
        const { checkedKeys } = this.state

        // 指定Item布局的配置对象, 会约束所有 Item
        const formItemLayout = {
            labelCol: { span: 4 }, // 左侧label的宽度
            wrapperCol: { span: 15 }, // 指定右侧包裹的宽度
        };

        return (
            <Form ref={this.formRef} initialValues={{ role: role.name }}>

                <Form.Item label="角色名称" name='role' {...formItemLayout} disabled >
                    <Input />
                </Form.Item>

                <Tree
                    checkable
                    defaultExpandAll={true} // 展开所有树节点
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>

                </Tree>

            </Form>
        )
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // console.log('nextProps', nextProps)
        const { name, menus } = nextProps.role // 接收到最新的 parentId
        this.onFill(name)

        // 根据最新role来更新checkedKeys状态
        this.setState({ checkedKeys: menus })
        // this.state.checkedKeys = menus // 等同于 this.setState({ checkedKeys: menus }), 但是在平常事件回调函数中不能这样写
    }

    // 动态更新数据
    onFill = (name) => { this.formRef.current.setFieldsValue({ role: name }) }; //数据域进行控制

    // 选中某个node 时的回调
    onCheck = checkedKeys => {
        // console.log('onCheck', checkedKeys)
        // 更新 checkedKeys 状态
        this.setState({ checkedKeys })
    };

    // 为父组件提供 获取 最新mdenus数据的方法
    getMenus = () => this.state.checkedKeys

}

