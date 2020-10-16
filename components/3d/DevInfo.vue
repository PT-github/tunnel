<template>
  <div>
    <div class="mydialog" v-if="visible">
      <img id="close" @click="close" src="../../assets/3d/u1033.png" alt />
      <div class="title">
        <div class="icon">
          <img src="../../assets/3d/u1042.png" alt />
        </div>
        <div class="label">设备信息</div>
      </div>
      <div class="content2">
        <table width="100%">
          <tr>
            <td style="width:80px">当前状态:</td>
            <td>
              <el-switch v-model="dataForm.status" @change="openLight()"></el-switch>
            </td>
          </tr>
          <tr>
            <td>亮度调节:</td>
            <td>
              <el-slider v-model="dataForm.lightVaule" @input="setLight()"></el-slider>
            </td>
          </tr>
          <tr>
            <td>设备厂家:</td>
            <td>
              <input v-model="dataForm.made" />
            </td>
          </tr>
        </table>
              <div class="footer">
          <div class="btn1" @click="close">取消</div>
          <div class="btn1"  @click="dataFormSubmit()">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dev",
  data() {
    return {
      visible: false,
      dataForm: {
        id: "",
        name: "",
        status: false,
        lightVaule: 10,
        made: ""
      }
    };
  },
  methods: {
    close(){
      this.visible = false;
      this.$emit('close');
    },
    init() {
      this.visible = true;
      // this.dataForm.id = id
      // this.dataForm.name = name
    },
    openLight() {
      this.$emit("openLight", this.dataForm.id, this.dataForm.status);
    },
    setLight() {
      this.$emit("setLight", this.dataForm.lightVaule / 10);
    },
    // 表单提交
    dataFormSubmit() {
      this.visible = false;
      this.$emit("refreshData");
      this.$emit('close');
    }
  }
};
</script>


<style lang=scss scoped>
.myclass{
  background: white !important;
  color: #00ffff;
}
.mydialog {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: 25vh auto;
  width: 600px;
  height: 300px;
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
</style>
