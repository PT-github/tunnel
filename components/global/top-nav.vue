<template>
    <div class="top-nav">
        <div class="left">
            <img src="../../assets/images/top-nav/logo-2.png" class="logo">
            <div class="weather">{{nowTime}}{{weather}}</div>
        </div>
        <div class="center">
            <div class="menu-item" v-for="item,idx in menus" :key="idx" @click="$router.push(item.route)">
                <img class="img"
                     :src="require(`../../assets/images/top-nav/${item.icon}${activeRoute===idx?'-selected':''}.png`)">
                <span class="label" :class="{active:activeRoute===idx}">{{item.label}}</span>
            </div>
        </div>
        <div class="right">
            <el-dropdown trigger="hover">
                <div class="menu-right">
                    <span>隧道</span>
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu slot="dropdown" class="tunnel-dropdown">
                    <el-input prefix-icon="el-icon-search" clearable placeholder="请输入要搜索的隧道名称"
                              v-model="tunnelName"></el-input>
                    <home-list :TunnelList="TunnelList" code="" :filterName="tunnelName" nav></home-list>
                </el-dropdown-menu>
            </el-dropdown>
            <div class="menu-right" @click="$em.$fire('lock-screen')">
                <span>锁屏</span>
                <i class="el-icon-lock"></i>
            </div>
            <el-dropdown @command="handleCommand" v-if="myUserInfo">
                <div class="menu-right">
                    <img :src="myUserInfo.headImage" class="avatar">
                    <span>{{myUserInfo.name}}</span>
                    <i class="el-icon-caret-bottom"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="user"><i class="el-icon-user"></i>个人中心</el-dropdown-item>
                    <el-dropdown-item command="logout"><i class="el-icon-switch-button"></i>退出系统</el-dropdown-item>
                    <el-dropdown-item command="full"><i class="el-icon-full-screen"></i>全屏</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import screenfull from 'screenfull';
    import HomeList from '../home/home-list';

    export default {
        events: {
            'onPushEvent': 'queryAllRoadData'
        },
        components: {HomeList},
        services: [ 'basic', 'user', 'home' ],
        data () {
            return {
                tunnelName: '',
                nowTime: '',
                TunnelList: [],
                weather: '',
                menus: [ {
                    icon: 'index',
                    label: '首页',
                    route: '/'
                }, {
                    icon: 'tunnel',
                    label: '隧道管理',
                    route: '/tunnel'
                }, {
                    icon: 'video',
                    label: '视频墙',
                    route: '/video'
                }, {
                    icon: 'device',
                    label: '设备管理',
                    route: '/device'
                }, {
                    icon: 'fault',
                    label: '故障管理',
                    route: '/fault'
                }, {
                    icon: 'alarm',
                    label: '事件管理',
                    route: '/alarm'
                }, {
                    icon: 'energy',
                    label: '能耗管理',
                    route: '/energy'
                }, {
                    icon: 'plan',
                    label: '应急预案',
                    route: '/plan'
                }, {
                    icon: 'analysis',
                    label: '数据分析',
                    route: '/analysis'
                }, {
                    icon: 'system',
                    label: '基础配置',
                    route: '/system'
                } ]
            };
        },
        computed: {
            activeRoute () {
                let idx = -1;
                if (this.$route.path === '/' || /\/home/.test(this.$route.path)) {
                    idx = 0;
                } else {
                    this.menus.forEach((v, i) => {
                        if (new RegExp(v.route).test(this.$route.path)) {
                            idx = i;
                        }
                    });
                }
                return idx;
            }
        },
        mounted () {
            this.$service.basic.getWeather().then(res => {
                let {cityName, weather, temperature, sd} = res;
                this.weather = `${cityName}  ${weather}  ${temperature}℃  ${sd}`;
            });
            this.queryAllRoadData();
            this.nowTime = this.$utils.date.format(new Date(), 'yyyy/MM/dd hh:mm:ss ');
            this._id = setInterval(() => {
                this.nowTime = this.$utils.date.format(new Date(), 'yyyy/MM/dd hh:mm:ss ');
            }, 1000);
        },
        destroyed () {
            clearInterval(this._id);
        },
        methods: {
            queryAllRoadData () {
                this.$service.home.getListAll({
                    page: 1, pageSize: 100
                }).then(res => {
                    this.TunnelList = res;
                });
            },
            handleCommand (e) {
                if (e === 'logout') {
                    this.$showConfirm('是否确认退出登录？').then(() => {
                        this.$service.user.logout();
                        this.$store.commit('logout');
                        localStorage.removeItem('myUserInfo');
                        // this.$router.push('/login');
                        location.reload();
                    });
                } else if (e === 'user') {
                    this.$router.push('/system/user');
                } else if (e === 'full') {
                    screenfull.toggle();
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .tunnel-dropdown {
        border: 1px solid #224C97;
        padding: 0;
        width: 400px;
    }

    .top-nav {
        height: 102px;
        background: url("../../assets/images/top-nav/bg.png") no-repeat;
        background-size: 100%, 100%;
        margin-bottom: 14px;
        display: flex;
        padding: 0 24px;

        .right {
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .menu-right {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                font-size: 16px;
                font-weight: 400;
                color: rgba(193, 217, 255, 1);
                line-height: 14px;
                margin-left: 35px;
                cursor: pointer;

                .avatar {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    margin-right: 4px;
                }

                i {
                    margin-left: 4px;
                }
            }
        }

        .left {
            .logo {
                width: 309px;
                height: 21px;
                margin-top: 15px;
            }

            .weather {
                margin-top: 11px;
                width: 312px;
                height: 26px;
                background: rgba(18, 58, 132, 0.5);
                border-radius: 13px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                color: rgba(83, 145, 243, 1);
            }
        }

        .center {
            flex: 1;
            margin: 0 24px;
            display: flex;
            align-items: center;
            justify-content: space-around;

            .menu-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                cursor: pointer;

                .img {
                    height: 26px;
                }

                .label {
                    margin-top: 10px;
                    height: 16px;
                    font-size: 14px;
                    color: #337CF3;
                    line-height: 16px;

                    &.active {
                        color: #C1D9FF;
                    }
                }
            }
        }
    }
</style>
