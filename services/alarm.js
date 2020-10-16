// 故障单
export default class AlarmService extends Service {

    // 分页查询事件记录列表
    getList (data) {
        return this.get({
            url: '/tunnel/rest/TEventrecord/pageAll',
            data: data
        }).then(res => {
            let result = [];
            if (res.records && res.records.length) {
                let date = [];
                res.records.forEach(item => {
                    if (item.createdUserDate) {
                        item.date = item.createdUserDate.substr(5, 5) || item.createdUserDate;
                        date.push(item.createdUserDate.substr(5, 5)); //截取mm-dd日期
                    }
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

    // /tunnel/rest/TEventTypeInfo/getSetingAll
    getSetingAll (data) {
        return this.get({
            url: '/tunnel/rest/TEventTypeInfo/getSetingAll',
            data
        });
    }

    // 事件记录列表
    recordList (data) {
        return this.get({
            url: '/tunnel/rest/TEventrecord/listAll',
            data
        });
    }

    //查询事件类型及数量统计
    queryTEventTypeInfo () {
        return this.get({
            url: '/tunnel/rest/TEventTypeInfo/getEventCount'
        }).then(res => {
            if (res && res.length) {
                res.forEach(item => {
                    item.isAutoRemind = item.isAutoRemind.toString();
                    item.isSoundRemind = item.isSoundRemind.toString();
                });
            }
            return res;
        });
    }

    //保存事件类型设置
    subTEventTypeInfo (param) {
        return this.post({
            url: '/tunnel/rest/TEventTypeInfo/saveSetingAll',
            data: param
        });
    }

    //根据ID查询事件信息
    queryAlarmDetail (id) {
        return this.get({
            loadingText: '加载中',
            url: '/tunnel/rest/TEventrecord/get',
            data: {
                id
            }
        });
    }

    //归档事件记录
    setGdang (param) {
        return this.post({
            url: '/tunnel/rest/TEventrecord/placeOnFileEventById',
            contentType: 'form',
            data: param
        });
    }

    //忽略事件记录
    ignoreEventById (param) {
        return this.post({
            url: '/tunnel/rest/TEventrecord/ignoreEventById',
            contentType: 'form',
            data: param
        });
    }

    //执行事件预案
    implementationPlan (param) {
        return this.post({
            url: '/tunnel/rest/TEventrecord/implementationPlan',
            contentType: 'form',
            data: param
        });
    }

    // 语音报警
    voiceAlarmTrigger (eventContent) {
        return this.get({
            url: '/tunnel/open/voiceAlarmTrigger',
            contentType: 'form',
            playAudio: true,
            data: {eventContent}
        });
    }
}