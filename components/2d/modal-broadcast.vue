<!-- 广播弹窗 -->
<template>
  <div class="content flex">
    <div class="left">
      <p class="flex flex-space lefttitle">
        <span class="bluecolor">文件列表</span>
        <uploadFiles
          busType="BroadCast"
          button-only
          @uploadOver="uploadOver"
          single
          path
        ></uploadFiles>
      </p>
      <ul class="actionlist scroll">
        <li
          class="flex flex-space"
          v-for="(item, index) in listSource"
          :key="index"
        >
          <span>{{ item.templetName }}</span>
          <div>
            <span
              :class="['checkbox', item.ischose ? 'chosebg2' : 'chosebg1']"
              @click="chosetab(index, 'listSource')"
            ></span>
          </div>
        </li>
      </ul>
    </div>
    <div class="right">
      <p class="flex flex-space lefttitle">
        <span class="bluecolor">广播列表</span>
        <span class="legend">
          <span class="on">
            <i class="oni"></i>
            正常
          </span>
          <span class="status">
            <i class="offi"></i>
            故障
          </span>
        </span>
      </p>
      <ul class="actionlist scroll">
        <li
          class="flex flex-space"
          v-for="(item, index) in deviceList"
          :key="index"
        >
          <span
            >{{ item.deviceName }}

            <span class="status">
              <i
                :class="item.deviceCommunicationsState === 0 ? 'oni' : 'offi'"
              ></i>
              {{ item.deviceCommunicationsState === 0 ? "正常" : "故障" }}
            </span>
            <marquee style="width:300px;vertical-align: bottom">
              <span class="status">{{ item.reamrks }}</span>
            </marquee>
          </span>

          <div>
            <span
              :class="['checkbox', item.ischose ? 'chosebg2' : 'chosebg1']"
              @click="chosetab(index, 'deviceList')"
            ></span>
          </div>
          <!-- <input type="checkbox" v-model="item.ischose"> -->
        </li>
      </ul>
      <div class="flex btnbox flex-end">
        <div style="align-items: center" class="flex">
          <!-- <span style="padding-right: 5px;">循环播放 </span> -->
          <!-- <span style="margin-right:10px;"
                          :class="['checkbox',loop[0].ischose?'chosebg2':'chosebg1']"
                          @click="chosetab(0,'loop')"
                    ></span> -->
          <div @click="confirm(1)" class="btn sure">播放</div>
          <div @click="stop()" class="btn no">停止</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import uploadFiles from "../basic/upload-file";

export default {
  services: ["_2d"],
  components: { uploadFiles },
  props: {
    tunnelId: String,
  },
  data() {
    return {
      fileName: "",
      deviceList: [],
      listSource: [], //文件列表
      files: null,
      checkbox: false,
      loop: [{ ischose: false }],
      chosebg1: "chosebg1",
      chosebg2: "chosebg1",
    };
  },
  mounted() {
    this.getDeviceList();
    this.getListSourceMaterial();
  },
  methods: {
    uploadOver(file) {
      this.$service._2d
        .saveBroadcastSource({
          tunnelId: this.tunnelId,
          boardcastFileName: file.name,
          boardcastFilePath: file.path,
        })
        .then(() => {
          this.$notifySuccess("上传成功！");
          this.getListSourceMaterial();
        });
    },
    //播放
    confirm() {
      let deviceId = this.deviceList
        .filter((v) => v.ischose)
        .map((v) => v.id)
        .join(",");
      let tempId = this.listSource
        .filter((v) => v.ischose)
        .map((v) => v.id)
        .join(",");
      if (!deviceId || !tempId) {
        return this.$message.warning("请选择设备和广播");
      }
      this.$service._2d
        .playBroadcast({
          deviceId,
          tempId,
          tunnelId: this.tunnelId,
          loop: this.loop[0].ischose,
        })
        .then(() => {
          this.$notifySuccess();
        });
    },
    //停止
    stop() {
      let deviceId = this.deviceList
        .filter((v) => v.ischose)
        .map((v) => v.id)
        .join(",");
      if (!deviceId) {
        return this.$message.warning("请选择设备");
      }
      this.$service._2d
        .stopBroadcast({
          deviceId,
          tunnelId: this.tunnelId,
        })
        .then(() => {
          this.$notifySuccess();
        });
    },
    // 获取设备列表
    getDeviceList() {
      this.$service._2d
        .getTunnelDeviceTypeList(this.tunnelId, "broadcast")
        .then((res) => {
          console.log(res);
          this.deviceList = res.map((v) => {
            return {
              ...v,
              ischose: false,
            };
          });
        });
    },
    //获取文件列表
    getListSourceMaterial() {
      this.$service._2d.getBroadcastSource(this.tunnelId).then((res) => {
        this.listSource = res;
      });
    },
    chosetab(i, name) {
      console.log(name);
      //if (name === "listSource") {
      this.listSource.forEach((element) => {
        element.ischose = false;
      });
      //  } else {
      //this.listSource[i].ischose=false
      this[name][i].ischose = !this[name][i].ischose;
      // }
      this.$forceUpdate();
    },
    close() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped>
.content {
  box-sizing: border-box;
  color: rgb(135, 164, 194);
}

.left {
  border-right: 1px solid #092c61;
  width: 50%;
}

.left,
.right {
  padding: 0 20px;
}

.right {
  width: 50%;
}

.flex-space {
  justify-content: space-between;
}

.flex-end {
  justify-content: flex-end;
}

.bluecolor {
  color: #fff;
  font-size: 20px;
}

.lefttitle {
  height: 40px;
  line-height: 40px;
  color: #87a4c2;
  font-size: 20px;
  font-weight: bold;
  margin: 10px 0;
}

.lefttitle1 {
  margin: 20px 0;
}

.imgArr {
  flex-wrap: wrap;
  justify-content: space-between;
}

.imgArr .imgbox {
  width: 230px;
  height: 180px;
  display: block;
  border: 2px solid #184284;
  margin-bottom: 20px;
  padding: 10px;
}

.imgbox img {
  display: block;
  height: 100%;
  width: 100%;
}

.actionlist {
  height: 300px;
  overflow-y: auto;
}

.actionlist li {
  align-items: center;
  padding: 10px 0;
  border-top: 1px dashed #184284;
}

input {
  vertical-align: middle;
}

.checkall {
  margin-right: 10px;
}

.btnbox {
  margin: 10px 0;
}

.btnbox .btn {
  text-align: center;
  padding: 3px 30px;
  border-radius: 30px;
  cursor: pointer;
}
.texts {
}
.upload {
  text-align: center;
  border: 1px solid #184284;
  color: #184284;
}

.no {
  border: 1px solid #184284;
}

.sure {
  background: linear-gradient(to right, #1e6bc8, #00befb);
  color: #fff;
  margin-right: 10px;
}

.on {
  font-size: 12px;
}

.status {
  font-size: 12px;
  overflow: hidden; /*自动隐藏文字*/
  text-overflow: ellipsis; /*文字隐藏后添加省略号*/
  white-space: nowrap; /*强制不换行*/
}

.top {
  margin: 10px;
  display: flex;
  align-items: center;
  padding-top: 24px;
}

.top i {
  display: inline-block;
  width: 20px;
  height: 20px;
}

.top span {
  color: #87a4c2;
  margin-left: 10px;
}

i {
  display: inline-block;
  width: 10px;
  height: 10px;

  border-radius: 50%;
}

.oni {
  background: green;
}

.offi {
  background: red;
}

.status {
  margin-left: 30px;
}

.check {
  color: #92ccfa;
  font-size: 20px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  width: 80px;
}

.checkbox {
  display: inline-block;
  border-radius: 5px;
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.chosebg1 {
  background: url("../../assets/images/warning/chose.png") no-repeat;
  background-size: 30px 30px;
}

.chosebg2 {
  background: url("../../assets/images/warning/chose1.png") no-repeat;
  background-size: 30px 30px;
}

.actionlist::-webkit-scrollbar {
  display: none;
}
</style>
