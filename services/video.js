// 视频墙
export default class VideoService extends Service {

    // 查询隧道列表
    getTunnelList () {
        return this.get({
            url: '/tunnel/rest/TDevicebookinfo/getVideoCount'
        });
    }

    // 查询视频设备列表
    getVideoList ({tunnelId, deviceName}) {
        return this.get({
            url: '/tunnel/rest/TDevicebookinfo/getVideoWall',
            data: {tunnelId, deviceName}
        });
    }
}