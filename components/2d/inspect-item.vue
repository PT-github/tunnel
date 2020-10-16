<template>
    <div class="inspect-item">
        <div class="decorator" :class="{checked:status!==0}" v-if="!first"></div>
        <div class="content">
            <template v-if="status===0">
                <div class="round"></div>
            </template>
            <template v-else-if="status===1">
                <div class="round blue"></div>
            </template>
            <template v-else-if="status===2">
                <img class="icon" v-if="device.deviceCommunicationsState===1" src="../../assets/images/inspect/error.png">
                <img class="icon" v-if="device.deviceCommunicationsState===0" src="../../assets/images/inspect/success.png">
            </template>
            <span class="text"
                  :class="{blue:status === 1 || (status===2 && device.status==='0'),error:status===2 && device.status==='1'}">
                {{device.deviceName + ' ' + (device.mileage||'')}}
            </span>
            <div v-if="status===1" class="checking">正在巡检</div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            first: Boolean,
            device: Object, // 设备数据
            status: Number // 0表示未检，1表示正在检，2表示检查完成，显示原来的状态
        }
    };
</script>

<style scoped lang="scss">
    $error: #FF2012;
    $gray: #6A6D7C;
    $ing: #5391F3;


    .inspect-item {
        .decorator {
            width: 1px;
            height: 20px;
            margin-left: 8px;
            background: $gray;

            &.checked {
                background: $ing;
            }
        }

        .icon {
            width: 16px;
            height: 16px;
        }

        .checking {
            background: rgba(50, 106, 248, 1);
            border-radius: 4px;
            width: 60px;
            height: 20px;
            text-align: center;
            font-size: 12px;
            font-weight: 400;
            color: rgba(237, 244, 246, 1);
            line-height: 20px;
            margin-left: 8px;
        }

        .round {
            width: 16px;
            height: 16px;
            border-radius: 8px;
            background: $gray;

            &.blue {
                background: $ing;
            }
        }

        .text {
            margin-left: 12px;

            &.blue {
                color: $ing;
            }

            &.error {
                color: $error;
            }

        }

        .content {
            display: flex;
            align-items: center;
            font-size: 13px;
            color: #9CA0B3;
            line-height: 15px;
        }
    }
</style>