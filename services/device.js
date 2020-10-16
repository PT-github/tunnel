export default class DeviceService extends Service {

    // 设备class分类数量统计
    getDeviceClassList (param) {
        return this.get({
            url: '/tunnel/rest/TDeviceclassifyinfo/listAll',
            data: param,
            loadingText: '正在加载'
        }).then(res => {
            return res;
        });
    }

    // 获取设备Type类型
    getDeviceTypeAll () {
        return this.get({
            url: '/tunnel/rest/TDeviceTypeInfo/listAll',
            data: {}
        }).then(res => {
            let list = res || [];
            if (list && list.length) {
                list.forEach(item => {
                    item.name = item.typeName;
                    item.value = item.id;
                });
            }
            return list;
        });
    }

    // 设备台账类型
    getBookClassifyList () {
        return this.get({
            url: '/tunnel/rest/TDevicebookclassifyinfo/listAll',
            data: {}
        }).then(res => {
            let list = res || [];
            if (list && list.length) {
                list.forEach(item => {
                    item.name = item.bookClassifyName;
                    item.value = item.id;
                });
            }
            return list;
        });
    }

    //设备列表
    queryDeviceList (param) {
        return this.get({
            url: '/tunnel/rest/TDevicebookinfo/pageAll',
            data: param
        }).then(res => {
            return res;
        });
    }

    // 删除设备
    deleteDevice (id) {
        return this.get({
            url: '/tunnel/rest/TDevicebookinfo/delete',
            data: {
                id
            }
        });
    }

    // 通过实体ID批量删除设备台账
    deleteMoreDevice (listId) {
        return this.get({
            url: '/tunnel/rest/TDevicebookinfo/deleteAll',
            data: {
                listId
            }
        });
    }

    //根据ID查设备台账详情
    getById (bookInfoId) {
        return this.get({
            url: '/tunnel/rest/TDevicebookinfo/getDeviceBookInfoDetailById',
            data: {
                bookInfoId
            }
        });
    }

    //根据条件查询设备故障率
    getDeviceGz (param) {
        return this.get({
            url: '/tunnel/rest/TDevicebookinfo/getDeviceFailureRate',
            data: param
        });
    }

    //根据条件查询设备故障波动值
    getDeviceBd (param) {
        return this.get({
            url: '/tunnel/rest/TDevicebookinfo/getDeviceFailureFluctuation',
            data: param
        }).then(res => {
            let arr = res || [];
            if (arr.length) {
                arr.forEach(item => {
                    item.month = item.day;
                });
            }
            return arr;
        });
    }

    //新增台账
    addDevice (param) {
        return this.post({
            url: '/tunnel/rest/TDevicebookinfo/insert',
            data: param
        });
    }

    //修改设备台账
    uploadDevice (param) {
        return this.post({
            url: '/tunnel/rest/TDevicebookinfo/update',
            data: param
        });
    }

    //设备台账操作日志
    queryDeviceCzList (param) {
        if(param.keyWord===''){
            delete param.keyWord
        }
        return this.get({
            url: '/tunnel/rest/TDevicelogrecord/pageAll',
            data: param
        }).then(res => {
            let result = [];
            if (res.records && res.records.length) {
                let date = [];
                res.records.forEach(item => {
                    item.date = item.createdUserDate.substr(5, 5) || item.createdUserDate;
                    date.push(item.createdUserDate.substr(5, 5)); //截取mm-dd日期
                });
                date = [ ...new Set(date) ];      //日期去重

                date.forEach(dates => {
                    let list = [];
                    res.records.forEach(item => {
                        if (item.date == dates) {
                            list.push(item);
                        }
                    });
                    result.push({
                        date: dates,
                        list: list
                    });
                });
            }
            res.records = result || [];
            return res;
        });
    }

    //设备运维日志
    queryDeviceYwList (param) {
        if (param.dateRange && param.dateRange.length) {
            param = {
                ...param,
                startDate: param.dateRange[ 0 ],
                endDate: param.dateRange[ 1 ],
                dateRange: undefined
            };
        }
        return this.get({
            url: '/tunnel/rest/TDevicebookinfo/getMaintenanceStatusPage',
            data: param
        });
    }

    //根据条件查设备
    getDeviceByTunnelId (param) {
        return this.get({
            url: '/tunnel/rest/TDevicebookinfo/getDeviceByTunnelId',
            loadingText: '正在加载',
            data: param
        });
    }

    // 预案查询设备类型
    getDevicClassifyInfoeByTunnelId (param) {
        return this.get({
            url: '/tunnel/rest/TDeviceclassifyinfo/listAllByDevice',
            loadingText: '正在加载',
            data: param
        });
    }

    // 根据条件查设备并且用于选择框
    getDeviceForSelect (param) {
        return this.getDeviceByTunnelId(param).then(res => {
            return res.map(v => {
                return {
                    name: v.deviceName,
                    value: v.id
                };
            });
        });
    }

    // 下载设备导入的excel模板
    downloadDeviceTemplates () {
        return this.get({
            downloadFile: '设备导入模板',
            url: '/tunnel/rest/TDevicebookinfo/downloadDeviceTemplates'
        });
    }

    // 导出excel
    exportDeviceBook (data) {
        return this.get({
            downloadFile: '导出设备列表',
            url: '/tunnel/rest/TDevicebookinfo/exportDeviceBook',
            data
        });
    }

    // 导入excel
    importDeviceInfoBatch (file) {
        return this.post({
            url: '/tunnel/rest/TDevicebookinfo/importDeviceInfoBatch',
            uploadFiles: [ {name: 'excel', file} ]
        });
    }
}
