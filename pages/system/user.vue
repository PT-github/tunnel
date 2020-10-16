<template>
    <form-page :breadcrumb="[{name:'中心首页',path:'/system'},{name:'个人中心'}]"
               :radios="userConfig"
               @radio-change="changeTab">
        <div slot="left" class="org fixed-height block">
            <div class="user-header">
                <img :src="(myUserInfo.headImage&&myUserInfo.headImage.includes('http'))?myUserInfo.headImage:('http://w7.qcxt.com:8090/upload/'+myUserInfo.headImage)"
                     alt="">
            </div>
            <div class="user-info-t">
                <div class="user-name">{{myUserInfo.name}}</div>
                <div class="state-icon" :class="[myUserInfo.status==0?'normal':'abnormal']"></div>
                <div class="status">{{myUserInfo.status==0?'正常':'异常'}}</div>
            </div>
            <div class="user-type">
                {{myUserInfo.organizationName}}
            </div>
        </div>
        <div class="org block">
            <div v-show="activeTabs===0">
                <div class="form-bg">
                    <el-form :model="ruleForm" ref="ruleForm"
                             :label-width="100*$px2rem+'px'"
                             class="demo-ruleForm">
                        <IndexTipTitle title="个人头像"></IndexTipTitle>
                        <div class="form-items">
                            <el-form-item label="上传头像" required
                                          prop='headImage'
                                          :rules="[{ required: true, message: '请上传头像'}]">
                                <uploadImg busType="userheader" v-model="ruleForm.headImage"></uploadImg>
                            </el-form-item>
                        </div>

                        <IndexTipTitle title="基本信息"></IndexTipTitle>

                        <div class="form-items">
                            <el-form-item label="姓名"
                                          :rules="[{required: true, message: '姓名不能为空'}]"
                                          required prop="name">
                                <el-input v-model="ruleForm.name"></el-input>
                            </el-form-item>

                            <el-form-item label="尊称" prop="sex">
                                <el-radio-group v-model="ruleForm.sex">
                                    <el-radio :label="0">未知</el-radio>
                                    <el-radio :label="1">先生</el-radio>
                                    <el-radio :label="2">女士</el-radio>
                                </el-radio-group>
                            </el-form-item>

                            <el-form-item label="QQ" prop="qq">
                                <el-input v-model="ruleForm.qq"
                                          placeholder="请输入QQ"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号码"
                                          :rules="[{ required: true, message: '手机号码不能为空'},
                                          { type: 'number', message: '手机号码必须为数字值'}]"
                                          required prop="mobile">
                                <el-input v-model.number="ruleForm.mobile"></el-input>
                            </el-form-item>
                            <el-form-item label="电子邮箱"
                                          :rules="[{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]"
                                          prop="email">
                                <el-input v-model="ruleForm.email"
                                          placeholder="请输入邮箱"></el-input>
                            </el-form-item>
                            <el-form-item label="微信号" prop="weChat">
                                <el-input v-model="ruleForm.weChat"
                                          placeholder="请输入微信号"></el-input>
                            </el-form-item>
                            <el-form-item label="个人说明" prop="remark">
                                <el-input type="textarea"
                                          :rows="2"
                                          placeholder="请输入个人说明"
                                          v-model="ruleForm.remark">
                                </el-input>
                            </el-form-item>
                        </div>

                        <el-form-item>
                            <el-button type="primary"
                                       class="submit"
                                       @click="submitForm('ruleForm')">保存
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div v-show="activeTabs===1">
                <div class="form-bg">
                    <el-form :model="resetPass" ref="passForm"
                             :rules="rules"
                             :label-width="100*$px2rem+'px'"
                             class="demo-ruleForm">
                        <IndexTipTitle title="正确填写新的密码"></IndexTipTitle>
                        <div class="form-items">
                            <el-form-item label="旧密码" prop="oldPassword">
                                <el-input type="password"
                                          autocomplete="off"
                                          v-model="resetPass.oldPassword"></el-input>
                            </el-form-item>
                            <el-form-item label="密码" prop="newPassword">
                                <el-input type="password" v-model="resetPass.newPassword" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="confirmNewPassword">
                                <el-input type="password" v-model="resetPass.confirmNewPassword"
                                          autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitPassForm('passForm')">提交</el-button>
                                <el-button @click="resetForm('passForm')">重置</el-button>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </div>
        </div>
    </form-page>
</template>

<script>
    import IndexTipTitle from '../../components/index/tips-title';
    import uploadImg from '../../components/basic/upload-img';

    export default {
        name: 'user',
        components: {IndexTipTitle, uploadImg},
        data () {
            const validateOldPass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                    // }else if (value !== this.myUserInfo.password) {
                    //     callback(new Error('请输入正确的旧密码'));
                } else {
                    if (this.resetPass.confirmNewPassword !== '') {
                        this.$refs.passForm.validateField('confirmNewPassword');
                    }
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                    return;
                }
                if (this.resetPass.confirmNewPassword !== '') {
                    this.$refs.passForm.validateField('confirmNewPassword');
                }
                callback();
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                    return;
                }
                if (value !== this.resetPass.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                    return;
                }
                callback();
            };
            return {
                activeTabs: 0,
                userConfig: [ {label: '个人信息'}, {label: '修改密码'} ],

                ruleForm: {
                    headImage: '',
                    name: '',
                    sex: 0,
                    qq: '',
                    mobile: '',
                    email: '',
                    weChat: '',
                    remark: ''
                },

                resetPass: {
                    oldPassword: '', //旧密码
                    newPassword: '', //新密码
                    confirmNewPassword: '' //确认密码
                },
                //密码校验规则
                rules: {
                    oldPassword: [ {required: true, validator: validateOldPass, trigger: 'blur'} ],
                    newPassword: [ {required: true, validator: validatePass, trigger: 'blur'} ],
                    confirmNewPassword: [ {required: true, validator: validatePass2, trigger: 'blur'} ]
                }
            };
        },
        services: [ 'index', 'user' ],
        events: {
            test: 'onTest'
        },
        mounted () {
            console.log(this.myUserInfo.password);
            this.ruleForm.name = this.myUserInfo && this.myUserInfo.name ? this.myUserInfo.name : null;
            this.ruleForm.mobile = this.myUserInfo && this.myUserInfo.mobile ? Number(this.myUserInfo.mobile) : null;
            this.$service.user.queryUserInfo(this.myUserInfo.userId).then(res => {
                if (res && res.mobile) {
                    res.mobile = Number(res.mobile);
                }
                this.ruleForm = res || {};
            });
            //反选
            /*let {name,sex,qq,mobile,email,weChat,remark} = this.myUserInfo
            this.ruleForm = {name,sex,qq,mobile,email,weChat,remark}*/
        },
        methods: {
            changeTab (e) {
                this.activeTabs = e;
            },
            //修改用户信息
            submitForm (formName) {
                this.$refs[ formName ].validate((valid) => {
                    if (!valid) {return false;}
                    this.$confirm('确定修改用户信息？', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        showClose: false
                    }).then(() => {
                        this.$service.user.resetUserInfo(this.ruleForm).then(res => {
                            this.quseyUserInfo();
                            this.$notifySuccess();
                            setTimeout(() => {
                                this.$router.back();
                            }, 1000);
                        });
                    })
                });
            },
            //修改密码
            submitPassForm (formName) {
                this.$refs[ formName ].validate((valid) => {
                    if (!valid) {return false;}
                    let params = {
                        id: this.myUserInfo.userId,
                        ...this.resetPass
                    };
                    this.$confirm('确定修改此密码？', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        showClose: false
                    }).then(() => {
                        this.$service.user.resetUserPassword(params).then(res => {
                            this.quseyUserInfo(this.resetPass.newPassword);
                            this.$notifySuccess('修改成功');
                            setTimeout(() => {
                                this.$router.back();
                            }, 1000);
                        });
                    });
                    
                });
            },
            //清空表单
            resetForm (formName) {
                this.$refs[ formName ].resetFields();
            },
            //查询最新用户信息更新到store里面
            quseyUserInfo (newPassword) {
                this.$service.user.queryUserInfo(this.myUserInfo.userId).then(res => {
                    let destObj = Object.assign({...this.myUserInfo},res);
                    this.$store.commit('updateUserInfo', Object.assign(destObj, {btoap: newPassword ? btoa(newPassword) : this.myUserInfo.btoap}));
                });
            }
        }
    };
</script>

<style scoped lang="less">
    img {
        height: 100%;
        width: 100%
    }

    /deep/ .el-form-item__content {
        margin-left: 140px !important;
    }

    /deep/ .el-button--primary {
        height: 32px;
        width: 80px;
        line-height: 2px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        background-color: #337CF3;
        color: #C1D9FF;
    }

    /deep/ .el-form-item__content > .el-button--default {
        height: 32px;
        width: 80px;
        border-radius: 4px;
        border: 1px solid #123A84 !important;
        font-size: 16px;
        line-height: 2px;
        background: none !important;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #C1D9FF;
    }

    .org {
        position: relative;
        height: 100%;
        width: 100%;

        .user-header {
            height: 80px;
            width: 80px;
            border-radius: 50%;
            margin-left: auto;
            margin-right: auto;
            top: 30px;
            position: relative;
            overflow: hidden;
        }

        .user-info-t {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 42px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #C1D9FF;

            .normal {
                background-color: #51D53E;
            }

            .abnormal {
                background-color: red;
            }

            .state-icon {
                margin-left: 10px;
                height: 8px;
                width: 8px;
                border-radius: 50%;
            }

            .status {
                margin-left: 4px;
            }
        }

        .user-type {
            margin-top: 6px;
            color: #C1D9FF;
            text-align: center;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
        }

        .form-bg {
            margin-left: 30px;
            padding-top: 20px;

            .form-items {
                margin-top: 30px;
                padding-bottom: 20px;

                .el-upload__tip {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #5391F3;
                    padding-bottom: 10px;
                }

                /deep/ .el-form-item__content {
                    margin-left: 140px !important;
                }

                /deep/ .el-form-item__label {
                    width: 120px !important;
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #C1D9FF;
                }

                /deep/ .el-form-item__label:before {
                    color: #FF0000;
                }

                /deep/ .el-input__inner {
                    width: 224px;
                    background-color: #123A84;
                    border: none;
                }

                /deep/ .el-input__inner {
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #2B63CA;
                }

                /deep/ .el-textarea__inner {
                    width: 224px;
                    background-color: #123A84;
                    border: none;
                }

                /deep/ .el-radio__label {
                    font-size: 16px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #C1D9FF;
                }

                /deep/ .el-upload > .el-button--default {
                    background-color: #123A84;
                    border: none;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #C1D9FF;
                }

                .uoload-ctn {
                    display: flex;

                    .avatar {
                        width: 120px;
                        height: 120px;
                        display: block;

                        img {
                            height: 100%;
                            width: 100%
                        }
                    }

                    .show-header-ctn {
                        margin-left: 40px;

                        .show-t {
                            color: #C1D9FF;
                            text-align: center;
                            font-size: 12px;
                            font-family: PingFangSC-Regular, PingFang SC;
                        }

                        .show-header {
                            height: 80px;
                            width: 80px;
                        }
                    }
                }
            }
        }
    }

    .fixed-height {
        height: 235px;
    }
</style>