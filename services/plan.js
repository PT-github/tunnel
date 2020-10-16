export default class PlanService extends Service {

    // 分页查询预案列表
    getList (data) {
        return this.get({
            url: '/tunnel/rest/TContingencyPlanRecord/pageAll',
            data
        });
    }

    // 获取事件类型
    getEventTypes () {
        return this.get({
            url: '/tunnel/rest/TEventTypeInfo/getEventTypeAll'
        }).then(res => {
            return res.map(v => {
                return {
                    name: v.typeName,
                    value: v.id
                };
            });
        });
    }

    // 更新预案状态
    updateStatus (idList, newStatus) {
        return this.post({
            url: newStatus ? '/tunnel/rest/TContingencyPlanRecord/startReminder' : '/tunnel/rest/TContingencyPlanRecord/endReminder',
            contentType: 'form',
            data: {
                idList
            }
        });
    }

    // 删除预案
    deletePlan (ids) {
        return this.post({
            url: '/tunnel/rest/TContingencyPlanRecord/deleteBatch',
            contentType: 'form',
            data: {
                ids
            }
        });
    }

    //预案详情
    queryPlanDetail (id) {
        return this.get({
            url: '/tunnel/rest/TContingencyPlanRecord/get',
            data: {
                id
            }
        });
    }

    //分页查询设预案执行情况
    queryPlanDoneList (param) {
        return this.get({
            url: '/tunnel/rest/TEmergencyPlanExecution/pageAll',
            data: param
        }).then(res => {
            return res;
        });
    }

    //根据条件查询预案列表
    getAllByParam (param) {
        return this.get({
            url: '/tunnel/rest/TContingencyPlanRecord/getAllByParam',
            data: param
        });
    }

    // 获取预案的操作
    getPlanActions (planId) {
        return this.get({
            url: '/tunnel/rest/TContingencyPlanRecord/getOperateById',
            data: {
                id: planId
            }
        });
    }

    // 新增或者编辑预案
    createOrUpdatePlan (param) {
        return this.post({
            url: param.id ? '/tunnel/rest/TContingencyPlanRecord/save' : '/tunnel/rest/TContingencyPlanRecord/insert',
            data: param
        });
    }

    //根据设备ID查询设备控制信息
    getDevicePropertyValueInfo (deviceId) {
        return this.get({
            url: '/tunnel/rest/TDevicePropertyValueInfo/getDevicePropertyValueInfo',
            data: {
                deviceId
            }
        }).then(res => {
            if (res && res.length) {
                res.forEach(item => {
                    item._value = undefined;  //输入默认值
                    //controlMode 0单选 1多选 2输入框
                    if (item.controlMode === 0 || item.controlMode === 1) {
                        item._value = false; //单选开关默认值
                        if (item.controlMode === 1) {
                            item._value = [];   //复选框默认值
                        }
                        item._selected = []; //选择框数组
                        Object.keys(item.propertyValueModels).map((key) => {
                            item._selected.push({
                                name: key,
                                value: item.propertyValueModels[ key ]
                            });
                        });
                    } else if (item.controlMode === 2) {
                        item._value = 1;
                    }
                });
            }
            return res || [];
        });
    }
}