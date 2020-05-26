import React, { Component } from 'react'
import { Form, Card, Select, Input, Button, Table, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import LinkButton from '../../components/link-button'
// 接口文档的调用函数千万不要写错 resSearchProducts/reqSearchProducts
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
// import memoryUtils from '../../utils/memoryUtils'
const Option = Select.Option

//Product的默认子路由组件
export default class ProductHome extends Component {
    formRef = React.createRef();
    state = {
        loading: false, // 是否正在加载中
        total: 0, // 商品总数量
        products: [
            //#region
            // {
            //     "status": 1,
            //     "imgs": [
            //         "image-1554636776678.jpg",
            //         "image-1557738385383.jpg",
            //     ],
            //     "_id": "5ca9e05db49ef916541160cd",
            //     "name": "联想ThinkPad 翼480",
            //     "desc": "年度重量级产品,X390,T490全新登场 更加轻薄机身设计",
            //     "price": 66000,
            //     "pCategoryID": "5ca9d6c0b49ef916541160bb",
            //     "categoryId": "5ca9db78b49ef916541160ca",
            //     "detail": "<p><span> 【急速发货】Lenovo/联想 拯救者 Y7000 2019新款 九代酷睿i5 15.6英寸游戏笔记本电脑轻薄独显4G手提游戏本</span></p>",
            //     "__v": 0
            // },
            // {
            //     "status": 1,
            //     "imgs": [
            //         "image-1554636776678.jpg",
            //         "image-1557738385383.jpg",
            //     ],
            //     "_id": "5ca9e05db49ef916541160cd",
            //     "name": "联想ThinkPad 翼480",
            //     "desc": "年度重量级产品,X390,T490全新登场 更加轻薄机身设计",
            //     "price": 66000,
            //     "pCategoryID": "5ca9d6c0b49ef916541160bb",
            //     "categoryId": "5ca9db78b49ef916541160ca",
            //     "detail": "<p><span> 【急速发货】Lenovo/联想 拯救者 Y7000 2019新款 九代酷睿i5 15.6英寸游戏笔记本电脑轻薄独显4G手提游戏本</span></p>",
            //     "__v": 0
            // }
            //#endregion
        ], // 商品的数组
        searchType: 'productName', // 根据哪个字段搜索 按名称/按描述
        searchName: '', //搜索的关键字名称
    }
    
    // 初始化table表格的列的数组
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price // 当前指定了对应的属性,传入的是对应的属性值
            },
            {
                width: 100,
                title: '状态',
                // dataIndex: 'status', 如果使用status 就看不到  _id ,所有使用 product作为参数
                render: (product) => {
                    const { status, _id } = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button type="primary" onClick={() => this.updateStatus(_id, newStatus)}>{status === 1 ? "下架" : "上架"}</Button>
                            <span>{status === 1 ? "在售" : "已下架"}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            {/* 将product对象使用state传递给目标路由组件 */}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
                            {/* <LinkButton onClick={() => this.showDetail(product)}>详情</LinkButton>
                            <LinkButton onClick={() => this.showUpdate(product)}>修改</LinkButton> */}
                        </span>
                    )
                }
            },
        ];
    }

    // // 显示商品详情界面
    // showDetail = (product) => {
    //     // 缓存 product 对象=> 给 detail 对象使用
    //     memoryUtils.product = product
    //     this.props.history.push('/product/detail')
    // }
    // //显示修改商品界面
    // showUpdate = (product) => {
    //     // 缓存 product 对象=> 给 detail 对象使用
    //     memoryUtils.product = product
    //     this.props.history.push('/product/addupdate')
    // }

    UNSAFE_componentWillMount() {
        this.initColumns()
    }

    onFill = (searchType, searchName) => { this.formRef.current.setFieldsValue({ searchType: searchType, searchName: searchName }) }; //数据域进行控制

    render() {
        // 去除 状态数据
        const { products, total, loading } = this.state
        const title = (
            <Form ref={this.formRef} initialValues={{ searchType: 'productName' }} onValuesChange={this.onValuesChange} >
                <Form.Item noStyle name='searchType' rules={[{ required: true }]}>
                    <Select style={{ width: 150 }}>
                        {/* value 值千万不要在写错 ProductName/productName, ppoductDesc/productDesc */}
                        <Option value='productName'>按名称搜索</Option>
                        <Option value='productDesc'>按描述搜索</Option>
                    </Select>
                </Form.Item>
                <Form.Item name='searchName' noStyle rules={[{ required: true }]}>
                    <Input placeholder='关键字' style={{ width: 150, margin: '0 15px' }} />
                </Form.Item>
                <Button type='primary' onClick={() => { this.getProducts(1) }}>搜索</Button>
            </Form >
        )
        // onChange={event => this.setState({ searchName: event.target.value })}
        const extra = (
            <Button type='primary' onClick={() => { this.props.history.push('/product/addupdate') }}>
                <PlusOutlined />
                添加商品
            </Button>
        )

        return (
            <Card title={title} extra={extra}>
                <Table
                    loading={loading} // 页面是否加载中
                    bordered // 是否展示外边框和列边框
                    rowKey="_id" // 表格行 key 的取值，可以是字符串或一个函数
                    dataSource={products} // 数据数组
                    columns={this.columns} // 表格列的配置描述
                    pagination={{
                        current: this.pageNum, // 当前页数
                        total, // 数据总数
                        defaultPageSize: PAGE_SIZE, // 默认的每页条数
                        showQuickJumper: true, // 是否可以快速跳转至某页
                        // onChange: (pageNum) => { this.getProducts(pageNum) }
                        onChange: this.getProducts // 页码改变的回调，参数是改变后的页码及每页条数
                    }}
                />;
            </Card>
        )
    }

    componentDidMount() {
        this.getProducts(1)
    }

    // 获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum // 保存pageNum, 让其他方法可以看见
        this.setState({ loading: true }) // 显示loading
        const { searchName, searchType } = this.state
        // console.log(searchType, searchName)
        // 如果搜索关键字有值, 说明我们要做搜索分页
        let result
        if (searchName) {
            result = await reqSearchProducts({ searchType, searchName, pageNum, pageSize: PAGE_SIZE })
            // console.log('getProducts', result.data)
            // console.log('1')
        } else { // 一般分页请求
            result = await reqProducts(pageNum, PAGE_SIZE)
            // console.log('2')
        }
        this.setState({ loading: false }) // 隐藏loading
        // console.log('reqProducts', result)
        if (result.status === 0) {
            // 取出分页数据, 更新状态, 显示分页列表
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    // changedValues 指定的是单一的值
    onValuesChange = (changedValues, allValues) => {
        const searchType = allValues.searchType
        const searchName = allValues.searchName
        // this.onFill(searchType, searchName)
        // console.log('onValuesChange', searchType, searchName)
        this.setState({
            searchType: searchType,
            searchName: searchName
        }, () => {
            this.onFill(searchType, searchName)
        })
    }

    // 更新指定商品的状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            // this.getProducts(1) // 这样会导致, 更新商品后更新当前页为第一页
            this.getProducts(this.pageNum)
        }
    }
}
