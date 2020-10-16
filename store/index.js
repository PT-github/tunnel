export default {
    state: () => ({
        myUserInfo: null,
        buttonAuthList: []
    }),
    mutations: {
        updateUserInfo (state, userInfo) {
            let info = {...state.myUserInfo || {}, ...userInfo};
            state.myUserInfo = info;
            state.buttonAuthList = info&&info.buttonList&&info.buttonList.map(v => v.code);
            localStorage.setItem('myUserInfo', JSON.stringify(info));
            Event.$fire('login');
        },
        logout (state) {
            state.myUserInfo = null;
            state.buttonAuthList = [];
            Event.$fire('logout');
        }
    }
};
