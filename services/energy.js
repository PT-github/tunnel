// 能耗管理
export default class EnergyService extends Service {

    // 查询隧道总能耗排名列表
    getElenergyRankingList () {
        return this.get({
            url: '/tunnel/rest/TTunnelenergyrecord/getElenergyRankingList'
        }).then(res => {
            let max = 0;
            return res.map(v => {
                if (!max) {
                    max = v.energy;
                    v.percent = 100;
                } else {
                    v.percent = v.energy / max * 100;
                }
                return v;
            });
        });
    }

    // 分页查询能耗清单
    getList (data) {
        return this.get({
            url: '/tunnel/rest/TTunnelenergyrecord/getTunnelenergyrecordPageAll',
            contentType: 'form',
            data
        }).then(res => {
            if (res && res.records && res.records.length) {
                res.records.forEach(item => {
                    item.totalEnergy = item.leftEnergy + item.rightEnergy;  //总能耗
                    item.totalNumber = item.leftNumber + item.rightNumber;
                });
            }
            return res;
        });
    }

    // 根据时间查询隧道能耗（列表）数据
    getTunnelenElenergyListByMonth (data) {
        return this.get({
            url: '/tunnel/rest/TTunnelenergyrecord/getTunnelenElenergyListByMonth',
            data
        });
    }

    //根据时间查询隧道能耗（统计）数据
    getElenergyStatisticsByMonth (param) {
        return this.get({
            url: '/tunnel/rest/TTunnelenergyrecord/getElenergyStatisticsByMonth',
            data: param
        });
    }

    //根据时间查询隧道能耗（波动）数据(包含左洞、右洞、总三种数值，根据条件使用)
    getElenergyFluctuationByMonth (param) {
        return this.get({
            url: '/tunnel/rest/TTunnelenergyrecord/getElenergyFluctuationByMonth',
            data: param
        });
    }

    //根据时间查询隧道能耗（对比）数据(包含左洞、右洞、总三种数值，根据条件使用)
    getElenergyComparisonByMonth (param) {
        return this.get({
            url: '/tunnel/rest/TTunnelenergyrecord/getElenergyComparisonByMonth',
            data: param
        }).then(res => {
            console.log(res);
            if (res && res.length) {
                res.forEach(item => {
                    item.totalEnergy = item.leftEnergy + item.rightEnergy;  //总能耗
                    item.totalNumber = item.leftNumber + item.rightNumber;
                });
            }
            return res;
        });
    }

    // 导出xls隧道能耗值清单列表
    exportEnergyList (data) {
        return this.get({
            downloadFile: '导出能耗清单',
            url: '/tunnel/rest/TTunnelenergyrecord/exportTunnelElenergyListXls',
            data
        });
    }


    // 导出xls根据时间查询隧道能耗（列表）数据
    exportEnergyListByMonth (data) {
        return this.get({
            downloadFile: '导出能耗清单（按月）',
            url: '/tunnel/rest/TTunnelenergyrecord/exportTunnelenElenergyListByMonthXls',
            data
        });
    }

    //数据分析—设备统计
    selectDataDisplayDevice(){
        return this.get({
            url: '/tunnel/rest/TDevicebookinfo/selectDataDisplayDevice',
        });
    }

    //数据分析—能耗节能率排行
    selectDataDisplayEnergy(){
        return this.get({
            url: '/tunnel/rest/TTunnelenergyrecord/selectDataDisplayEnergy',
        });
    }
    //数据分析—设备类型列表
    selectDataDisplayDeviceTypeAll(){
        return this.get({
            url: '/tunnel/rest/TDeviceTypeInfo/selectDataDisplayDeviceTypeAll',
        });
    }

    //查询事件记录列表
    selectEventRecordByType(param){
        return this.get({
            url: '/tunnel/rest/TEventrecord/selectEventRecordByType',
            data: param
        });
    }

    //设备故障情况统计表
    selectDataDisplayFailure(param){
        return this.get({
            url: '/tunnel/rest/TRepairdetailedrecord/selectDataDisplayFailure',
            data: param
        }).then(res =>{
            if(res && res.length){
                res.forEach(item=>{
                    item.month = item.months
                })
            }
            return res || []
        });
    }

    //数据分析—查询能耗统计图
    selectDataDisplayEnergyUsage(param){
        return this.get({
            url: '/tunnel/rest/TTunnelenergyrecord/selectDataDisplayEnergyUsage',
            data: param
        });
    }

    //数据分析—设备类型图形
    selectDataDisplayDevices(param){
        return this.get({
            url: '/tunnel/rest/TDeviceTypeInfo/selectDataDisplayDeviceType',
            data: param
        });
    }
    //  隧道能耗
    getTunnelenElenergyListByDay(param){
        return this.get({
            url: '/tunnel/rest/TunnelInfo/getTunnelenElenergyListByDay',
            data: param
        });
    }
    //  隧道事件发生处理情况
    getTunnelenEventListByDay(param){
        return this.get({
            url: '/tunnel/rest/TunnelInfo/getTunnelenEventListByDay',
            data: param
        });
    }
     //  详情隧道事件发生处理情况
     getTunnelenFailureAndWarningListByDay(param){
        return this.get({
            url: '/tunnel/rest/TunnelInfo/getTunnelenFailureAndWarningListByDay',
            data: param
        });
    }
    

}