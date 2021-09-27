<!-- 节目单预览 -->
<template>
  <el-carousel class="swiper" :autoplay="false">
    <el-carousel-item v-for="(item, index) in previewList" :key="'list_' + index + '_' + item.id">
      <div class="swiper-item">
        <div class="preview-view" :style="[getWH, getContainerStyle(item)]">
          <div v-for="(t, k) in item.textList" :key="index + '_' + k" :style="getTextStyle(item)">
            <span v-for="(i,j) in t" :key="index + '_' + k + '_' + j" :style="getSpanStyle(item)">{{ i === ' ' ? '&nbsp;' : i }}</span>
            <!-- <span :style="getSpanStyle(item)">{{ t }}</span> -->
          </div>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>
<script>
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
    name: 'Preview',
    props: {
      list: {
        type: Array,
        default: () => []
      },
      // 当前设备信息
      deviceData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      fontSize: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        previewList: []
      }
    },
    computed: {
      getWH() {
        let wh = this.resolutionPower ? this.resolutionPower.split('*') : [0, 0]
        return {
          "width": this.getRealPx(wh[0]) + 'PX',
          "height": this.getRealPx(wh[1]) + 'PX'
        }
      },
      // 分辨率
      resolutionPower() {
        return this.deviceData.resolutionPower
      },
    },
    created() {
      this.init()
    },
    watch: {
      list: {
        handler: function() {
          this.init()
        },
        deep: true
      }
    },
    methods: {
      getCanvasCtx() {
        let context = document.createElement('canvas').getContext('2d')
        this.ctx = context
        return context
      },
      // 初始化预览项
      init() {
        this.previewList.splice(0, this.previewList.length)
        if (!this.list.length) {
          return
        }
        for (let i = 0; i < this.list.length; i++) {
          this.previewList.push(this.handlerTxtToArr(this.list[i]))
        }
      },
      handlerTxtToArr(obj) {
        let wh = this.resolutionPower ? this.resolutionPower.split('*') : [0, 0]
        let {
          text,
          fontSize,
          rowHeight,
          bold,
          italics,
          spacing,
        } = obj
        this.getCanvasCtx();
        // 先处理换行的符号
        let txtArr = text.split("\n");
        // 根据数据得出最大多少行
        let maxLines = Math.floor(
          wh[0] / (fontSize * 1 + rowHeight * 1)
        );
        // 设置字体
        this.ctx.font = `${bold ? "bold " : ""}${
              italics ? "italic " : ""
            }${fontSize || 24}px sans-serif`;
        let destTextArr = [];
        //  处理数组中的每一个数据
        txtArr.forEach((item, index) => {
          // 当前这一列有可能分割成多个数据的数组存放变量
          let tempArr = [];
          let linesNum = Math.round(
            (this.ctx.measureText(item + "").width +
              (item.length - 1) * spacing) /
            wh[0]
          );
          // 构建好二维数组
          for (let index = 0; index < linesNum.length; index++) {
            tempArr[index] = [];
          }
          // 最后一次分组的油标位置
          let lastIndex = 0;
          // 子数组里面的数据
          let times = 0;
          // 当前这个数组长度不足一屏，直接给数据
          // console.log(`当前${item}的长度 ${this.ctx.measureText(item+'').width}，屏幕的长度${wh[0]}`)
          // 文字的宽度+字间距
          if (
            this.ctx.measureText(item + "").width +
            (item.length - 1) * spacing <=
            wh[0]
          ) {
            tempArr.push(item);
          } else {
            //当前数组的底index个数据超出了一列分个去截取
            for (let i = 1; i <= item.length; i++) {
              // 循环计算每个字的宽度
              // 文字的长度+字间距超出了屏幕的宽度
              // console.log(
              //   `文字的长度+字间距超出了屏幕的宽度 ${
              //         this.ctx.measureText(item.slice(lastIndex, i) + "").width
              //       }  当前间距 ${
              //         (i - lastIndex - 1) * spacing
              //       } 当前文字【==${item.slice(lastIndex, i)}==】`
              // );
              let textLetterWidth =
                this.ctx.measureText(item.slice(lastIndex, i) + "").width +
                (i - lastIndex - 1) * spacing;
              if (textLetterWidth == wh[0]) {
                tempArr[times] = item.slice(lastIndex, i);
                times++;
                lastIndex = i;
              } else if (textLetterWidth > wh[0]) {
                tempArr[times] = item.slice(lastIndex, i - 1);
                times++;
                lastIndex = i - 1;
              }
            }
            // 最后分割的不足一屏幕了
            if (
              this.ctx.measureText(item.slice(lastIndex, item.length)).width +
              ((item.slice(lastIndex, item.length) + "").length - 1) *
              spacing <
              wh[0]
            ) {
              if (lastIndex < item.length) {
                tempArr[times] = item.slice(lastIndex, item.length);
              }
            }
          }
          // console.log(tempArr);
          destTextArr[index] = tempArr;
        });
        // 将二维数组打成一维数组
        let destArrData = [];
        destTextArr.forEach((item) => {
          // 是数组
          if (Array.isArray(item)) {
            item.forEach((li) => {
              destArrData.push(li);
            });
          } else {
            destArrData.push(item);
          }
        });
        // this.detail.text = destArrData.join("\n");
        //  判断是否是高度超出了限制
        if (destArrData.length > maxLines) {
          return this.reduceOther(obj);
        }
        return {
          ...obj,
          textList: destArrData
        }
      },
      reduceOther(obj) {
        let fontArr = this.fontSize.map((item) => Number(item.value));
        fontArr.sort(function(a, b) {
          return a - b;
        });
        let index = fontArr.findIndex(
          (item) => Number(obj.fontSize) == item
        );
        if (index > 0) {
          index--;
          obj.fontSize = fontArr[index];
        } else if (obj.rowHeight != 0) {
          obj.rowHeight = 0;
        }
        return this.handlerTxtToArr(obj)
      },
      // 获取每个文字的样式
      getSpanStyle(item) {
        // console.log('====================================0000====================================')
        // console.log('********************************',this.getRealPx(item.fontSize),'************************')
        // console.log('====================================0000====================================')
        return {
          "color": item.color,
          "marginRight": this.getRealPx(item.spacing) + 'PX',
          "font-weight": Boolean(Number(item.bold || '0')) ? 'bold' : '',
          "line-height": this.getRealPx(item.fontSize) + 'PX',
          "font-style": Boolean(Number(item.italics || '0')) ? 'italic' : '',
          "font-size": this.getRealPx(item.fontSize) + 'PX',
        }
      },
      getContainerStyle (item) {
        let verticalMap = {
          '1': "flex-start", // 垂直居上
          '2': "center", // 垂直居中
          '3': "flex-end" // 垂直居下
        }
        // console.log(item, '===',verticalMap[(item.vertical + '') || '1'])
        return {
          "justify-content": verticalMap[item.vertical || '1'],
          "background-color": item.backgroundColor
        }
      },
      // 获取每行样式
      getTextStyle(item) {
        let textAlginMap = {
          1: "center",
          2: "flex-start",
          3: "flex-end"
        }
        return {
          "display": "flex",
          "padding-top": this.getRealPx(item.rowHeight) + 'PX',
          "color": item.color,
          "font-weight": Boolean(Number(item.bold || '0')) ? 'bold' : '',
          "line-height": this.getRealPx(item.fontSize) + 'PX',
          "font-style": Boolean(Number(item.italics || '0')) ? 'italic' : '',
          "font-size": this.getRealPx(item.fontSize) + 'PX',
          "justify-content": textAlginMap[item.horizontal || 1],
          "flex-shrink": 0,
          "overflow": 'hidden'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.swiper {
  height: 90px;
  color: #FFFFFF;
  .swiper-item {
    height:90px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .preview-view {
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
</style>
