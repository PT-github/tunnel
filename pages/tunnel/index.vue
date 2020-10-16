<template>
    <div class="page">
        <!-- 头部信息汇总及查询 -->
        <div class="page-header block">
            <div class="page-row">
                <div class="page-header-title">隧道列表</div>
                <!-- 搜索条件 -->
                <div class="page-header-search">
                    <div class="margin-20">所属隧道</div>
                    <hSelect :ds="{service:'tunnel',func:'getListAll'}"
                            class="margin-10"
                            v-model="search.tunnelId"
                            placeholder="请选择隧道"></hSelect>
                    <hSelect :ds="{service:'basic',func:'getDict',params:'TunnelType'}"
                            class="margin-20"
                            v-model="search.LeftRightFlag"
                            placeholder="请选择隧道类型"></hSelect>
                <el-button type="primary"
                           @click="goSearch"
                           icon="el-icon-search">搜索</el-button>
                </div>
            </div>
            <div class="page-tips">
                <span class="page-header-tips">隧道总数：</span>
                <span class="page-header-num">{{ tunnelCount.tunnelCount}}个</span>
                <span class="page-header-tips">长隧道：</span>
                <span class="page-header-num">{{tunnelCount.longTunnelCount}}个</span>
                <span class="page-header-tips">短隧道：</span>
                <span class="page-header-num">{{tunnelCount.shortTunnelCount}}个</span>
                <span class="page-header-tips">特长隧道：</span>
                <span class="page-header-num">{{tunnelCount.superlongTunnelCount}}个</span>
                <span class="page-header-tips">总长为：</span>
                <span class="page-header-num">{{tunnelCount.tunnelTotallength||0}}KM</span>
            </div>
        </div>
        <div class="page-content">
            <div class="page-content-list">
                <template v-for="(item,i) in tunnelList">
                    <tunnelCard class="page-content-list-item" :info="item" :key="i"></tunnelCard>  
                </template>
            </div>
            <div class="page-content-pagination">
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="page"
                    :page-size="pageSize"
                    background
                    layout="total, prev, pager, next"
                    :total="total">
                    </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import tunnelCard from '../../components/tunnel/tunnel-card';
    export default {
        services: [ 'tunnel', 'basic'],
        components: {tunnelCard},
        data () {
            return {
              search:{}, // 搜索参数
              tunnelCount:{},  //分类统计
              tunnelList:[],
              page:1,
              pageSize: 9,
              total: 0
            };
        },
        async mounted(){
            this.tunnelCount = await this.$service.tunnel.getTunnelCate() || {}
            this.getList()

        },
        methods: {
            //  拿列表数据
            getList(){
                let parms = {
                    page: this.page,
                    tunnelType: this.search.LeftRightFlag,
                    tunnelId: this.search.tunnelId,
                    pageSize: this.pageSize
                }
                this.$service.tunnel.getTunnelList(parms).then(res=>{
                    this.tunnelList = res.records || [];
                    this.total = Number(res.total)
                })
            },
            // 选择了页码
            handleCurrentChange(e){
                this.page = e;
                this.getList()
            },
            // 搜索
            goSearch(){
               this.page = 1;
               console.log('去搜索')
               this.getList()
            }
        }
    };
</script>

<style scoped lang='less'>
    .page {
        margin: 0 18px;
        height: 932px;
        padding: 20px;
        background: linear-gradient(180deg, rgba(17, 34, 109, 0.6) 0%, rgba(15, 102, 186, 0) 100%);
        border-radius: 20px;
        &-row{
            display: flex;
            justify-content: space-between;
        }
        &-header{
            padding: 25px 20px;
            width: 100%;
            &-title{
                font-size:20px;
                color: #C1D9FF;
                font-weight: bold;
                margin-bottom: 16px;
            }
            &-search{
                display: flex;
                align-items: center;
                color: #C1D9FF;
                .margin-20{
                    margin-right: 20px;
                }
                .margin-10{
                    margin-right: 10px;
                }
            }
            &-tips{
                color:#5391F3;
                font-size: 16px;
            }
            &-num{
                color: #C1D9FF;
                font-size: 16px;
                padding-right: 25px;
            }
        }
        &-content{
            padding: 20px 0;
            &-list{
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                &-item{
                    width: calc( (100% - 44px) / 3);
                }
                &-item:nth-child(3n){
                    margin-right: 0px;
                }
            }
            &-pagination{
                text-align: right;
            }
        }
    }
    /deep/  .el-pagination__total{
        color: #C1D9FF;
    }
</style>
