export default class NoticeService extends Service {

    // 获取公告列表
    getNoticeList (p) {
        return this.get({
            url: '/tunnel/rest/SystemNotice/pageAll',
            data: p
        });
    }

    // 新建公告
    createNotice (p) {
        return this.post({
            url: '/tunnel/rest/SystemNotice/insert',
            data: p
        });
    }

    // 公告类型
    getTypes () {
        return this.get({
            url: '/tunnel/rest/SystemDictionary/DictionaryListById',
            data: {parentId: 'BCA195AA-4C44-4FFB-BA1F-A865009D21F6'}
        }).then(res => {
            return res.map(v => {
                return {
                    name: v.name,
                    value: v.dictionaryId
                };
            });
        });
    }

    // 删除公告
    deleteNotice (id) {
        return this.get({
            loadingText: '删除中...',
            url: '/tunnel/rest/SystemNotice/delete',
            data: {id}
        });
    }
}