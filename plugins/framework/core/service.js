import axios from 'axios';

const DATASOURCE_CACHE = new Map();
const LOCK_PROMISE = {};
const CONTENT_TYPE_MAP = {
    'json': 'application/json',
    'form': 'application/x-www-form-urlencoded'
};

export default class Service {

    constructor ($ctx) {
        this.$ctx = $ctx;
    }

    /**
     * 请求之前的处理
     */
    sendBefore (options) {
        if (LOCK_PROMISE[ options.lock ]) {
            return LOCK_PROMISE[ options.lock ];
        }
        /**
         * 支持内存缓存
         */
        if (!options.hasUpdateCache && options.cacheKey && DATASOURCE_CACHE.has(options.cacheKey)) {
            return Promise.resolve(DATASOURCE_CACHE.get(options.cacheKey));
        }
    }

    // 真正的发送请求
    sendTo (options) {
        options.loadingText && this.$ctx.showLoading && this.$ctx.showLoading(options.loadingText);
        options.contentType = options.contentType || 'json';

        if (!this.instance) {
            this.instance = axios.create({
                baseURL: this.$ctx.$config.baseUrl
            });
        }
        let o = {
            url: options.url,
            method: options.method,
            timeout: options.timeout || 30 * 1000,
            headers: {
                ...options.headers || {},
                'content-type': CONTENT_TYPE_MAP[ options.contentType || 'json'.toLowerCase() ]
            }
        };
        if (options.downloadFile || options.playAudio) {     // 下载文件
            o.responseType = 'blob';
        }
        if (options.method === 'get') {
            o.params = options.data;
        } else {
            if (options.contentType === 'form') {
                let form = new FormData();
                let keys = Object.keys(options.data);
                keys.forEach(key => {
                    form.append(key, options.data[ key ]);
                });
                o.data = form;
            } else {
                o.data = options.data;
            }
        }
        if (options.uploadFiles) {  // 上传文件
            let form = new FormData();
            options.uploadFiles.forEach(v => {
                form.append(v.name, v.file);
            });
            o.data = form;
            o.headers[ 'content-type' ] = 'multipart/form-data';
        }
        if (this.$ctx.beforeHttp) {
            o = this.$ctx.beforeHttp(o);
        }
        return this.instance(o).then(res => {
            options.loadingText && this.$ctx.hideLoading && this.$ctx.hideLoading();
            return this.$ctx.resolveHttpSuccess(res.data, options, o);
        }).catch(err => {
            options.loadingText && this.$ctx.hideLoading && this.$ctx.hideLoading();
            let defaultCatch = e => {
                if (options.isToastError !== false) {   // 除非明确指出不需要弹toast，否则接口失败默认弹出toast
                    if (e.message && e.message.includes('timeout')) {
                        //e.message = '网络请求超时';
                        console.log('网络请求超时');
                    }
                    //this.$ctx.toastError(e.message || '网络请求失败');
                }
                return Promise.reject(err);
            };
            if (this.$ctx.catchHttpError) {
                return this.$ctx.catchHttpError(err).catch(e => {
                    return defaultCatch(e);
                });
            } else {
                return defaultCatch(err);
            }
        });
    }

    /**
     * 处理结果
     */
    handlerRes (res, options) {
        if (options.cacheKey && !DATASOURCE_CACHE.has(options.cacheKey)) {
            DATASOURCE_CACHE.set(options.cacheKey, res);
        }
        options.lock && delete LOCK_PROMISE[ options.lock ];
        return res;
    }

    /**
     * 处理请求Error
     */
    handlerError (error, options) {
        options.cacheKey && DATASOURCE_CACHE.delete(options.cacheKey);
        options.lock && delete LOCK_PROMISE[ options.lock ];
        return Promise.reject(error);
    }

    /**
     * 请求之后处理
     */
    sendAfter (options) {

        const _sendTo = options => {
            let promise = this.sendTo(options);
            if (options.lock) {
                LOCK_PROMISE[ options.lock ] = promise;
            }
            return promise;
        };

        return _sendTo(options);
    }

    get (options) {
        options.method = 'get';
        return this.send(options);
    }

    post (options) {
        options.method = 'post';
        return this.send(options);
    }

    put (options) {
        options.method = 'put';
        return this.send(options);
    }

    delete (options) {
        options.method = 'delete';
        return this.send(options);
    }

    /**
     * 请求
     */
    send (options) {
        let result = this.sendBefore(options);
        if (!result) {
            return this.sendAfter(options).then(res => {
                return this.handlerRes(res, options);
            }).catch(error => {
                return this.handlerError(error, options);
            });
        }
        return result;
    }
}
