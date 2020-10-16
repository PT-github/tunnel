<template>
    <div class="cascader-ctn" v-if="systemOrganization && systemOrganization.length">
        <el-tree :data="systemOrganization"
                 ref="tree"
                 node-key="organizationId"
                 :check-strictly="true"
                 default-expand-all
                 check-strictly
                 icon-class="''"
                 show-checkbox
                 @check-change="orgCheckChange"
                 :props="{children: 'childList',label: 'name'}"></el-tree>
    </div>
</template>

<script>
    export default {
        name: "cascader-selected",
        props:{
            systemOrganization:Array,
        },
        data(){
            return{
                checkedKeys:'',

                defaultProps: null,
                selectOrg: {
                    orgsid: []
                }
            }
        },
        methods:{
            orgCheckChange(data, checked, indeterminate) {
                // 获取当前选择的id在数组中的索引
                const indexs = this.selectOrg.orgsid.indexOf(data.organizationId)
                // 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
                if (indexs < 0 && this.selectOrg.orgsid.length === 1 && checked) {
                    this.$ctx.toastError('只能选择一个组织机构');
                    // 设置已选择的节点为false 很重要
                    this.$refs.tree.setChecked(data, false)
                } else if (this.selectOrg.orgsid.length === 0 && checked) {
                    // 发现数组为空 并且是已选择
                    // 防止数组有值，首先清空，再push
                    this.selectOrg.orgsid = []
                    this.$emit('selectedOrganization',data)
                    this.selectOrg.orgsid.push(data.organizationId)
                } else if (
                    indexs >= 0 &&
                    this.selectOrg.orgsid.length === 1 &&
                    !checked
                ) {
                    // 再次直接进行赋值为空操作
                    this.selectOrg.orgsid = []
                }
            },
           /* handleOrgClick(data){
                if(this.selectOrg.orgsid && this.selectOrg.orgsid.length){
                    return
                }
            }*/
        }
    }
</script>

<style scoped lang="less">
    img{height: 100%;width: 100%}
    .circle{
        height: 20px;
        width: 20px;
        border-radius: 50%;
    }
    .children-items{
        margin-top: 30px;
        .asd{
            display: flex;
            align-items: center;
        }
    }
    .cascader-ctn{
        .first-ctn{
            margin-top: 10px;
            padding: 15px 20px;
            width: 100%;
            border: 1px solid #224C97;
            border-radius:4px;
            .first-items{
                display: flex;
                align-items: center;
            }
        }
    }
    /deep/ .el-tree{
        padding-top: 15px;
        padding-bottom: 15px;
        background: #0C2253;
        border:1px solid #224C97;
        border-radius:4px;
    }
    /deep/ .el-tree-node__children{
        margin-top: 10px;
        width: 100%;
        border-radius:4px;
    }
    /deep/ .el-tree-node__label{
        font-size:16px;
        font-family:PingFang-SC-Heavy,PingFang-SC;
        color: #5391F3;
        margin-left: 10px;
    }
    /deep/ .el-tree-node__content:hover{
        background: none;
    }
    /deep/ .el-tree-node__content{
        background: none !important;
    }

    /deep/ .el-tree-node{

    }
</style>