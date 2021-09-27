<template>
  <div class="edit">
    <div class="add-area">
      <div class="title">
        <span>信息编辑区域</span>
      </div>
      <div class="button" style="flex: 1;margin-left: ">
        <span :class="{active: type === 1}" @click="handleAddPlayList(1)">新增模板</span>
        <span @click="saveDeviceQbBoardNew">保存模板</span>
      </div>
      <div class="button">
        <span :class="{active: type === 2}" @click="handleAddPlayList(2)">新增节目单</span>
        <span @click="saveBoard">保存节目单</span>
      </div>
    </div>

    <div class="select-options">
      <div class="bold">
        <span :class="{active: detail.bold}" @click="detail.bold = detail.bold === 0 ? 1 : 0">B</span>
      </div>
      <div class="italics">
        <span :class="{active: detail.italics}" @click="detail.italics = detail.italics === 0 ? 1 : 0">I</span>
      </div>

      <div class="color" :class="{active: detail.color}" :style="{borderColor: detail.color}">
        <div>
          <span @click="showColor = !showColor">A</span>
        </div>
        <div class="modal" v-show="showColor" @click="showColor = false"></div>
        <div class="color-options" v-show="showColor">
          <div v-for="(item,index) in colors" :key="'colors_' + index" :style="{backgroundColor: item.value}"
            @click="hideColor(item)">
          </div>
        </div>
      </div>

      <div class="backcolor" :class="{active: detail.backgroundColor}"
        :style="{backgroundColor: detail.backgroundColor}">
        <div><span @click="showBgColor = !showBgColor">背景</span></div>
        <div class="modal" v-show="showBgColor" @click="showBgColor = false"></div>
        <div class="color-options" v-show="showBgColor">
          <div v-for="(item,index) in backgroundColors" :key="'backgroundColors_' + index" @click="hideBgColor(item)"
            :style="{backgroundColor: item.value}"></div>
        </div>
      </div>

      <div class="horizontal">
        <div><span>水平</span></div>
      </div>
      <div class="horizontal-select">
        <div><span @click="showHorizontal = true"><input :disabled="true" type="text" :value="horizontalFormat[detail.horizontal]"
               /></span></div>
        <div class="modal" v-show="showHorizontal" @click="showHorizontal = false"></div>
        <div class="horizontal-select-options" v-show="showHorizontal">
          <div v-for="(item,index) in horizontal" :key="'horizontal' + index" @click="hideHorizontal(item)">
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>


      <div class="vertical">
        <div><span>垂直</span></div>
      </div>
      <div class="vertical-select">
        <div><span @click="showVertical = true"><input :disabled="true" type="text" :value="verticalFormat[detail.vertical]"
              /></span></div>
        <div class="modal" v-show="showVertical" @click="showVertical = false"></div>
        <div class="horizontal-select-options" v-show="showVertical">
          <div v-for="(item,index) in vertical" :key="'vertical' + index" @click="hideVertical(item)">{{ item.name }}
          </div>
        </div>
      </div>

      <div class="font-select">
        <div><span @click="showFont = true"><input :disabled="true" type="text" :value="detail.fontName"/></span></div>
        <div class="modal" v-show="showFont" @click="showFont = false"></div>
        <div class="horizontal-select-options" v-show="showFont">
          <div v-for="(item,index) in font" :key="'font' + index" @click="hideFont(item)">{{ item.name }}</div>
        </div>
      </div>

      <div class="fontsize">
        <span>字号</span>
      </div>
      <div class="fontsize-select">
        <div><span @click="showFontSize = true"><input :disabled="true" type="text" :value="detail.fontSize" /></span></div>
        <div class="modal" v-show="showFontSize" @click="showFontSize = false"></div>
        <div class="horizontal-select-options" v-show="showFontSize">
          <div v-for="(item,index) in fontSize" :key="'fontSize' + index" @click="hideFontSize(item)">{{ item.name }}
          </div>
        </div>
      </div>

      <div class="space">
        <span>字间距</span>
      </div>
      <div class="space-input">
        <span>
          <input type="number" v-model="detail.spacing" />
        </span>
      </div>
      <div class="rowHeight">
        <span>行高</span>
      </div>
      <div class="rowHeight-input">
        <span><input type="number" v-model="detail.rowHeight" /></span>
      </div>
    </div>

    <div class="input-area">
      <textarea placeholder-class="textarea-placeholder" v-model="detail.text" />
    </div>

    <div class="select-options" style="margin-top: 3.9062rpx">

      <div class="space">
        <span>停留时间</span>
      </div>
      <div class="space-input">
        <span>
          <input type="number" v-model="detail.intervalShow" />
        </span>
      </div>

      <div class="space">
        <span>间隔时间</span>
      </div>
      <div class="space-input">
        <span>
          <input type="number" v-model="detail.interval" />
        </span>
      </div>

      <div class="resolutionPower">
        <span>分辨率</span>
      </div>
      <div class="font-select">
        <div><span @click="showResolutionPower = true"><input :disabled="true" type="text" :value="detail.resolutionPower"
               /></span></div>
        <div class="modal" v-show="showResolutionPower" @click="showResolutionPower = false"></div>
        <div class="horizontal-select-options top" v-show="showResolutionPower">
          <div v-for="(item,index) in resolutionPowers" :key="'resolutionPowers' + index"
            @click="hideResolutionPowers(item)">{{ item.name }}</div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
    name: 'Edit',
    props: {
      currentDevice: {
        type: Object,
        default: () => {
          return {}
        }
      },
      colors: {
        type: Array,
        default: () => []
      },
      backgroundColors: {
        type: Array,
        default: () => []
      },
      horizontal: {
        type: Array,
        default: () => []
      },
      vertical: {
        type: Array,
        default: () => []
      },
      font: {
        type: Array,
        default: () => []
      },
      fontSize: {
        type: Array,
        default: () => []
      },
      resolutionPowers: {
        type: Array,
        default: () => []
      },

    },
    data() {
      return {
        txt: '',
        type: null,

        showColor: false, // 颜色
        showBgColor: false, // 背景
        showHorizontal: false, // 水平
        showVertical: false, // 垂直
        showFont: false, // 字体
        showFontSize: false, // 字号
        showResolutionPower: false, // 分辨率
        detail: {
          color: null, // 颜色
          backgroundColor: null, // 背景
          horizontal: 1, // 水平
          vertical: 1, // 垂直
          fontName: "宋体", // 字体
          fontSize: 24, // 字体大小
          bold: 0, // 加粗
          italics: 0, // 斜体
          resolutionPower: '96*32', // 分辨率
          resolutionPowerHeight: 96, // 分辨率高度
          resolutionPowerWidth: 32, // 分辨率宽度
          rowHeight: 0, // 行高
          spacing: 0, // 字间距
          text: null, // 文字

          intervalShow: 2, // 停留时间，界面用，如果这里是1，则设备停留时间为1*100=1000
          interval: 2, // 间隔时间
        },

        emergeFlagOption: [{
            label: "黑屏",
            value: 0
          },
          {
            label: "立即显示",
            value: 1
          },
          {
            label: "上移",
            value: 2
          },
          {
            label: "下移",
            value: 3
          },
          {
            label: "左移",
            value: 4
          },
          {
            label: "右移",
            value: 5
          },
          {
            label: "横百叶窗",
            value: 6
          },
          {
            label: "竖百叶窗",
            value: 7
          },
          {
            label: "上下合拢",
            value: 8
          },
          {
            label: "上下展开",
            value: 9
          },
          {
            label: "左右合拢",
            value: 10
          },
          {
            label: "左右展开",
            value: 11
          },
          {
            label: "中心合拢",
            value: 12
          },
          {
            label: "中心展开",
            value: 13
          },
          {
            label: "向下马赛克",
            value: 14
          },
          {
            label: "向右马赛克",
            value: 15
          },
          {
            label: "淡入",
            value: 16
          },
          {
            label: "淡出",
            value: 17
          },
          {
            label: "字符闪烁（闪后消失）",
            value: 18
          },
          {
            label: "字符闪烁（闪后停留）",
            value: 19
          },
          {
            label: "区域闪烁（闪后复原）",
            value: 20
          },
          {
            label: "区域闪烁（闪后区域为黑）",
            value: 21
          },
        ],
      }
    },
    created() {
      if (this.currentDevice) {
        this.detail.resolutionPower = this.currentDevice.resolutionPower
        this.detail.resolutionPowerHeight = this.currentDevice.resolutionPowerHeight
        this.detail.resolutionPowerWidth = this.currentDevice.resolutionPowerWidth
      }
    },
    watch: {
      currentDevice: {
        handler: function(v) {
          this.detail.text = ''
          if (v) {
            this.detail.resolutionPower = this.currentDevice.resolutionPower
            this.detail.resolutionPowerHeight = this.currentDevice.resolutionPowerHeight
            this.detail.resolutionPowerWidth = this.currentDevice.resolutionPowerWidth
          }
        },
        deep: true
      }
    },
    computed: {
      resolutionPower() {
        return this.currentDevice.resolutionPower
      },
      horizontalFormat() {
        let obj = {}
        this.horizontal.forEach(item => {
          obj[item.value] = item.name
        })
        return obj
      },
      verticalFormat() {
        let obj = {}
        this.vertical.forEach(item => {
          obj[item.value] = item.name
        })
        return obj
      },
      fontSizeFormat() {
        let obj = {}
        this.fontSize.forEach(item => {
          obj[item.value] = item.name
        })
        return obj
      }
    },
    methods: {
      // 保存节目单
      saveBoard () {
        let obj = {
          "bmpName": "",
          "bmps": [{
            "bmpContent": "",
            "bytes": "",
            "imgUrl": "",
            "x": ""
          }],
          "emergeFlag": "",
          "emergeSpeed": "",
          "imgUrls": "",
          "monopoly": 0,
          "point": {
            "x": 0,
            "y": 0
          },
          "releaseType": 0,
          "releaseTypeName": "",
          "showImg": "",
          "templateType": 0,
          "templetId": ""
        }
        this.$emit('update-board', Object.assign({}, obj,this.detail))
      },
      saveDeviceQbBoardNew() {
        if (this.detail.text) {
          let obj = {
            "bmpName": "",
            "bmps": [{
              "bmpContent": "",
              "bytes": "",
              "imgUrl": "",
              "x": ""
            }],
            "emergeFlag": "",
            "emergeSpeed": "",
            "imgUrls": "",
            "monopoly": 0,
            "point": {
              "x": 0,
              "y": 0
            },
            "releaseType": 0,
            "releaseTypeName": "",
            "showImg": "",
            "templateType": 0,
            "templetId": ""
          }
          this.$service.tunnel_2d.saveDeviceQbBoardNew(Object.assign({}, obj, this.detail)).then(res => {
            if (res.status === 1) {
              this.$notifySuccess()
              if (this.currentDevice.resolutionPower === this.detail.resolutionPower) {
                this.$emit('update-list')
              }
            }
          })
        }
      },

      handleAddPlayList(v) {
        this.type = v
        this.detail.text = ''
      },

      hideColor(item) {
        this.detail.color = item.value
        this.showColor = false
      },
      hideBgColor(item) {
        this.detail.backgroundColor = item.value
        this.showBgColor = false
      },
      hideHorizontal(item) {
        this.detail.horizontal = item.value
        this.showHorizontal = false
      },
      hideVertical(item) {
        this.detail.vertical = item.value
        this.showVertical = false
      },
      hideFont(item) {
        this.detail.fontName = item.value
        this.showFont = false
      },
      hideFontSize(item) {
        this.detail.fontSize = item.value
        this.showFontSize = false
      },
      hideResolutionPowers(item) {
        this.detail.resolutionPower = item.value
        this.showResolutionPower = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .edit {
  .modal {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 1100001;
    top: 0;
    left: 0;
  }

  .select-options {
    display: flex;
    height: 30px;
    align-items: center;
    line-height: 30px;
    margin-bottom: 10px;

    >div {
      color: #5DA0FE;
      font-size: 14px;
      margin-right: 5px;
      position: relative;

      span {
        display: block;
        padding: 0 5px;
        white-space: nowrap;
        .color {}
      }

      &.bold,
      &.italics {
        .active {
          background: #3B46E2;
          color: #FFFFFF;
        }
      }

      &.italics {
        font-style: italic;
      }

      &.color {
        &.active {
          border-style: solid;
          border-width: 0 0 4px;
          // line-height: 26px;
          // box-sizing: border-box;
        }
      }

      .color-options {
        position: absolute;
        top: 35px;
        left: 0;
        background: #120F41;
        z-index: 1100002;
        display: flex;
        border-radius: 2px;
        padding: 10px;
        border: 1px solid #4E58ED;

        >div {
          display: inline-block;
          width: 20px;
          height: 20px;

          &:not(:last-child) {
            margin-right: 10px;
          }
        }
      }

      .horizontal-select-options {
        position: absolute;
        top: 35px;
        left: 50%;
        transform: translateX(-50%);
        background: #120F41;
        z-index: 1100002;
        border-radius: 2px;
        padding: 5px 16px;
        border: 1px solid #4E58ED;
        // width: 50px;
        text-align: center;
        &.top {
          top: initial;
          bottom: 32px;
        }

        >div {
          height: 30px;
          line-height: 30px;
          color: #5DA0FE;
          font-size: 14px;
          white-space: nowrap;
          min-width: 40px;
          text-align: center;

          &:not(:last-child) {
            border-bottom: 2px dotted #4E58ED;
          }
        }
      }

      &.backcolor {
        &.active {
          color: #5DA0FE;
        }
      }

      &.horizontal-select,
      &.vertical-select,
      &.font-select,
      &.fontsize-select,
      &.space-input,
      &.rowHeight-input {
        input {
          font-size: 14px;
          background: #0B0A30;
          border: 2px solid #4E58ED;
          width: 50px;
          color: #5DA0FE;
          text-align: center;
          box-sizing: border-box;
          border-radius: 4px;
          height: 30px;
          line-height: 28px;
        }
      }
    }
  }

  .input-area {
    textarea {
      width: 100%;
      height: 125px;
      background: #120F41;
      border: 1px solid #4E58ED;
      padding: 10px;
      box-sizing: border-box;
      font-size: 14px;
      font-family: Microsoft YaHei;
      color: #5DA0FE;
    }
  }

  .add-area {
    height: 50px;
    display: flex;
    align-items: center;

    .title {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: #5DA0FE;
      padding-left: 18px;
      height: 50px;
      ;
      line-height: 50px;
      ;
      position: relative;
      margin-right: 13px;

      &::before {
        content: '';
        width: 3px;
        height: 10px;
        position: absolute;
        top: 21px;
        left: 7px;
        background: #4E58ED;
      }
    }

    .button {
      display: flex;

      span {
        height: 24px;
        line-height: 22px; //24px;
        box-sizing: border-box;
        padding: 0 5px;
        background: #0B0A30;
        border: 1px solid #4E58ED;
        border-radius: 12px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;

        &.active {
          background: #3B46E2;
          color: #FFFFFF;
        }

        &+span {
          margin-left: 7px;
        }
      }
    }
  }
}
</style>
