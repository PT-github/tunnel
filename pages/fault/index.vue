<template>
    <form-page :radios="[ {label: '故障单'}, {label: '预警日志',num:faultNum}]"
               @radio-change="onRadioChanged" no-back :class="{'page-fault':radioIdx===0}">
        <h-tab v-show="radioIdx===0"
               :tab="tabs"
               tabName="typeName"
               dotName="count"
               @clickBar="changeClass">
            <h-table ref="table0"
                     :top="330"
                     :options="faultOptions"
                     :params="params"
                     @dataLoaded="dataLoaded"
                     @searchChange="searchParmsChange"
                     @click="onFaultButtonClick">
                <template slot="row" slot-scope="scope">
                    <div class="item-wrap">
                        <div class="content">
                            <div class="row">
                                <div class="label">故障时间：{{scope.row.faultDate}}</div>
                                <div class="label">故障编码：{{scope.row.faultNO}}</div>
                                <div class="label">故障来源：{{scope.row.faultSourceName}}</div>
                                <div class="label last">故障等级：{{scope.row.faultLevelName}}</div>
                                <div class="status">故障状态：<span class="status-name">{{scope.row.disposeStateName}}</span>
                                </div>
                            </div>
                            <div class="row margin">
                                <div class="flex1" style="text-align: left">{{scope.row.faultDepict}}</div>
                                <el-button type="primary" size="small" @click="goDetail(scope.row)">查看详情</el-button>
                                <el-button v-if="scope.row.disposeState!==2" type="primary" size="small"
                                           @click="goDetails(scope.row)">{{scope.row.disposeState===0?'故障处理':'归档总结'}}
                                </el-button>
                            </div>
                        </div>
                        <el-table :data="scope.row.trepairdetailedrecordVO" border class="table">
                            <el-table-column prop="deviceName" label="设备名称"></el-table-column>
                            <el-table-column prop="tunnelName" label="所属隧道"></el-table-column>
                            <el-table-column prop="leftRightFlagName" label="安装位置"></el-table-column>
                            <el-table-column prop="pileNumber" label="桩号"></el-table-column>
                            <el-table-column prop="disposeStateName" label="处理状态"></el-table-column>
                            <el-table-column prop="solution" label="解决方案"></el-table-column>
                            <el-table-column prop="disposeDepict" label="处理说明"></el-table-column>
                        </el-table>
                    </div>
                </template>
            </h-table>
            <template slot="right-slot">
                <el-button type="primary" icon="el-icon-plus" size="small" @click="addFault"
                           v-auth="'/rest/TRepairnum/fault/report'">故障上报
                </el-button>
                <el-button size="small" @click="exportInfo" v-auth="'/rest/TRepairnum/fault/export'">导出</el-button>
            </template>
        </h-tab>

        <h-table v-show="radioIdx===1"
                 :top="230" :options="warnOptions" ref="table1" @click="onWarnButtonClick"></h-table>

        <h-popup showButton
                 title="故障处理"
                 :width="$getPx(740)"
                 @handleClose="initParam"
                 @btnCannal="initParam"
                 @btnConfirm="subSolve"
                 :showPopup="solvePopup">
            <el-form ref="form"
                     :model="solveForm"
                     label-position="right"
                     :label-width="$getPx(100)">
                <el-form-item label="故障时间:"
                              :rules="[{ required: true}]">
                    <el-date-picker v-model="solveForm.faultDate"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime"
                                    placeholder="请选择故障时间">
                    </el-date-picker>

                    <hSelect :ds="{service:'basic',func:'getDict',params:'TaultLevel'}"
                             v-model="solveForm.faultLevel"
                             ref="faultLevel"
                             placeholder="故障等级"></hSelect>
                </el-form-item>

                <el-form-item label="发生位置:"
                              :rules="[{ required: true}]">
                    <el-input v-model="solveForm.faultLocation"
                              placeholder="请输入故障发生位置"></el-input>
                </el-form-item>

                <el-form-item label="故障描述:">
                    <el-input type="textarea"
                              style="overflow:hidden; resize:none; "
                              :autosize="{ minRows: 2, maxRows: 20 }"
                              maxlength="300"
                              show-word-limit
                              placeholder="请输入故障原因"
                              v-model="solveForm.faultDepict">
                    </el-input>
                </el-form-item>
            </el-form>
        </h-popup>
    </form-page>
</template>

<script>
    import HTable from '../../components/h-table';
    import HPopup from '../../components/common-popup';
    import HSelect from '../../components/h-select';
    import HTab from '../../components/h-tab';

    export default {
        components: {
            HTable,
            HPopup,
            HSelect,
            HTab
        },
        services: [ 'basic', 'fault' ],
        data () {
            return {
                params: {},
                radioIdx: 0,
                faultNum: 0,
                tabs: [
                    {typeName: '全部故障'},
                    {typeName: '故障处理', count: 0},
                    {typeName: '归档总结', count: 0},
                    {typeName: '结束'} ],
                faultOptions: {
                    search: [
                        {
                            placeholder: '所属隧道',
                            field: 'tunnelId',
                            type: 'select',
                            ds: {service: 'tunnel', func: 'getListAll'}
                        },
                        {
                            placeholder: '左右洞',
                            field: 'leftRightFlag',
                            type: 'select',
                            ds: {service: 'basic', func: 'getDict', params: 'leftRightFlag'}
                        },
                        {placeholder: '设备名称', field: 'deviceName', type: 'text'},
                        {placeholder: '桩号', field: 'pileNumber', type: 'text'},
                        {
                            placeholder: '设备类型',
                            field: 'deviceTypeId',
                            type: 'select',
                            ds: {service: 'device', func: 'getDeviceTypeAll', params: 'deviceTypeId'}
                        },
                        {placeholder: '故障编号', field: 'faultNO', type: 'text'},
                        {placeholder: '故障描述', field: 'faultDepict', type: 'text'},
                        {placeholder: '故障时间', field: 'faultDateS,faultDateE', type: 'daterange'}
                    ],
                    table: {
                        hideHeader: true,
                        customRow: true,
                        service: 'fault',
                        func: 'getList'
                    }
                },
                warnOptions: {
                    search: [
                        {
                            placeholder: '所属隧道',
                            field: 'tunnelId',
                            type: 'select',
                            ds: {service: 'tunnel', func: 'getListAll'}
                        },
                        {placeholder: '预警时间', field: 'warningTimeS,warningTimeE', type: 'daterange'},
                        {
                            placeholder: '左右洞',
                            field: 'leftRightFlag',
                            type: 'select',
                            ds: {service: 'basic', func: 'getDict', params: 'LeftRightFlag'}
                        },
                        {placeholder: '设备名称', field: 'deviceName', type: 'text'},
                        {placeholder: '桩号', field: 'pileNumber', type: 'text'},
                        {
                            placeholder: '设备类型',
                            field: 'deviceTypeId',
                            type: 'select',
                            ds: {service: 'device', func: 'getDeviceTypeAll', params: 'deviceTypeId'}
                        },
                        {placeholder: '预警内容', field: 'warningContent', type: 'text'},
                        {
                            placeholder: '预警状态', field: 'warningStatus',
                            type: 'select',
                            default: '0',
                            ds: {service: 'basic', func: 'getDict', params: 'WarningStatus'}
                        }
                    ],
                    buttons: [
                        {
                            name: '忽略预警',
                            type: 'primary',
                            icon: 'el-icon-plus',
                            event: 'ignore',
                            needData: true,
                            auth: '/rest/TRepairnum/warn/ignore'
                        },
                        {
                            name: '故障处理',
                            type: 'primary',
                            icon: 'el-icon-plus',
                            event: 'solve',
                            needData: true,
                            auth: '/rest/TRepairnum/warn/dispose'
                        },
                        {name: '导出', event: 'export', auth: '/rest/TRepairnum/warn/export'}
                    ],
                    table: {
                        selectable: true,
                        service: 'warn',
                        func: 'getList',
                        columns: [ {
                            title: '预警时间',
                            field: 'warningTime',
                            width: 180 * this.$px2rem
                        }, {
                            title: '设备名称',
                            field: 'deviceName'
                        }, {
                            title: '所属隧道',
                            field: 'tunnelName'
                        }, {
                            title: '安装位置',
                            field: 'leftRightFlagName',
                            width: 100 * this.$px2rem
                        }, {
                            title: '桩号',
                            field: 'pileNumber'
                        }, {
                            title: '设备类型',
                            field: 'deviceTypeName'
                        }, {
                            title: '预警类型',
                            field: 'warningTypeName'
                        }, {
                            title: '预警状态',
                            field: 'warningStatusName'
                        }, {
                            title: '预警来源',
                            field: 'warningSourceName'
                        }, {
                            title: '预警内容',
                            field: 'warningContent'
                        } ]
                    }
                },

                solveDatas: [],
                solvePopup: false,    //故障处理
                solveForm: {
                    faultDate: '',
                    faultLevel: '',
                    faultLocation: '',
                    faultDepict: ''
                }
            };
        },
        mounted () {
            this.$service.fault.getDevicewarninginfoCount().then(res => {
                this.faultNum = res || 0;
            });
        },
        methods: {
            onRadioChanged (e) {
                this.radioIdx = e;
                this.$nextTick(() => {
                    this.$refs[ 'table' + e ].init();
                });
            },
            //重置
            initParam () {
                this.solveForm = {
                    faultDate: '',
                    faultLevel: '',
                    faultLocation: '',
                    faultDepict: ''
                };
                this.solvePopup = false;
            },
            goDetails (row) {
                this.$router.push('/fault/detail?id=' + row.id + '&type=done');
            },
            goDetail (row) {
                this.$router.push('/fault/detail?id=' + row.id + '&type=look');
            },
            //提交事件处理
            subSolve () {
                let form = this.solveForm;
                if (!form.faultDate) {
                    this.$ctx.toastError('请选择故障时间');
                    return;
                }
                if (!form.faultLevel) {
                    this.$ctx.toastError('请选择故障等级');
                    return;
                }
                if (!form.faultLocation) {
                    this.$ctx.toastError('请输入发生位置');
                    return;
                }
                let params = {
                    ...form,
                    tunnelId: this.solveDatas[ 0 ].tunnelId,
                    faultLevelName: this.$refs.faultLevel.getSelectedName(),
                    trepairdetailedrecord: this.solveDatas.map(v => {
                        return {...v, warningId: v.id, id: undefined};
                    })
                };
                this.$service.fault.insertByWarning(params).then(() => {
                    this.initParam();
                    this.$notifySuccess();
                    this.$refs.table1.reload();
                });
            },
            // 搜索参数变化
            searchParmsChange (searchParms) {
                this.searchParms = searchParms;
            },
            // 数据加载完成
            dataLoaded (res) {
                this.tabs = [
                    {typeName: '全部故障'},
                    {typeName: '故障处理', count: res.disposeStateCount_0},
                    {typeName: '归档总结', count: res.disposeStateCount_1},
                    {typeName: '结束'}
                ];
            },
            changeClass (i) {
                // 0故障处理，1归档总结，2结束
                let map = {0: '', 1: 0, 2: 1, 3: 2};
                this.params = {
                    disposeState: map[ i ]
                };
                this.$nextTick(() => {
                    this.$refs.table0.reload(true);
                });
            },
            // 故障上报
            addFault () {
                this.$router.push('/fault/add-fault');
            },
            exportInfo () {
                this.$service.fault.exportFaultinfo(this.searchParms);
            },
            onFaultButtonClick (e) {    // 故障
                if (e.event === 'create') {
                    this.$router.push('/fault/add-fault');
                } else if (e.event === 'export') {
                    this.$service.fault.exportFaultinfo(e.params);
                }
            },
            onWarnButtonClick (e) {     // 预警
                let checkError = () => {
                    let tunnelId = '', leftRightFlagName = '';
                    let error = false;
                    let canSolve = true;
                    e.rows.forEach(v => {
                        if (v.warningStatus !== 0) {
                            canSolve = false;
                        }
                        if (!tunnelId && !leftRightFlagName) {
                            tunnelId = v.tunnelId;
                            leftRightFlagName = v.leftRightFlagName;
                        } else if (tunnelId !== v.tunnelId || leftRightFlagName !== v.leftRightFlagName) {
                            error = true;
                        }
                    });
                    if (error) {
                        this.$message.warning('请选择同一隧道和左右洞标识，才能进行操作，请重新选择。');
                        return true;
                    }
                    if (!canSolve) {
                        this.$message.warning('选择的预警数据中有已故障处理或忽略操作，请重新选择。');
                        return true;
                    }
                };
                if (e.event === 'export') {
                    this.$service.fault.exportTDevicewarninginfo(e.params);
                } else if (e.event === 'solve') {
                    if (checkError()) return;
                    this.solveDatas = e.rows;
                    this.solvePopup = true;
                } else if (e.event === 'ignore') {
                    if (checkError()) return;
                    this.$showConfirm('是否确定忽略预警？').then(() => {
                        this.$service.fault.ignoreWarnning(e.rows).then(() => {
                            this.$notifySuccess();
                            this.$refs.table1.reload();
                        });
                    });
                }
            }
        }
    };
</script>

<style lang="less">
    .page-fault {
        .el-dialog__body {
            padding: 10px 20px 0 !important;
        }
    }
</style>
<style lang="less">
    .page-fault {
        .el-table .cell {
            padding: 0;
        }

        .item-wrap {
            border: 1px solid rgba(34, 76, 151, 1);
            margin-bottom: 10px;
        }

        .el-table__header {
            border-top: 1px solid #1B3E6F;
        }

        .el-table--enable-row-transition .el-table__body td {
            border: none;
        }

        .el-table__row {
            padding: 0;

            .el-table--enable-row-transition .el-table__body td {
                border-right: 1px solid #1B3E6F;
            }
        }

        .el-table {
            border: none;
        }
    }
</style>
<style scoped lang="less">
    .content {
        padding: 30px 20px;
        color: #C1D9FF;
        font-size: 16px;
        background: rgba(12, 34, 83, 0.5);

        .row {
            display: flex;
            align-items: center;

            &.margin {
                margin-top: 30px;
            }

            .status-name {
                color: rgb(207, 156, 31);
            }

            .label {
                margin-right: 60px;

                &.last {
                    flex: 1;
                }
            }
        }

        .popup-item {
            display: flex;
            align-items: center;
        }
    }

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
</style>