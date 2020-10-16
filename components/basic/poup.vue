<template>
    <div class="mask-poup">
        <slot></slot>
    </div>
</template>
<script>
export default {
    props:{
    }
}
</script>
<style lang="less" scoped>
.mask-poup{
    position: fixed;
    display: flex;
    justify-content: center;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    /*background-color: rgba(0,0,0,.4);*/
}
</style>
