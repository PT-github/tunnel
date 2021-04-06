<template>
  <!-- 文字 -->
  <!-- <container icon="el-icon-edit" title="文字内容"> -->
  <div class="text-content">
    <!-- 工具栏 -->
    <div class="text-content-tool">
      <!-- 加粗 -->
      <div class="tool-item" @click="detail.bold = !detail.bold">
        <svg
          class="icon bold"
          :class="[detail.bold && 'select']"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#515151"
            d="M597.32864 554.666667H255.995307V426.666667h341.333333v-1.536a149.333333 149.333333 0 0 0 0-295.594667V128H255.995307v768h341.333333a170.666667 170.666667 0 1 0 0-341.333333z m42.666667 469.333333H85.32864V0h512v0.853333a277.333333 277.333333 0 0 1 211.626667 478.208A298.666667 298.666667 0 0 1 639.995307 1024z"
          />
        </svg>
      </div>
      <!-- 斜体 -->
      <div class="tool-item" @click="detail.italics = !detail.italics">
        <svg
          class="icon bold"
          :class="[detail.italics && 'select']"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#515151"
            d="M329.649231 72.625231h510.739692L820.066462 177.230769H626.845538l-137.216 709.553231H682.929231l-20.322462 104.605538H151.788308l20.322461-104.605538H364.701538L502.547692 177.230769H309.326769z"
          />
        </svg>
      </div>
      <!-- 字的颜色 -->
      <div class="tool-item">
        <el-popover placement="bottom-start" trigger="click">
          <template v-for="(item, i) in colorList">
            <!-- 这里没搞懂为什么写行内样式才生效 -->
            <div
              style="
                display: inline-flex;
                height: 30px;
                width: 30px;
                margin-right: 5px;
              "
              :key="i"
              :style="{ 'background-color': item }"
              @click="detail.color = item"
            ></div>
          </template>
          <span class="bold" :style="zcolorBg" slot="reference">
            <svg
              class="icon font-bold"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="#515151"
                d="M379.733333 635.733333l145.066667-384 145.066667 384M465.066667 85.333333L128 938.666667h136.533333l68.266667-183.466667h379.733333l68.266667 183.466667h136.533333L584.533333 85.333333h-119.466666z"
              />
              \
            </svg>
          </span>
        </el-popover>
      </div>
      <!-- 背景颜色 -->
      <div class="tool-item">
        <el-popover placement="bottom-start" trigger="click">
          <template v-for="(item, i) in bgColorList">
            <!-- 这里没搞懂为什么写行内样式才生效 -->
            <div
              style="
                display: inline-flex;
                height: 30px;
                width: 30px;
                margin-right: 5px;
              "
              :key="i"
              :style="{ 'background-color': item }"
              @click="detail.backgroundColor = item"
            ></div>
          </template>
          <span class="bold bgbold" :style="bgColorSty" slot="reference">
            背景
          </span>
        </el-popover>
      </div>

      <div class="tool-item" style="margin-left: 10px">
        水平
        <el-select
          class="select-font"
          v-model="detail.horizontal"
          placeholder="水平"
        >
          <el-option
            v-for="item in horizontalOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="tool-item">
        垂直
        <el-select
          class="select-font"
          v-model="detail.vertical"
          placeholder="垂直"
        >
          <el-option
            v-for="item in verticalOptions"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="tool-item">
        <el-select
          class="select-font"
          v-model="detail.fontName"
          placeholder="字体"
        >
          <el-option
            v-for="item in fontNameOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="tool-item">
        字号
        <el-select
          class="select-font"
          v-model="detail.fontSize"
          placeholder="字号"
        >
          <el-option
            v-for="item in fontOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="tool-item">
        字间距
        <input
          v-model="detail.spacing"
          class="bginput"
          :disabled="!allowSpacing"
        />
      </div>
      <div class="tool-item">
        行高
        <input
          v-model="detail.rowHeight"
          class="bginput"
          :disabled="!allowRowHeight"
        />
      </div>
    </div>
    <textarea class="text-content-textarea" v-model="detail.text"></textarea>
  </div>
  <!-- </container> -->
</template>

<script>
import container from "./container.vue";
export default {
  services: ["index"],
  components: { container },
  props: {
    allowSpacing: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    allowRowHeight: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    txtWH: {
      type: Object,
      default: () => {
        return {
          w: 0,
          h: 0,
        };
      },
    },
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isOVerText: false,
      textArr: [],
      colorList: [],
      ctx: null,
      bgColorList: [],
      horizontalOptions: [],
      verticalOptions: [],
      fontNameOptions: [],
      fontOptions: [],
      // 暴露出去的大对象
      detail: {
        spacing: 0, // 字间距
        rowHeight: 0,
        vertical: "1", // 垂直
        horizontal: "1", // 水平
        text: "",
        bold: "0",
        italics: false,
        //  colorVisible: false,
        color: "", // 字颜色
        backgroundColor: "", //背景色
        fontSize: "24", //字号
        fontName: "宋体", //字体
      },
    };
  },
  watch: {
    value: {
      handler(obj) {
        let {
          backgroundColor,
          bold,
          color,
          fontName,
          fontSize,
          spacing = 0,
          rowHeight = 0,
          italics,
          text,
          vertical = "1",
          horizontal = "1",
        } = obj || {};
        this.detail = {
          backgroundColor: backgroundColor || this.detail.backgroundColor,
          rowHeight,
          spacing,
          vertical: String(vertical || 1),
          horizontal: String(horizontal || 1),
          text,
          bold: Boolean(Number(bold || "0")),
          italics: Boolean(Number(italics || "0")),
          color: color || this.detail.color, // 字颜色
          fontSize: fontSize || this.detail.fontSize, //字号
          fontName: fontName || this.detail.fontName, //字体
        };
        this.handlerTxtToArr(text);
      },
      deep: true,
      immediate: true,
    },
    detail: {
      handler(obj) {
        if (JSON.stringify(obj) != JSON.stringify(this.value)) {
          this.$emit("input", obj);
        }
      },
      deep: true,
    },
  },
  computed: {
    // 字的颜色
    bgColorSty() {
      if (this.detail.backgroundColor) {
        return { "border-bottom": `3px solid ${this.detail.backgroundColor}` };
      }
    },
    zcolorBg() {
      if (this.detail.color) {
        return { "border-bottom": `3px solid ${this.detail.color}` };
      }
    },
  },
  mounted() {
    let fontSize = JSON.parse(localStorage.getItem("fontSize") || "[]");
    let font = JSON.parse(localStorage.getItem("font") || "[]");
    let bgColor = JSON.parse(localStorage.getItem("bgColor") || "[]");
    let fontColor = JSON.parse(localStorage.getItem("fontColor") || "[]");
    let contentType = JSON.parse(localStorage.getItem("contentType") || "[]");
    let vertical = JSON.parse(localStorage.getItem("vertical") || "[]");
    let horizontal = JSON.parse(localStorage.getItem("horizontal") || "[]");
    this.verticalOptions = vertical || [];
    this.horizontalOptions = horizontal || [];
    this.fontOptions = fontSize;
    this.fontNameOptions = font || [];

    this.bgColorList = bgColor.map((item) => {
      return item.value;
    });
    this.detail.backgroundColor = this.bgColorList[0] || "";
    this.colorList = fontColor.map((item) => {
      return item.value;
    });
    console.log(this.colorList);
    this.detail.color = this.colorList[0] || "";
  },
  methods: {
    getCanvasCtx() {
      if (!this.ctx) {
        let canvas = document.createElement("canvas");
        this.ctx = canvas.getContext("2d");
      }
    },
    handlerTxtToArr(txt = "") {
      this.getCanvasCtx();
      // 先处理换行的符号
      let txtArr = txt.split("\n");
      // 根据数据得出最大多少行
      let maxLines = Math.floor(
        this.txtWH.h / (this.detail.fontSize * 1 + this.detail.rowHeight * 1)
      );
      // 设置字体
      this.ctx.font = `${this.detail.bold ? "bold " : ""}${
        this.detail.italics ? "italic " : ""
      }${this.detail.fontSize || 24}px sans-serif`;
      let destTextArr = [];
      // [...[],...[]]
      //  处理数组中的每一个数据
      txtArr.forEach((item, index) => {
        // 当前这一列有可能分割成多个数据的数组存放变量
        let tempArr = [];
        // console.info(this.txtWH.w)
        let linesNum = Math.round(
          (this.ctx.measureText(item + "").width +
            (item.length - 1) * this.detail.spacing) /
            this.txtWH.w
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
        // console.log(`当前${item}的长度 ${this.ctx.measureText(item+'').width}，屏幕的长度${this.txtWH.w}`)
        // 文字的宽度+字间距
        if (
          this.ctx.measureText(item + "").width +
            (item.length - 1) * this.detail.spacing <=
          this.txtWH.w
        ) {
          tempArr.push(item);
        } else {
          //当前数组的底index个数据超出了一列分个去截取
          for (let i = 1; i <= item.length; i++) {
            // 循环计算每个字的宽度
            // 文字的长度+字间距超出了屏幕的宽度
            console.log(
              `文字的长度+字间距超出了屏幕的宽度 ${
                this.ctx.measureText(item.slice(lastIndex, i) + "").width
              }  当前间距 ${
                (i - lastIndex - 1) * this.detail.spacing
              } 当前文字 ${item.slice(lastIndex, i)}`
            );
            let textLetterWidth =
              this.ctx.measureText(item.slice(lastIndex, i) + "").width +
              (i - lastIndex - 1) * this.detail.spacing;
            if (textLetterWidth == this.txtWH.w) {
              tempArr[times] = item.slice(lastIndex, i);
              times++;
              lastIndex = i;
            } else if (textLetterWidth > this.txtWH.w) {
              tempArr[times] = item.slice(lastIndex, i - 1);
              times++;
              lastIndex = i - 1;
            }
          }
          // 最后分割的不足一屏幕了
          if (
            this.ctx.measureText(item.slice(lastIndex, item.length)).width +
              ((item.slice(lastIndex, item.length) + "").length - 1) *
                this.detail.spacing <
            this.txtWH.w
          ) {
            if (lastIndex < item.length) {
              tempArr[times] = item.slice(lastIndex, item.length);
            }
          }
        }
        // console.log(tempArr);
        // destTextArr[index] = tempArr;
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
        this.$ctx.toastError("文字超出长度");
        // 超出长度的降级方案
        this.isOVerText = true;
        this.reduceOther();
      } else {
        this.isOVerText = false;
      }
      this.$emit("textArrChange", destArrData);
    },
    isOVerFlag() {
      return this.isOVerText;
    },
    reduceOther() {
      let fontArr = this.fontOptions.map((item) => Number(item.value));
      fontArr.sort(function (a, b) {
        return a - b;
      });
      let index = fontArr.findIndex(
        (item) => Number(this.detail.fontSize) == item
      );
      if (index > 0) {
        index--;
        this.detail.fontSize = fontArr[index];
      } else if (this.detail.rowHeight != 0) {
        this.detail.rowHeight = 0;
      }
    },
    choseColor(color) {
      this.color = color;
      // this.colorVisible = false
    },
  },
};
</script>

<style scoped lang="less">
.text-content {
  font-size: 11px !important;
  width: 100%;
  &-tool {
    height: 2 50px;
    border-bottom: none;
    display: flex;
    align-items: center;
    // padding: 0 16px;
    .tool-item {
      font-size: 11px !important;
      margin-right: 5px;
      .select-font {
        width: 80px;
        margin-right: 8px;
      }
      input {
        font-size: 11px !important;
        text-align: center;
        width: 50px;
      }
      .select {
        font-size: 11px !important;
        background-color: #bbbbbb;
      }
      .color-line {
        height: 2px;
        width: 26px;
        display: flex;
      }
    }

    .bold,
    .font-bold {
      height: 18px;
      padding: 3px 5px;
      width: 26px;
      cursor: pointer;
    }
    .font-bold {
      height: 15px;
      padding: 2px 5px;
    }
    .bgbold {
      height: 10px;
      padding: 2px 5px;
    }
  }
  &-textarea {
    width: 100%;
    height: 80px;
    resize: none;
    padding: 15px;
    font-size: 18px;
    outline: none;
    border: none;
    background: #0c2253;
    color: #fff;
  }
}
.bginput {
  background: #123a84;
  border: none;
  color: #fff;
  padding: 15px;
}
/deep/ .text-content .el-input__inner {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}
/deep/ .text-content .el-input__icon {
  line-height: 0;
  font-size: 12px;
}
/deep/ .el-input--suffix .el-input__inner {
  font-size: 10px !important;
  width: 80px;
}
svg.bold:hover {
  path {
    fill: #547ede;
  }
}
/deep/ .el-input__inner {
  height: 0.40666667rem !important;
}
</style>
