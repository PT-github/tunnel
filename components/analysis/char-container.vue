<template>
    <div class="char-container block">
        <div class="char-container-head">
            <div class="char-container-head-title">{{title}}</div>
            <div class="search-ctn" v-if="search && search.length">
                <div v-for="item in search"
                     style="display: flex;align-items: center">
                    <div class="search-item" v-if="item.type=='tunnel'">
                        所属隧道
                        <hSelect :ds="{service:'tunnel',func:'getListAll'}"
                                 class="mar-r"
                                 v-model="chartParam.tunnelId"
                                 placeholder="请选择隧道"></hSelect>
                    </div>
                    <div class="search-item" v-if="item.type=='LeftRightFlag'">
                        <hSelect :ds="{service:'basic',func:'getDict',params:'LeftRightFlag'}"
                                 v-model="chartParam.LeftRightFlag"
                                 placeholder="左右洞"></hSelect>
                    </div>
                    <div class="search-item" v-if="item.type=='date'">
                        {{item.name}}
                        <el-date-picker v-model="chartParam.date"
                                        class="mar-r"
                                        :type="item.selType=='day'?'daterange':'monthrange'"
                                        :value-format="item.valueType"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <el-button type="primary"
                           @click="searchData"
                           icon="el-icon-search">搜索
                </el-button>
            </div>
        </div>
        <slot name="content"></slot>
    </div>
</template>

<script>
    export default {
        name: 'char-container',
        props: {
            title: String,
            search: Array
        },
        data () {
            return {
                chartParam: {
                    tunnelId: '',
                    LeftRightFlag: '',
                    date: []
                }
            };
        },
        mounted () {
            let param = {
                tunnelId: '',
                LeftRightFlag: '',
                date: []
            };
            this.search && this.search.forEach(v => {
                if (v.default) {
                    param[ v.type ] = v.default;
                }
            });
            this.chartParam = param;
        },
        methods: {
            init () {

            },
            searchData () {
                let parm = this.chartParam;
                let param = {};
                if (parm.tunnelId) {
                    Object.assign(param, {
                        tunnelId: parm.tunnelId
                    });
                }
                if (parm.LeftRightFlag) {
                    Object.assign(param, {
                        LeftRightFlag: parm.LeftRightFlag
                    });
                }
                if (parm.date.length) {
                    Object.assign(param, {
                        dateS: parm.date[ 0 ],
                        dateE: parm.date[ 1 ]
                    });
                }
                this.$emit('search', param);
            }
        }
    };
</script>

<style scoped lang="less">
    .char-container {
        position: relative;
        overflow: hidden;
        width: 100%;

        .char-container-head {
            height: 80px;
            padding-left: 20px;
            padding-right: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;

            &-title {
                font-size: 20px;
                font-family: PingFang-SC-Heavy, PingFang-SC;
                font-weight: 800;
                color: #5391F3;
            }
        }

        .search-ctn {
            display: flex;
            align-items: center;

            .search-item {
                margin-right: 10px;
                font-size: 16px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #C1D9FF;
            }
        }
    }
</style>