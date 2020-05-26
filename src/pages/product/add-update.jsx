import React, { PureComponent } from 'react'
import { Card, Form, Input, Cascader, Button, message } from 'antd'
import LinkButton from '../../components/link-button';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { reqCategorys, reqAddOrUpdateProduct } from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor.jsx'
// import memoryUtils from '../../utils/memoryUtils';
const { TextArea } = Input;

//  Product的添加和更新的子路由组件
export default class ProductAddUpdate extends PureComponent {
    formRef = React.createRef();  //通过 ref 获取数据域
    constructor(props) {
        super(props)
        // 创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }
    state = {
        options: [],
    };

    UNSAFE_componentWillMount() {
        // 取出携带的state
        const product = this.props.location.state // 如果是添加没值,否则有值
        // const product = memoryUtils.product // 如果是添加没值,否则有值

        // 保存是否是更新的标识
        this.isUpdate = !!product // 强制转换为bool值
        // this.isUpdate = !!product._id // 强制转换为bool值 , 要根据_id判断, 否则永远是true

        // 保存商品(如果没有,保存的是{}防止报错)
        this.product = product || {}
    }
    // onFill = (value) => { this.formRef.current.setFieldsValue({ categoryIds: value }) }; //数据域进行控制
    render() {
        const { isUpdate, product } = this
        const { pCategoryId, categoryId, imgs, detail } = product
        // 用来接收级联分类的ID的数组
        const categoryIds = []
        if (isUpdate) {
            // 商品是一个一级分类的商品
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                // 商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        // 指定Item布局的配置对象, 会约束所有 Item
        const formItemLayout = {
            labelCol: { span: 2 }, // 左侧label的宽度
            wrapperCol: { span: 8 }, // 指定右侧包裹的宽度
        };

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{ marginRight: 6, fontSize: 20 }} />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        return (
            <Card title={title} >
                <Form {...formItemLayout} ref={this.formRef}
                    initialValues={{
                        name: product.name,
                        desc: product.desc,
                        price: product.price,
                        categoryIds: categoryIds
                    }}
                    onFinish={this.onFinish}
                    onFinishFailed={this.onFinishFailed}>

                    <Form.Item label="商品名称" name="name" rules={[{ required: true, message: "商品名称必须输入" }]}>
                        <Input placeholder="请输入商品名称" />
                    </Form.Item>

                    <Form.Item label="商品描述" name="desc" rules={[{ required: true, message: "商品描述必须输入" }]}>
                        <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Form.Item>

                    <Form.Item label="商品价格" name="price" rules={[{ required: true, message: "商品价格必须输入" }, { validator: this.validateprice }]}>
                        <Input type='number' placeholder="请输入商品价格" addonAfter="元" />
                    </Form.Item>

                    <Form.Item label="商品分类" name="categoryIds" rules={[{ required: true, message: "商品分类必须输入" }]}>
                        <Cascader
                            placeholder="请选择商品分类"
                            options={this.state.options} /*需要显示的列表数据数组*/
                            loadData={this.loadData} /*当选择某个列表项, 加载下一级列表的监听回调*/
                        />
                    </Form.Item>

                    <Form.Item label="商品图片">
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Form.Item>

                    <Form.Item label="商品详情" labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">提交</Button>
                    </Form.Item>

                </Form>
            </Card>
        )
    }
    componentDidMount() {
        this.getCategorys('0')
    }

    // // 在卸载之前清除保存的数据
    // componentWillUnmount() {
    //     memoryUtils.product = {}
    // }


    // 异步获取一级/二级分类列表, 并显示
    // async函数的返回值是一个新的promise对象, promise的结果和值由async的结果来决定
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId) // {status:0,data:categorys}
        if (result.status === 0) {
            const categorys = result.data
            // 如果是 一级分类列表
            if (parentId === '0') {
                this.initOptions(categorys)
            } else { // 二级列表
                return categorys // 返回二级列表 ==> 当前async函数返回的promise就会成功且value为categorys
            }
        }
    }

    initOptions = async (categorys) => {
        // 根据 categorys 生成 options 数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false, // 不是叶子
        }))

        // 如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            // 获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            //找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            // 二级分类数组有数据
            if (subCategorys && subCategorys.length > 0) {
                // 生成一个二级列表的 options 
                const childOptions = subCategorys.map(c => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }))
                // 关联当前option上
                targetOption.children = childOptions
            } else { // 当前选中的分类没有二级分类
                return subCategorys
            }
        }
        // 更新options状态
        this.setState({
            options  // 原本是个空数组, 现在是新创建的一个 options , 所以没必要解构赋值, 也会重新render
        })
    }

    // 用于加载下一级列表的回调函数
    loadData = async selectedOptions => {
        // 得到选择的option对象
        const targetOption = selectedOptions[0]
        // 显示 loading
        targetOption.loading = true
        // 根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        // 隐藏loading
        targetOption.loading = false
        // 二级分类数组有数据
        if (subCategorys && subCategorys.length > 0) {
            // 生成一个二级列表的 options 
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            // 关联当前option上
            targetOption.children = childOptions
        } else { // 当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        // 更新 options 状态
        this.setState({
            options: [...this.state.options], // 使用 PureComponent 创建的组件, 对组件的新/旧state和props中的数据进行浅比较 (只比较变量本身)
            // 如果用 options: this.state.options 这种方法, 状态不会更新, 因为改变的是 options 内部的状态
        })
    }

    // 对输入的价格进行自定义验证
    validateprice = (rule, value, callback) => {
        // console.log(value, typeof value)
        if (value * 1 > 0) {
            callback() // 验证通过
        } else {
            callback('价格必须大于0') // 验证没通过
        }
    }

    // 提交表单且数据验证成功后回调事件
    onFinish = async (values) => {
        alert('提交登录的ajax请求 ', values);

        // 1. 收集数据, 并封装成 Product 对象
        const { name, desc, price, categoryIds } = values
        let pCategoryId, categoryId
        if (categoryIds.length === 1) {
            pCategoryId = '0'
            categoryId = categoryIds[0]
        } else {
            pCategoryId = categoryIds[0]
            categoryId = categoryIds[1]
        }
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.current.getDetail()
        const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }

        // 如果是更新需要添加_id
        if (this.isUpdate) {
            product._id = this.product._id
        }

        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product)

        // 3. 根据结果提示
        if (result.status === 0) {
            message.success(`${this.isUpdate ? '更新' : '添加'}商品成功!`)
            this.props.history.goBack()
        } else {
            message.error(`${this.isUpdate ? '更新' : '添加'}商品失败!`)
        }
        // console.log(product)
        // console.log('imgs', imgs, detail)
        // console.log(values)
    };

    // 提交表单且数据验证失败后回调事件
    onFinishFailed = ({ values, errorFields, outOfDate }) => {
        console.log('检验失败 ', values);
    }
}

// 1. 子组件调用父组件的方法: 将父组件的方法以函数属性的形式传递给子组件,子组件就可以调用
// 2. 父组件调用子组件的方法: 在父组件中通过ref得到子组件标签对象(也就是组件对象),调用其方法


/**
 * 使用ref
 *  1.创建ref容器: 通常在constructor中创建 this.pw = React.createRef() ---> 创建的其实是一个容器, 再把这个容器保存到组件的 pw 属性上, 组件就有了这么一个容器属性
 *  2.将ref容器交给需要获取的标签元素:  <PicturesWall ref={this.pw} /> ---> 把创建好的容器交给指定的标签元素, 他就会自动得将这个实例标签对象添加为容器对象的current对象
 *  3.通过ref容器读取标签元素: this.pw.current ---> 容器里面以一个固定的属性 current 来存储实例标签组件, 这样我们就可以用 this.pw.current.xxx() 来访问存储的这个组件
*/



/*
1. Component存在的问题?
    1). 父组件重新render(), 当前组件也会重新执行render(), 即使没有任何变化
    2). 当前组件setState(), 重新执行render(), 即使state没有任何变化

2. 解决Component存在的问题
    1). 原因: 组件的componentShouldUpdate()默认返回true, 即使数据没有变化render()都会重新执行
    2). 办法1: 重写shouldComponentUpdate(), 判断如果数据有变化返回true, 否则返回false
    3). 办法2: 使用PureComponent代替Component
    4). 说明: 一般都使用PureComponent来优化组件性能

3. PureComponent的基本原理
    1). 重写实现shouldComponentUpdate()
    2). 对组件的新/旧state和props中的数据进行浅比较, 如果都没有变化, 返回false, 否则返回true
    3). 重写shouldComponentUpdate()返回false不再执行用于更新的render()

4. 使用 PureComponent 应该注意哪些问题?
    1). 如果只是改变状态里面的某一个内部的数据, 如果不用三点运算符进行扩展, 是不会重新渲染的

5. 面试题:
    组件的哪个生命周期勾子能实现组件优化?
    PureComponent的原理?
    区别Component与PureComponent?
 */

