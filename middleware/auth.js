export default function({redirect, route, store}) {
    let checkAuth = userInfo => {
        if (route.path === '/' || route.name === 'login') return;    // 首页和登录页默认有权限
        let menus = userInfo && userInfo.menuList && userInfo.menuList.filter(v => {     // 权限url列表
            return v.openUrl && v.openUrl !== '/home';
        }).map(v => v.openUrl);
        if (/\/home\/3d/.test(route.path) && menus.includes('/home/2d')) return;   // 有2d权限表示也有3d权限
        let hasAuth = false;
        menus && menus.forEach(v => {
            if (new RegExp(v).test(route.path)) {
                hasAuth = true;
            }
        });
        if (!hasAuth) {
            return Promise.reject('抱歉，您没有权限访问该页面');
        }
    };
    if (!store.state.myUserInfo) {     // 处理没登录的情况
        let cache = localStorage.getItem('myUserInfo');
        if (cache) {
            let myUserInfo = JSON.parse(cache);
            store.commit('updateUserInfo', myUserInfo);
            return checkAuth(myUserInfo);
        } else {
            if (route.name !== 'login') {
                return redirect('/login');
            }
        }
    }
    return checkAuth(store.state.myUserInfo);
}