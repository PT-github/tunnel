<template>
    <div class="container">
        <div class="center-container">
            <div class="c-c-l">
                <div class="c-c-l--ctn">
                    <div class="user-head">
                        <img :src="(myUserInfo.headImage&&myUserInfo.headImage.includes('http'))?myUserInfo.headImage:('http://w7.qcxt.com:8090/upload/'+myUserInfo.headImage)"
                             alt="">
                    </div>
                    <div class="user-info">
                        <div>
                            <div class="t1">{{myUserInfo.name}}（{{myUserInfo.otherContactInformation}}
                                {{myUserInfo.postName + '/'+myUserInfo.organizationName }}），欢迎进入个人管理中心
                            </div>
                            <div class="t2">上次登录：{{myUserInfo.lastVisitTime}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="c-c-r">
                <div class="c-c-r-ctn">
                    <div class="c-c-r-item"
                         @click="goPage(title)"
                         :key="index"
                         v-for="(title,index) in topRightBar">
                        <div class="item-icon">
                            <img :src="require(`../../assets/images/index/idx-bar-icon${index}.png`)" alt="">
                        </div>
                        <div class="item-t">{{title.title}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-container">
            <div class="page-t-ctn">
                <IndexTipTitle title="个人活跃度"></IndexTipTitle>
            </div>

            <div class="chart-bg">
                <IndexLineChart v-if="indexLineData && indexLineData.length"
                                :valueName="'activity'"
                                :indexLineData="indexLineData"></IndexLineChart>
            </div>
        </div>

        <div class="c-c-c">
            <div class="c-c-c-top">
                <div class="page-t-ctn">
                    <IndexTipTitle title="系统公告"></IndexTipTitle>
                </div>
                <div class="c-c-c-top-r">
                    <div class="c-c-c-top-r-l" v-auth="'/system/notice/report'" @click="showCreateNotice = true">
                        <i class="el-icon-plus"></i>
                        发布公告
                    </div>
                    <div class="c-c-c-top-r-r" v-auth="'/system/notice/more'" @click="$router.push({path:'/system/notice/'})">
                        查看更多
                        <i class="el-icon-arrow-right"></i>
                    </div>
                </div>
            </div>
            <ad-scroll :rolling="tipsList"
                       :showMaxNum="Number(5)"
                       @chose="getTipDetail"></ad-scroll>
        </div>

        <!--公告详情弹层-->
        <popup :showPopup="showTipsPopup"
               :width="$getPx(800)"
               @handleClose="handleTipClose"
               title="公告详情">
            <TipDetailCard :tipDetail="tipDetail"></TipDetailCard>
        </popup>

        <!--发布公告-->
        <create-notice v-model="showCreateNotice" @create="queryTipsList"></create-notice>
    </div>
</template>

<script>

    import IndexLineChart from '../../components/index/index-line-chart';
    import IndexTipTitle from '../../components/index/tips-title';
    import AdScroll from '../../components/index/ad-scroll';

    import TipDetailCard from '../../components/index/tip-detail-card';
    import CreateNotice from '../../components/system/create-notice';

    export default {
        components: {
            IndexTipTitle,
            IndexLineChart,
            TipDetailCard,
            CreateNotice,
            AdScroll
        },
        services: [ 'index' ],
        events: {
            test: 'onTest'
        },
        data () {
            return {
                topRightBar: [ {
                    title: '个人设置',
                    link: '/system/user/'
                }, {
                    title: '隧道管理',
                    link: '/system/tunnel/'
                }, {
                    title: '日志管理',
                    link: '/system/log/'
                }, {
                    title: '系统管理',
                    selfUrl: true,
                    link: '/system/notice/'
                } ],

                tipsList: [],    //系统公告
                indexLineData: [],   //活跃动态
                tipDetail: {},      //公告详情

                showTipsPopup: false,
                showCreateNotice: false
            };
        },
        mounted () {
            console.log(this.myUserInfo);

            //查询用户活跃度
            this.queryUserActivity();
            //查询公告列表
            this.queryTipsList();

            /*this.$service.index.getTunnelList({});
            this.$em.$fire('test', {a: 1}, 123, '12312');*/
        },
        methods: {
            goPage (path) {
                if (path.selfUrl) {
                    if (this.myUserInfo.menuList.some(v => v.openUrl === '/rest/admin')) {
                        window.open(this.$store.state.myUserInfo.systemDomain);
                    } else {
                        this.$message.error('抱歉，您没有权限访问该页面');
                    }
                } else {
                    this.$router.push({path: path.link});
                }
            },
            onTest (e, a, b) {
                console.log('onTest', e, a, b);
                console.log(this.$service);
            },
            queryUserActivity () {//查询用户活跃度
                this.$service.index.queryUserActivity(this.myUserInfo.userId).then(res => {
                    this.indexLineData = res && res.reverse() || [];
                });
            },
            queryTipsList () { //查询公告列表
                this.$service.index.queryTipsList().then(res => {
                    this.tipsList = res || [];
                });
            },
            getTipDetail (row) { //根据ID查询公告信息
                let id = row.noticeId;
                this.$service.index.getTipDetail(id).then(res => {
                    this.tipDetail = res || [];
                    this.showTipsPopup = true;
                });
            },

            handleTipClose () {
                this.showTipsPopup = false;
            }
        }
    };
</script>

<style lang="less" scoped>
    img {
        height: 100%;
        width: 100%
    }

    .page-t-ctn {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-family: PingFang-SC-Heavy, PingFang-SC;
        font-weight: 800;
        color: #5391F3;
    }

    .container {
        width: 100%;
        padding-bottom: 20px;

        .center-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 200px;
            margin-left: 18px;
            margin-right: 18px;
            width: calc(100% - 36px);
            margin-bottom: 30px;

            .c-c-l {
                display: flex;
                align-items: center;
                height: 200px;
                width: 60%;
                padding-bottom: 1px;
                position: relative;
                background: linear-gradient(180deg, rgba(24, 38, 113, 0.8) 0%, rgba(24, 38, 113, 0) 100%);
                border-radius: 20px 20px 0px 0px;

                .c-c-l-title {
                    font-size: 18px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #337CF3;
                    text-align: center;
                    margin-top: 24px;
                }

                .c-c-l--ctn {
                    display: flex;
                    align-items: center;
                    margin-left: 30px;
                    margin-right: 30px;
                    width: calc(100% - 60px);
                    height: 80px;

                    .user-head {
                        height: 80px;
                        width: 80px;
                        border-radius: 50%;
                        flex: none;
                        overflow: hidden;
                    }

                    .user-info {
                        display: flex;
                        align-items: center;
                        margin-left: 20px;
                        height: 80px;
                        width: 100%;
                        font-size: 16px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #C1D9FF;

                        .t2 {
                            margin-top: 20px
                        }
                    }
                }
            }

            .c-c-r {
                height: 200px;
                width: 38%;
                display: flex;
                align-items: center;
                padding-bottom: 1px;
                position: relative;
                background: linear-gradient(180deg, rgba(24, 38, 113, 0.8) 0%, rgba(24, 38, 113, 0) 100%);
                border-radius: 20px 20px 0px 0px;

                .c-c-r-ctn {
                    margin-left: 50px;
                    margin-right: 50px;
                    width: calc(100% - 100px);
                    display: flex;
                    align-items: center;

                    .c-c-r-item {
                        cursor: pointer;
                        flex: 1;
                        width: 70px;

                        .item-icon {
                            margin: 0 auto;
                            height: 44px;
                            width: 44px;

                            img {
                                height: 100%;
                                width: 100%
                            }
                        }

                        .item-t {
                            margin-top: 14px;
                            text-align: center;
                            width: 100%;
                            font-size: 16px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            color: #C1D9FF;
                        }
                    }
                }
            }
        }

        .bottom-container {
            width: calc(100% - 36px);
            padding-top: 18px;
            padding-left: 18px;
            margin-left: 18px;
            margin-right: 18px;
            padding-bottom: 1px;
            position: relative;
            background: linear-gradient(180deg, rgba(24, 38, 113, 0.6) 0%, rgba(24, 38, 113, 0) 100%);
            border-radius: 20px 20px 0px 0px;

            .chart-bg {
                margin-top: 30px;
                width: 100%;
            }
        }

        .c-c-c {
            width: calc(100% - 36px);
            margin-left: 18px;
            margin-right: 18px;
            padding-bottom: 1px;
            position: relative;
            background: linear-gradient(180deg, rgba(24, 38, 113, 0.6) 0%, rgba(24, 38, 113, 0) 100%);
            border-radius: 20px 20px 0px 0px;

            .c-c-c-top {
                margin-left: 18px;
                margin-right: 18px;
                width: calc(100% - 36px);
                margin-bottom: 22px;
                display: flex;
                align-items: center;
                justify-content: space-between;

                .c-c-c-top-r {
                    margin-top: 18px;
                    display: flex;
                    align-items: center;

                    .c-c-c-top-r-l {
                        width: 80px;
                        height: 30px;
                        cursor: pointer;
                        border-radius: 4px;
                        background-color: #123A84;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        color: #C1D9FF;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 28px;

                        .el-icon-plus {
                            margin-right: 4px;
                            margin-top: 1px;
                        }
                    }

                    .c-c-c-top-r-r {
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #5391F3;

                        .el-icon-arrow-right {
                            margin-top: 1px
                        }
                    }
                }
            }

            .tip-list {
                margin-left: 18px;
                margin-right: 18px;
                width: calc(100% - 36px);
                height: 190px;
                overflow: hidden;

                .border-btm {
                    border-bottom: 1px dashed #334BBA;
                }

                .tip-list-item {
                    height: 56px;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;

                    .tip-list-l {
                        font-size: 16px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #C1D9FF;
                    }

                    .tip-list-r {
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #C1D9FF;
                    }
                }
            }
        }
    }
</style>
