import {
    Bean
} from '../';

export default {
    beforeCreate () {
        Bean.injectClass(this.$options, this); // 注入service
    }
};
