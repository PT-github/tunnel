<template>
    <form-page :breadcrumb="[{name:'中心首页',path:'/system'},{name:'公告列表'}]">
        <h-table ref="table" :options="options" @click="onButtonClick" top="230"
                 @row-btn-click="onRowButtonClick"></h-table>

        <!--公告详情弹层-->
        <TipDetailPopup :showPopup="showTipsPopup"
                        width="800px"
                        @handleClose="showTipsPopup = false"
                        title="公告详情">
            <TipDetailCard :tipDetail="tipDetail"></TipDetailCard>
        </TipDetailPopup>

        <!--发布公告-->
        <create-notice v-model="showCreateNotice" @create="$refs.table.reload()"></create-notice>
    </form-page>
</template>

<script>
    import HTable from '../../components/h-table';
    import uploadFile from '../../components/basic/upload-file';
    import TipDetailPopup from '../../components/common-popup';
    import TipDetailCard from '../../components/index/tip-detail-card';
    import CreateNotice from '../../components/system/create-notice';

    export default {
        components: {
            HTable,
            uploadFile,
            TipDetailPopup,
            TipDetailCard,
            CreateNotice
        },
        services: [ 'notice' ],
        data () {
            return {
                showCreateNotice: false,
                showTipsPopup: false,
                tipDetail: {},
                options: {
                    search: [
                        {placeholder: '关键词搜索', field: 'title', type: 'text'},
                        {placeholder: '发布时间', field: 'publicTime,publicTimeEnd', type: 'daterange'},
                        {placeholder: '选择栏目', field: 'type', type: 'select', ds: {service: 'notice', func: 'getTypes'}},
                        {placeholder: '发布人员', field: 'createUserName', type: 'text'}
                    ],
                    buttons: [
                        {
                            name: '发布公告',
                            auth: '/system/notice/report',
                            type: 'primary',
                            icon: 'el-icon-plus',
                            event: 'create'
                        }
                    ],
                    table: {
                        service: 'notice',
                        func: 'getNoticeList',
                        selectable: true,
                        columns: [ {
                            title: '公告标题',
                            field: 'title'
                        }, {
                            title: '发布人员',
                            field: 'createUserName'
                        }, {
                            title: '发布时间',
                            field: 'createTime'
                        }, {
                            title: '所属栏目',
                            field: 'typeName'
                        }, {
                            title: '操作',
                            type: 'buttons',
                            buttons: [
                                {name: '详情', icon: 'el-icon-info', event: 'detail'},
                                {
                                    name: '删除',
                                    icon: 'el-icon-delete-solid',
                                    event: 'delete',
                                    auth: '/system/notice/delete'
                                } ]
                        } ]
                    }
                }
            };
        },
        methods: {
            onButtonClick (e) {
                if (e.event === 'create') {
                    this.showCreateNotice = true;
                }
            },
            onRowButtonClick (e) {
                let {event, row} = e;
                switch (event) {
                    case 'detail':
                        this.tipDetail = row;
                        this.showTipsPopup = true;
                        break;
                    case 'delete':
                        this.$showConfirm().then(() => {
                            this.$service.notice.deleteNotice(row.noticeId).then(() => {
                                this.$refs.table.reload(true);
                                this.$notifySuccess();
                            });
                        });
                        break;
                }
            }
        }
    };
</script>

<style scoped>

</style>