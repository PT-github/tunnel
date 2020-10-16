// 故障单
export default class FaultService extends Service {

    // 查询故障列表
    getList (data) {
        return this.get({
            url: '/tunnel/rest/TRepairnum/pageAll',
            data
        });
    }

    // 故障详情
    getDetail (data) {
        return this.get({
            url: '/tunnel/rest/TRepairnum/get',
            data
        });
    }

    // 故障上报
    createByUser (data) {
        return this.post({
            url: '/tunnel/rest/TRepairnum/insertByUser',
            data
        });
    }

    //新增故障单（预警系统检测）
    insertByWarning (param) {
        return this.post({
            url: '/tunnel/rest/TRepairnum/insertByWarning',
            contentType: 'json',
            data: param
        });
    }

    //修改(设备维修)
    updateByRepair (arr) {
        return this.post({
            url: '/tunnel/rest/TRepairdetailedrecord/updateByRepair',
            /* contentType:'json',*/
            data: arr
        });
    }

    //修改(设备更换)
    updateByReplace (arr) {
        return this.post({
            url: '/tunnel/rest/TRepairdetailedrecord/updateByReplace',
            /* contentType:'json',*/
            data: arr
        });
    }

    // 忽略预警
    ignoreWarnning (rows) {
        return this.post({
            url: '/tunnel/rest/TDevicewarninginfo/ignore',
            data: rows
        });
    }

    // 总结故障单
    postArchive ({id, serviceReport}) {
        return this.post({
            url: '/tunnel/rest/TRepairnum/summary',
            contentType: 'form',
            data: {id, serviceReport}
        });
    }

    // 归档故障单
    archiveFault (id) {
        return this.post({
            url: '/tunnel/rest/TRepairnum/archive',
            contentType: 'form',
            data: {id}
        });
    }

    // 检查故障单是否能归档
    checkCanArchive (id) {
        return this.get({
            url: '/tunnel/rest/TRepairnum/isComplete',
            data: {id}
        });
    }

    // 故障管理-导出预警日志
    exportTDevicewarninginfo (data) {
        return this.get({
            downloadFile: '预警日志',
            url: '/tunnel/rest/TDevicewarninginfo/exportTDevicewarninginfo',
            data
        });
    }

    // 故障管理 - 导出故障单
    exportFaultinfo (data) {
        return this.get({
            downloadFile: '故障单',
            url: '/tunnel/rest/TRepairnum/exportRepairnum',
            data
        });
    }

    // 预警数量 接口：预警日志的取 预警状态的
    getDevicewarninginfoCount () {
        return this.get({
            url: '/tunnel/rest/TDevicewarninginfo/getDevicewarninginfoCount',
            data: {
                warningStatus: 0
            }
        });
    }

}