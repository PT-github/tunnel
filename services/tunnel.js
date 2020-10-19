export default class TunnelService extends Service {

    // 根据ID用户查询活跃度
    getSystemOrganization() {
        return this.get({
            url: '/tunnel/rest/SystemOrganization/pageAll'
        });
    }

    // 获取所有隧道
    getListAll() {
        return this.get({
            url: '/tunnel/rest/TunnelInfo/listAll'
        }).then(res => {
            return res.map(v => {
                return {
                    name: v.tunnelName,
                    value: v.id
                };
            });
        });
    }

    // 根据ID查询隧道信息
    getById(id) {
        return this.get({
            url: '/tunnel/rest/TunnelInfo/get',
            data: {id}
        });
    }

    // 获取隧道列表
    getTunnelList(p) {
        return this.get({
            url: '/tunnel/rest/TunnelInfo/pageAll',
            data: p
        });
    }

    // 获取我的隧道列表
    getMyTunnelList(p) {
        return this.get({
            url: '/tunnel/rest/TunnelInfo/pageMyAll',
            data: p
        });
    }

    // 删除隧道
    deleteTunnels(ids) {
        return this.get({
            url: '/tunnel/rest/TunnelInfo/delete',
            data: {
                ids
            }
        });
    }

    // 隧道启用停用
    updateTunnelStatus(id, enableStatus) {
        return this.post({
            url: '/tunnel/rest/TunnelInfo/updateStatus',
            contentType: 'form',
            data: {
                id, enableStatus
            }
        });
    }

    // 新增隧道信息
    addTunnelInfo(params) {
        return this.post({
            url: '/tunnel/rest/TunnelInfo/insert',
            data: params
        });
    }

    // 更新隧道信息
    upDateTunnelInfo(params) {
        return this.post({
            url: '/tunnel/rest/TunnelInfo/update',
            data: params
        });
    }

    // 隧道类型分类统计汇总,包括隧道类型分别多少个
    getTunnelCate(params) {
        return this.get({
            url: '/tunnel/rest/TunnelInfo/getTunnelCensusByOrgId',
            data: params
        });
    }
}
