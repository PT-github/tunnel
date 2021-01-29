<template>
    <popup :showPopup="show"
           @handleClose="show = false"
           @btnCannal="show = false"
           @btnConfirm="submitForm('deviceForm')"
           :show-button="true"
           class="modal"
           :title="title">
        <el-form :model="deviceForm" >
            <div class="form-items">
                <el-form-item label="设备配置:">
                    <el-input type="textarea"
                              style="overflow:hidden; resize:none; "
                              :autosize="{ minRows: 5, maxRows: 20 }"
                              maxlength="5000"
                              show-word-limit
                              placeholder="请输入设备配置信息"
                              v-model="deviceForm.deviceConfig">
                    </el-input>
                </el-form-item>
            </div>
        </el-form>
    </popup>
</template>

<script>
    import titleCom from '../../components/index/tips-title';
    import hSelect from '../../components/h-select';

    export default {
        name: 'add-device',
        components: {
            titleCom,
            hSelect
        },
        services: [ 'device' ],
        props: {
            deviceId: String         // 设备id
        },
        data () {
            return {
                deviceForm: {},
                type: '',
                title: '',
                show: false
            };
        },
        mounted () {

        },
        watch: {
        value(v) {
            this.show = v;
        },
        deviceId(v) {
            this.deviceId = v || '';
            this.show = true ;
            this.initForm();
            //console.log('this.deviceId',this.deviceId)
        },
        show(v) {
        }},
        methods: {
            showDal(){
                this.show = true ;
            },
            initForm(){
                let id = this.deviceId;
                //console.log('deviceId',id);
                if (id) {

                    this.$service.device.getById(id).then(res => {
                        //console.log(String(res.pileNumber).)
                        this.title=res.deviceName
                        this.deviceForm = {
                            ...res,
                            orientationLocation: String(res.orientationLocation),
                            deviceEmployState: String(res.deviceEmployState),
                            leftRightFlag: String(res.leftRightFlag),
                            pileNumber2: String(res.pileNumber).substring(String(res.pileNumber).length-3),
                            pileNumber1: String(res.pileNumber).substring(0,String(res.pileNumber).length-3)
                        };
                    });
                }
            },
            //重置表单
            resetForm () {
                this.$confirm('确定清除数据？', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    showClose: false
                }).then(() => {
                    this.initFormParam();
                });
            },
            //提交表单
            submitForm (formName) {
                this.$confirm('确定提交数据？', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    showClose: false
                }).then(() => {
                    this.handleParams();
                });
            },
            handleParams () {
                let param = this.deviceForm;
                let status = {  //启用状态
                    0: '备用', 1: '停用', 2: '在用', 3: '维修中', 4: '报废'
                };
                //最终参数
                let realParam = {
                    //必传
                    deviceName: param.deviceName,    //设备名称
                    deviceTypeId: param.deviceTypeId,    //设备分类id
                    tunnelId: param.tunnelId,            //所属隧道Id
                    leftRightFlag: param.leftRightFlag,  //洞类型
                    leftRightFlagName: param.leftRightFlagName,
                    bookClassifyId: param.bookClassifyId,    //所属分类
                    employDeadline: param.employDeadline,    //使用年限

                    //非必传
                    deviceConfig: param.deviceConfig,       // 设备配置
                    deviceVender: param.deviceVender,    //设备厂商
                    deviceModel: param.deviceModel,      //设备编号
                    pileNumber: Number(param.pileNumber1) * 1000 + Number(param.pileNumber2),         //桩号
                    deviceIP: param.deviceIP,            //设备ip地址
                    deviceUnit: param.deviceUnit,        //设备单位
                    installLocation: param.installLocation,  //安装位置
                    orientationLocation: param.orientationLocation,//方位位置
                    orientationLocationName: param.orientationLocation == 1 ? '左' : param.orientationLocation == 2 ? '右' : '中',
                    deviceEmployState: param.deviceEmployState,  //启用状态
                    deviceEmployStateName: status[ param.deviceEmployState ] ? status[ param.deviceEmployState ] : '',
                    reamrks: param.reamrks,  //备注
                    firstEmployDate: param.firstEmployDate ? this.$utils.date.format(param.firstEmployDate, 'yyyy-MM-dd hh:mm:ss') : ''  //启用时间
                };
                console.log('最终参数：', realParam);

                let id = this.deviceId;
                if (id) {
                    Object.assign(realParam, {
                        id: id
                    });
                    //更新设备台账
                    this.$service.device.uploadDevice(realParam).then(res => {
                        this.$notifySuccess();
                        this.show = false ;
                    });
                    return;
                }
            },
            initFormParam () {
                this.deviceForm = {
                    deviceName: '',//设备名称
                    deviceTypeId: '',//设备id
                    tunnelId: '',    //隧道id
                    leftRightFlag: '',    //洞类型
                    bookClassifyId: '',  //所属分类
                    pileNumber1: '',
                    pileNumber2: '',

                    deviceConfig: '',            // 设备配置
                    employDeadline: '',        //使用年限
                    depreciationRate: '',       //设备减值
                    deviceVender: '',        //设备厂商
                    deviceModel: '',        //设备型号
                    deviceIP: '',     //IP地址
                    deviceUnit: '',        //单位
                    installLocation: '',    //安装位置
                    orientationLocation: '',   //方位位置
                    deviceEmployState: '',       //启动状态
                    reamrks: '',      //备注
                    firstEmployDate: ''   //启用时间
                };
            }
        }
    };
</script>

<style scoped lang="less">
    /deep/ .org input::-webkit-outer-spin-button,
    /deep/ .org input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    /deep/ .org input[type='number'] {
        -moz-appearance: textfield;
    }

    /deep/ .el-form-item__error {
        left: 20px !important;
    }

    .org {
        padding-bottom: 1px;
        position: relative;
        height: 100%;
        background: linear-gradient(180deg, rgba(24, 38, 113, 1) 0%, rgba(24, 38, 113, 0) 100%);
        border-radius: 20px 20px 0px 0px;

        .add-tunnel-ctn {
            padding-top: 20px;
            margin-left: 30px;

            .form-items {
                margin-top: 30px;
                padding-bottom: 20px;

                .second-selest-item {
                    display: inline-block;
                    margin-left: 20px;
                }

                .flex-items {
                    display: flex;
                    align-items: center;

                    /deep/ .el-form-item__content > .el-input {
                        width: 120px !important;
                    }

                    span {
                        margin-left: 10px;
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #337CF3;
                    }
                }

                .station-ctn {
                    display: flex;
                    align-items: center;

                    .s1 {
                        color: #C1D9FF;
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                    }
                }

                /deep/ .el-textarea {
                    width: 448px;

                    .el-textarea__inner {
                        width: 100%;
                        min-height: 96px !important;
                        padding-bottom: 2px;
                        background-color: #123A84;
                        border: none;
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #2B63CA;
                    }

                    .el-input__count {
                        background: none;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #337CF3;
                    }
                }

                /deep/ .el-input__prefix {
                    right: 5px;
                    left: auto;
                }
            }
        }
    }

    /deep/ .el-input {
        width: 300px;
    }
    /deep/ .el-textarea .el-input__count {
        background: none;
    }
</style>