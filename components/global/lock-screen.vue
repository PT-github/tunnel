<template>
    <div class="lock-page" v-if="showLock && myUserInfo">
        <img class="bg" src="../../assets/images/lock-bg.png">

        <img :src="myUserInfo.headImage" class="avatar">

        <div class="time">{{myUserInfo.name}}：{{lockTime}}</div>

        <el-form ref="loginForm" :model="form" :rules="rules" class="login-form" @submit.native.prevent>
            <el-form-item prop="password">
                <el-input v-model="form.password" type="password" placeholder="请输入您的密码继续登录">
                    <img slot="prefix" class="input-prefix" src="../../assets/images/login-lock.png">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit" class="submit-btn" @click="hide">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    export default {
        events: {
            'lock-screen': 'lock'
        },
        data () {
            let validatePassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else if (value !== atob(this.myUserInfo.btoap)) {
                    callback(new Error('密码错误'));
                } else {
                    callback();
                }
            };
            return {
                showLock: false,
                lockTime: '',
                form: {},
                rules: {
                    password: [
                        {validator: validatePassword, trigger: 'blur'}
                    ]
                }
            };
        },
        watch: {
            showLock (v) {
                if (v) {
                    this.lockTime = this.$utils.date.format(new Date(), 'yyyy年MM月dd日 hh:mm');
                    this.form = {};
                }
            }
        },
        mounted () {
            let cache = localStorage.getItem('lock');
            this.showLock = !!cache;
        },
        methods: {
            lock () {
                this.showLock = true;
                localStorage.setItem('lock', '1');
            },
            hide () {
                this.$refs.loginForm.validate((valid) => {
                    if (!valid) return;
                    this.showLock = false;
                    localStorage.removeItem('lock');
                });
            }
        }
    };
</script>
<style lang='less' scoped>
    .lock-page {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9999999;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .bg {
            width: 100%;
            height: 100%;
            z-index: -1;
            position: absolute;
        }
    }

    .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        margin-bottom: 20px;
    }

    .time {
        font-size: 16px;
        font-weight: 400;
        color: rgba(193, 217, 255, 1);
        line-height: 16px;
    }

    .login-form {
        width: 280px;
    }

    .input-prefix {
        width: 20px;
        height: 20px;
        margin-top: 14px;
    }

    .el-input {
        margin-top: 30px;
        line-height: 48px;
        height: 48px;
        font-size: 16px;

        input {
            line-height: 48px;
            height: 100%;
            padding-left: 40px;
        }
    }

    .el-button {
        width: 100%;
        line-height: 48px;
        padding: 0;
        font-size: 20px;
        margin-top: 28px;
    }
</style>
