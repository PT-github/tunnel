import {
    Context
} from '../';

export default {
    mounted () {
        let {
            events
        } = this.$options;
        if (events) {
            Object.keys(events).forEach(v => {
                Context.$em.$on(v, this[ events[ v ] ]);
            });
        }
    },
    destroyed () {
        let {
            events
        } = this.$options;
        if (events) {
            Object.keys(events).forEach(v => {
                Context.$em.$un(v, this[ events[ v ] ]);
            });
        }
    }
};
