<template>
    <div>
        <div class="mydialog" v-if="visible">
            <img id="close" @click="close" src="../../assets/3d/u1033.png" alt/>
            <div class="title">
                <div class="icon">
                    <img src="../../assets/3d/u1042.png" alt/>
                </div>
                <div class="label">设备信息</div>
            </div>
            <div class="content2">
                <table>
                    <tr>
                        <td>设备名称:</td>
                        <td>{{dataForm.name}}</td>
                    </tr>
                    <tr>
                        <td>设备厂家:</td>
                        <td>
                            <input v-model="dataForm.made"/>
                        </td>
                    </tr>
                </table>
                <div class="footer">
                    <div class="btn1" @click="cancel">取消</div>
                    <div class="btn1" @click="dataFormSubmit()">确定</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'dev',
        data () {
            return {
                num: 0,
                visible: false,
                dataForm: {
                    id: '',
                    name: '',
                    status: false,
                    lightVaule: 10,
                    made: ''
                }
            };
        },
        methods: {
            close () {
                this.visible = false;
                this.$emit('close');
            },
            cancel () {
                this.visible = false;
                this.$emit('close');
            },
            init (name, id) {
                this.visible = true;
                this.dataForm.id = id;
                this.dataForm.name = name;
            },
            //获取参数
            fnGetQueryString (key) {
                //正则获取url后面的参数值，如?env=dev&exp=123中可以通过fnGetQueryString('exp')=>得到123
                let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
                let result = window.location.search.substr(1).match(reg);
                return result ? decodeURIComponent(result[ 2 ]) : false;
            },

            // 表单提交
            dataFormSubmit () {
                this.visible = false;
                this.$emit('close');
            }
        }
    };
</script>


<style lang="scss" scoped>
    ul, li {
        margin: 0;
        padding: 0;
        list-style: none;
        text-align: left;
    }

    .mydialog {
        position: fixed;
        right: 100px;
        // bottom: 0;
        margin: 25vh auto;
        width: 400px;
        height: 200px;
        background: url("../../assets/3d/u2682.png") no-repeat;
        background-size: 100% 100%;
        z-index: 10000;
        color: white;

        #close {
            position: absolute;
            right: 10px;
            top: -10px;
            cursor: pointer;
        }

        .title {
            display: flex;
            margin-top: 5px;

            .icon {
                margin-left: 20px;
                margin-right: 5px;;

                img {
                    margin-top: 2px;
                    position: absolute;
                }
            }

            .label {
                margin-left: 20px;
            }
        }

        .content2 {
            padding: 10px 20px;
            color: #00ffff;

            td {
                padding: 10px;

            }

            .footer {
                display: flex;
                position: absolute;
                bottom: 20px;
                right: 20px;
            }
        }

        .btn1 {
            // width: 200px;
            text-align: center;
            cursor: pointer;
            margin-left: 15px;
            padding: 0px 25px;
            border-radius: 20px;
            background: linear-gradient(
                            245deg,
                            rgba(22, 167, 254, 1) 0%,
                            rgba(22, 167, 254, 1) 0%,
                            rgba(15, 75, 168, 1) 100%,
                            rgba(15, 75, 168, 1) 100%
            );
        }

        input {
            background: transparent;
            border: 1px solid #00ffff;
            color: white;
        }
    }
</style>
