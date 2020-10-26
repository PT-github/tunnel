<template>
    <div class="tips" :class="{between:mode === 'center'}">
        <template v-if="mode === 'center'">
            <img class="tips-right" :src="require('@/assets/images/index/title-right.png')">
            <div class="flex-center">
                <div class="title">{{title}}</div>
                <div class="border"></div>
            </div>
            <img class="tips-right reverse" :src="require('@/assets/images/index/title-right.png')">
        </template>
        <template v-else>
            <img class="tips-left" :src="require('@/assets/images/index/title-left.png')">
            <div class="title">{{title}}</div>
            <img class="tips-right" :src="require('@/assets/images/index/title-right.png')">
        </template>
    </div>
</template>
<script>
    export default {
        props: {
            mode: String,
            title: String
        }
    };
</script>
<style scoped lang="less">
    .tips {
        display: flex;
        align-items: center;
        height: 30px;


        .title {
            //padding: 0 9px;
          //height: 20px;
            font-size: 16px;
            font-weight: bold;
            color: #5391F3;
        }

        .flex-center {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        &.between {
            justify-content: space-between;
        }

        .border {
            width: 40px;
            height: 2px;
            margin-top: 6px;
            background: rgba(50, 106, 248, 1);
        }

        &-left {
            height: 17px;
        }

        &-right {
            height: 12px;

            &.reverse {
                transform: rotateY(180deg);
            }
        }
    }
</style>
