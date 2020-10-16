export default class BasicService extends Service {
    // 获取上传的附件列表
    getFileList (correlationId) {
        return this.get({
            url: '/tunnel/rest/file/listAll',
            data: {
                correlationId
            }
        });
    }

    // 获取天气
    getWeather () {
        return this.post({url: '/tunnel/open/getWeather'});
    }

    // 获取组织架构
    getOrgList () {
        return this.get({url: '/tunnel/rest/SystemOrganization/pageAll'});
    }

    // 根据编码获取下级字典列表
    getDict (value) {
        return this.get({
            url: '/tunnel/rest/SystemDictionary/listChildrenByParentValue',
            data: {
                value
            }
        }).then(res => {
            return res.map(v => {
                return {
                    name: v.name,
                    value: v.value || v.dictionaryId
                };
            });
        });
    }

    // 根据编码获取下级字典列表(限定取id)
    getDictId (value) {
        return this.get({
            url: '/tunnel/rest/SystemDictionary/listChildrenByParentValue',
            data: {
                value
            }
        }).then(res => {
            return res.map(v => {
                return {
                    name: v.name,
                    value: v.dictionaryId
                };
            });
        });
    }

    //获取省市区
    getAddress (includeProvince = 0) {
        return this.get({
            url: '/tunnel/rest/SystemDistrict/listAll',
            data: {
                includeProvince // 1包括省 0不包括
            }
        }).then(res => {
            return res.map(v => {
                return {
                    name: v.name,
                    value: v.districtId,
                    parentId:v.parentId
                };
            });
        });
    }

}