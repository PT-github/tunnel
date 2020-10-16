import Context from './core/context'; // 应用上下文，在vue文件和service对象内可通过this.$ctx获取所有功能
import bean from './core/bean'; // bean管理器
import Service from './core/service'; // 用于发送请求和处理model层逻辑
import * as Utils from './utils'; // 工具类
import Event from './core/event';   // 事件通知
import Hook from './core/hook';      // 钩子

const Bean = new bean(Context);

const proto = {
    $utils: Utils,
    $bean: Bean,
    $em: Event,
    $hook: Hook
};
Object.assign(Context, proto); // 把各种功能赋予context实例

export default {
    install: function(vue, options) {

        Context.showLoading = options.showLoading;
        Context.hideLoading = options.hideLoading;
        Context.toastError = options.toastError;
        Context.beforeHttp = options.beforeHttp;
        Context.$config = options.config;
        Context.resolveHttpSuccess = options.resolveHttpSuccess;
        Context.catchHttpError = options.catchHttpError;

        Object.assign(vue.prototype, proto); // 把各种功能赋予vue实例

        Context.doInit = function() { // context初始化，暂时没啥做的
            if (!Context._initPromise) {
                Context._initPromise = Promise.resolve();
            }
            return Context._initPromise;
        };
        vue.prototype.$ctx = Context;

        vue.mixin(require('./mixins/event').default);
        vue.mixin(require('./mixins/create').default);
        vue.mixin(require('./mixins/user-info').default);
    }
};

export {
    Context,
    Utils,
    Bean,
    Service,
    Event
};

Object.assign(window, {
    Context,
    Utils,
    Bean,
    Service,
    Event
});

