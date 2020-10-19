export default class HomeService extends Service {

    // 获取所有隧道
    getListAll (data) {
        return this.get({
            url: '/tunnel/rest/home/pageAll',
            data
        }).then(res=>{
            res.records.forEach(item => {
                item.longitude = item.rightEndLongitude;
                item.latitude = item.rightEndLatitude;
            });
            return res.records
        });
    }

    // 事件统计
    getEventCount(tunnelId){
        return this.get({
            url: '/tunnel/rest/home/getHomeStatEventCount',
            data:{
                tunnelId
            }
        });
    }
    // 设备统计
    geDeviceCount(tunnelId){
        return this.get({
            url: '/tunnel/rest/home/getHomeStatDeviceCount',
            data:{
                tunnelId
            }
        });
    }
    // 最新50条事件记录
    getEventPageAll(tunnelId){
        return this.get({
            url: '/tunnel/rest/home/getEventPageAll',
            data:{
                tunnelId
            }
        });
    }
    // 最新50条的报警记录
    getWarnPageAll(tunnelId){
        return this.get({
            url: '/tunnel/rest/home/getWarnPageAll',
            data:{
                tunnelId
            }
        });
    }
    // 节能率统计
    getHomeStatEnergyRate(tunnelId){
        return this.get({
            url: '/tunnel/rest/home/getHomeStatEnergyRate',
            data:{
                tunnelId
            }
        });
    }
    // 隧道统计值统计
    getTunnelEventStat(tunnelId){
        return this.get({
            url: '/tunnel/rest/home/getTunnelEventStat',
            data:{
                tunnelId
            }
        });
    }

    // 隧道字典
    // Show3D 显示隧道3d
    // ShowFirstPageLR 首页左右侧边栏显示
    getTunnelShowSide(params) {
        return this.get({
            url: '/tunnel/rest/SystemDictionary/listChildrenByParentValue',
            data: {
                value: 'OneValueDictionary'
            }
        })
    }

}
