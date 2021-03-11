<template>
  <div>
    <iframe :src='iframeUrl'
            v-if="iframeUrl"
            id="frame-view"
            frameborder="0"
            scrolling="auto"
            style="position:absolute;bottom: 0;left: 0;z-index:1"/>
  </div>
</template>

<script>
import DevInfo from '../../components/3d/DevInfo';
import DevDetails from '../../components/3d/DevDetails';
import screenfull from 'screenfull';
import View from '../../assets/3d/index';
import ModalControl from '../../components/2d/modal-control';

// Array.prototype.remove = function (val) {
//   var index = this.indexOf(val);
//   if (index > -1) {
//     this.splice(index, 1);
//   }
// };

export default {
  // components: {ModalControl, DevInfo, DevDetails},
  props: {
    tunnelId: {
      type: String,
      default: ''
    },
    tunnelDevices: {
      type: Array,
      default: () => []
    },
    tunnelInfo: {
      type: Object,
      default: () => {
      }
    }
  },
  computed: {
    // classifyNumber() {
    //   return {
    //     19: 'video',
    //     5: 'conflagration',
    //     8: 'tunneldoor'
    //   }[this.showModalType];
    // }
  },
  data() {
    return {
      iframeUrl: `/static/3d/index.html`,
      classifyNumber: '',
      // tunnelId: this.$route.query.tunnelId,
      // controls: '0',
      // lightDialog: false,
      // fanDialog: false,
      // devVisible: false,
      // devInfoVisible: false,
      // lightInfo: {},
      // fanInfo: {},
      showModal: false,
      // showModalTitle: '',
      // showModalType: ''
    };
  },
  services: ['_2d', 'tunnel'],
  methods: {
    initEvent() {
      window.addEventListener("message", event => {
        const {msgType, msgData} = event.data;
        switch (msgType) {
          case "loaded": // 初始化完成，可以添加设备主体和设备
            this.$emit('on-load')
            break;
          case "clickDevice": // 点击选择某设备
            this.$emit('on-chose', msgData)
            console.log("click device:", msgData);
            break;
        }
      })
    },

    initInfo() {
      const el = this.$el.querySelector('#frame-view')
      const {postMessage} = el.contentWindow

      postMessage({
        msgType: "loadTunnel",
        msgData: this.tunnelInfo
      })

      postMessage({
        msgType: 'addDevices',
        msgData: this.tunnelDevices
      })
      // console.log(postMessage)
    },

    initTunnel() {

    }
  },
  async mounted() {

  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#frame-view {
  width: 100vw;
  height: 90vh;
  top: 100px;
}

.mydialog {
  position: fixed;
  right: 100px;
  // bottom: 0;
  margin: 25vh auto;
  width: 400px;
  height: 200px;
  background: url("../../assets/3d/u2682.png") no-repeat;
  background-size: 100% 100%;
  z-index: 10000;
  color: white;

  #close {
    position: absolute;
    right: 10px;
    top: -10px;
    cursor: pointer;
  }

  .title {
    display: flex;
    margin-top: 5px;

    .icon {
      margin-left: 20px;
      margin-right: 5px;

      img {
        margin-top: 2px;
        position: absolute;
      }
    }

    .label {
      margin-left: 20px;
    }
  }

  .content2 {
    padding: 10px 20px;
    color: #00ffff;

    td {
      padding: 10px;
    }

    .footer {
      display: flex;
      position: absolute;
      bottom: 20px;
      right: 20px;
    }
  }

  .btn1 {
    // width: 200px;
    text-align: center;
    cursor: pointer;
    margin-left: 15px;
    padding: 0px 25px;
    border-radius: 20px;
    background: linear-gradient(
            245deg,
            rgba(22, 167, 254, 1) 0%,
            rgba(22, 167, 254, 1) 0%,
            rgba(15, 75, 168, 1) 100%,
            rgba(15, 75, 168, 1) 100%
    );
  }

  input {
    background: transparent;
    border: 1px solid #00ffff;
    color: white;
  }
}

.info {
  position: absolute;
  top: 100px;
  left: 100px;
  color: white;
}

#container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.btn {
  position: absolute;
  padding: 10px;
  display: flex;
  align-items: center;

  div {
    margin: 10px;
    color: #ffffff;

    padding: 0px 10px;
    cursor: pointer;
    border: 1px solid #00ffff;
    border-radius: 20px;

    &:hover {
      color: #00ffff;
    }
  }
}
</style>
