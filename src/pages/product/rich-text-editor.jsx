// 用来指定商品详情的富文本编辑器
import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs'
import draftToHtml from '../../../node_modules/draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import ReactTypes from 'prop-types'

export default class RichTextEditor extends Component {

    // 获取判断父组件传递过来的编辑器内容
    static contextTypes = {
        detail: ReactTypes.string // 不是必须的 因为有可能是添加,根本就没传, 只有修改的时候才传
    }

    state = {
        editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
    }

    constructor(props) {
        super(props)
        const html = this.props.detail
        if (html) { // 如果有值, 根据html 格式字符串创建一个对应的编辑对象
            const contentBlock = htmlToDraft(html)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.state = {
                    editorState,
                }
            }
        } else {
            this.state = {
                editorState: EditorState.createEmpty(), // 创建一个没有内容的编辑对象
            }
        }
    }

    // 输入过程中实时回调
    onEditorStateChange = (editorState) => {
        // console.log('editorState()')
        this.setState({
            editorState,
        })
    }

    getDetail = () => {
        // 返回输入数据对应的html格式的文本
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))

    }

    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/manage/img/upload')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const url = response.data.url // 得到图片地址
                    resolve({ data: { link: url } })
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }

    render() {
        const { editorState } = this.state
        return (
            <Editor
                editorState={editorState}
                editorStyle={{ border: '1px solid blacK', minHeight: 200, paddingLeft: 10 }}
                onEditorStateChange={this.onEditorStateChange}
                toolbar={{
                    image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                }}
            />
        )
    }
}

/**
 * 我用到的是一个基于react的一个插件, wysiwyg, 当时我就是在百度搜索后在 Git Hub 上找

到的一个库, 那start数量已经有几千了, 应该用起来还可以, 而且用起来还很方便, 他有相应

的文档, 有相关的例子, 当时我坐项目的时候我就参照那个文档还有例子来做的, 另外他默认

的那个图片上传的操作在他的文档里面是写的不是很详细的, 我当时还百度了一下, 最后把

问题给解决了, 下次在上我写, 有文档有网络, 肯定能搞定, 而且不会花太长时间, 我们用它主

要是根据文档, 以及demo , 如果确实根据文档和demo确定不了的事情, 就要去百度搜索,

在百度搜索的时候就一个很重要的事情, 就是关键字, 首先要把需求搞明确了, 比如说有某个

功能没出来, 那首先我就会先确认我用的是哪一个库, 文件上传的功能有一点小问题, 那这就

是关键字吗, 只要你确定了你的问题, 那你就应该, 能够确定一个相对合适的关键字, 当然有

的时候很难保证一次向命中, 不能命中, 就再换一个相关的关键字,
 *
 *
*/
