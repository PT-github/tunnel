<template>
    <form-page :breadcrumb="[{name:'中心首页',path:'/system'},{name:'日志管理'}]"
               :radios="logConfig"
               @radio-change="onLogChanged">
        <h-table ref="table" :options="logTableConfig[radioIdx]"
                 top="230"
                 @row-btn-click="onRowButtonClick"></h-table>

        <popup title="操作日志明细" :show-popup="showOptLogDetail" @handleClose="showOptLogDetail = false">
            <h-table ref="optTable" :params="{logId:showOptLogId}"
                     :options="optDetailOptions"></h-table>
        </popup>
    </form-page>
</template>

<script>
    import HTable from '../../components/h-table';

    export default {
        components: {HTable},
        data () {
            return {
                radioIdx: 0,
                showOptLogDetail: false,
                showOptLogId: '',   // 弹窗显示的操作日志id
                logConfig: [ {label: '操作日志'}, {label: '系统日志'}, {label: '登录日志'} ],
                logTableConfig: [ { // 操作日志
                    search: [
                        {placeholder: '关键词搜索', field: 'keyWord', type: 'text'},
                        {placeholder: '操作时间', field: 'opeDate,opeDateEnd', type: 'daterange'},
                    ],
                    table: {
                        service: 'log',
                        func: 'getOptLogs',
                        columns: [ {
                            title: '序号',
                            type: 'index'
                        }, {
                            title: '操作时间',
                            field: 'oprTime'
                        }, {
                            title: '操作人员',
                            field: 'oprUser'
                        }, {
                            title: '操作类型',
                            field: 'oprType'
                        }, {
                            title: '操作IP',
                            field: 'oprIp'
                        }, {
                            title: '操作来源',
                            field: 'oprSource'
                        }, {
                            title: '操作说明',
                            field: 'oprRemark'
                        }, {
                            title: '操作',
                            type: 'buttons',
                            buttons: [ {name: '详情', icon: 'el-icon-info', event: 'detail'} ]
                        } ]
                    }
                }, {    // 系统日志
                    search: [
                        {placeholder: '关键词搜索', field: 'keyWord', type: 'text'},
                        {placeholder: '操作时间', field: 'opeDate,opeDateEnd', type: 'daterange'},
                    ],
                    table: {
                        service: 'log',
                        func: 'getSysLogs',
                        columns: [ {
                            title: '序号',
                            type: 'index'
                        }, {
                            title: '操作时间',
                            field: 'createTime'
                        }, {
                            title: '操作人员',
                            field: 'createUserName'
                        }, {
                            title: '操作模块',
                            field: 'controllerName'
                        }, {
                            title: '操作方法',
                            field: 'actionName'
                        }, {
                            title: '请求参数',
                            field: 'requestData',
                        }, {
                            title: '请求浏览器',
                            field: 'navigator'
                        }, {
                            title: '返回参数',
                            field: 'responseData'
                        } ]
                    }
                }, {        // 登录日志
                    search: [
                        {placeholder: '关键词搜索', field: 'keyWord', type: 'text'},
                        {placeholder: '登录时间', field: 'loginDate,loginDateEnd', type: 'daterange'},
                    ],
                    table: {
                        service: 'log',
                        func: 'getLoginLogs',
                        columns: [ {
                            title: '序号',
                            type: 'index'
                        }, {
                            title: '登录时间',
                            field: 'loginTime'
                        }, {
                            title: '登录名',
                            field: 'createUserName'
                        }, {
                            title: '登录',
                            field: 'source'
                        }, {
                            title: '浏览器/终端版本',
                            field: 'navigator'
                        }, {
                            title: '登录IP',
                            field: 'remoteIp'
                        } ]
                    }
                } ],
                optDetailOptions: {        // 操作日志明细
                    search: [],
                    table: {
                        service: 'log',
                        func: 'getOptLogDetail',
                        columns: [ {
                            title: '字段名称',
                            field: 'fieldName'
                        }, {
                            title: '字段名称描述',
                            field: 'fieldNameComment'
                        }, {
                            title: '原始值',
                            field: 'oldValue'
                        }, {
                            title: '新值',
                            field: 'newValue'
                        } ]
                    }
                }
            };
        },
        methods: {
            onLogChanged (e) {
                this.radioIdx = e;
                this.$nextTick(() => {
                    this.$refs.table.init();
                });
            },
            onRowButtonClick (e) {
                let {event, row} = e;
                switch (event) {
                    case 'detail':
                        this.showOptLogDetail = true;
                        this.showOptLogId = row.id;
                        this.$nextTick(() => {
                            this.$refs.optTable.reload(true);
                        });
                        break;
                }
            }
        }
    };
</script>

<style scoped>

</style>