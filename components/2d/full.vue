<template>
  <div class="full-2d">
    <!--控制3d和2d-->
    <div class="switcher-wrapper threed">
      <el-radio-group size="medium">
        <div class="page-list">
          <el-radio-button label="2d">2d</el-radio-button>
          <el-radio-button label="full2d">2d全屏</el-radio-button>
          <el-radio-button label="3d">3d</el-radio-button>
        </div>
      </el-radio-group>
    </div>

    <tunnel-component @detail="doShowModalDevice"
                      full-screen
                      ref="tunnel"
                      :showActiveType="showActiveType"/>
    <div class="buttons">
      <div class="button-item"
           v-for="(item, index) in deviceTypes"
           :key="index"
           @click="doShowModal(item.classifyNumber)"
      >
        <div class="img-wrap">
          <img
              class="img"
              :src="
                require('../../assets/images/warning/icons/' +
                  item.classifyNumber +
                  '.png')
              "
          />
        </div>
        <p>{{ item.classifyName }}</p>
      </div>
    </div>

    <!--弹窗-->
    <modal-control
        :device-name="showModalDeviceName"
        :classify-number="showModalClassify"
        v-model="showModal"
        @update="$refs.tunnel.listDeviceBaseOfTunnelPage()"
        :tunnel-id="tunnelId"
    />
  </div>
</template>

<script>
import TunnelComponent from '@/components/2d/tunnel'
import ModalControl from '../../components/2d/modal-control'
export default {
  name: "full",
  components: {
    TunnelComponent,
    ModalControl
  },
  props: {
    deviceTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showActiveType: 'all',
      tunnelId: '',
      showModal: false, // 弹窗
      showModalClassify: '', // 弹窗的设备分类
      showModalDeviceName: null, // 弹窗选中的设备名
    }
  },
  methods: {
    doShowModalDevice(device) {
      this.doShowModal(device.classifyNumber, device.deviceName)
    },

    doShowModal(classifyNumber, deviceName) {
      this.showActiveType = classifyNumber
      if (classifyNumber === 'all') return
      this.showModal = true
      this.showModalDeviceName = deviceName
      this.showModalClassify = classifyNumber
    },
  }
}
</script>

<style scoped>

</style>
