const BEANS = {}; // 存放所有的bean

export default class Bean {
    constructor ($ctx) {
        this.$ctx = $ctx;
    }

    injectClass (o, pageCtx) {  // 注入service类
        const services = o.services || [];
        const service = {};
        services.forEach(v => {
            service[ v ] = this.makeBean(v);
        });
        pageCtx && services.length && (pageCtx.$service = service);
        return service;
    }

    makeBean (v) {
        let service = BEANS[ v ];
        if (!service) {
            let serviceClass = require(`@/services/${v}`).default;
            service = new serviceClass(this.$ctx);
            BEANS[ v ] = service;
            service.init && service.init();
        }
        return service;
    }
}
