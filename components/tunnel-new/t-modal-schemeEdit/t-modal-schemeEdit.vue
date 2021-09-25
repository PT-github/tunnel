<template>
  <div class="t-modal-schemeEdit">
    <div class="header">
      <span>组合{{ schemeModalType === 0 ? '新增' : '修改' }}</span>
      <span class="close" @click="handleCancel">x</span>
    </div>
    <div class="form-control">
      <div class="label">
        <span>组合名称：</span>
      </div>
      <div class="value">
        <input v-model="schemeName" type="text" placeholder="请输入组合名称" />
      </div>
    </div>
    <div class="submit-area">
      <span @click="handleCancel">取消</span>
      <span class="active" @click="handleSubmit">保存</span>
    </div>
  </div>
</template>

<script>
  export default {
    services: ["_2d", "tunnel", "tunnel_2d"],
    name:"t-modal-schemeEdit",
    props: {
      // 0新增 1修改
      schemeModalType: {
        type: Number,
        default: 0
      },
      // 修改的方案数据
      schemeData: {
        type: Object,
        default: () => {
          return {}
        }
      },
      tunnelId: {
        type: [String, Object]
      },
    },
    created() {
      this.schemeName = this.schemeModalType === 0 ? '' : this.schemeData.schemeName
    },
    data() {
      return {
        classifyNumber: 'lighting',
        schemeName: ''
      };
    },
    methods: {
      handleSubmit () {
        let request, params = {
          classifyNumber: this.classifyNumber,
          schemeName: this.schemeName,
          tunnelId: this.tunnelId
        };
        if (this.schemeModalType === 0) {
          request = this.$service.tunnel_2d.insert
        } else {
          request = this.$service.tunnel_2d.update
          params.id = this.schemeData.id
        }
        request.call(this.$service.tunnel_2d, params).then(res => {
          if (res && res.status === 1) {
            this.$notifySuccess()
          }
          this.$emit('change')
        })
        
      },
      handleCancel () {
        this.$emit('close')
      },
    }
  }
</script>

<style lang="scss">
.t-modal-schemeEdit {
  width: 440px;
  height: 220px;//180px;
  box-sizing: border-box;
  background: #0B0A30;
  border: 1px solid #1D2388;
  .header {
    border-bottom: 1px solid #1D2388;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #5DA0FE;
    background: url(../../../assets/tunnel/modal/laneIndicator/dot.png) 19px center / 18px auto no-repeat;
    padding-left: 51px;
    height: 56px;
    line-height: 56px;
    position: relative;
    .close {
      position: absolute;
      width: 33px;
      height: 33px;
      line-height: 33px;
      text-align: center;
      background: #1B195A;
      color: #2B79E3;
      font-size: 22px;
      right: 14px;
      top: 11px;
    }
  }
  .submit-area {
    width: 100%;
    padding-right: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    span {
      width: 80px;
      height: 34px;
      line-height: 34px;
      text-align: center;
      background: #1B195A;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #286BC8;
      &.active {
        background: #3B46E2;
        color: #FFFFFF;
      }
      & + span {
        margin-left: 10px;
      }
    }
  }
  .form-control {
    display: flex;
    align-items: center;
    padding: 30px 30px;
    .label {
      color: #5DA0FE;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #5DA0FE;
    }
    .value {
      display: flex;
      flex: 1;
      input {
        flex: 1;
        border: 1px solid #4E58ED;
        height: 34px;
        display: block;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #5DA0FE;
        padding: 0 16px;
        box-sizing: border-box;
        background: none;
        outline: none;
      }
      .upload {
        background: #3B46E2;
        color: #FFFFFF;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
}
</style>
