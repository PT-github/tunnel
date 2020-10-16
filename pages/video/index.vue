<template>
    <div class="video-page">
        <div class="video-list" ref="list">
            <template v-if="previewVideos.length" v-for="video in previewVideos">
                <div class="video-item" :class="'mode'+mode" v-if="video.id">
                    <video-rtsp :width="videoStyle.width" no-bg click-to-play
                                is-true-width
                                :device-config="video.deviceConfig"></video-rtsp>
                </div>
            </template>
        </div>
        <div class="right">
            <div class="show-switch">
                <el-radio-group v-model="mode">
                    <el-radio-button label="2x2"></el-radio-button>
                    <el-radio-button label="3x3"></el-radio-button>
                    <el-radio-button label="4x4"></el-radio-button>
                </el-radio-group>
                <div>最多可选择{{maxVideoCount}}个视频</div>
            </div>
            <div class="tunnel-list">
                <div class="search">
                    <el-input v-model="keyword" placeholder="请输入视频设备名称"></el-input>
                    <el-button type="primary" class="btn-search" @click="search">搜索</el-button>
                </div>
                <div class="search-result" v-if="showSearchResult">
                    <el-checkbox-group v-model="selected" :max="maxVideoCount">
                        <div class="camera-item" v-for="(camera,idx) in searchResult" :key="idx">
                            <span>{{camera.belongTunnel}} - [{{camera.leftRightFlagName}}] {{camera.deviceName}}</span>
                            <el-checkbox :label="camera">&nbsp;</el-checkbox>
                        </div>
                    </el-checkbox-group>
                </div>
                <el-collapse v-model="activeTunnels" @change="onCollapseChange" v-if="!showSearchResult">
                    <el-checkbox-group v-model="selected" :max="maxVideoCount">
                        <template v-for="item in tunnelList">
                            <el-collapse-item :title="`${item.belongTunnel} （${item.count}个视频）`" :name="item.tunnelId">
                                <div class="camera-item" v-if="videoList[item.tunnelId]"
                                     v-for="camera in videoList[item.tunnelId]">
                                    <span>[{{camera.leftRightFlagName}}] {{camera.deviceName}}</span>
                                    <el-checkbox :label="camera">&nbsp;</el-checkbox>
                                </div>
                            </el-collapse-item>
                        </template>
                    </el-checkbox-group>
                </el-collapse>
                <div class="buttons">
                    <el-button type="primary" @click="preview">预览</el-button>
                    <el-button type="primary" @click="selected = []">重置</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    const getMax = mode => {
        return {'2x2': 4, '3x3': 9, '4x4': 16}[ mode ];
    };
    import VideoRtsp from '../../components/video/video-rtsp';

    export default {
        components: {VideoRtsp},
        services: [ 'video' ],
        computed: {
            maxVideoCount () {  // 最多显示多少个视频
                return getMax(this.mode);
            },
            videoStyle () {     // 视频宽高
                if (!this.$refs.list) return {};
                let {clientWidth} = this.$refs.list;
                let x = {'2x2': 2, '3x3': 3, '4x4': 4}[ this.previewMode ];
                return {
                    width: (clientWidth - x * 25 * this.$px2rem) / x
                };
            }
        },
        mounted () {
            this.$nextTick(() => {
                this.previewVideos = [ {id: 1}, {id: 1}, {id: 1}, {id: 1} ];
                this.previewMode = '2x2';
            });
            this.$service.video.getTunnelList().then(res => {
                this.tunnelList = res;
                this.$nextTick(() => {
                    if (res[ 0 ]) {
                        this.activeTunnels = [ res[ 0 ].tunnelId ];
                        this.onCollapseChange(this.activeTunnels);
                    }
                });
            });
        },
        data () {
            return {
                tunnelList: [],
                videoList: {},
                activeTunnels: [],
                selected: [],
                keyword: '',
                mode: '2x2',
                previewVideos: [],   // 视频墙展示
                previewMode: '',      // 视频墙展示的模式
                searchResult: [],      // 搜索结果
                showSearchResult: false     // 是否展示搜索结果
            };
        },
        methods: {
            search () {
                if (this.keyword) {
                    this.showSearchResult = true;
                    this.$service.video.getVideoList({deviceName: this.keyword, tunnelId: ''}).then(res => {
                        this.selected = [];
                        this.searchResult = res;
                    });
                } else {
                    this.showSearchResult = false;
                    this.searchResult = [];
                    this.selected = [];
                }
            },
            preview () {    // 预览
                let max = getMax(this.mode);
                if (max < this.selected.length) {
                    // return this.$message.warning(`${this.mode}模式最多预览${max}个视频，请先取消勾选部分视频`);
                    this.selected.splice(max, this.selected.length - max);
                }
                if (!this.selected.length) {
                    return this.$message.warning('请至少选择一路视频');
                }
                if (this.previewMode === this.mode) {   // 相同模式下，如果只加了预览视频，那前面的视频不重新加载
                    this.previewVideos = this.previewVideos.map((v, i) => {
                        if (this.selected[ i ] && v.id === this.selected[ i ].id) { // 已预览的视频id跟已选的视频id一样，就不动
                            return v;
                        } else {
                            return {};
                        }
                    });
                } else {
                    this.previewVideos = [];
                }
                setTimeout(() => {
                    this.previewMode = this.mode + '';
                    let add = [];
                    if (max > this.selected.length) {
                        while (add.length < max - this.selected.length) {
                            add.push({id: 1});
                        }
                    }
                    this.previewVideos = this.selected.concat(add);
                }, 500);
            },
            async onCollapseChange (e) {
                for (let i = 0; i <= e.length; i++) {
                    let tunnelId = e[ i ];
                    if (!tunnelId) return;
                    if (!this.videoList[ tunnelId ]) {
                        let cameras = await this.$service.video.getVideoList({
                            deviceName: '',
                            tunnelId: tunnelId
                        });
                        this.$set(this.videoList, tunnelId, cameras);
                    }
                }
            }
        }
    };
</script>
<style lang='less' scoped>
    .video-page {
        display: flex;
        margin: 0 18px;
        height: calc(100vh - 120px);
        padding: 20px 20px 30px;
        background: linear-gradient(180deg, rgba(17, 34, 109, 0.6) 0%, rgba(15, 102, 186, 0) 100%);
        border-radius: 20px;
    }

    .video-list {
        flex: 1;
        height: 100%;

        .video-wrap {
            margin-bottom: 0;
        }

        .video-item {
            display: inline-block;
            margin-bottom: 20px;
            margin-right: 20px;

            &.mode2x2 {
            }
        }
    }

    .right {
        flex-shrink: 0;
        width: 420px;
        display: flex;
        flex-direction: column;

        .btn-search {
            color: #fff;
        }

        .buttons {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .show-switch {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 0 30px;
            font-size: 16px;
            font-weight: 400;
            color: rgba(83, 145, 243, 1);
            line-height: 16px;
            background: rgba(14, 36, 101, 1);
            border-radius: 4px;
            border: 1px solid rgba(34, 76, 151, 1);

            .el-radio-group {
                margin-bottom: 26px;
            }
        }

        .camera-item {
            height: 80px;
            background: rgba(18, 58, 132, 1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px 0 50px;
            font-size: 16px;
            color: rgba(193, 217, 255, 1);
        }

        .el-collapse, .search-result {
            overflow: scroll;
            flex: 1;
            margin: 10px;

            .el-checkbox {
                margin-left: 40px;
            }
        }

        .tunnel-list {
            flex: 1;
            margin-top: 20px;
            padding-bottom: 80px;
            position: relative;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background: linear-gradient(180deg, rgba(17, 34, 109, 0.6) 0%, rgba(15, 102, 186, 0) 100%);

            .search {
                height: 80px;
                background: rgba(51, 124, 243, 1);
                display: flex;
                align-items: center;
                border-radius: 4px 4px 0 0;
                opacity: 0.5;
                border: 1px solid rgba(34, 76, 151, 1);
                justify-content: center;

                .el-input {
                    width: 300px;
                    margin-right: 10px;
                }
            }
        }
    }
</style>

