<template>
    <form-page no-back>
        <h-table ref="table" :options="options"
                 top="170"
                 @click="onButtonClick"
                 @row-btn-click="onRowButtonClick"></h-table>
    </form-page>
</template>

<script>
    import HTable from '../../components/h-table';

    export default {
        services: [ 'plan' ],
        components: {HTable},
        data () {
            return {
                options: {
                    search: [
                        {placeholder: '预案名称', field: 'planName', type: 'text', label: '预案名称'},
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
                            ds: {service: 'basic', func: 'getDict', params: 'LeftRightFlag'}
                        },
                        {
                            placeholder: '预案类型', field: 'eventTypeId', type: 'select',
                            ds: {service: 'plan', func: 'getEventTypes'}
                        },
                        {
                            placeholder: '启用状态', field: 'planStatus', type: 'select',
                            ds: {service: 'basic', func: 'getDict', params: 'AllEnabledState'}
                        }
                    ],
                    buttons: [
                        {
                            name: '新增预案',
                            type: 'primary',
                            icon: 'el-icon-plus',
                            event: 'create',
                            auth: '/rest/TContingencyPlanRecord/add'
                        },
                        {name: '启用预案', event: 'enable', needData: true, auth: '/rest/TContingencyPlanRecord/start'},
                        {name: '停用预案', event: 'disable', needData: true, auth: '/rest/TContingencyPlanRecord/stop'},
                        {
                            name: '批量删除',
                            icon: 'el-icon-delete',
                            event: 'delete',
                            needData: true,
                            auth: '/rest/TContingencyPlanRecord/batchdelete'
                        }
                    ],
                    table: {
                        service: 'plan',
                        func: 'getList',
                        selectable: true,
                        columns: [ {
                            title: '预案名称',
                            field: 'planName'
                        }, {
                            title: '预案类型',
                            field: 'eventType',
                            width: '200px'
                        }, {
                            title: '所属隧道',
                            field: 'tunnelName'
                        }, {
                            title: '左右洞标识',
                            field: 'leftRightFlagName',
                            width: '120px'
                        }, {
                            title: '是否启用',
                            field: 'planStatus',
                            type: 'switch',
                            isTrue: planStatus => planStatus === 1,
                            event: 'switch',
                            width: '120px'
                        }, {
                            title: '预案说明',
                            field: 'reamrks'
                        }, {
                            title: '操作',
                            type: 'buttons',
                            buttons: [
                                {name: '详情', icon: 'el-icon-info', event: 'detail'},
                                {name: '编辑', icon: 'el-icon-edit', event: 'edit'},
                                {
                                    name: '删除',
                                    icon: 'el-icon-delete-solid',
                                    event: 'delete',
                                    auth: '/rest/TContingencyPlanRecord/delete'
                                } ]
                        } ]
                    }
                }
            };
        },
        methods: {
            onButtonClick (e) {
                if (e.event === 'create') {
                    this.$router.push({
                        path: '/plan/add-plan'
                    });
                } else if (e.event === 'enable' || e.event === 'disable') {
                    this.updateStatus(e.rows.map(v => v.id), e.event === 'enable' ? 1 : 0);
                } else if (e.event === 'delete') {
                    this.deletePlan(e.rows.map(v => v.id));
                }
            },
            updateStatus (idList, newStatus) {    // 启用/停用预案
                this.$service.plan.updateStatus(idList, newStatus).then(() => {
                    this.$refs.table.reload(true);
                    this.$notifySuccess('操作成功');
                });
            },
            deletePlan (ids) {  // 删除预案
                this.$service.plan.deletePlan(ids).then(() => {
                    this.$refs.table.reload(true);
                    this.$notifySuccess();
                });
            },
            onRowButtonClick (e) {
                let {event, row} = e;
                switch (event) {
                    case 'detail':
                        this.$router.push({
                            path: '/plan/detail',
                            query: {
                                id: row.id
                            }
                        });
                        break;
                    case 'edit':
                        this.$router.push({
                            path: '/plan/add-plan',
                            query: {
                                id: row.id,
                                type: 'edit'
                            }
                        });
                        break;
                    case 'delete':
                        this.$showConfirm().then(() => {
                            this.deletePlan([ row.id ]);
                        });
                        break;
                    case 'switch':
                        let newStatus = [ 1, 0 ].indexOf(row.planStatus);
                        this.updateStatus([ row.id ], newStatus);
                        break;
                }
            }
        }
    };
</script>

<style scoped>
    /deep/ .el-table_1_column_7 .el-tooltip {
        text-align: left;
    }
</style>