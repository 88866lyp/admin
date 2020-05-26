import React, { Component } from 'react'
import { Card, Table, Button, message, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './add-form'
import UpdataForm from './update-form'

// 商品分类路由
export default class Category extends Component {
    state = {
        loading: false,//是否正在获取数据中
        categorys: [], // 一级分类列表
        subCategorys: [], // 二级分类列表
        parentId: '0', // 当前需要显示的分类列表的父分类ID
        parentName: '', // 当前需要显示的分类列表的父分类名称
        showStatus: 0,// 标识 添加或更新 的确认框是否显示, 0:都不显示, 1:显示添加, 2:显示更新
    }

    // 初始化 Table所有列的数组
    initColumns = () => {
        this.columns = [  // 列的数组
            {
                title: '分类的名称',
                dataIndex: 'name', // 显示数据对应的属性名  "name": "箱包",
                key: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => ( // 返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
                    </span>
                )
            }
        ];
    }

    // 为第一次render 准备数据
    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    render() {
        // 读取状态数据
        const { categorys, loading, parentId, parentName, showStatus, subCategorys } = this.state
        // 读取指定的分类
        const category = this.category || {} // 如果还没有指定为一个空对象
        // card 的左侧
        const title = parentId === '0' ? "一级分类列表" : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <ArrowRightOutlined style={{ marginRight: 5 }} />
                <span>{parentName}</span>
            </span>
        )
        // card 的右侧
        const extra = (
            < Button type='primary' onClick={this.showAdd}>
                <PlusOutlined />
                添加
            </Button>
        )
        return (
            <div>
                <Card title={title} extra={extra} >
                    <Table
                        bordered
                        rowKey='_id'
                        loading={loading}
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        columns={this.columns}
                        pagination={{ defaultPageSize: 4, showQuickJumper: true }}
                    />
                </Card>

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        categorys={categorys}
                        parentId={parentId}
                        tt={(tt) => { this.tt = tt }}
                        setformRef={(formRef) => { this.formRef = formRef }}
                    />
                </Modal>

                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory} // 更新分类
                    onCancel={this.handleCancel}//隐藏确认框
                >
                    <UpdataForm
                        categoryName={category.name}
                        cc={(value) => { this.value = value }}
                        setformRef={(formRef) => { this.formRef = formRef }}
                    />
                </Modal>
            </div >
        )
    }

    // 执行异步任务: 发异步ajax请求
    componentDidMount() {
        // 获取一级分类列表显示
        this.getCategorys()
    }

    // 异步获取一级/二级分类列表显示
    // parentId: 如果没有指定根据状态中的parentId请求, 如果指定了根据指定的请求
    getCategorys = async (parentId) => {
        // debugger
        //再发请求前, 显示loading
        this.setState({ loading: true })
        // const { parentId } = this.state // 更改之后如下一行
        parentId = parentId || this.state.parentId
        // 发异步ajax请求, 获取数据
        const result = await reqCategorys(parentId)
        //再请求完成后, 隐藏loading
        this.setState({ loading: false })
        if (result.status === 0) {
            // 取出分类数组(一级或二级)
            const categorys = result.data
            // 更新一级分类状态
            if (parentId === '0') {
                this.setState({
                    categorys
                })
                // console.log('111')
            } else {
                // 更新二级分类状态
                this.setState({
                    subCategorys: categorys
                })
                // console.log('222')
            }
        } else {
            message.error('获取分类列表失败')
        }
    }

    // 显示指定一级分类对象的二级子列表
    showSubCategorys = (category) => {
        // 更新状态
        this.setState({
            parentId: category._id,
            parentName: category.name,
        }, () => { //在状态更新且重新 render() 后执行
            // 获取二级分类列表显示
            this.getCategorys()
        })
    }

    // 显示指定一级分类列表
    showCategorys = () => {
        // 更新显示为一级分类列表
        this.setState({
            subCategorys: [],
            parentId: '0',
            parentName: '',
        })
    }

    // 响应点击取消: 隐藏确认框
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }

    // 显示添加的确认框
    showAdd = () => {
        this.setState({
            showStatus: 1
        })
    }

    // 添加分类
    addCategory = async () => {
        // console.log('addCategory()')
        // 获取 表单中 的value 值
        const name = this.formRef.current.getFieldValue('categoryName')
        if (name !== '') {
            // 1. 隐藏确定框
            this.setState({
                showStatus: 0
            })
            // 收集数据并提交添加分类的请求
            const categoryName = this.tt.categoryName
            const parentId = this.tt.parentId
            const result = await reqAddCategory(categoryName, parentId)
            if (result.status === 0) {
                // 添加的分类就是当前分类列表下的分类
                if (parentId === this.state.parentId) {
                    // 重新获取分类列表显示
                    this.getCategorys()
                } else if (parentId === '0') { //在二级分类列表下添加一级分类列表,重新获取一级分类列表,但不需要显示一级分类列表
                    this.getCategorys('0')
                    // this.setState({ parentId: '0' }, () => { this.getCategorys() }) // 这种方法不可用, 会导致二级页面调转至一级页面
                }
            }
        }
    }

    // 显示修改确认框
    showUpdate = (category) => {
        // 保存分类对象
        this.category = category
        // 更新状态
        this.setState({
            showStatus: 2
        })
    }
    // 更新分类
    updateCategory = async () => {
        // 进行表单验证, 只有通过了才处理 nameList, options
        // console.log(this.formRef.current.getFieldValue('username'))
        // 获取 表单中 的value 值
        const name = this.formRef.current.getFieldValue('username')
        if (name !== '') {
            // 1. 隐藏确定框
            this.setState({
                showStatus: 0
            })
            // 准备数据
            const categoryId = this.category._id
            const categoryName = this.value
            // 2. 发请求更新分类
            const result = await reqUpdateCategory({ categoryId, categoryName })
            // console.log('cc', categoryId, categoryName)
            if (result.status === 0) {
                // 3. 重新显示列表
                this.getCategorys()
                // console.log(result.status)
            }
        }
    }
}
