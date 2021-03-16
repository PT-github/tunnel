<template>
    <!--模板内容 -->
    <div class="editor-container">
        <div class="editor-container-title">
            <i :class="icon" v-if="icon"></i>{{title}}
        </div>
        <div class="editor-container-content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            icon: String,
            title: String
        }
    }
</script>

<style scoped lang="less">
    .editor-container{
        border: 1px solid #a7c7d8;
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 20px;
        &-title{
            height: 40px;
            line-height: 40px;
            background-color: #d9edf7;
            font-size: 16px;
            color: #395666;
            padding-left: 15px;
            i{
                padding-right: 5px;
            }
        }
        &-content{
            padding: 15px 30px;
        }
    }
</style>
