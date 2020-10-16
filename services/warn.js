// 预警
export default class WarnService extends Service {

    // 查询预警日志
    getList (data) {
        return this.get({
            url: '/tunnel/rest/TDevicewarninginfo/pageAll',
            data
        });
    }
}