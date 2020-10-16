<template>
    <div v-if="listParm && listParm.length">
        <table class="table-ctn1" border="1px" cellspacing="0">
            <tr v-for="item in listParm">
                <th :class="{'th-title':items.isTitle}"
                    :style="item.style"
                    :colspan="items.col?items.col:1"
                    v-for="items in item.list">{{items.value}}</th>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        name: "plan-table",
        props:{
            listParm:Array
        },
        data(){
            return{
                //配置模板
                text:[
                    {
                        list:[
                            {
                                list:[
                                    {
                                        value:'标题',
                                        isTitle:true
                                    },
                                    {
                                        value:'值',
                                    },
                                    {
                                        value:'标题',
                                        isTitle:true
                                    },
                                    {
                                        value:'值',
                                    }
                                ],
                            },
                        ],
                        style:{}
                    },
                    {
                        list:[
                            {
                                value:'标题',
                                isTitle:true
                            }, {
                                value:'值',
                                col:3
                            }
                        ],
                        style:{
                            height:'150px'
                        }
                    }
                ]
            }
        }
    }
</script>

<style scoped lang="less">
    .table-ctn1{
        width: 100%;
        border-radius: 4px;
        border-collapse:collapse;
        margin-top: 30px;
        margin-bottom: 30px;
        table-layout:fixed;
        tr th{
            border:1px solid #224C97;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
            color: #C1D9FF;
            height: 50px;
            font-weight:500;
        }
        .ctn2-t th{
            width: calc((100% - 640px) / 4);
            background: #0C2253;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
            color: #5391F3;
            font-weight:500;
        }
        .ctn2-t th:last-child{width: 640px !important;}
        .ctn2-v th{
            color: #C1D9FF;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
        }
        .th-title{
            height: 50px;
            width: 200px;
            background:#0C2253;
            font-size:16px;
            font-family:PingFangSC-Regular,PingFang SC;
            color: #5391F3;
        }
    }
</style>