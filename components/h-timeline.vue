<template>
   <div class="time-line-item">
       <div class="bar"></div>
       <div class="time-line-ctn">
           <slot></slot>
       </div>
   </div>
</template>

<script>

    export default {
        name: "timeline-pagin",
        components: {},
        props: {

        },
        mounted () {

        },
        data(){
            return{

            }
        },
        methods: {

        }
    }
</script>

<style scoped lang="less">
    .time-line-item{
        position: relative;
        padding-bottom: 16px;
        width: 100%;
        border-left: 1px solid #337CF3;
        .bar{
            position: absolute;
            left: -6px;
            top: 0px;
            height: 11px;
            width: 11px;
            border-radius: 50%;
            background: #0C2253;
            border: 1px solid #337CF3;
        }
        .time-line-ctn{
            margin-left: 12px;
        }
    }
</style>