<!-- 错误页 -->
<template>
    <div class="error-page">
        <form-page no-back>
            <div class="error-msg">{{error.message}}</div>
        </form-page>
    </div>
</template>

<script>
    export default {
        props: [ 'error' ],
        data () {
            return {};
        },
        methods: {}
    };
</script>

<style scoped lang="less">
    .error-page {
        .page {
            height: calc(100vh - 142px);
        }

        .error-msg{
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            font-size: 30px;
            color: #C1D9FF;
        }
    }
</style>