<template>
    <div class="tabs-ctn">
        <el-tabs type="border-card"
                 v-model="activeNum"
                 @tab-click="clickBar">
            <el-tab-pane v-for="(tabs,index) in tab"
                         :key="index"
                         :name="index.toString()">
                <div slot="label" class="tab-content">
                    <!--标签-->
                    <!--<i class="el-icon-date"></i>-->

                    <img class="icon" v-if="icon && iconType==='alarm'"
                         :src="`/static/alarm/type${tabs[icon]}.png`">

                    {{tabs[tabName]}}
                    <!--统计数-->
                    <div class="dot" v-if="dotName && tabs[dotName]">{{tabs[dotName]}}</div>
                </div>
            </el-tab-pane>
            <slot></slot>
        </el-tabs>

        <div class="top-right-slot">
            <slot name="right-slot"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'h-tab',
        props: {
            tab: Array,
            active: {
                type: String,
                default: '0'
            },
            iconType: String,    // 图标类型
            icon: String,        //图标名
            tabName: String,     //tab字段名
            dotName: String     //统计数字段名
        },
        data () {
            return {
                activeNum: this.active
            };
        },
        methods: {
            clickBar () {
                this.$emit('clickBar', this.activeNum);
            }
        },
        computed: {}
    };
</script>

<style scoped lang="less">
    .tabs-ctn {
        position: relative;
        width: 100%;

        .tab-content {
            display: flex;
            align-items: center;
        }

        .icon {
            width: 25px;
            margin-right: 5px;
        }

        .top-right-slot {
            position: absolute;
            height: 55px;
            right: 9px;
            top: 0;
            display: flex;
            align-items: center;
        }

        .dot {
            position: absolute;
            text-align: center;
            line-height: 20px;
            height: 20px;
            min-width: 20px;
            padding-left: 5px;
            padding-right: 5px;
            background: #FF1818;
            border-radius: 50%;
            top: 10px;
            right: 0;
            font-size: 12px;
            font-family: PingFang-SC-Bold, PingFang-SC;
            font-weight: bold;
            color: #FFFFFF;
        }

        /deep/ .el-tabs--border-card{
            width: 100%;
        }

        /deep/ .el-tabs__header {
            background: #0C2253;
            border: 1px solid;
            border-image: linear-gradient(90deg, rgba(37, 52, 134, 1), rgba(37, 52, 134, 0)) 1 1;
        }

        /deep/ .el-tabs__item {
            position: relative;
            height: 55px;
            line-height: 55px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5391F3;
        }

        /deep/ .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
            border: 1px solid rgba(34, 76, 151, 1);
            border-bottom: 1px solid #0C2253;
            background: #0C2253;
            font-size: 16px;
            font-family: PingFang-SC-Heavy, PingFang-SC;
            font-weight: 800;
            color: #C1D9FF;
        }
    }
</style>