<template>
    <popup :showPopup="show"
           @handleClose="show = false"
           @btnCannal="show = false"
           @btnConfirm="submit"
           show-button
           title="发布公告">
        <el-form :label-width="100*$px2rem+'px'" class="form" :model="ruleForm" ref="form">
            <el-form-item label="选择栏目"
                          :rules="[{required: true, message: '请选择公告类型'}]"
                          required prop="type">
                <h-select v-model="ruleForm.type" :ds="{service: 'notice', func: 'getTypes'}">
                </h-select>
            </el-form-item>
            <el-form-item label="公告标题"
                          :rules="[{required: true, message: '标题不能为空'}]"
                          required prop="title">
                <el-input v-model="ruleForm.title" maxlength="20" placeholder="不能超过20个字"></el-input>
            </el-form-item>
            <el-form-item label="公告内容"
                          :rules="[{required: true, message: '内容不能为空'}]"
                          required prop="msg">
                <quill-editor id='toolbar-container' ref="text" v-model="ruleForm.msg" class="editor"
                              :options="quillOptions"/>
            </el-form-item>
            <el-form-item label="选择附件">
                <uploadFiles busType="Notice" @uploadOver="uploadOver"></uploadFiles>
            </el-form-item>
        </el-form>
    </popup>
</template>

<script>
    import HSelect from '../h-select';
    import uploadFiles from '../basic/upload-file';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';

    export default {
        components: {HSelect, quillEditor, uploadFiles},
        services: [ 'notice' ],
        props: {
            value: Boolean
        },
        data () {
            return {
                show: false,
                ruleForm: {
                    title: '',
                    type: '',
                    msg: '',
                    fileIds: ''
                },
                quillOptions: {
                    theme: 'snow',
                    placeholder: '请输入公告内容',
                    modules: {
                        toolbar: {
                            container: [
                                [ 'bold', 'italic', 'underline', 'strike' ], // 加粗 斜体 下划线 删除线
                                [ 'blockquote', 'code-block' ], // 引用  代码块
                                [ {header: 1}, {header: 2} ], // 1、2 级标题
                                [ {list: 'ordered'}, {list: 'bullet'} ], // 有序、无序列表
                                [ {script: 'sub'}, {script: 'super'} ], // 上标/下标
                                [ {indent: '-1'}, {indent: '+1'} ], // 缩进
                                // [ {size: [ 'small', false, 'large', 'huge' ]} ], // 字体大小
                                // [ {header: [ 1, 2, 3, 4, 5, 6, false ]} ], // 标题
                                [ {color: []}, {background: []} ], // 字体颜色、字体背景颜色
                                // [ {font: []} ], // 字体种类
                                [ {align: []} ], // 对齐方式
                                [ 'clean' ], // 清除文本格式
                                [ 'link' ] // 链接、图片、视频
                            ]
                        }
                    }
                }
            };
        },
        methods: {
            uploadOver (idlist = []) {
                this.ruleForm.fileIds = idlist.join(',');
            },
            submit () {
                this.$refs.form.validate((valid) => {
                    if (!valid) return;
                    this.$service.notice.createNotice(this.ruleForm).then(() => {
                        this.$notifySuccess();
                        this.show = false;
                        this.$emit('create');
                    });
                });
            }
        },
        watch: {
            value (v) {
                this.show = v;
            },
            show (v) {
                this.$emit('input', v);
            }
        }
    };
</script>


<style lang="less">
    .ql-editor.ql-blank::before {
        color: #C1D9FF;
    }

    .ql-container.ql-snow {
        height: 200px;
    }

    .ql-editor {
        color: #C1D9FF;
    }

    .ql-toolbar.ql-snow, .ql-container.ql-snow {
        border: 1px solid #123A84;
    }

    .ql-toolbar .ql-stroke {
        fill: none;
        stroke: #fff;
    }

    .ql-toolbar .ql-fill {
        fill: #fff;
        stroke: none;
    }
</style>
<style scoped lang="less">
    .form {
        margin-top: 30px;
    }

    .editor {
        border: none;
    }
</style>