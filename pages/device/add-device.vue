<template>
    <form-page :breadcrumb="[{name:'设备管理',path:'/device'},{name:type==='edit'?'编辑设备':'新增设备'}]">
        <div class="org">
            <div class="add-tunnel-ctn">
                <el-form :model="deviceForm" ref="deviceForm"
                         :label-width="100*$px2rem+'px'"
                         class="demo-ruleForm">
                    <title-com title="基本信息"></title-com>
                    <div class="form-items">
                        <el-form-item label="设备名称:"
                                      prop="deviceName"
                                      :rules="[{ required: true, message: '请输入设备名称', trigger: 'blur' },]">
                            <el-input v-model="deviceForm.deviceName"
                                      placeholder="请输入设备名称"></el-input>
                        </el-form-item>
                        <el-form-item label="设备类型:"
                                      prop="deviceTypeId"
                                      :rules="[{ required: true, message: '请选择设备类型', trigger: 'blur' }]">
                            <hSelect :ds="{service:'device',func:'getDeviceTypeAll',params:'deviceTypeId'}"
                                     v-model="deviceForm.deviceTypeId"
                                     placeholder="请选择设备类型"></hSelect>
                        </el-form-item>

                        <el-form-item label="所属隧道:"
                                      :rules="[{ required: true, message: '请选择所属隧道' }]">
                            <hSelect :ds="{service:'tunnel',func:'getListAll'}"
                                     v-model="deviceForm.tunnelId"
                                     placeholder="请选择隧道"></hSelect>

                            <div class="second-selest-item">
                                <!-- 改个隧道的标识 -->
                                <hSelect :ds="{service:'basic',func:'getDict',params:'LeftRightFlag'}"
                                         v-model="deviceForm.leftRightFlag"
                                         ref="leftRightFlag"
                                         placeholder="请选择洞类型"></hSelect>
                            </div>
                        </el-form-item>

                        <el-form-item label="所属分类:"
                                      prop="bookClassifyId"
                                      :rules="[{ required: true, message: '请选择所属分类', trigger: 'blur' }]">
                            <hSelect :ds="{service:'device',func:'getBookClassifyList'}"
                                     v-model="deviceForm.bookClassifyId"
                                     placeholder="请选择所属分类"></hSelect>
                        </el-form-item>

                        <div class="flex-items">
                            <el-form-item label="使用年限:"
                                          prop="employDeadline"
                                          :rules="[{ required: true, message: '请输入年份', trigger: 'blur' }]">
                                <el-input type="number"
                                          class="numberType"
                                          v-model="deviceForm.employDeadline" placeholder="请输入年份"></el-input>
                                <span>年</span>
                            </el-form-item>

                            <el-form-item label="设备减值:">
                                <el-input type="number"
                                          v-model="deviceForm.depreciationRate" placeholder="请输入数字"></el-input>
                                <span>%</span>
                            </el-form-item>
                        </div>
                    </div>

                    <title-com title="设备管理信息"></title-com>
                    <div class="form-items">
                        <el-form-item label="设备厂商:">
                            <el-input v-model="deviceForm.deviceVender"
                                      placeholder="请输入设备厂商"></el-input>
                        </el-form-item>

                        <el-form-item label="设备型号:">
                            <el-input v-model="deviceForm.deviceModel"
                                      placeholder="请输入设备型号"></el-input>
                        </el-form-item>
                        <el-form-item label="桩号:" :style="{width: 350*$px2rem+'px', color: '#C1D9FF'}" required>
                            <el-col :span="2">K</el-col>
                            <el-col :span="6">
                                <el-form-item prop="pileNumber1"
                                              :rules="[{ required: true, message: '请输入',trigger: 'blur' }]">
                                    <div class="station-ctn">
                                        <el-input v-model="deviceForm.pileNumber1" style="text-align: center;"
                                                  type="text" max="3" placeholder="150"></el-input>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3" style="text-align: center;">-</el-col>
                            <el-col :span="6">
                                <el-form-item prop="pileNumber2"
                                              :rules="[{ required: true, message: '请输入',trigger: 'blur' }]">
                                    <div class="station-ctn">
                                        <el-input v-model="deviceForm.pileNumber2" style="text-align: center;"
                                                  type="text" maxlength="3" placeholder="220"></el-input>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="IP地址:">
                            <el-input v-model="deviceForm.deviceIP"
                                      placeholder="请输入IP地址"></el-input>
                        </el-form-item>
                        <el-form-item label="单位:">
                            <el-input v-model="deviceForm.deviceUnit"
                                      placeholder="请输入单位"></el-input>
                        </el-form-item>
                        <el-form-item label="安装位置:">
                            <el-input v-model="deviceForm.installLocation"
                                      placeholder="请输入安装位置"></el-input>
                        </el-form-item>
                        <el-form-item label="方位位置:">
                            <hSelect :ds="{service:'basic',func:'getDict',params:'Location'}"
                                     ref="orientationLocation"
                                     v-model="deviceForm.orientationLocation"
                                     placeholder="请选择方位"></hSelect>
                        </el-form-item>
                        <el-form-item label="启用状态:">
                            <hSelect :ds="{service:'basic',func:'getDict',params:'EquipmentEnabledState'}"
                                     ref="deviceEmployState"
                                     v-model="deviceForm.deviceEmployState"
                                     placeholder="请选择启用状态"></hSelect>
                        </el-form-item>


                        <el-form-item label="设备配置:">
                            <el-input type="textarea"
                                      style="overflow:hidden; resize:none; "
                                      :autosize="{ minRows: 2, maxRows: 20 }"
                                      maxlength="2000"
                                      show-word-limit
                                      placeholder="请输入设备配置信息"
                                      v-model="deviceForm.deviceConfig">
                            </el-input>
                        </el-form-item>

                        <el-form-item label="备注信息:">
                            <el-input type="textarea"
                                      style="overflow:hidden; resize:none; "
                                      :autosize="{ minRows: 2, maxRows: 20 }"
                                      maxlength="300"
                                      show-word-limit
                                      placeholder="请输入备注信息"
                                      v-model="deviceForm.reamrks">
                            </el-input>
                        </el-form-item>
                    </div>

                    <title-com title="设备时间信息"></title-com>
                    <div class="form-items">
                        <el-form-item label="启用时间:"
                                      prop="firstEmployDate"
                                      :rules="[{ required: true, message: '请选择启用时间', trigger: 'blur' },]">
                            <el-date-picker
                                    popper-class="zdy-time"
                                    prefix-icon="el-icon-arrow-right"
                                    :clearable="false"
                                    v-model="deviceForm.firstEmployDate"
                                    type="datetime"
                                    placeholder="请选择启用时间">
                            </el-date-picker>
                        </el-form-item>
                    </div>

                    <el-form-item>
                        <el-button type="primary" @click="submitForm('deviceForm')">提交</el-button>
                        <el-button @click="resetForm('deviceForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </form-page>
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
        data () {
            return {
                deviceForm: {},
                type: ''
            };
        },
        mounted () {
            let {type, id} = this.$route.query;
            this.type = type;
            if (type === 'edit' && id) {
               
                this.$service.device.getById(id).then(res => {
                    //console.log(String(res.pileNumber).)
                    
                    this.deviceForm = {
                        ...res,
                        orientationLocation: String(res.orientationLocation),
                        deviceEmployState: String(res.deviceEmployState),
                        leftRightFlag: String(res.leftRightFlag),
                        pileNumber2: String(res.pileNumber).substring(String(res.pileNumber).length-3),
                        pileNumber1: String(res.pileNumber).substring(0,String(res.pileNumber).length-3)
                    };
                });
            } else {
                //初始化表单模板
                this.initFormParam();
            }
        },
        methods: {
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
                this.$refs[ formName ].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$confirm('确定提交数据？', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        showClose: false
                    }).then(() => {
                        this.handleParams();
                    });
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
                    leftRightFlagName: this.$refs.leftRightFlag.getSelectedName(),
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
                let {type, id} = this.$route.query;
                if (type === 'edit' && id) {
                    Object.assign(realParam, {
                        id: id
                    });
                    //更新设备台账
                    this.$service.device.uploadDevice(realParam).then(res => {
                        this.$notifySuccess();
                        this.$router.go(-1);
                    });
                    return;
                }
                //新增隧道信息
                this.$service.device.addDevice(realParam).then(res => {
                    this.$notifySuccess();
                    this.$router.go(-1);
                });
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
</style>