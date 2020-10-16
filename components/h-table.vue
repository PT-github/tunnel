<template>
    <div class="table block" :style="{height: top?`calc(100vh - ${top*$px2rem}px)`:'auto'}" v-if="options"
         ref="htable">

        <slot name="form-title"></slot>

        <!--搜索框-->
        <el-form v-if="options.search && options.search.length" ref="form" :model="searchForm">
            <el-form-item v-for="item,index in options.search" :key="index">
                <el-input v-if="item.type==='text'"
                          size="medium"
                          :placeholder="item.placeholder"
                          :suffix-icon="item.icon"
                          v-model="searchForm[item.field]"></el-input>
                <el-date-picker v-else-if="item.type==='date'"
                                v-model="searchForm[item.field]"
                                value-format="yyyy-MM-dd"
                                type="date"
                                :placeholder="item.placeholder">
                </el-date-picker>
                <el-date-picker v-else-if="item.type==='daterange'"
                                v-model="searchForm[item.field]"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
                <el-date-picker v-else-if="item.type==='monthrange'"
                                v-model="searchForm[item.field]"
                                type="monthrange"
                                value-format="yyyy-MM"
                                range-separator="至"
                                start-placeholder="开始月份"
                                end-placeholder="开始月份">
                </el-date-picker>
                <h-select v-else-if="item.type==='select'" v-model="searchForm[item.field]" clearable
                          :placeholder="item.placeholder" :ds="item.ds">
                </h-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="doSearch" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="initSearch" icon="el-icon-refresh-right">重置</el-button>
            </el-form-item>

            <!--按钮-->
            <template v-if="options.searchButtons" v-for="btn in options.searchButtons">
                <el-form-item>
                    <!--文本-->
                    <template v-if="btn.type==='text'">
                        <slot name="l-title"></slot>
                    </template>
                    <!--上传文件-->
                    <template v-else-if="btn.selectFile">
                        <el-button :type="btn.type" :icon="btn.icon" v-auth="btn.auth">
                            <span>{{btn.name}}</span>
                            <input :ref="'selectFile_'+btn.event" class="btn-select-file" type="file"
                                   :accept="btn.selectFile"
                                   @change="onFileSelect(btn.event)">
                        </el-button>
                    </template>
                    <!--普通按钮-->
                    <template v-else>
                        <el-button :type="btn.type" :icon="btn.icon" v-auth="btn.auth"
                                   @click="popButtonEvent({event:btn.event,needData:btn.needData})">{{btn.name}}
                        </el-button>
                    </template>
                </el-form-item>
            </template>

        </el-form>

        <!--按钮-->
        <div class="btns">
            <template v-if="options.buttons" v-for="btn in options.buttons">
                <!--文本-->
                <template v-if="btn.type==='text'">
                    <slot name="l-title"></slot>
                </template>
                <!--上传文件-->
                <template v-else-if="btn.selectFile">
                    <el-button :type="btn.type" :icon="btn.icon" v-auth="btn.auth">
                        <span>{{btn.name}}</span>
                        <input :ref="'selectFile_'+btn.event" class="btn-select-file" type="file"
                               :accept="btn.selectFile"
                               @change="onFileSelect(btn.event)">
                    </el-button>
                </template>
                <!--普通按钮-->
                <template v-else>
                    <el-button :type="btn.type" :icon="btn.icon" v-auth="btn.auth"
                               @click="popButtonEvent({event:btn.event,needData:btn.needData})">{{btn.name}}
                    </el-button>
                </template>
            </template>
        </div>

        <!--表格-->
        <el-table :data="tableData"
                  v-loading="loading"
                  ref="table"
                  border
                  :show-header="!options.table.hideHeader"
                  tooltip-effect="dark"
                  class="table-com"
                  @selection-change="handleSelectionChange"
                  :style="{width:tableWidth+'px'}">
            <el-table-column
                    v-if="options.table.selectable"
                    type="selection"
                    :width="40*$px2rem">
            </el-table-column>
            <el-table-column v-if="options.table.customRow">
                <template slot-scope="scope">
                    <slot name="row" :row="scope.row"></slot>
                </template>
            </el-table-column>
            <template v-if="options.table.columns" v-for="col,index in options.table.columns">
                <!--普通的数据显示-->
                <el-table-column v-if="!col.type"
                                 :prop="col.field"
                                 :width="col.width"
                                 show-overflow-tooltip
                                 :label="col.title">
                </el-table-column>
                <!--自定义显示的数据-->
                <el-table-column v-else-if="col.type==='customField'"
                                 :width="col.width"
                                 show-overflow-tooltip
                                 :label="col.title">
                    <template slot-scope="scope">
                        <span>{{col.fieldFunction(scope.row)}}</span>
                    </template>
                </el-table-column>
                <!--索引-->
                <el-table-column v-else-if="col.type==='index'"
                                 :label="col.title"
                                 type="index"
                                 :width="60*$px2rem">
                </el-table-column>
                <!--开关-->
                <el-table-column v-else-if="col.type==='switch'"
                                 :label="col.title"
                                 :width="col.width">
                    <template slot-scope="scope">
                        <el-switch :value="col.isTrue(scope.row[col.field])" @change="popRowClick(scope.row,col.event)">
                        </el-switch>
                    </template>
                </el-table-column>
                <!--操作按钮-->
                <el-table-column v-else-if="col.type==='buttons'"
                                 :width="col.width"
                                 :label="col.title">
                    <template slot-scope="scope">
                        <template v-for="btn in col.buttons">
                            <el-button @click="popRowClick(scope.row,btn.event)" :icon="btn.icon" type="text"
                                       size="medium" v-auth="btn.auth">{{btn.name}}
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
                <!--进度条-->
                <el-table-column v-else-if="col.type==='progress'"
                                 :width="col.width"
                                 :label="col.title">
                    <template slot-scope="scope">
                        <el-progress :percentage="scope.row[col.field]"
                                     :show-text="true"
                                     color="#337CF3"></el-progress>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <div class="bottom">
            <div class="select-btns">
                <template v-if="options.table.selectable">
                    <el-button @click="toggleSelection(tableData)">全选</el-button>
                    <el-button @click="toggleSelection()">反选</el-button>
                </template>
            </div>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="page"
                    :page-sizes="[10,20,50,100]"
                    :page-size="pageSize"
                    background
                    layout="total, sizes, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import HSelect from './h-select';

    export default {
        components: {HSelect},
        props: {
            top: [ Number, String ],
            options: Object,    // 全部设置
            params: Object      // 列表接口的其他参数
        },
        data () {
            return {
                tableData: [],
                page: 1,
                pageSize: 10,
                total: 0,
                loading: false,
                selected: [],    // 选中的行
                searchForm: {},
                finalParams: {},
                tableWidth: ''
            };
        },
        mounted () {
            this.init();
        },
        methods: {
            init () {
                if (!this.options || !this.options.table) return;
                this.tableWidth = this.$refs.htable.clientWidth - 40 * this.$px2rem;
                this.initSearch();
                this.load();
            },
            onFileSelect (event) {  // 选择文件回调
                let files = this.$refs[ 'selectFile_' + event ][ 0 ].files;
                this.$emit('click', {
                    event,
                    files
                });
                this.$refs[ 'selectFile_' + event ][ 0 ].value = '';
            },
            popRowClick (row, event) {  // 列表每行的按钮点击
                this.$emit('row-btn-click', {
                    event: event,
                    row: row
                });
            },
            doSearch () {
                this.$emit('search', {params: this.searchForm, finalParams: this.finalParams});
                this.reload(true);
            },
            popButtonEvent (e) {    // 表格上面的按钮点击
                if (e.needData) {
                    if (!(this.selected && this.selected.length)) {
                        return this.$message('请先选择数据');
                    } else if (typeof e.needData === 'number' && e.needData !== this.selected.length) {
                        return this.$message(`只能选择${e.needData}条数据`);
                    }
                }
                this.$emit('click', {
                    event: e.event,
                    rows: this.selected,
                    params: this.finalParams
                });
            },
            initSearch () { // 初始化/重置搜索表单
                let form = {};
                this.searchForm = this.options.search.forEach(v => {
                    form[ v.field ] = v.default || '';
                });
                this.searchForm = form;
            },
            load () {
                let service = this.$bean.makeBean(this.options.table.service);
                let searchFormParams = {};
                Object.keys(this.searchForm).forEach(v => {
                    if (v.indexOf(',') !== -1) {
                        let fields = v.split(',');
                        fields.forEach((f, i) => {
                            if (this.searchForm[ v ] && this.searchForm[ v ][ i ]) {
                                searchFormParams[ f ] = this.searchForm[ v ][ i ];
                            }
                        });
                    } else {
                        // 状态值为0的也要考虑
                        if (this.searchForm[ v ] || this.searchForm[ v ] === 0) {
                            searchFormParams[ v ] = this.searchForm[ v ];
                        }
                    }
                });
                this.finalParams = {
                    page: this.page,
                    pageSize: this.pageSize,
                    ...searchFormParams,
                    ...this.params
                };
                this.loading = true;
                service[ this.options.table.func ](this.finalParams).then(res => {
                    this.tableData = res.records;
                    this.total = Number(res.total);
                    this.$emit('dataLoaded', res);
                    this.loading = false;
                }).catch(() => {
                    this.tableData = [];
                    this.loading = false;
                });
            },
            reload (clear) {
                if (clear) {
                    this.page = 1;
                }
                this.load();
            },
            handleSizeChange (val) {
                this.pageSize = val;
                this.reload();
            },
            handleCurrentChange (val) {
                this.page = val;
                this.reload();
            },
            toggleSelection (rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.table.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.table.clearSelection();
                }
            },
            handleSelectionChange (val) {
                this.selected = val;
            }
        },
        watch: {
            finalParams: {
                handler (val) {
                    this.$emit('searchChange', val);
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .table {
        padding: 36px 20px 10px;
        display: flex;
        flex-direction: column;
    }

    .bottom {
        margin-top: 25px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .el-button {
        position: relative;
        overflow: hidden;

        .btn-select-file {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0;
        }
    }

    .el-table {
        flex: 1;
        max-height: 100%;
    }

    .el-form {
        display: flex;
        /*flex-wrap: wrap;*/
        width: 100%;

        .el-form-item {
            margin-right: 20px;
        }
    }

    .table-com {
        height: 1000px;
        overflow-y: auto;
    }

    .table-com,
    .table-com /deep/ table,
    /deep/ .el-table__body-wrapper.is-scrolling-none {
        overflow-y: auto;

        &::-webkit-scrollbar {
            /*滚动条整体样式*/
            width: 4px;
            height: 80%;
        }

        &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background: rgba(24, 116, 174, 1) !important;
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        }
    }

    .btns {
        margin-bottom: 20px;
    }

    /deep/ .el-pagination__total {
        color: #C1D9FF;
    }
</style>