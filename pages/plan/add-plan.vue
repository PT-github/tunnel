<template>
    <form-page :breadcrumb="[{name:'应急预案',path:'/plan/'},{name:`${$route.query.type==='edit'?'编辑':'新增'}预案`}]">
        <div class="org block">
            <div class="add-tunnel-ctn">
                <el-form :model="planForm" ref="planForm"
                         :label-width="100*$px2rem+'px'"
                         class="demo-ruleForm">
                    <title-com title="基本信息"></title-com>

                    <div class="form-items">
                        <el-form-item label="所属隧道:" required>
                            <el-form-item prop="tunnelId"
                                          :rules="[{ required: true, message: '请选择所属隧道', trigger: 'blur' }]"
                                          style="display: inline-block;">
                                <h-select :ds="{service:'tunnel',func:'getListAll'}"
                                          v-model="planForm.tunnelId"
                                          required
                                          @input="selectedTunnel"
                                          placeholder="请选择隧道"></h-select>
                            </el-form-item>
                            <el-form-item prop="leftRightFlag"
                                          :rules="[{ required: true, message: '请选择洞类型', trigger: 'blur' }]"
                                          style="display: inline-block;margin-left: 20px;">
                                <h-select :ds="{service:'basic',func:'getDict',params:'leftRightFlag'}"
                                          v-model="planForm.leftRightFlag"
                                          ref="leftRightFlag"
                                          placeholder="请选择洞类型"></h-select>
                            </el-form-item>
                        </el-form-item>

                        <el-form-item label="预案类型:"
                                      prop="eventTypeId"
                                      :rules="[{ required: true, message: '请选择预案类型', trigger: 'blur' }]">
                            <h-select :ds="{service:'plan',func:'getEventTypes'}"
                                      v-model="planForm.eventTypeId"
                                      ref="eventType"
                                      placeholder="请选择预案类型"></h-select>
                        </el-form-item>

                        <el-form-item label="预案名称:"
                                      prop="planName"
                                      :rules="[{ required: true, message: '请输入预案名称', trigger: 'blur' },]">
                            <el-input v-model="planForm.planName"
                                      placeholder="请输入预案名称"></el-input>
                        </el-form-item>

                        <el-form-item label="事件等级:" prop="planLevel"
                                      :rules="[{ required: true, message: '请选择所属隧道', trigger: 'blur' }]">
                            <h-select :ds="{service:'basic',func:'getDict',params:'EventLevel'}"
                                      v-model="planForm.planLevel"
                                      ref="level"
                                      placeholder="请选择事件等级"></h-select>

                            <div class="second-selest-item">
                                <div style="display: flex;align-items: center">
                                    <div class="j-w-title">是否启用预案：</div>
                                    <el-switch v-model="planForm.planStatus"></el-switch>
                                </div>
                            </div>
                        </el-form-item>

                        <el-form-item label="预案说明:">
                            <el-input type="textarea"
                                      style="overflow:hidden; resize:none; "
                                      :autosize="{ minRows: 2, maxRows: 20 }"
                                      maxlength="300"
                                      show-word-limit
                                      placeholder="请输入预案说明"
                                      v-model="planForm.reamrks">
                            </el-input>
                        </el-form-item>
                    </div>

                    <title-com title="预案执行内容"></title-com>
                    <div class="collapse-ctn">
                        <div class="collapse-item block">
                            <div class="collapse-title">
                                <span>设备</span>
                                <span>操作</span>
                            </div>
                            <el-collapse v-model="activeNames"
                                         @change="changeCol">
                                <el-collapse-item :title="item.classifyName"
                                                  v-for="(item,index) in deviceList"
                                                  :key="index"
                                                  :name="index+1">
                                    <div class="event-item"
                                         v-if="item._list && item._list.length"
                                         v-for="i in item._list">
                                        <div class="event-item-l">
                                            [{{i.leftRightFlagName}}] {{i.deviceName}} <span class="s1">{{i.deviceTypeName}}</span>
                                        </div>
                                        <div class="event-item-r" @click="editOperation(i.id)">
                                            <i class="el-icon-circle-plus"></i>
                                        </div>
                                    </div>
                                </el-collapse-item>
                            </el-collapse>
                        </div>

                        <div class="show-img">
                            <i class="el-icon-d-arrow-right"></i>
                        </div>

                        <div class="collapse-item block" :style="{width: $getPx(992)}">
                            <div class="collapse-titles">
                                <div class="v1">已选设备</div>
                                <div class="v2">设备类型</div>
                                <div class="v3">操作</div>
                            </div>
                            <div class="collapse-items"
                                 v-for="(item,index) in operationList"
                                 v-if="operationList && operationList.length">
                                <div class="v1">{{item.deviceName}}<span class="s1">{{item.pileNumber}}</span></div>
                                <div class="v2">{{item.deviceTypeName}}</div>
                                <div class="v3">
                                    <div class="remark">{{item.reamrks}}</div>
                                    <div class="done-icon" @click="editOperation(item.deviceId)">
                                        <i class="el-icon-edit-outline"></i>
                                    </div>
                                    <div class="done-icon"
                                         @click="del(index)"
                                         style="margin-left: 40px">
                                        <i class="el-icon-close"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>

            <el-button type="primary" @click="submitForm('planForm')" class="btn-submit">提交</el-button>
            <el-button type="primary" @click="resetData()">重置</el-button>
        </div>

        <popup showButton
               :width="$getPx(528)"
               class="device-popup"
               :showPopup="showPopup"
               @handleClose="handleClose"
               @btnCannal="handleClose"
               @btnConfirm="btnConfirm"
               title="添加设备操作">
            <div v-if="operateDevice && operateDevice.id && operateForm">
                <div class="device-name">{{operateDevice.deviceName}}</div>
                <el-form ref="operateForm" v-model="operateForm" v-if="operations && operations.length">
                    <el-form-item v-for="item,idx in operations" :key="idx"
                                  :label="item.propertyName+'：'">
                        <!--单选 改成开关式-->
                        <h-select v-if="item.controlMode===0"
                                  required
                                  :ds="item._selected"
                                  v-model="operateForm[item.id].operateValue"
                                  :placeholder="'请选择'+item.propertyName"></h-select>
                        <!--复选框组件（暂未封装）-->
                        <h-select v-else-if="item.controlMode===1"
                                  :ds="item._selected"
                                  v-model="operateForm[item.id].operateValue"
                                  required
                                  multiple
                                  :placeholder="'请选择'+item.propertyName"></h-select>
                        <!--输入框-->
                        <el-input-number v-else-if="item.controlMode===2"
                                         v-model="operateForm[item.id].operateValue"
                                         :min="Number(item.propertyValueModels['min'])"
                                         :max="Number(item.propertyValueModels['max'])"
                                         :placeholder="'请输入'+item.propertyName"></el-input-number>

                        <el-checkbox v-model="operateForm[item.id].select"></el-checkbox>

                    </el-form-item>
                </el-form>
            </div>
        </popup>
    </form-page>
</template>

<script>
    import titleCom from '../../components/index/tips-title';

    export default {
        name: 'add-plan',
        services: [ 'plan', 'basic', 'device' ],
        components: {
            titleCom
        },
        mounted () {
            let {type, id} = this.$route.query;
            if (type === 'edit') {
                this.id = id;
                this.$service.plan.queryPlanDetail(id).then(res => {
                    this.planForm = {
                        tunnelId: res.tunnelId,
                        eventTypeId: res.eventTypeId,
                        planName: res.planName,         //预案名称
                        leftRightFlag: String(res.leftRightFlag),   //洞类型
                        planLevel: String(res.planLevel),        //事件等级
                        planStatus: !!res.planStatus,         //自动提醒
                        reamrks: res.reamrks
                    };
                    this.operationList = res.operateItem;
                });
            }
        },
        data () {
            return {
                planForm: {
                    eventTypeId: '',     // 预案类型
                    tunnelId: '',       //所属隧道
                    planName: '',         //预案名称
                    leftRightFlag: '',   //洞类型
                    planLevel: '',        //事件等级
                    planStatus: false,         //自动提醒
                    reamrks: ''
                },

                activeNames: [ '1' ], //折叠版默认
                deviceList: [],           //设备class
                operationList: [],     //选中设备对象
                operations: [],          // 弹窗设备的所有操作
                operateForm: {},          // 弹窗的操作表单
                showPopup: false,     //设备操作弹窗

                operateDevice: {},     //操作对象模板
                editIdx: 0          //操作索引
            };
        },
        methods: {
            resetData () {
                this.$confirm('确定清空数据？', '提示', {
                    confirmButtonText: '确定',
                    type: 'warning',
                    showClose: false
                }).then(() => {
                    this.planForm = {};
                    this.operationList = [];
                });
            },
            submitForm (formName) {
                this.$refs[ formName ].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if (!this.operationList.length) {
                        return this.$message.warning('请选择此预案对应的设备');
                    }
                    let {tunnelId, leftRightFlag, eventTypeId, planName, planLevel, planStatus, reamrks} = this.planForm;
                    let params = {
                        id: this.id,
                        tunnelId,
                        leftRightFlag,
                        leftRightFlagName: this.$refs.leftRightFlag.getSelectedName(),
                        eventTypeId,
                        // eventType: this.$refs.eventType.getSelectedName(),
                        planName,
                        planLevel,
                        planLevelName: this.$refs.level.getSelectedName(),
                        planStatus: planStatus ? 1 : 0,
                        reamrks,
                        operateinfo: this.operationList.map((v, i) => {
                            return {
                                ...v,
                                propertyId: v.propertyId || v.id,  // 编辑的时候取原有的propertyId
                                sortInt: i + 1,
                                id: undefined,
                                _selected: undefined,
                                _value: undefined
                            };
                        })
                    };
                    this.$confirm('确定提交数据？', '提示', {
                        confirmButtonText: '确定',
                        type: 'warning',
                        showClose: false
                    }).then(() => {
                        this.$service.plan.createOrUpdatePlan(params).then(() => {
                            this.$router.back();
                            this.$notifySuccess();
                        });
                    });

                });
            },
            //点击设备根据tpe类型判断是新增还是编辑
            async editOperation (deviceId) {
                console.log(deviceId);
                let operations = await this.$service.plan.getDevicePropertyValueInfo(deviceId).catch(() => {});
                if (!operations) return;
                this.operations = operations;
                let device = null;
                this.deviceList.forEach(v => {
                    if (v._list && !device) {
                        device = v._list.find(d => d.id === deviceId);
                    }
                });
                if (!device) {
                    device = await this.$service.device.getById(deviceId);
                }
                let operateForm = {};
                let existList = this.operationList.filter(v => v.deviceId === deviceId);    // 先查找是否已经在操作列表中
                if (existList.length) {
                    operations.forEach(v => {
                        let e = existList.find(o => o.id === v.id || o.propertyId === v.id);
                        if (v.controlMode === 0) {
                            operateForm[ v.id ] = {...v, operateValue: e ? e.operateValue : v._selected[ 0 ].value};
                        } else if (v.controlMode === 1) {
                            operateForm[ v.id ] = {...v, operateValue: e ? e.operateValue : []};
                        } else if (v.controlMode === 2) {
                            operateForm[ v.id ] = {...v, operateValue: e ? e.operateValue : v.propertyValueModels.min};
                        }
                        operateForm[ v.id ].select = !!e;
                        operateForm[ v.id ].deviceId = deviceId;
                        operateForm[ v.id ].deviceName = device.deviceName;
                        operateForm[ v.id ].bookClassifyId = device.bookClassifyId;
                        operateForm[ v.id ].pileNumber = device.pileNumberStr;
                        operateForm[ v.id ].deviceTypeName = device.deviceTypeName;
                    });
                } else {
                    operations.forEach(v => {
                        operateForm[ v.id ] = v;
                        if (v.controlMode === 0) {
                            operateForm[ v.id ] = {...v, operateValue: v._selected[ 0 ].value};
                        } else if (v.controlMode === 1) {
                            operateForm[ v.id ] = {...v, operateValue: []};
                        } else if (v.controlMode === 2) {
                            operateForm[ v.id ] = {...v, operateValue: v.propertyValueModels.min};
                        }
                        operateForm[ v.id ].select = false;
                        operateForm[ v.id ].deviceId = deviceId;
                        operateForm[ v.id ].deviceName = device.deviceName;
                        operateForm[ v.id ].bookClassifyId = device.bookClassifyId;
                        operateForm[ v.id ].pileNumber = device.pileNumberStr;
                        operateForm[ v.id ].deviceTypeName = device.deviceTypeName;
                    });
                }
                this.operateForm = operateForm;
                this.operateDevice = device;
                this.showPopup = true;
            },
            //弹框确认按钮
            btnConfirm () {
                let change = [];
                let add = [];
                let tmp = [].concat(this.operationList);
                let getRemark = v => {
                    let value = '';
                    if (v.controlMode === 0) {
                        value = Object.keys(v.propertyValueModels)[ Object.values(v.propertyValueModels).indexOf(v.operateValue) ];
                    } else if (v.controlMode === 1) {

                    } else if (v.controlMode === 2) {
                        value = v.operateValue;
                    }
                    // let value = Object.values(v.propertyValue)
                    return v.propertyName + '：' + value;
                };
                Object.values(this.operateForm).forEach(v => {    // 遍历当前的操作
                    let exist = false;
                    this.operationList.forEach((o, i) => {      // 对比已经放到右边的操作
                        if (v.deviceId === o.deviceId && (v.id === o.id || v.id === o.propertyId)) {          // 如果已经有了，就修改
                            exist = true;
                            change.push({
                                idx: i,
                                newVal: v,
                                select: v.select
                            });
                        }
                    });
                    if (!exist) {                               // 没有的话就加到最后面
                        v.select && add.push({...v, reamrks: getRemark(v)});
                    }
                });
                change.forEach(v => {
                    if (v.select) {
                        tmp.splice(v.idx, 1, {...v.newVal, reamrks: getRemark(v.newVal)});
                    } else {
                        tmp.splice(v.idx, 1);
                    }
                });
                this.operationList = tmp.concat(add);
                this.showPopup = false;
                this.operateForm = {};
                this.operateDevice = {};
            },
            //关闭弹层（清空operateDate模板）
            handleClose () {
                this.showPopup = false;
                this.operateForm = {};
                this.operateDevice = {};
            },
            //删除右侧列表
            del (index) {
                this.operationList.splice(index, 1);
            },
            //点击设备分类查设备列表
            changeCol (arr) {
                if (!this.planForm.tunnelId) {
                    this.$ctx.toastError('请先选择所属隧道');
                    return;
                }
                //获取当前索引（组件有点特殊，没有直接得索引）
                let idx = (arr[ arr.length - 1 ]) - 1;
                //当有list不再加载设备列表
                if (this.deviceList[ idx ]._list && this.deviceList[ idx ]._list.length) {
                    return;
                }
                //否则 初始化list对象
                this.deviceList[ idx ]._list = [];
                this.$service.device.getDeviceByTunnelId({
                    classifyId: this.deviceList[ idx ].id,
                    tunnelId: this.planForm.tunnelId
                }).then(res => {
                    if (res && res.length) {
                        //赋值设备列表到设备Class下
                        this.deviceList[ idx ]._list = res;
                        this.$forceUpdate();
                    }
                });
            },
            //选择所属隧道，更新设备Class列表
            selectedTunnel (tunnelId) {
                this.activeNames = [ '1' ];
                this.$service.device.getDevicClassifyInfoeByTunnelId({tunnelId: tunnelId}).then(res => {
                    this.deviceList = res || [];
                });
            }
        }
    };
</script>

<style scoped lang="less">
    /deep/ .org .el-input {
        width: 300px;
    }

    .btn-submit {
        margin-left: 30px;
    }

    .org {
        position: relative;
        height: 100%;
        padding-bottom: 20px;

        .add-tunnel-ctn {
            padding-top: 20px;
            margin-left: 30px;

            .form-items {
                margin-top: 30px;
                padding-bottom: 20px;

                .second-selest-item {
                    display: inline-block;
                    margin-left: 20px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    color: #337CF3;
                }

                /deep/ .el-textarea {
                    width: 448px;

                    .el-textarea__inner {
                        width: 100%;
                        min-height: 96px !important;
                        padding-bottom: 2px;
                        border: none;
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                    }

                    .el-input__count {
                        background: none;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #337CF3;
                    }
                }
            }

            .collapse-ctn {
                display: flex;
                margin-top: 30px;
                margin-bottom: 20px;
                align-items: center;

                .collapse-item {
                    height: 551px;
                    position: relative;
                    border-radius: 4px;
                    overflow: scroll;
                    width: 742px;
                    background: #123A84;

                    .collapse-title {
                        height: 50px;
                        padding-left: 30px;
                        padding-right: 30px;
                        font-size: 16px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #337CF3;
                        background: #0C2253;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                    }

                    .event-item {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        height: 50px;
                        padding-left: 60px;
                        padding-right: 30px;
                        width: calc(100 - 60px);
                        background: #123A84;

                        .event-item-l {
                            color: #C1D9FF;
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;

                            .s1 {
                                margin-left: 10px
                            }
                        }

                        .event-item-r {
                            .el-icon-circle-plus {
                                cursor: pointer;
                                color: #C1D9FF;
                                font-size: 24px;
                            }
                        }
                    }

                    .collapse-titles {
                        background: #0C2253;
                        font-size: 16px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #337CF3;
                    }

                    .collapse-items {
                        background: #123A84;
                        font-size: 16px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #C1D9FF;
                        border-bottom: 1px solid #224C97;
                    }

                    .collapse-titles, .collapse-items {
                        height: 50px;
                        width: 100%;
                        display: flex;
                        align-items: center;

                        .v1 {
                            display: flex;
                            align-items: center;
                            margin-left: 30px;
                            width: 402px;

                            .s1 {
                                margin-left: 20px
                            }
                        }

                        .v2 {
                            display: flex;
                            align-items: center;
                            width: 308px;
                        }

                        .v3 {
                            display: flex;
                            align-items: center;
                            width: calc(100% - 402px - 308px);

                            .remark {
                                width: 150px;
                            }

                            .done-icon {
                                cursor: pointer;
                                height: 20px;
                                width: 20px;

                                i {
                                    font-size: 20px;
                                }
                            }
                        }
                    }
                }
            }

            .show-img {
                margin-left: 20px;
                margin-right: 20px;
                font-size: 30px;
                color: #c1d9ff;
            }
        }
    }

    .device-name {
        margin: 20px 0;
        background: #0C2253;
        padding: 15px 0 15px 20px;
        font-size: 16px;
        font-family: PingFang-SC-Heavy, PingFang-SC;
        font-weight: 800;
        color: #5391F3;
        border-radius: 4px;
        border: 1px solid #224C97;
    }

    .input-type {
        display: flex;
        align-items: center;
        margin-left: 0px;
        margin-top: 20px;

        .type-title {
            font-size: 15px;
            font-family: PingFang-SC-Heavy, PingFang-SC;
            font-weight: 800;
            color: #5391F3;
            margin-right: 20px;
        }
    }

    .device-popup {
        .el-form-item {
            display: flex;

            /deep/ .el-form-item__label {
                width: 120px;
            }

            /deep/ .el-form-item__content {
                flex: 1;
                display: flex;
            }

            .el-select, .el-input-number {
                flex: 1;
            }

            .el-checkbox {
                padding: 0 10px 0 20px;
            }
        }
    }
</style>