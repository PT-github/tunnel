import Vue from 'vue';
import framework from './framework';
import uploader from 'vue-simple-uploader';

Vue.use(uploader);

export default ({store}) => {
    Vue.use(framework, {
        config: {
           //  baseUrl: '/api',
            // baseUrl: 'http://w8.qcxt.com:65036',
            baseUrl: 'http://cxgs.tunnel.qcxt.com:65036/api',
            // baseUrl: 'http://w7.qcxt.com:8060',
            baseImgUrl: '/upload'
        },
        resolveHttpSuccess: (res, options) => {
            if (options.downloadFile) {     // 下载文件
                let url = URL.createObjectURL(res);
                let link = document.createElement('a');
                link.download = options.downloadFile + '.xls';
                link.href = url;
                link.click();
                window.URL.revokeObjectURL(url);
            } else if (options.playAudio) {      // 播放语音
                let x = document.createElement('AUDIO');
                // x.setAttribute('src', 'https://www.w3school.com.cn/i/horse.mp3');
                x.setAttribute('src', URL.createObjectURL(res));
                x.setAttribute('controls', 'controls');
                x.style.display = 'none';
                document.body.appendChild(x);
                x.addEventListener('ended', function() {
                    document.body.removeChild(x);
                }, false);
                x.play();
                return Promise.resolve();
            } else {
                if (res.status === 1) {
                    return res.data;
                } else if (res.status === 304) {
                    Vue.prototype.$confirm('登录已过期，请重新登录', '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'warning',
                        showClose: false
                    }).then(() => {
                        localStorage.removeItem('myUserInfo');
                        location.href = '/login';
                    });
                } else {
                    return Promise.reject(res);
                }
            }
        },
        catchHttpError: err => {
            return Promise.reject(err);
        },
        beforeHttp: options => {
            let userInfo = store.state.myUserInfo;
            if (userInfo) {
                options.headers = {
                    ...options.headers || {},
                    jwt: userInfo.jwt
                };
            }
            return options;
        },
        showLoading: text => {
            window._loading = Vue.prototype.$loading({text});
        },
        hideLoading: () => {
            window._loading && window._loading.close();
        },
        toastError: text => {
            Vue.prototype.$message.error(text);
        }
    });
}
