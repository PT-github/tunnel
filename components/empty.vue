<template>
    <div class="empty-ctn">
        <img class="empty-img" src="../assets/images/empty.png" alt="">
    </div>
</template>

<script>
    export default {
        name: "empty"
    }
</script>

<style scoped>
    .empty-ctn{
        height: 500px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .empty-img{
        height: 133px;
        width: 200px;
    }
</style>