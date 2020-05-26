import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { reqDeleteImg } from '../../api/'
import ReactTypes from 'prop-types'
import { BASE_IMG_URL } from '../../utils/constants'
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}
// 用于图片上传的组件
export default class PicturesWall extends React.Component {
    state = {
        previewVisible: false, // 标识是否显示大图预览
        previewImage: '', // 大图的url
        fileList: [  // img数组
            // {
            //     uid: '-1', // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
            //     name: 'image.png', // 文件名
            //     status: 'done', // 图片的状态 状态有：uploading done error removed 上传中、完成、失败、已删除
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png', // 图片地址
            // },
            // {
            //     uid: '-2',
            //     name: 'image.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
            // {
            //     uid: '-3',
            //     name: 'image.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
            // {
            //     uid: '-4',
            //     name: 'image.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
            // {
            //     uid: '-5',
            //     name: 'image.png',
            //     status: 'error',
            // },
        ],
    };

    // 获取判断父组件传递过来的图片类型
    static contextTypes = {
        imgs: ReactTypes.array // 不是必须的 因为有可能是添加,根本就没传, 只有修改的时候才传
    }

    constructor(props) {
        super(props)

        let fileList = []

        // 如果传入了img
        const { imgs } = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index, // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
                name: img, // 文件名
                status: 'done', // 图片的状态 状态有：uploading done error removed 上传中、完成、失败、已删除
                url: BASE_IMG_URL + img, // 图片地址
            }))
        }
        // 初始化状态
        this.state = { // 注意不要写成 setState 否则会报错 不是一个函数
            previewVisible: false, // 标识是否显示大图预览
            previewImage: '', // 大图的url
            fileList // 所有已上传图片的数组
        }
    }

    // 获取所有已上传图片文件名的数组
    getImgs = () => {
        return this.state.fileList.map(file => file.name)
    }

    // 隐藏 Modal
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        // console.log('handlePreview()', file)
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        // 显示指定的 file 对应的大图
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
        // console.log(file)
    };

    // file: 当前操作的图片文件(上传/删除)
    // fileList: 所有已上传图片文件对象的数组
    handleChange = async ({ file, fileList }) => {
        // console.log('handleChange()', file.status, file, fileList.length, file === fileList[fileList.length - 1])

        // 一旦上传成功，将当前上传的file的信息修正(name, urL)
        if (file.status === 'done') {
            const result = file.response // { status: 0, data: { name:'xxx.jpg', url:'图片地址'} }
            if (result.status === 0) {
                message.success('上传图片成功')
                // 修正图片
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
                // console.log( file.url)
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status === 'removed') { // 删除图片
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功!')
            } else {
                message.error('删除图片失败!')
            }
        }
        // 在操作(上传/删除)过程中更新fileList状态
        this.setState({
            fileList
        })
        // console.log(file)
    };

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload"  /*上传图片的接口地址 */
                    accept="image/*" /*只接收图片格式 */
                    listType="picture-card" /*卡片样式 */
                    name='image' /*发到后台的文件参数名 */
                    fileList={fileList} /*所有已上传图片文件对象的数组 */
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}