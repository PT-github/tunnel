export default class UserService extends Service {

    login (account, password) {
        return this.post({
            url: '/tunnel/login',
            loadingText: '正在登录',
            contentType: 'form',
            data: {
                code: account, password
            }
        });
    }

    logout () {
        return this.get({
            url: '/tunnel/rest/userinfo/loginOut'
        });
    }

    //查询用户信息
    queryUserInfo (id) {
        return this.get({
            url: '/tunnel/rest/userinfo/get',
            data: {
                id
            }
        });
    }

    //修改用户信息
    resetUserInfo ({headImage, name, sex, qq, mobile, email, weChat, remark}) {
        return this.post({
            url: '/tunnel/rest/userinfo/update',
            data: {
                headImage, name, sex, qq, mobile, email, weChat, remark
            }
        });
    }

    //修改用户密码
    resetUserPassword ({id, oldPassword, newPassword, confirmNewPassword}) {
        return this.get({
            url: '/tunnel/rest/userinfo/saveChangePassword',
            data: {id, oldPassword, newPassword, confirmNewPassword}
        });
    }
}