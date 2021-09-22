<template>
    <div>
        <top-nav v-if="showTop"></top-nav>
        <div class="app-content">
            <nuxt/>
        </div>
        <push-event-dialog></push-event-dialog>
        <lock-screen></lock-screen>
    </div>
</template>

<script>
    import TopNav from '../components/global/top-nav';
    import PushEventDialog from '../components/global/push-event-dialog';
    import LockScreen from '../components/global/lock-screen';

    export default {
        components: {TopNav, PushEventDialog, LockScreen},
        data () {
            return {
                showTop: false
            };
        },
        mounted () {
            this.checkRoute();
        },
        watch: {
            $route () {
                this.checkRoute();
            }
        },
        methods: {
            checkRoute () {
                console.log(this.$route.name, '===')
                this.showTop = !(this.$route.name === 'login' || this.$route.name === 'forget' || this.$route.name === 'tunnel-id');
            }
        }
    };
</script>

<style lang="less">
    *,
    *:before,
    *:after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-size: 16px;
    }

    #__nuxt {
        width: 100%;
        height: 100vh;
        overflow: auto;
        background-image: url("../assets/images/background_login.png");
        background-size: 100% 100%;
        background-repeat: no-repeat;

        .app-content {
            max-height: calc(100vh - 116px);
        }

        .scroll {
            overflow-y: scroll;
            overflow-x: hidden;
            user-select: none;

            &::-webkit-scrollbar {
                /*滚动条整体样式*/
                width: 4px;
                height: 100%;
            }

            &::-webkit-scrollbar-thumb {
                /*滚动条里面小方块*/
                border-radius: 10px;
                background: rgba(24, 116, 174, 1);
                -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            }

            &::-webkit-scrollbar-track {
                /*滚动条里面轨道*/
                border-radius: 10px;
                background: rgba(5, 47, 101, 1);
                -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            }
        }
    }

    .el-tabs--border-card {
        border-radius: 6px;
        border: 1px solid #224c97;
        background: #11226D;
    }

    .block {
        border-radius: 6px;
        border: 1px solid #224c97;
        background: #11226D;
    }

    .flex1 {
        flex: 1;
    }

    .flex {
        display: flex;
    }
</style>
