<template>
  <view class="edit">
    <view class="add-area">
      <view class="title">
        <text>信息编辑区域</text>
      </view>
      <view class="button" style="flex: 1;margin-left: ">
        <text :class="{active: type === 1}" @click="handleAddPlayList(1)">新增模板</text>
        <text @click="saveDeviceQbBoardNew">保存模板</text>
      </view>
      <view class="button">
        <text :class="{active: type === 2}" @click="handleAddPlayList(2)">新增节目单</text>
        <text @click="saveBoard">保存节目单</text>
      </view>
    </view>

    <view class="select-options">
      <view class="bold">
        <text :class="{active: detail.bold}" @click="detail.bold = detail.bold === 0 ? 1 : 0">B</text>
      </view>
      <view class="italics">
        <text :class="{active: detail.italics}" @click="detail.italics = detail.italics === 0 ? 1 : 0">I</text>
      </view>

      <view class="color" :class="{active: detail.color}" :style="{borderColor: detail.color}">
        <view>
          <text @click="showColor = !showColor">A</text>
        </view>
        <view class="modal" v-show="showColor" @click="showColor = false"></view>
        <view class="color-options" v-show="showColor">
          <view v-for="(item,index) in colors" :key="'colors_' + index" :style="{backgroundColor: item.value}"
            @click="hideColor(item)">
          </view>
        </view>
      </view>

      <view class="backcolor" :class="{active: detail.backgroundColor}"
        :style="{backgroundColor: detail.backgroundColor}">
        <view><text @click="showBgColor = !showBgColor">背景</text></view>
        <view class="modal" v-show="showBgColor" @click="showBgColor = false"></view>
        <view class="color-options" v-show="showBgColor">
          <view v-for="(item,index) in backgroundColors" :key="'backgroundColors_' + index" @click="hideBgColor(item)"
            :style="{backgroundColor: item.value}"></view>
        </view>
      </view>

      <view class="horizontal">
        <view><text>水平</text></view>
      </view>
      <view class="horizontal-select">
        <view><text><input :disabled="true" type="text" :value="horizontalFormat[detail.horizontal]"
              @click="showHorizontal = true" @focus="showHorizontal=true" /></text></view>
        <view class="modal" v-show="showHorizontal" @click="showHorizontal = false"></view>
        <view class="horizontal-select-options" v-show="showHorizontal">
          <view v-for="(item,index) in horizontal" :key="'horizontal' + index" @click="hideHorizontal(item)">
            <text>{{ item.name }}</text>
          </view>
        </view>
      </view>


      <view class="vertical">
        <view><text>垂直</text></view>
      </view>
      <view class="vertical-select">
        <view><text><input :disabled="true" type="text" :value="verticalFormat[detail.vertical]"
              @click="showVertical = true" @focus="showVertical=true" /></text></view>
        <view class="modal" v-show="showVertical" @click="showVertical = false"></view>
        <view class="horizontal-select-options" v-show="showVertical">
          <view v-for="(item,index) in vertical" :key="'vertical' + index" @click="hideVertical(item)">{{ item.name }}
          </view>
        </view>
      </view>

      <view class="font-select">
        <view><text><input :disabled="true" type="text" :value="detail.fontName" @click="showFont = true"
              @focus="showFont=true" /></text></view>
        <view class="modal" v-show="showFont" @click="showFont = false"></view>
        <view class="horizontal-select-options" v-show="showFont">
          <view v-for="(item,index) in font" :key="'font' + index" @click="hideFont(item)">{{ item.name }}</view>
        </view>
      </view>

      <view class="fontsize">
        <text>字号</text>
      </view>
      <view class="fontsize-select">
        <view><text><input :disabled="true" type="text" :value="detail.fontSize" @click="showFontSize = true"
              @focus="showFontSize=true" /></text></view>
        <view class="modal" v-show="showFontSize" @click="showFontSize = false"></view>
        <view class="horizontal-select-options" v-show="showFontSize">
          <view v-for="(item,index) in fontSize" :key="'fontSize' + index" @click="hideFontSize(item)">{{ item.name }}
          </view>
        </view>
      </view>

      <view class="space">
        <text>字间距</text>
      </view>
      <view class="space-input">
        <text>
          <input type="number" v-model="detail.spacing" />
        </text>
      </view>
      <view class="rowHeight">
        <text>行高</text>
      </view>
      <view class="rowHeight-input">
        <text><input type="number" v-model="detail.rowHeight" /></text>
      </view>
    </view>

    <view class="input-area">
      <textarea placeholder-class="textarea-placeholder" v-model="detail.text" />
    </view>

    <view class="select-options" style="margin-top: 3.9062rpx">

      <view class="space">
        <text>停留时间</text>
      </view>
      <view class="space-input">
        <text>
          <input type="number" v-model="detail.intervalShow" />
        </text>
      </view>

      <view class="space">
        <text>间隔时间</text>
      </view>
      <view class="space-input">
        <text>
          <input type="number" v-model="detail.interval" />
        </text>
      </view>

      <view class="resolutionPower">
        <text>分辨率</text>
      </view>
      <view class="font-select">
        <view><text><input :disabled="true" type="text" :value="detail.resolutionPower"
              @click="showResolutionPower = true" @focus="showResolutionPower=true" /></text></view>
        <view class="modal" v-show="showResolutionPower" @click="showResolutionPower = false"></view>
        <view class="horizontal-select-options" v-show="showResolutionPower">
          <view v-for="(item,index) in resolutionPowers" :key="'resolutionPowers' + index"
            @click="hideResolutionPowers(item)">{{ item.name }}</view>
        </view>
      </view>

    </view>
  </view>
</template>

<script>
  export default {
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
          uni.showLoading({
            title: '加载中'
          })
          this.$request.saveDeviceQbBoardNew(Object.assign({}, obj, this.detail)).then(res => {
            if (res.status === 1) {
              uni.showToast({
                icon: 'success',
                title: '新增播放成功'
              })
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
      z-index: 100;
      top: 0;
      left: 0;
    }

    .select-options {
      display: flex;
      height: 11.7187rpx;
      align-items: center;
      line-height: 11.7187rpx;
      margin-bottom: 3.9062rpx;

      >view {
        color: #5DA0FE;
        font-size: 5.4687rpx;
        margin-right: 1.9531rpx;
        position: relative;

        text {
          display: block;
          padding: 0 1.9531rpx;

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
            border-width: 0 0 1.5625rpx;
            // line-height: 10.1562rpx;
            // box-sizing: border-box;
          }
        }

        .color-options {
          position: absolute;
          top: 13.6718rpx;
          left: 0;
          background: #120F41;
          z-index: 101;
          display: flex;
          border-radius: 3.9062rpx;
          padding: 3.9062rpx;
          border: 0.3906rpx solid #4E58ED;

          >view {
            display: inline-block;
            width: 7.8125rpx;
            height: 7.8125rpx;

            &:not(:last-child) {
              margin-right: 3.9062rpx;
            }
          }
        }

        .horizontal-select-options {
          position: absolute;
          top: 13.6718rpx;
          left: 50%;
          transform: translateX(-50%);
          background: #120F41;
          z-index: 101;
          border-radius: 3.9062rpx;
          padding: 3.9062rpx;
          border: 0.3906rpx solid #4E58ED;
          width: 19.5312rpx;
          text-align: center;

          >view {
            height: 11.7187rpx;
            height: line-11.7187rpx;
            color: #5DA0FE;
            font-size: 5.4687rpx;

            &:not(:last-child) {
              border-bottom: 0.7812rpx dotted #4E58ED;
            }
          }
        }

        &.backcolor {
          &.active {
            color: #FFFFFF;
          }
        }

        &.horizontal-select,
        &.vertical-select,
        &.font-select,
        &.fontsize-select,
        &.space-input,
        &.rowHeight-input {
          input {
            font-size: 5.4687rpx;
            background: #0B0A30;
            border: 0.7812rpx solid #4E58ED;
            width: 19.5312rpx;
            text-align: center;
            box-sizing: border-box;
            border-radius: 1.5625rpx;
            height: 11.7187rpx;
            line-height: 10.9375rpx;
          }
        }
      }
    }

    .input-area {
      textarea {
        width: 100%;
        height: 48.8281rpx;
        background: #120F41;
        border: 0.3906rpx solid #4E58ED;
        padding: 3.9062rpx;
        box-sizing: border-box;
        font-size: 5.4687rpx;
        font-family: Microsoft YaHei;
        color: #5DA0FE;
      }
    }

    .add-area {
      height: 19.5312rpx;
      display: flex;
      align-items: center;

      .title {
        font-size: 5.4687rpx;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #5DA0FE;
        padding-left: 7.0312rpx;
        height: 19.5312rpx;
        ;
        line-height: 19.5312rpx;
        ;
        position: relative;
        margin-right: 5.0781rpx;

        &::before {
          content: '';
          width: 1.1718rpx;
          height: 3.9062rpx;
          position: absolute;
          top: 8.2031rpx;
          left: 2.7343rpx;
          background: #4E58ED;
        }
      }

      .button {
        display: flex;

        text {
          height: 9.375rpx;
          line-height: 8.5937rpx; //9.375rpx;
          box-sizing: border-box;
          padding: 0 1.9531rpx;
          background: #0B0A30;
          border: 0.3906rpx solid #4E58ED;
          border-radius: 12px;
          font-size: 4.6875rpx;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #5DA0FE;

          &.active {
            background: #3B46E2;
            color: #FFFFFF;
          }

          &+text {
            margin-left: 2.7343rpx;
          }
        }
      }
    }
  }
</style>
