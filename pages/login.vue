<template>
    <div class="page">
        <img src="../assets/images/login-bg.png" class="bg">



        <section class="title">
          <img :src="loginImg" alt="">
          <h3 class="">{{loginTitle}}</h3>
        </section>
        <el-form ref="loginForm" :model="form" class="login-form" @submit.native.prevent>
            <el-form-item prop="account" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
                <el-input v-model="form.account" placeholder="请输入用户名" autofocus>
                    <img slot="prefix" class="input-prefix" src="../assets/images/login-account.png">
                </el-input>
            </el-form-item>
            <el-form-item prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                <el-input v-model="form.password" type="password" placeholder="请输入密码">
                    <img slot="prefix" class="input-prefix" src="../assets/images/login-lock.png">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="form.save">记住密码</el-checkbox>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" native-type="submit" class="submit-btn" @click="Login">登 录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    const CACHE_DATA = 'suidao';
    export default {
        services: [ 'user','index' ],
        data () {
            return {
                form: {},
              loginTitle: '',
              loginImg: ''
            };
        },
        mounted () {
            let userInfo = localStorage.getItem(CACHE_DATA);
            if (!userInfo) return;
            userInfo = JSON.parse(userInfo);
            this.form = {
                account: userInfo.u,
                password: userInfo.p,
                save: true
            };


            this.$service.index.getLoginLogoInfo({
              value: 'OneValueDictionary'
            }).then(res => {
              const loginTitle = res.find(item => item.name === 'PlatTitle')

              const loginImg = res.find(item => item.name === 'LogoImg')

              if (loginTitle) this.loginTitle = loginTitle.value

              if (loginImg) this.loginImg = loginImg.value


            })
        },
        methods: {
            Login () {
                this.$refs.loginForm.validate((valid) => {
                    if (!valid) return;
                    this.$service.user.login(this.form.account, this.form.password).then(res => {
                        res.btoap = btoa(this.form.password);
                        this.$store.commit('updateUserInfo', res);
                        if (this.form.save) {
                            this.setCacheData();
                        } else {
                            this.clearCache();
                        }
                        this.$router.push('/');
                    });
                });
            },
            setCacheData () {
                localStorage.setItem(CACHE_DATA, JSON.stringify({
                    u: this.form.account,
                    p: this.form.password
                }));
            },
            clearCache () {
                localStorage.removeItem(CACHE_DATA);
            }
        }
    };
</script>
<style lang='less' scoped>
    .page {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        height: 100vh;
        position: relative;

        .bg {
            width: 100%;
            height: 100%;
            position: absolute;
        }

        .title {
            position: relative;
            //width: 374px;
        }
    }

    .welcome {
        font-size: 24px;
        text-align: center;
        font-weight: bold;
        color: rgba(83, 145, 243, 1);
        line-height: 24px;
        padding-bottom: 6px;
    }

    .input-prefix {
        width: 20px;
        height: 20px;
        margin-top: 14px;
    }

    .el-checkbox {
        margin-left: 14px;
        font-size: 16px;
        color: rgba(83, 145, 243, 1);
        line-height: 16px;
        padding: 30px 0;
    }

    .title {
      position: relative;
      text-align: center;

      img {
        height: 60px;
      }

      h3 {
        margin-top: 10px;
        font-weight: bold;
        font-size: 24px;
        color: rgba(193, 217, 255, 1);
        margin-bottom: 40px;
        line-height: 24px;
        text-align: center;
      }
    }

    .login-form {
        position: relative;
        width: 364px;
        background: rgba(17, 34, 109, 1);
        padding: 10px 42px 40px;
    }

    .el-form-item {
        margin-bottom: 0;
    }

    .el-input {
        margin-top: 40px;
        line-height: 48px;
        height: 48px;
        font-size: 16px;
        background: rgba(193, 217, 255, 1);
        border-radius: 6px;

        /deep/ .el-input__prefix {
            left: 10px;
        }

        /deep/ .el-input__inner {
            background: rgba(193, 217, 255, 1);
            border-radius: 6px;
            color: rgba(51, 124, 243, 1);
            padding-left: 40px;

            &::placeholder {
                color: rgba(51, 124, 243, 0.5);
            }
        }

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
    }
</style>
