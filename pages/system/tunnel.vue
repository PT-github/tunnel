<template>
    <form-page :breadcrumb="[{name:'中心首页',path:'/system'},{name:'隧道列表'}]">
        <div slot="left" class="org block">
            <el-tree :data="orgList" :props="{children: 'childList',label: 'name'}"
                     :default-expanded-keys="allKeys"
                     node-key="organizationId"
                     icon-class="none"
                     @node-click="handleOrgClick">
                <div slot-scope="{ node, data }" class="tree-item">
                    <img src="../../assets/images/org.png" v-if="data.childList && data.childList.length">
                    <span>{{data.name}}</span>
                </div>
            </el-tree>
        </div>
        <h-table ref="table" :params="params" :options="options" top="230"
                 @click="onButtonClick"
                 @row-btn-click="onRowButtonClick"></h-table>
    </form-page>
</template>

<script>
    import HTable from '../../components/h-table';

    export default {
        components: {HTable},
        services: [ 'tunnel', 'basic' ],
        mounted () {
            this.getOrgList();
        },
        data () {
            return {
                orgList: [],    // 组织列表
                params: {},
                allKeys: [],
                options: {
                    search: [
                        {placeholder: '创建日期', field: 'createdUserDate,createdUserDateEnd', type: 'daterange'},
                        {placeholder: '隧道名称', field: 'tunnelName', type: 'text'}
                    ],
                    buttons: [
                        {
                            name: '新增隧道',
                            type: 'primary',
                            icon: 'el-icon-plus',
                            event: 'create',
                            auth: '/rest/userinfo/tunnel/add'
                        },
                        {
                            name: '批量删除',
                            icon: 'el-icon-delete',
                            event: 'delete',
                            needData: true,
                            auth: '/rest/userinfo/tunnel/batchdelete'
                        }
                    ],
                    table: {
                        service: 'tunnel',
                        func: 'getTunnelList',
                        selectable: true,
                        columns: [ {
                            title: '所属地区',
                            field: 'cityName'
                        }, {
                            title: '隧道名称',
                            field: 'tunnelName'
                        }, {
                            title: '起止桩号',
                            type: 'customField',
                            fieldFunction: row => `K${row.startStakeMarkKm}+${row.startStakeMarkM} ~ K${row.endStakeMarkKm}+${row.endStakeMarkM}`
                        }, {
                            title: '隧道类型',
                            field: 'tunnelTypeName'
                        }, {
                            title: '单双洞类型',
                            field: 'singleDoubleTypeName'
                        }, {
                            title: '是否启用',
                            field: 'enableStatus',
                            type: 'switch',
                            isTrue: enableStatus => enableStatus === 1,
                            event: 'switch'
                        }, {
                            title: '所属路段',
                            field: 'belongsStretch'
                        }, {
                            title: '操作',
                            type: 'buttons',
                            buttons: [
                                {
                                    name: '编辑',
                                    icon: 'el-icon-edit',
                                    event: 'edit',
                                    auth: '/rest/userinfo/tunnel/edit'
                                },
                                {
                                    name: '删除',
                                    icon: 'el-icon-delete-solid',
                                    event: 'delete',
                                    auth: '/rest/userinfo/tunnel/delete'
                                } ]
                        } ]
                    }
                }
            };
        },
        methods: {
            handleOrgClick (e) {    // 点击组织架构
                this.params = {
                    organizationId: e.organizationId
                };
                this.$nextTick(() => {
                    this.$refs.table.reload(true);
                });
            },
            getOrgList () { // 组织架构列表
                this.$service.basic.getOrgList().then(res => {
                    console.time('递归洗数据');
                    this.allKeys = this.getAllKeys(res);
                    console.timeEnd('递归洗数据');
                    this.orgList = res;
                });
            },
            deleteTunnels (ids) {   // 删除隧道
                this.$showConfirm().then(() => {
                    this.$service.tunnel.deleteTunnels(ids.join(',')).then(() => {
                        this.$refs.table.reload(true);
                        this.$notifySuccess();
                    });
                });
            },
            onButtonClick (e) {     // 点击按钮
                if (e.event === 'create') {
                    this.$router.push('/system/add-tunnel');
                } else if (e.event === 'delete') {
                    this.deleteTunnels(e.rows.map(v => v.id));
                }
            },
            //  递归生成ID
            getAllKeys (list = [], key = 'organizationId') {
                let ids = [];
                list.forEach(item => {
                    ids.push(item[ key ]);
                    if (item.childList && item.childList.length) {
                        ids = [ ...ids, ...this.getAllKeys(item.childList) ];
                    }
                });
                return ids;
            },
            onRowButtonClick (e) {  // 表格内的操作按钮
                let {event, row} = e;
                switch (event) {
                    case 'edit':
                        this.$router.push({
                            path: '/system/add-tunnel',
                            query: {
                                id: row.id,
                                type: 'edit'
                            }
                        });
                        break;
                    case 'delete':
                        this.deleteTunnels([ row.id ]);
                        break;
                    case 'switch':
                        let newStatus = [ 1, 0 ].indexOf(row.enableStatus);
                        if (newStatus === -1) {
                            return this.$message.error('隧道数据异常');
                        }
                        this.$service.tunnel.updateTunnelStatus(row.id, newStatus).then(() => {
                            this.$refs.table.reload(true);
                            this.$notifySuccess('操作成功');
                        });
                        break;
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .org {
        height: calc(100vh - 230px);
        overflow: scroll;
        padding-top: 20px;
    }

    .tree-item {
        padding: 0 15px;

        span {
            margin-left: 5px;
            font-size: 18px;
            line-height: 50px;
        }

        img {
            height: 18px;
        }
    }
</style>