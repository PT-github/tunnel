<template>
    <form-page :breadcrumb="[{name:'故障管理',path:'/fault'},{name:'故障上报'}]">
        <el-form :model="faultForm" ref="faultForm"
                 :label-width="150*$px2rem+'px'">
            <title-com title="故障信息"></title-com>
            <div class="form-items">
                <el-form-item label="所属隧道:" prop="tunnelId"
                              :rules="[{ required: true, message: '请选择所属隧道' }]">
                    <h-select :ds="{service:'tunnel',func:'getListAll'}"
                              v-model="faultForm.tunnelId"
                              placeholder="请选择隧道"></h-select>

                    <div class="second-selest-item">
                        <h-select :ds="{service:'basic',func:'getDict',params:'leftRightFlag'}"
                                  v-model="faultForm.leftRightFlag"
                                  placeholder="请选择洞类型"></h-select>
                    </div>
                </el-form-item>
                <el-form-item label="故障发生时间:" prop="faultDate"
                              :rules="[{ required: true, message: '请选择故障发生时间' }]">
                    <el-date-picker v-model="faultForm.faultDate"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime"
                                    :picker-options="pickerOptions"
                                    placeholder="选择时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="发生具体位置:">
                    <el-input v-model="faultForm.faultLocation"
                              placeholder="请输入位置"></el-input>
                </el-form-item>

                <el-form-item label="故障说明:">
                    <el-input type="textarea"
                              style="overflow:hidden; resize:none; "
                              :autosize="{ minRows: 2, maxRows: 20 }"
                              maxlength="300"
                              show-word-limit
                              placeholder="请输入故障说明"
                              v-model="faultForm.faultDepict">
                    </el-input>
                </el-form-item>
            </div>

            <title-com title="故障设备"></title-com>
            <div class="form-items">
                <el-form-item label="选择故障设备:" prop="devices"
                              :rules="[{ required: true, message: '请选择故障设备' }]">
                    <h-select
                            :ds="faultForm.tunnelId ? {service:'device',func:'getDeviceForSelect',
                                params:{tunnelId:faultForm.tunnelId, leftRightFlag:faultForm.leftRightFlag}} : []"
                            v-model="faultForm.devices"
                            filterable
                            multiple
                            :placeholder="faultForm.tunnelId ?'请选择设备':'请先选择隧道'"></h-select>
                </el-form-item>
                <el-form-item label="故障等级:" prop="faultLevel"
                              :rules="[{ required: true, message: '请选择故障等级' }]">
                    <h-select :ds="{service:'basic',func:'getDict',params:'TaultLevel'}"
                              ref="level"
                              v-model="faultForm.faultLevel"
                              placeholder="请选择故障等级"></h-select>
                </el-form-item>
            </div>

            <el-form-item>
                <el-button type="primary" @click="submitForm('faultForm')">提交</el-button>
                <el-button @click="resetForm('faultForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </form-page>
</template>

<script>
    import titleCom from '../../components/index/tips-title';
    import HSelect from '../../components/h-select';

    export default {
        services: [ 'fault' ],
        components: {
            titleCom,
            HSelect
        },
        data () {
            return {
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() > new Date().getTime();
                    }
                },
                faultForm: {
                    tunnelId: '',
                    leftRightFlag: '',
                    faultDate: this.$utils.date.format(new Date(), 'yyyy-MM-dd hh:mm:ss'),
                    faultLocation: '',
                    faultDepict: '',
                    faultLevel: '',
                    devices: []
                }
            };
        },
        methods: {
            resetForm () {
                this.$confirm('确定清除数据？', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    showClose: false
                }).then(() => {
                    this.faultForm = {
                        tunnelId: '',
                        leftRightFlag: '',
                        faultDate: '',
                        faultLocation: '',
                        faultDepict: '',
                        faultLevel: '',
                        devices: []
                    };
                });
            },
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
                        this.doSubmit();
                    });

                });
            },
            doSubmit () {
                let {tunnelId, leftRightFlag, faultDate, faultLocation, faultDepict, faultLevel, devices} = this.faultForm;
                let params = {
                    tunnelId,
                    leftRightFlag,
                    faultDate,
                    faultLocation,
                    faultDepict,
                    faultLevel,
                    faultLevelName: this.$refs.level.getSelectedName(),
                    trepairdetailedrecord: devices.map(v => {
                            return {deviceId: v};
                        }
                    )
                };
                this.$service.fault.createByUser(params).then(() => {
                    this.$router.back();
                    this.$notifySuccess();
                });
            }
        }
    };
</script>

<style scoped lang="less">
    /deep/ .el-input {
        width: 300px;
    }

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
</style>