<template>
    <form-page :breadcrumb="[{name:'首页',path:'/'},{name:'故障管理'}]">
        <!-- 进度 -->
        <div class="process">
            <div class="process-tips">
                <div class="process-tips-title">故障处理</div>
                <div class="process-tips-cicle"></div>
                <div class="process-tips-name">{{detail.disposeStateName}}</div>
            </div>
            <!-- element进度条 -->
            <div style="width:50%">
                <el-steps :active="active" align-center>
                    <el-step icon="el-icon-message-solid">
                        <div slot="title">预警(或主动上报)</div>
                    </el-step>
                    <el-step icon="el-icon-upload">
                        <div slot="title">故障处理</div>
                    </el-step>
                    <el-step icon="el-icon-tickets">
                        <div slot="title">归档总结</div>
                    </el-step>
                    <el-step icon="el-icon-circle-check">
                        <div slot="title">完成</div>
                    </el-step>
                </el-steps>
            </div>
        </div>
        <div>
            <TipsTitle title="基本信息"/>
            <c-table :listParm="infoList"></c-table>
        </div>
        <div class="fault-done" v-if="!onlySee">
            <el-button v-if="active===1"
                       type="primary"
                       @click="batchRepair(1,1,{})">
                <i class="el-icon-s-tools"></i>
                设备维修
            </el-button>
            <el-button v-if="active===1"
                       type="primary"
                       @click="batchRepair(2,1,{})">
                <i class="el-icon-refresh"></i>
                设备更换
            </el-button>
            <el-button :disabled="active===1 && !canArchive"
                       type="primary"
                       v-if="active === 2 || active === 1"
                       @click="doGuidang"
                       style="margin-right: 0px">
                <i class="el-icon-tickets"></i>
                {{active === 1?'归档总结':'确认总结'}}
            </el-button>
        </div>
        <!-- 查看详情 -->
        <div>
            <TipsTitle title="设备列表"/>
            <div v-if="onlySee">
                <table class="table-ctn" border="1px" cellspacing="0">
                    <tr class="ctn-t">
                        <th>设备名称</th>
                        <th>所属隧道</th>
                        <th>安装位置</th>
                        <th>桩号</th>
                        <th>处理状态</th>
                        <th>维护时间</th>
                        <th>维护单位</th>
                        <th>解决方案</th>
                        <th>处理说明</th>
                    </tr>
                    <template v-for="(device,i) in deviceList">
                        <tr class="ctn-v" :key="i">
                            <th>{{device.deviceName}}</th>
                            <th>{{device.tunnelName}}</th>
                            <th>{{device.installLocation}}</th>
                            <th>{{device.pileNumber}}</th>
                            <th>{{device.disposeStateName}}</th>
                            <th>{{device.createdUserDate}}</th>
                            <th>{{device.repairCompany}} {{device.contactNumber}}</th>
                            <th>{{device.solution}}</th>
                            <th>{{device.disposeDepict}}</th>
                        </tr>
                    </template>
                </table>
            </div>
            <div v-else>
                <div class="selected-table" style="margin-bottom: 30px">
                    <el-table
                            ref="multipleTable"
                            :data="deviceList"
                            tooltip-effect="dark"
                            style="width: 100% !important;"
                            @selection-change="handleSelectionChange">
                        <el-table-column
                                v-if="active === 1"
                                type="selection"
                                :width="62*$px2rem">
                        </el-table-column>
                        <el-table-column
                                label="设备名称"
                                prop="deviceName"
                                :width="212*$px2rem">
                        </el-table-column>
                        <el-table-column
                                label="所属隧道"
                                prop="tunnelName"
                                :width="211*$px2rem">
                        </el-table-column>
                        <el-table-column
                                label="安装位置"
                                prop="installLocation">
                        </el-table-column>
                        <el-table-column
                                label="桩号"
                                prop="pileNumber">
                        </el-table-column>
                        <el-table-column
                                label="处理状态"
                                prop="disposeStateName">
                        </el-table-column>
                        <el-table-column
                                label="维护时间"
                                prop="createdUserDate"
                                :width="212*$px2rem">
                        </el-table-column>
                        <el-table-column
                                label="维护单位"
                                :width="212*$px2rem">
                                <template slot-scope="scope">
                                    {{scope.row.repairCompany}} {{scope.row.contactNumber}}
                                </template>
                        </el-table-column>
                        <el-table-column
                                :width="211*$px2rem"
                                label="解决方案"
                                prop="solution">
                        </el-table-column>
                        <el-table-column
                                label="处理说明"
                                :min-width="241*$px2rem"
                                prop="disposeDepict"
                                show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                                v-if="active === 1"
                                :width="211*$px2rem"
                                label="操作">
                            <template slot-scope="scope">
                                <div class="el-col">
                                    <div class="el-btn" @click="batchRepair(1,2,scope.row)">
                                        <i class="el-icon-s-tools"></i>
                                        维修
                                    </div>
                                    <div class="el-btn" @click="batchRepair(2,2,scope.row)">
                                        <i class="el-icon-refresh"></i>
                                        更换
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <!-- <h-table :options="deviceOtions"></h-table> -->
        </div>
        <div v-if="active === 2 || active === 3">
            <TipsTitle title="归档总结"/>
            <div class="btm-ctn">
                <span class="btm-title">维修总结</span>
                <el-input type="textarea"
                          style="overflow:hidden; resize:none; "
                          :autosize="{ minRows: 2, maxRows: 20 }"
                          maxlength="300"
                          :readonly="active === 3"
                          show-word-limit
                          placeholder="请输入处理说明"
                          v-model="serviceReport">
                </el-input>
            </div>
        </div>

        <!-- 可以编辑的那种 -->
        <ComPopup :title="formType==1?'设备维修':'设备更换'"
                  :width="$getPx(528)"
                  showButton
                  @handleClose="closeRepair"
                  @btnCancel="closeRepair"
                  @btnConfirm="submitForm('repairForm')"
                  :showPopup="showRepair">
            <el-form :model="repairForm" ref="repairForm"
                     class="repair-form"
                     :label-width="100*$px2rem+'px'">
                <el-form-item label="维修单位:"
                              prop="repairCompany"
                              :rules="[{ required: true, message: '请输入维修单位', trigger: 'blur' },]">
                    <el-input v-model="repairForm.repairCompany"
                              placeholder="请输入维修单位"></el-input>
                </el-form-item>
                <el-form-item label="维修时间:"
                              prop="createdUserDate"
                              :rules="[{ required: true, message: '请选择维修时间', trigger: 'blur' },]">
                    <el-date-picker v-model="repairForm.createdUserDate"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    :pickerOptions="pickerOptions"
                                    type="datetime"
                                    placeholder="请选择维修时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="受理人/电话:"
                              prop="contactNumber">
                    <el-input v-model="repairForm.contactNumber"
                              placeholder="请输入受理人/电话"></el-input>
                </el-form-item>
                <el-form-item :label="formType===1?'备注信息:':'故障原因:'">
                    <el-input type="textarea"
                              v-if="formType===1"
                              style="overflow:hidden; resize:none; "
                              :autosize="{ minRows: 2, maxRows: 20 }"
                              maxlength="300"
                              show-word-limit
                              placeholder="请输入备注信息"
                              v-model="repairForm.reamrks">
                    </el-input>
                    <el-input type="textarea"
                              v-else
                              style="overflow:hidden; resize:none; "
                              :autosize="{ minRows: 2, maxRows: 20 }"
                              maxlength="300"
                              show-word-limit
                              placeholder="请输入故障原因"
                              v-model="repairForm.cause">
                    </el-input>
                </el-form-item>

                <el-form-item label="解决方案:"
                              prop="solution">
                    <el-input v-model="repairForm.solution" readonly></el-input>
                </el-form-item>
                <el-form-item label="处理说明:">
                    <el-input type="textarea"
                              style="overflow:hidden; resize:none; "
                              :autosize="{ minRows: 2, maxRows: 20 }"
                              maxlength="300"
                              show-word-limit
                              placeholder="请输入处理说明"
                              v-model="repairForm.disposeDepict">
                    </el-input>
                </el-form-item>

                <el-form-item label="选择设备:"
                              v-if="formType===2"
                              prop="replaceDeviceId"
                              :rules="[{ required: true, message: '请选择更换设备' , trigger: 'blur' }]">
                    <h-select
                            :ds="{service:'device',func:'getDeviceForSelect',params:{tunnelId:detail.tunnelId,leftRightFlag:detail.leftRightFlag,deviceEmployState:0}}"
                            v-model="repairForm.replaceDeviceId"
                            filterable
                            placeholder="请选择更换设备"></h-select>
                </el-form-item>
            </el-form>
        </ComPopup>
    </form-page>
</template>

<script>

    import TipsTitle from '../../components/index/tips-title';
    import CTable from '../../components/c-table';
    import HTable from '../../components/h-table';

    import ComPopup from '../../components/common-popup';

    export default {
        components: {
            TipsTitle, CTable, HTable, ComPopup
        },
        services: [ 'basic', 'fault' ],
        data () {
            return {
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() > new Date().getTime();
                    }
                },
                id: '',
                active: 0,
                onlySee: true,
                infoList: [],
                detail: {},
                deviceList: [],

                formType: 1,     //1设备维修 2设备更换
                type: 1,     //类型 1批量 2单选
                showRepair: false,       //设备维修
                repairForm: {},          //弹窗对象
                listData: {},
                listParam: [],            //列表筛选项
                serviceReport: '',       //维修总结
                canArchive: false
            };
        },
        mounted () {
            this.id = this.$route.query.id || null;
            this.initRepair();
            this.loadData();
        },
        methods: {
            loadData () {
                this.$service.fault.getDetail({id: this.id}).then(res => {
                    this.active = Number(res.disposeState) + 1;
                    if (this.$route.query.type === 'done') {
                        this.onlySee = false;
                    }
                    this.serviceReport = res.serviceReport || '';

                    if (this.active === 1) {
                        // 查询是否能归档
                        this.$service.fault.checkCanArchive(this.id).then(res => {
                            this.canArchive = res;
                        });
                    }
                    this.deviceList = res.trepairdetailedrecordVO;
                    if (res.trepairdetailedrecordVO.length) {
                        res.leftRightFlag = res.trepairdetailedrecordVO[ 0 ].leftRightFlag;
                        res.leftRightFlagName = res.trepairdetailedrecordVO[ 0 ].leftRightFlagName;
                    }
                    this.detail = res || {};
                    let tableList = [
                        {
                            list: [
                                {value: '故障时间', isTitle: true},
                                {value: res.faultDate},
                                {value: '所属隧道', isTitle: true},
                                {value: `${res.tunnelName}（${res.leftRightFlagName}）`}
                            ],
                            style: {textAlign: 'left', paddingLeft: '20px'}
                        },
                        {
                            list: [
                                {value: '发生具体位', isTitle: true},
                                {value: res.faultLocation},
                                {value: '事件等级', isTitle: true},
                                {value: res.faultLevelName}
                            ],
                            style: {textAlign: 'left', paddingLeft: '20px'}
                        },
                        {
                            list: [
                                {value: '故障来源', isTitle: true},
                                {value: res.faultSourceName},
                                {value: '', isTitle: true},
                                {value: ''}
                            ],
                            style: {textAlign: 'left', paddingLeft: '20px'}
                        }
                        ,
                        {
                            list: [
                                {value: '故障描述', isTitle: true},
                                {value: res.faultDepict, col: 3}
                            ],
                            style: {textAlign: 'left', height: '150px', paddingLeft: '20px'}
                        }
                    ];
                    this.infoList = tableList;
                });
            },
            //提交表单
            submitForm (formName) {
                this.$refs[ formName ].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    let param = [];
                    if (this.type == 2) {
                        //合并
                        this.listData = this.mergeData(this.repairForm, this.listData);
                        param.push(this.listData);
                    } else {
                        param = this.listParam;
                        param.forEach(item => {
                            item = this.mergeData(this.repairForm, item);
                        });
                    }
                    if (this.formType === 1) {
                        this.$service.fault.updateByRepair(param).then(res => {
                            this.initRepair();
                            this.showRepair = false;
                            this.loadData();
                            this.$notifySuccess();
                        });
                    } else {
                        this.$service.fault.updateByReplace(param).then(res => {
                            this.initRepair();
                            this.showRepair = false;
                            this.loadData();
                            this.$notifySuccess();
                        });
                    }
                });
            },
            //处理弹窗类型，操作类型
            batchRepair (formType, type, data) {
                //form类型为维修设备或设备更换
                if (formType == 1) {
                    this.formType = 1;
                } else {
                    this.formType = 2;
                }
                if (type == 1) {
                    this.type = 1;
                    if (!this.listParam.length) {
                        return this.$ctx.toastError('请选择设备列表');
                    }
                    if (this.listParam.some(v => !!v.solution)) {
                        return this.$ctx.toastError('已维修/更换的设备无法再次维修/更换！');
                    }
                    if (formType == 2 && this.listParam.length > 1) {
                        return this.$ctx.toastError('设备更换每次只能操作一个设备');
                    }
                } else {
                    this.type = 2;
                    if (!!data.solution) {
                        return this.$ctx.toastError('已维修/更换的设备无法再次维修/更换！');
                    }
                    this.listData = data;
                }
                this.repairForm = {
                    solution: formType == 1 ? '设备维修' : '设备更换',
                    createdUserDate: this.$utils.date.format(new Date(), 'yyyy-MM-dd hh:mm:ss')
                };
                this.showRepair = true;
            },
            //选择得值存到本地
            handleSelectionChange (val) {
                this.listParam = val;
            },
            initRepair () {
                //单
                this.listData = {};
                //批
                this.repairForm = {
                    repairCompany: '',
                    createdUserDate: '',
                    contactNumber: '',
                    cause: '',       //故障原因
                    reamrks: '',     //备注说明
                    solution: '',
                    disposeDepict: '',
                    replaceDeviceId: '' //更换设备标号
                };
            },
            closeRepair () {
                this.initRepair();
                this.showRepair = false;
            },
            mergeData (newData, oldData) {
                oldData.repairCompany = newData.repairCompany;
                oldData.createdUserDate = newData.createdUserDate;
                oldData.contactNumber = newData.contactNumber;
                oldData.solution = newData.solution;
                oldData.disposeDepict = newData.disposeDepict;
                if (this.formType === 1) {
                    oldData.reamrks = newData.reamrks;
                } else {
                    oldData.cause = newData.cause;
                    oldData.replaceDeviceId = newData.replaceDeviceId;
                }
                return oldData;
            },
            //归档总结
            doGuidang () {
                if (this.active === 1) {    // 处理完故障需要点击确定归档才进行下一阶段
                    this.$service.fault.archiveFault(this.detail.id).then(() => {
                        this.$notifySuccess();
                        setTimeout(() => {
                            this.$router.go(0);
                        }, 1000);
                    });
                } else if (this.active === 2) { // 总结
                    if (!this.serviceReport) {
                        return this.$ctx.toastError('请输入维修总结!');
                    }
                    this.$service.fault.postArchive({
                        id: this.detail.id,
                        serviceReport: this.serviceReport
                    }).then(() => {
                        this.$notifySuccess();
                        this.initRepair();
                        this.loadData();
                    });
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .repair-form {
        /deep/ .el-form-item__label {
            width: 105px !important;
        }

        /deep/ .el-input {
            width: 344px;
        }

        /deep/ .el-textarea {
            width: 344px;

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
    }

    /deep/ .repair-form input::-webkit-outer-spin-button,
    /deep/ .repair-form input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    /deep/ .repair-form input[type='number'] {
        -moz-appearance: textfield;
    }

    /deep/ .el-form-item__error {
        left: 20px !important;
    }

    .process {
        width: 100%;
        height: 117px;
        border-radius: 4px;
        border: 1px solid rgba(34, 76, 151, 1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 20px;
        margin-bottom: 40px;

        /deep/ .el-step__icon {
            /*color: #337CF3;*/
        }

        &-tips {
            display: flex;
            align-items: center;
            color: #C1D9FF;
            margin-bottom: 10px;

            &-title {
                font-size: 20px;
            }

            &-cicle {
                margin: 0 5px 0 15px;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(253, 185, 19, 1);
            }

            &-name {
                font-size: 14px;
            }
        }
    }

    .fault-done {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        .btn-item {
            cursor: pointer;
            height: 30px;
            padding-left: 10px;
            padding-right: 10px;
            border-radius: 4px;
            background: #337CF3;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #C1D9FF;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 40px;

            i {
                margin-top: 1px;
                margin-right: 4px;
            }
        }
    }

    .table-ctn {
        width: 100%;
        border-radius: 4px;
        border-collapse: collapse;
        margin-top: 30px;
        margin-bottom: 30px;
        table-layout: fixed;

        tr th {
            border: 1px solid #224C97;
            font-size: 16px;
            color: #C1D9FF;
            height: 50px;
        }

        .ctn-t th {
            width: calc((100% - 640px) / 4);
            background: #0C2253;
            font-size: 16px;
            color: #5391F3;
            font-weight: 500;
        }

        // .ctn-t th:nth-child(6){width: 404px !important;}
        .ctn-v th {
            color: #C1D9FF;
            font-size: 16px;
            font-weight: 500;
        }

        .th-title {
            height: 50px;
            width: 200px;
            background: #0C2253;
            font-size: 16px;
            color: #5391F3;
        }
    }

    //图标已选中
    /deep/ .el-step__head.is-process {
        color: #C1D9FF;
        border-color: #C1D9FF;
    }

    //文字已选中
    /deep/ .el-step__head.is-finish {
        color: #C1D9FF;
        border-color: #C1D9FF;
    }

    //文字未选中
    /deep/ .el-step__title.is-wait {
        color: #337CF3;
    }

    //图标未选中
    /deep/ .el-step__head.is-wait {
        color: #337CF3;
        border-color: #337CF3;
    }

    //线默认颜色
    /deep/ .is-finish .el-step__line {
        background: #C1D9FF !important;
    }

    /deep/ .el-step__line {
        background-color: #337CF3;
    }

    /deep/ .el-step__icon {
        background: none;
        // background-color: rgba(253,185,19,0);
    }

    /deep/ .el-step__title.is-process {
        color: #C1D9FF;
    }

    /deep/ .el-step__title.is-finish {
        color: #C1D9FF;
    }

    //

    /deep/ .el-textarea {
        width: 100%;

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

    .selected-table {
        padding-top: 30px;
        // max-height: 365px;
        width: 100%;

        /deep/ .el-table td, .el-table th {
            padding: 0px !important;
        }

        /deep/ .has-gutter tr th {
            padding: 0px !important;
        }

        /deep/ .el-table td, .el-table th.is-leaf {
            border: 1px solid #1B3E6F !important;
        }

        /deep/ .el-table__body {
            width: 100%;
        }

        /deep/ .cell {
            height: 50px;
            line-height: 50px;
            text-align: center;
        }
    }

    .el-col {
        display: flex;
        justify-content: center;

        .el-btn {
            cursor: pointer;
            margin-right: 10px;
            margin-left: 10px;
            display: flex;
            align-items: center;
            justify-content: center;

            i {
                margin-right: 4px
            }
        }
    }

    .btm-ctn {
        margin-top: 30px;
        display: flex;

        .btm-title {
            display: flex;
            flex: none;
            margin-right: 30px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #C1D9FF;
        }
    }
</style>
