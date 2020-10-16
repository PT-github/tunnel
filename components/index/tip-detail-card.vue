<template>
    <!--公告详情卡片-->
    <div class="tips-ctn" v-if="tipDetail">
        <div class="detail-title">{{tipDetail.title}}</div>
        <div class="detail-author">
            <div class="author-item">发布人员：{{tipDetail.createUserName}}</div>
            <div class="author-item">发布时间：{{tipDetail.createTime}}</div>
        </div>
        <div class="tip-details" v-html="tipDetail.msg">
        </div>
        <div class="files" v-if="fileList.length">
            <div class="files-title">附件下载</div>
            <template v-for="(item,i) in fileList">
                <div :key="i">
                    <a :href="item.fileUrl" target="_blank">{{item.name}}</a>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        services: ['basic'],
        name: "tip-detail-card",
        props:{
            tipDetail:{
                type:Object,
                default:{}
            }
        },
        data(){
            return {
                fileList: []
            }
        },
        watch:{
            tipDetail:{
                handler:function(val){
                    this.getFiles()
                },
                deep: true
            }
        },
        mounted(){
            this.getFiles()
        },
        methods:{
            getFiles(){
                this.fileList = [];
                this.$service.basic.getFileList(this.tipDetail.noticeId).then(res=>{
                    this.fileList = res||[]
                })
            },
        }
    }
</script>

<style scoped lang="less">
    .tips-ctn{
        height: 550px;
        width: 100%;
        .detail-title{
            padding-left: 10px;
            display: flex;
            align-items: center;
            height: 35px;
            border-left: 6px solid #5391F3;
            font-size: 18px;
            color: #5391F3
        }
        .detail-author{
            margin-top: 20px;
            display: flex;
            align-items: center;
            height: 40px;
            width: 100%;
            color: #5391F3;
            background-color: #224C97;
            border: 1px solid #5391F3;
            .author-item{
                margin-left: 15px;
            }
        }
        .tip-details{
            margin-top: 20px;
            line-height: 30px;
            max-height: 335px;
            overflow: auto;
            color: #5391F3;
             &::-webkit-scrollbar {
                /*滚动条整体样式*/
                width: 4px;
                height: 100%;
            }

            &::-webkit-scrollbar-thumb {
                /*滚动条里面小方块*/
                border-radius: 10px;
                background: rgba(24, 116, 174, 1);
                -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            }

            &::-webkit-scrollbar-track {
                /*滚动条里面轨道*/
                border-radius: 10px;
                background: rgba(5, 47, 101, 1);
                -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            }
        }
        .files{
            color: #5391F3;
            padding-top: 30px;
            &-title{
                padding-bottom: 10px;
            }
            a{
                color:  #5391F3;
            }
        }
    }
</style>