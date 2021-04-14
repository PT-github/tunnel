// 2d界面的接口
export default class TwoDService extends Service {

    // 获取隧道设备
    getTunnelDevices(tunnelId) {
        return this.get({
            url: '/tunnel/rest/2d/getTunnelDevice',
            data: {
                tunnelId
            }
        });
    }

    // 获取隧道两路视频
    getTunnelVideos(tunnelId) {
        return this.get({
            url: '/tunnel/rest/2d/getTunnelDeviceVideo',
            data: {
                tunnelId
            }
        });
    }

    // 获取隧道的设备类型
    getTunnelDeviceTypes() {
        return this.get({
            url: '/tunnel/rest/2d/getDeviceClassify',
            cacheKey: 'deviceType'
        });
    }

    // 获取隧道某个类型的设备列表
    getTunnelDeviceTypeList(tunnelId, classifyNumber) {
        return this.get({
            url: '/tunnel/rest/2d/getTunnelDeviceByClassifyId',
            data: {
                classifyNumber,
                tunnelId,
                classifyId: ''
            }
        });
    }

    // 获取设备类型名
    getDeviceTypeName(classifyNumber) {
        return this.getTunnelDeviceTypes().then(res => {
            return res.find(v => v.classifyNumber === classifyNumber).classifyName;
        });
    }

    // 巡检隧道
    inspectTunnel(tunnelId) {
        return this.post({
            url: '/tunnel/rest/inspect/inspectTunnel',
            contentType: 'form',
            data: {
                tunnelId
            }
        });
    }

    // 巡检隧道设备
    inspectDevice(tunnelId, inspectId, deviceId) {
        return this.post({
            url: '/tunnel/rest/inspect/inspectTunnelDevice',
            contentType: 'form',
            data: {
                tunnelId,
                inspectId,
                deviceId
            }
        });
    }

    // 控制设备-控制柜、照明灯、风机、信号灯、车道指示器、火灾消防、诱导灯、横洞卷闸门
    operatePlcDevice(p) {
        return this.post({
            loadingText: '正在执行...请稍后',
            url: '/tunnel/rest/2d/operateCommonDevice',
            contentType: 'form',
            data: p
        });
    }

    // 获取隧道设备两路视频(电子围栏的视频)
    getTunnel2Videos(tunnelId) {
        return this.get({
            url: '/tunnel/rest/2d/getTunnelDeviceVideo',
            data: {tunnelId}
        });
    }

    // 获取广播文件
    getBroadcastSource(tunnelId) {
        return this.get({
            url: '/tunnel/rest/2d/getDeviceCriticalBroadcastList',
            data: {tunnelId}
        });
    }

    // 保存广播文件
    saveBroadcastSource({tunnelId, boardcastFileName, boardcastFilePath}) {
        return this.post({
            loadingText: '正在执行...请稍后',
            url: '/tunnel/rest/2d/saveDeviceCriticalBroadcast',
            contentType: 'form',
            data: {tunnelId, boardcastFileName, boardcastFilePath}
        });
    }

    // 播放广播
    playBroadcast({tunnelId, deviceId, loop, tempId}) {
        return this.post({
            loadingText: '正在执行...请稍后',
            url: '/tunnel/rest/2d/oprateDeviceCriticalBroadByTempId',
            contentType: 'form',
            data: {tunnelId, deviceId, loop, tempId}
        });
    }

    // 停止广播
    stopBroadcast({tunnelId, deviceId}) {
        return this.post({
            loadingText: '正在执行...请稍后',
            url: '/tunnel/rest/2d/closeDeviceCriticalBroadcast',
            contentType: 'form',
            data: {tunnelId, deviceId}
        });
    }

    // 保存情报板模板
    saveInfoBoardTmp(p) {
        return this.post({
            loadingText: '正在执行...请稍后',
            url: '/tunnel/rest/2d/saveDeviceQbBoardNew',
            data: p
        });
    }

    // 删除情报板模板
    deleteInfoBoardTmp(tempId) {
        return this.post({
            loadingText: '正在执行...请稍后',
            url: '/tunnel/rest/2d/deleteDeviceQbBoardTmepinfo',
            contentType: 'form',
            data: {tempId}
        });
    }

    // 获取情报板模板列表
    getInfoBoardTmpList(tunnelId,playDetail) {
        return this.get({
            url: '/tunnel/rest/2d/getDeviceQbBoardList',
            data: {
                tunnelId,
                resolutionPower:playDetail.resolutionPower || '',
                templetName:playDetail.templetName || '',
            }
        });
    }

    // 根据设备获取情报板信息
    getInfoBoardFromDevice(deviceId) {
        return this.get({
            url: '/tunnel/rest/2d/getDeviceQbByDeviceIdNew',
            data: {deviceId}
        });
    }

    // 直接操作情报板
    operateInfoBoard(data) {
        return this.post({
            loadingText: '正在执行...请稍后',
            url: '/tunnel/rest/2d/oprateDeviceQbBoard',
            data
        });
    }

    // 使用模板操作情报板
    operateInfoBoardByTmp(deviceId, tempId) {
        return this.post({
            loadingText: '正在执行...请稍后',
            url: '/tunnel/rest/2d/oprateDeviceQbBoardByTempId',
            contentType: 'form',
            data: {deviceId, tempId}
        });
    }
    operateInfoBoardByTmpNew(data){
        return this.post({
            loadingText: '正在执行...请稍后',
            url: '/tunnel/rest/2d/oprateDeviceQbBoardNew',
            data: data
        });
    }
   

    // 隧道字典
    // Show3D 显示隧道3d
    // ShowFirstPageLR 首页左右侧边栏显示
    getTunnelShow3D(params) {
        return this.get({
            url: '/tunnel/rest/SystemDictionary/listChildrenByParentValue',
            data: {
                value: 'OneValueDictionary'
            }
        })
    }

    getDict (code) {
        return this.get({
            url: '/tunnel/rest/SystemDictionary/listChildrenByParentValue',
            contentType: 'form',
            data: {
                
                value:code
            }
        }).then(res => {
            return res.map(v => {
                return {
                    name: v.name,
                    value: v.value || v.DictionaryId
                };
            });
        });
    }

}
