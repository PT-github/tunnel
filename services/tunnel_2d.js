/*
 * @Author: PT
 * @Date: 2021-09-22 23:58:46
 * @LastEditors: PT
 * @LastEditTime: 2021-09-26 01:14:17
 * @Description: file content
 */
export default class TwoDService extends Service {

  // 登录
login(data) {
  return this.post({
    url: '/tunnel/login',
    data,
    method: 'POST',
    contentType: 'form',
    retAll: true
  })
}
// 登出
loginOut(data) {
  return this.get({
    url: '/tunnel/rest/userinfo/loginOut',
    data,
    method: 'GET',
    contentType: 'form',
    retAll: true
  })
}

// 获取隧道设备
getTunnelDevice(data) {
  return this.get({
    url: '/tunnel/rest/pohome/getTunnelDevice',
    data,
    method: 'GET',
    retAll: true
  })
}
// 获取隧道信息
getTunnelDetail(data) {
  return this.get({
    url: '/tunnel/rest/TunnelInfo/get',
    data,
    method: 'GET',
    retAll: true
  })
}
// 获取隧道列表
getTunnelList(data) {
  return this.get({
    url: '/tunnel/rest/pohome/getTunnels',
    url: '/tunnel/rest/home/pageAll',
    data,
    method: 'GET',
    retAll: true
  })
}
// 获取隧道的设备类型
getDeviceClassify(data) {
  return this.get({
    url: '/tunnel/rest/2d/getDeviceClassify',
    data,
    method: 'GET',
    retAll: true
  })
}


// 隧道统计值-车流量
getTunnelTrafficVolume(data) {
  return this.get({
    url: '/tunnel/rest/pohome/getTunnelTrafficVolume',
    data,
    method: 'GET',
    retAll: true
  })
}
// 查询控制的数值-风速分向
getDataSensorInfo(data) {
  return this.get({
    url: '/tunnel/rest/pohome/getDataSensorInfo',
    data,
    method: 'GET',
    retAll: true
  })
}
// 查询控制的数值-光强
getLuminometer(data) {
  return this.get({
    url: '/tunnel/rest/pohome/getLuminometer',
    data,
    method: 'GET',
    retAll: true
  })
}
// 查询 - COVI
getCoVi(data) {
  return this.get({
    url: '/tunnel/rest/pohome/getCoVi',
    data,
    method: 'GET',
    retAll: true
  })
}
// 查询 节能用电
getEnergyConsum(data) {
  return this.get({
    url: '/tunnel/rest/pohome/getEnergyConsum',
    data,
    method: 'GET',
    retAll: true
  })
}
// 查询-消防水泵
getWaterlevel(data) {
  return this.get({
    url: '/tunnel/rest/pohome/getWaterlevel',
    data,
    method: 'GET',
    retAll: true
  })
}
// 查询-隧道环境
getHumidityTemperature(data) {
  return this.get({
    url: '/tunnel/rest/pohome/getHumidityTemperature',
    data,
    method: 'GET',
    retAll: true
  })
}
// 查询设备台账分类（全景控制头部）
getAppointListAll(data) {
  return this.get({
    url: '/tunnel/rest/panoramaHeadBusiness/getAppointListAll',
    data,
    method: 'GET',
    retAll: true
  })
}
// 获取全景所有设备列表信息-刘斐
getSelectDeviceList(data) {
  return this.post({
    url: '/tunnel/rest/pohome/getSelectDeviceList',
    data,
    method: 'POST',
    retAll: true
  })
}
// 获取设备分类控制模式信息-刘斐
getDeviceClassifyControlInfo(data) {
  return this.get({
    url: '/tunnel/rest/pohome/getDeviceClassifyControlInfo',
    data,
    method: 'GET',
    retAll: true
  })
}
// 交通信号灯控制执行-统一执行-刘斐
trafficLightsImplement(data) {
  return this.post({
    url: '/tunnel/rest/trafficLights/trafficLightsImplement',
    data,
    method: 'POST',
    retAll: true
  })
}
// 获取车道指示器数据
getLaneIndicatorData(data) {
  return this.get({
    url: '/tunnel/rest/laneIndicator/leftRightLine',
    data,
    method: 'GET',
    retAll: true
  })
}
// 获取车道指示器数据
laneIndicatorImplementList(data, params) {
  let qs = ''//'?'
  if (params) {
    qs = '?'
    for (let prop in params) {
      qs += `${prop}=${params[prop]}&`
    }
    qs = qs.substring(0, qs.length - 1)
  }
  return this.post({
    url: '/tunnel/rest/laneIndicator/laneIndicatorImplementList' + qs,
    data,
    method: 'POST',
    retAll: true
  })
}
// 获取广播文件信息
getDeviceCriticalBroadcastList(data) {
  return this.get({
    url: '/tunnel/rest/BroadcastBoard/getDeviceCriticalBroadcastList',
    data,
    method: 'GET',
    retAll: true
  })
}
// 停止定时播放
criticalBroadTimedPlaybackShop(data) {
  return this.post({
    url: '/tunnel/rest/BroadcastBoard/criticalBroadTimedPlaybackShop?tunnelId=' + data,
    method: 'POST',
    retAll: true
  })
}
// 关闭设备播放
closeDeviceCriticalBroadcast(data) {
  return this.post({
    url: '/tunnel/rest/BroadcastBoard/closeDeviceCriticalBroadcast?deviceId=' + data,
    method: 'POST',
    retAll: true
  })
}
// 定时播放
criticalBroadTimedPlayback(data) {
  return this.get({
    url: '/tunnel/rest/BroadcastBoard/criticalBroadTimedPlayback',
    data,
    method: 'GET',
    retAll: true
  })
}
// 保存广播
saveDeviceCriticalBroadcast(data) {
  return this.post({
    url: '/tunnel/rest/BroadcastBoard/saveDeviceCriticalBroadcast',
    data,
    method: 'POST',
    contentType: 'form',
    retAll: true
  })
}

// 查询设备通用方案列表-不分页
listAll(data) {
  return this.get({
    url: '/tunnel/rest/tCombinationscheme/listAll',
    data,
    method: 'GET',
    retAll: true
  })
}
// 查询通用方案下已选设备列表-不分页
getIsDeviceListAll(data) {
  return this.get({
    url: '/tunnel/rest/tCombinationschemeitem/getIsDeviceListAll',
    data,
    method: 'GET',
    retAll: true
  })
}
// 批量添加照明智能模式设备
insertByBatch(data) {
  return this.post({
    // url: '/tunnel/rest/tLightingintelligentdevice/insertByBatch',
    url: '/tunnel/rest/tCombinationschemeitem/updateByBatch',
    data,
    method: 'POST',
    retAll: true
  })
}
// 新增设备通用方案
insert(data) {
  console.log(111111, data)
  return this.post({
    url: '/tunnel/rest/tCombinationscheme/insert',
    data,
    method: 'POST',
    retAll: true
  })
}
// 修改设备通用方案
update(data) {
  return this.post({
    url: '/tunnel/rest/tCombinationscheme/update',
    data,
    method: 'POST',
    retAll: true
  })
}
// 删除设备通用方案
deleteScheme(data) {
  return this.post({
    url: '/tunnel/rest/tCombinationscheme/delete',
    data,
    method: 'POST',
    contentType: 'form',
    retAll: true
  })
}
// 通用方案控制执行
tCombinationschemeitemImplement(data) {
  return this.post({
    url: '/tunnel/rest/tCombinationschemeitem/tCombinationschemeitemImplement',
    data,
    method: 'POST',
    retAll: true
  })
}

// 通用方案控制执行
operateCommonDevice(data) {
  return this.post({
    url: '/tunnel/rest/pohome/operateCommonDevice',
    data,
    method: 'POST',
    contentType: 'form',
    retAll: true
  })
}
// 获取情报板列表
getIntelligenceBoardList(data) {
  return this.post({
    url: '/tunnel/rest/IntelligenceBoard/getIntelligenceBoardList',
    data,
    method: 'POST',
    retAll: true
  })
}
// 获取播放列表
getDeviceQbBoardList(data) {
  return this.get({
    url: '/tunnel/rest/IntelligenceBoard/getDeviceQbBoardList',
    data,
    method: 'GET',
    retAll: true
  })
}
// 获取设备节目单
getDeviceQbByDeviceId(data) {
  return this.get({
    url: '/tunnel/rest/IntelligenceBoard/getDeviceQbByDeviceId',
    data,
    method: 'GET',
    retAll: true
  })
}
// 获取字典
listChildrenByParentValue(data) {
  return this.get({
    url: '/tunnel/listChildrenByParentValue',
    data,
    method: 'GET',
    retAll: true
  })
}
// 保存模板
saveDeviceQbBoardNew(data) {
  return this.post({
    url: '/tunnel/rest/2d/saveDeviceQbBoardNew',
    data,
    method: 'POST',
    retAll: true
  })
}
// 删除模板
deleteDeviceQbBoardTmepinfo(data) {
  return this.post({
    url: '/tunnel/rest/IntelligenceBoard/deleteDeviceQbBoardTmepinfo',
    data,
    method: 'POST',
    contentType: 'form',
    retAll: true
  })
}
// 删除模板
oprateDeviceQbBoard(data) {
  return this.post({
    url: '/tunnel/rest/IntelligenceBoard/oprateDeviceQbBoard',
    data,
    method: 'POST',
    retAll: true
  })
}
// 主动推送
deviceStatusChange(data) {
  return this.post({
    url: '/tunnel/open/deviceStatusChange',
    data,
    method: 'POST',
    contentType: 'form',
    retAll: true
  })
}
// 主动推送分类
deviceStatusClassChange(data) {
  return this.post({
    url: '/tunnel/open/deviceStatusClassChange',
    data,
    method: 'POST',
    contentType: 'form',
    retAll: true
  })
}
// 获取季节列表
getListAll(data) {
  return this.get({
    url: '/tunnel/rest/tSeason/getListAll',
    data,
    method: 'GET',
    retAll: true
  })
}
// 获取时间段列表
getSeasonListAll(data) {
  return this.get({
    url: '/tunnel/rest/tSeasonTimeslot/getSeasonListAll',
    data,
    method: 'GET',
    retAll: true
  })
}
// 时间段配置设备
insertTimeDeviceByBatch(data) {
  return this.post({
    url: '/tunnel/rest/tTimeslotDevice/insertByBatch',
    data,
    method: 'POST',
    retAll: true
  })
}
// 时间段启用
timeEnable(data) {
  return this.post({
    url: '/tunnel/rest/tSeasonTimeslot/enable',
    data,
    method: 'POST',
    contentType: 'form',
    retAll: true
  })
}
// 获取策略
getLists(data) {
  return this.get({
    url: '/tunnel/rest/tLightingintelligentmode/getLists',
    data,
    method: 'GET',
    retAll: true
  })
}
// 照明启用
lightingEnable(data, params) {
  let qs = ''//'?'
  if (params) {
    qs = '?'
    for (let prop in params) {
      qs += `${prop}=${params[prop]}&`
    }
    qs = qs.substring(0, qs.length - 1)
  }
  return this.post({
    url: '/tunnel/rest/tLightingintelligentmode/enable' + qs,
    data,
    method: 'POST',
    contentType: 'form',
    retAll: true
  })
}
// 获取季节时间段下的设备
getDevicebookinfoList(data) {
  return this.get({
    url: '/tunnel/rest/tTimeslotDevice/getDevicebookinfoList',
    data,
    method: 'GET',
    retAll: true
  })
}
// 批量添加、修改季节时间段设备
updateTimeByBatch(data) {
  return this.post({
    url: '/tunnel/rest/tTimeslotDevice/updateByBatch',
    data,
    method: 'POST',
    retAll: true
  })
}
// 查询照明智能模式已选设备列表-不分页
getStragyDeviceListAll(data) {
  return this.get({
    url: '/tunnel/rest/tLightingintelligentdevice/getIsDeviceListAll',
    data,
    method: 'GET',
    retAll: true
  })
}
// 查询亮度仪设备列表（光强）
getLuminanceMeterEquipment(data) {
  return this.get({
    url: '/tunnel/rest/tLightingintelligentmode/getLuminanceMeterEquipment',
    data,
    method: 'GET',
    retAll: true
  })
}
// 新增策略
insertStrategy(data) {
  return this.post({
    url: '/tunnel/rest/tLightingintelligentmode/insert',
    data,
    method: 'POST',
    retAll: true
  })
}
// 查询亮度仪设备列表（光强）
bindStrategyDevice(data) {
  return this.post({
    url: '/tunnel/rest/tLightingintelligentdevice/updateByBatch',
    data,
    method: 'POST',
    retAll: true
  })
}
// 策略删除
strategyDelete(data) {
  return this.post({
    url: '/tunnel/rest/tLightingintelligentmode/delete',
    data,
    method: 'POST',
    contentType: 'form',
    retAll: true
  })
}
// 季节删除
deleteSeason(data) {
  return this.post({
    url: '/tunnel/rest/tSeason/delete',
    data,
    method: 'POST',
    contentType: 'form',
    retAll: true
  })
}

}