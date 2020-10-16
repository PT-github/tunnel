export default class IndexService extends Service {

    // 根据ID用户查询活跃度
    queryUserActivity (id) {
        return this.get({
            url: '/tunnel/rest/userinfo/getUserActivity',
            data: {
                id
            }
        });
    }
    //首页公告列表
    queryTipsList(){
        return this.get({
            url: '/tunnel/rest/SystemNotice/listAll',
            data:{}
        });
    }

    //根据ID查询公告信息
    getTipDetail(id){
        return this.get({
            url: '/tunnel/rest/SystemNotice/get',
            data:{id}
        });
    }
}