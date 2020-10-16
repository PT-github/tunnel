<template>
    <div class="page">
        <div class="head">
            <div class="left margin" v-if="breadcrumb && breadcrumb.length">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="item,idx in breadcrumb" :key="idx" :to="{ path: item.path }">
                        {{item.name}}
                    </el-breadcrumb-item>
                </el-breadcrumb>
                <slot name="breadcrumb-left"></slot>
            </div>
            <div class="flex1 margin" v-if="radios && radios.length">
                <el-radio-group v-model="radio" size="medium" @change="onRadioChanged">
                    <div class="page-list" v-for="(item,idx) in radios" :key="idx">
                        <el-radio-button :label="item.label">{{item.label}}</el-radio-button>
                        <div class="page-list-num" v-if="item.num">{{item.num}}</div>
                    </div>
                </el-radio-group>
            </div>
            <div v-if="!noBack" class="margin">
                <img src="../assets/images/back.png" class="img-back" @click="$router.go(-1)">
                <img src="../assets/images/refresh.png" class="img-refresh" @click="$router.go(0)">
            </div>
        </div>
        <div class="flex flex1 content-padding">
            <div class="left" v-if="$slots.left">
                <slot name="left"></slot>
            </div>
            <div class="flex1">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            noBack: Boolean,
            breadcrumb: Array,
            radios: Array
        },
        data () {
            return {
                radio: ''
            };
        },
        mounted () {
            if (this.radios && this.radios.length) {
                this.radio = this.radios[ 0 ].label;
                this.onRadioChanged(this.radio);
            }
        },
        methods: {
            onRadioChanged (e) {
                let index = this.radios.findIndex(v => v.label === e);
                this.$emit('radio-change', index);
            }
        }
    };
</script>

<style scoped lang="less">
    .page {
        margin: 0 18px;
        padding: 20px;
        background: linear-gradient(180deg, rgba(17, 34, 109, 0.6) 0%, rgba(15, 102, 186, 0.2) 100%);
        border-radius: 10px;
        display: flex;
        flex-direction: column;

        &-list {
            display: inline-block;
            position: relative;

            &-num {
                position: absolute;
                right: 4px;
                top: 4px;
                background-color: #FF1818;
                text-align: center;
                line-height: 15px;
                height: 15px;
                min-width: 15px;
                padding-left: 5px;
                padding-right: 5px;
                background: #FF1818;
                border-radius: 50%;
                color: #FFFFFF;
                font-size: 12px;
            }
        }

        .head {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .margin {
                margin-bottom: 30px;
            }
        }

        .left {
            min-width: 240px;
            margin-right: 20px;
            flex-shrink: 0;
        }

        .flex1 {
            flex: 1;
        }

        .content-padding {
        }

        .img-back, .img-refresh {
            width: 24px;
            margin-left: 40px;
            cursor: pointer;
        }
    }
</style>