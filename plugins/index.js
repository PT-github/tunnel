import Vue from 'vue';

require('./flexiable');

import FormPage from '../components/form-page';
import Popup from '../components/common-popup';
import HSelect from '../components/h-select';
import HRadio from '../components/h-radio';
import imageConfig from '../utils/imageConfig.js'
import * as config from '../utils/constant'

Vue.component('FormPage', FormPage);
Vue.component('Popup', Popup);
Vue.component('HSelect', HSelect);
Vue.component('HRadio', HRadio);

Vue.prototype.$imageConfig = imageConfig

Vue.prototype.$showConfirm = msg => Vue.prototype.$confirm(msg || '是否确定删除对应的记录？', '提示', {type: 'warning', customClass: 'custom-notify'});
Vue.prototype.$notifySuccess = msg => Vue.prototype.$notify.success({
    title: '提示',
    message: msg || '操作成功',
    position: 'bottom-right'
});

Vue.mixin({
    data () {
      return {
        windowWidth: document.body.offsetWidth
      }
    },
    methods: {
      getRealPx(w) {
        return w
      },
      getStyle(item) {
        if (!item) {
          return
        }
        // console.log(item, '======')
        let { widthFixArray } = this.$imageConfig
        let isWidthFix = widthFixArray.indexOf(this.deviceTypeCode) !== -1
        return {
          backgroundImage: `url(${config.imagePrefix}/icon/${item.leftRightFlag}/${item.deviceTypeCode || this.deviceTypeCode}_${item.deviceCommunicationsState}${item.workMode != null ? '_' + item.workMode : ''}.png)`,
          backgroundSize: isWidthFix ? `50px auto` : `auto 50px`,
          backgroundPosition: isWidthFix ? `center center` : `center calc(50% + 10px)`,
          backgroundRepeat: 'no-repeat'
        }
      },
    }
  })


let $px2rem = Number(document.documentElement.style.fontSize.replace('px', '')) / 75 * (window.dpr || 1);
Vue.prototype.$px2rem = $px2rem;
Vue.prototype.$getPx = e => e * $px2rem + 'px';

export default ({store}) => {
    Vue.directive('auth', {
        bind: function(el, binding) {
            let authCode = binding.value;
            if (!authCode) return;
            if (store.state.buttonAuthList.indexOf(authCode) === -1) {  // 没有那个权限则隐藏按钮
                el.style.display = 'none';
            }
        }
    });
}
