export default class LogService extends Service {

    // 获取操作日志
    getOptLogs ({page = 1, pageSize = 10, keyWord, opeDate,opeDateEnd}) {
        return this.get({
            url: '/tunnel/rest/SystemBusinessLog/pageAll',
            data: {
                page, pageSize, keyWord, opeDate,opeDateEnd
            }
        });
    }

    // 获取系统日志
    getSysLogs ({page = 1, pageSize = 10, keyWord, opeDate,opeDateEnd}) {
        return this.get({
            url: '/tunnel/rest/SystemOperationLog/pageAll',
            data: {
                page, pageSize, keyWord, opeDate,opeDateEnd
            }
        });
    }

    // 获取登录日志
    getLoginLogs ({page = 1, pageSize = 10, keyWord, loginDate,loginDateEnd}) {
        return this.get({
            url: '/tunnel/rest/SystemLoginlog/pageAll',
            data: {
                page, pageSize, keyWord, loginDate,loginDateEnd
            }
        });
    }

    // 获取操作日志明细
    getOptLogDetail ({page = 1, pageSize = 10, logId}) {
        return this.get({
            url: '/tunnel/rest/SystemBusinessLogDetail/pageAll',
            data: {
                page, pageSize, logId
            }
        });
    }
}