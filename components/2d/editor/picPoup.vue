<template>
    <el-dialog
        :visible="showPicPoup"
        :append-to-body="true"
        width="60%"
        @close="close"
        :close-on-click-modal="false">
        <el-tabs type="border-card" v-model="model" @tab-click="tabsChange">
            <el-tab-pane name="1">
                <span slot="label"><i class="el-icon-files"></i> 素材选择</span>
                <div class="label-content">
                    <el-radio-group v-model="MaterialtypeId" @change="radioChange">
                        <template v-for="(item,i) in classify">
                            <el-radio-button :label="item.MaterialtypeId" :key="i">{{item.TypeName||item.text}}</el-radio-button>
                        </template>
                    </el-radio-group>
                    <div class="img-list">
                        <!-- {{classPicList}} -->
                        <template v-for="(item,i) in classPicList">
                            <img  class="img-list-item " :key="i" :src="item.FilePathAll" lazy @click="choseImg(item)">
                             <!-- <el-image class="img-list-item" :key="i" :src="item.FilePathAll" lazy @click="choseImg(item)">
                                  <div slot="error" class="image-slot">
                                        <div class="el-icon-picture-outline"></div>
                                        <div class="error-tips">加载失败</div>
                                    </div>
                             </el-image> -->
                        </template>
                        <empty v-if="classPicList&&!classPicList.length"></empty>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane name="2">
                <span slot="label"><i class="el-icon-paperclip"></i> 素材维护</span>
                <div class="label-content ">
                    <div class="label-content-action">
                        <el-button class="label-content-action-btn" type="primary" @click="showAddPoup=true">素材上传</el-button>
                        <el-radio-group class="label-content-action-group" v-model="MaterialtypeId" @change="radioChange">
                            <template v-for="(item,i) in classify">
                                <el-radio-button :label="item.MaterialtypeId" :key="i">{{item.TypeName||item.text}}</el-radio-button>
                            </template>
                        </el-radio-group>
                    </div>
                    <div class="img-list">
                        <template v-for="(item,i) in classPicList">
                            <div class="img-mange">
                                <!-- <el-image class="img-list-item "  :key="i" :src="item.FilePathAll" lazy>
                                    <div slot="error" class="image-slot">
                                        <div class="el-icon-picture-outline"></div>
                                        <div class="error-tips">加载失败</div>
                                    </div>
                                </el-image> -->
                                <img  class="img-list-item " :src="item.FilePathAll" lazy>
                                <div class="btn" @click.stop="deleteImg(item)">删除</div>
                            </div>
                        </template>
                        <empty v-if="classPicList&&!classPicList.length"></empty>
                    </div>
                    <!-- <el-steps :active="active" simple>
                        <el-step title="请选择分类"></el-step>
                        <el-step title="上传文件"></el-step>
                    </el-steps>
                    <div class="center">
                        <el-select placeholder="请选择分类" v-model="RelationId" v-if="active==1">
                            <template v-for="(item,i) in classify">
                                <el-option :label="item.TypeName||item.text" :key="i" :value="item.MaterialtypeId"></el-option>
                            </template>
                        </el-select>
                        <uploadImg :RelationId="RelationId" v-if="active==2"></uploadImg>
                         <el-button style="margin-left:10px"
                                 type="primary"
                                 v-if="active==1"
                                 @click="goNext">下一步</el-button>
                    </div> -->
                    <el-dialog 
                        title="素材上传"
                        :visible.sync="showAddPoup"
        :append-to-body="true"
                        width="60%"
                        @close="showAddPoup=false">
                        <div class="center">
                            <div class="row">
                                <div>选择分类：</div>
                                <el-select placeholder="请选择分类" v-model="RelationId" v-if="active==1">
                                    <template v-for="(item,i) in classify">
                                        <el-option :label="item.TypeName||item.text" :key="i" :value="item.MaterialtypeId"></el-option>
                                    </template>
                                </el-select>
                            </div>
                            <div class="row">
                                <div>图片上传：</div>
                                <uploadImg :RelationId="RelationId" v-if="showAddPoup" @uploaded="uploaded"></uploadImg>
                            </div>
                        </div>
                    </el-dialog>
                </div>
            </el-tab-pane>
        </el-tabs>
</el-dialog>

</template>
<script>
import empty from '@/components/empty.vue'
import uploadImg from '@/components/common/upload-img.vue'
export default {
    components:{empty,uploadImg},
    services: [ 'file'],
    props: {
        showPicPoup:{
            type: Boolean,
            default:()=>{
                return false
            }
        }
    },
    watch:{
        MaterialtypeId: {
            handler(value){
                let currentId = '';
                this.classify&&this.classify.forEach(item=>{
                    if(item.MaterialtypeId == value){
                        currentId = item.id
                    }
                })
                this.currentId = currentId
            }
        }
    },
    data() {
        return {
            showFlag: false,
            showAddPoup:false,
            active: 1,
            currentId: '',
            model: "1", // 1表示是素材选择，2表示要上传
            MaterialtypeId: "", //  当前素材的分类ID
            RelationId: "",
            classify:[],      // 当前分类数组
            classPicList:[]    // 当前分类数组下的图片集和
        }
    },
    mounted(){
        this.initData()
    },
    methods:{
        async initData(){
            this.classify =  await this.$service.file.GetAllAdvMaterialTypeList() || [];
            let firstObj = this.classify[0]&&this.classify[0] || {}
            this.MaterialtypeId = firstObj.MaterialtypeId || '';
            this.currentId = firstObj.id;
            this.radioChange()
        },
        choseImg(item={}){
            this.$emit("chose",item)
            this.close()
        },
        deleteImg(item){
             this.$showConfirm('确认删除前素材？').then(() => {
                 this.$service.file.DelAdvMaterial(item.FileId).then(res=>{
                     this.$message.success('删除成功');
                     this.radioChange()
                 })
             })
        },
        tabsChange(){
            if(this.model==2){
                this.active=1
            }else{
                this.initData()
            }
        },
        goNext(){
            if(!this.RelationId){
                this.$ctx.toastError("请先选择分类")
                return
            }
            this.active = 2;
        },
        uploaded(){
            this.showAddPoup = false;
            this.radioChange()
        },
        async radioChange(){
            let id = this.currentId == 'all' ? '' : this.MaterialtypeId;
            let res = await this.$service.file.GetAdvMaterialPageList(id) || {};
            this.classPicList = res.Data || []
        },
        reset(){
            this.model = '1';
            this.active = 1;
            let firstObj = this.classify[0]&&this.classify[0] || {};
            this.MaterialtypeId = firstObj.MaterialtypeId || '';
            this.currentId = firstObj.id;
        },
        close(){
            this.$emit("close",false)
            this.reset()
        }
    }
}
</script>
<style lang='less' scoped>
    .label-content{
        height: 50vh;
        &-action{
            display: flex;
            align-items: center;
            &-btn{
                margin-right: 30px;
            }
            &-group{
                flex: 1;
                display: flex;
                justify-content: center;
            }
        }
    }
    .center{
        height: calc(50vh - 100px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .img-list{
        display: flex;
        flex-wrap: wrap;
        .img-mange{
            width: 100px;
            height: 100px;
            margin: 10px;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
            .btn{
                width: 90px;
                height: 30px;
                text-align: center;
                line-height: 30px;
                border-bottom-left-radius: 10px;
                cursor: pointer;
                background-color: rgba(245, 0, 0, 0.7);
                color: #fff;
                font-size: 15px;
                position: absolute;
                z-index: 111;
                left: 10px;
                bottom: -50px;
            }
        }
        &-item{
            border-radius: 10px;
            position: relative;
            width: 100px;
            height: 100px;
            margin: 10px;
            border-radius: 10px;
            overflow: hidden;
        }
        .img-mange:hover{
            .btn{
                bottom: 0px;
            }
        }
    }
     /deep/ .image-slot{
        width: 100px;
        height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #f5f5f5;
    }
    /deep/ .error-tips{
        margin-top: 5px;
        font-size: 12px;
    }
    .row{
        display: flex;
        align-items: center;
    }
    .row + .row{
        margin-top: 50px;
    }

</style>
