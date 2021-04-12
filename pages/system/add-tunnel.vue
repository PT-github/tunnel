<template>
  <form-page
      :breadcrumb="$route.query.from==='1'?[{name:'隧道管理',path:'/tunnel'},{name:$route.query.type==='edit'?'编辑隧道':'新增隧道'}]:
            [{name:'中心首页',path:'/system'},{name:'隧道管理',path:'/system/tunnel'},{name:$route.query.type==='edit'?'编辑隧道':'新增隧道'}]">
    <div class="org">
      <div class="add-tunnel-ctn">
        <el-form :model="tunnelForm" ref="tunnelForm"
                 :label-width="100*$px2rem+'px'"
                 class="demo-ruleForm">
          <IndexTipTitle title="基本信息"></IndexTipTitle>

          <div class="form-items">
            <el-form-item label="所属地区:"
                          :rules="[{ required: true, message: '请选择所属地区'}]"
                          prop="cityId">
              <h-select ref="city" v-model="tunnelForm.cityId"
                        :ds="{service:'basic',func:'getAddress'}"></h-select>
            </el-form-item>

            <el-form-item label="隧道名称:"
                          prop="tunnelName"
                          :rules="[{ required: true, message: '请输入隧道名称', trigger: 'blur' },]">
              <el-input v-model="tunnelForm.tunnelName"
                        placeholder="请输入隧道名称"></el-input>
            </el-form-item>

            <el-form-item label="所属部门:"
                          prop="organizationId"
                          :rules="[{ required: true, message: '请选择所属部门'}]">
              <div class="zdy-item" @click="showOrganizePopup = true">
                <div class="zdy-item-val">
                  {{ tunnelForm.organName ? tunnelForm.organName : '请选择所属部门' }}
                </div>
                <div class="zdy-item-icon">
                  <i class="el-icon-arrow-right"></i>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="隧道类型:"
                          prop="tunnelType"
                          :rules="[{ required: true, message: '请选择隧道类型', trigger: 'blur' }]">
              <hSelect :ds="{service:'basic',func:'getDict',params:'TunnelType'}"
                       ref="hSelect"
                       v-model="tunnelForm.tunnelType"
                       placeholder="请选择隧道类型"></hSelect>
            </el-form-item>

            <el-form-item label="单双洞类型:"
                          :rules="[{ required: true, message: '请选择单双洞类型'}]"
                          prop="singleDoubleType">
              <el-radio-group v-model="tunnelForm.singleDoubleType">
                <el-radio :label="1">单右洞</el-radio>
                <el-radio :label="2">单左洞</el-radio>
                <el-radio :label="3">双洞</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="车道数:"
                          prop="laneNums"
                          :rules="[{ required: true, message: '请输入车道数', trigger: 'blur' },]">
              <el-input v-model="tunnelForm.laneNums" type="digit" placeholder="请输入车道数"></el-input>
            </el-form-item>

            <el-form-item label="所属路段:"
                          prop="belongsStretch"
                          :rules="[{ required: true, message: '请输入所属路段', trigger: 'blur' },]">
              <el-input v-model="tunnelForm.belongsStretch"
                        placeholder="请输入路段名称"></el-input>
            </el-form-item>

            <el-form-item label="2D显示模式:"
                          :rules="[{ required: true, message: '请选择2D显示模式'}]"
                          prop="singleDoubleType">
              <el-radio-group v-model="tunnelForm.showMode">
                <el-radio :label="0">固定模式</el-radio>
                <el-radio :label="1">分段模式</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="限速:" prop="speedLimit">
              <div class="qzzh-ctn">
                <el-input v-model="tunnelForm.speedLimit"
                          type="number"
                          placeholder=""></el-input>
                <span class="sd">公里/时</span>
              </div>
            </el-form-item>

            <el-form-item label="隧道图片:"
                          :rules="[{ required: true, message: '请上传隧道图片'},]"
                          prop="tunnelPicture">
              <div class="qzzh-ctn" style="padding-bottom: 20px">
                <div class="upload-image">
                  <uploadImg busType="Tunnel" v-model="tunnelForm.tunnelPicture"></uploadImg>
                </div>
                <span class="sd" style="margin-left: 20px">建议分辩率：180*360</span>
              </div>
            </el-form-item>

            <el-form-item label="隧道描述:" prop="tunnelDescribe">
              <el-input type="textarea"
                        style="overflow:hidden; resize:none; "
                        :autosize="{ minRows: 2, maxRows: 20 }"
                        maxlength="300"
                        show-word-limit
                        placeholder="请输入隧道描述"
                        v-model="tunnelForm.tunnelDescribe">
              </el-input>
            </el-form-item>

          </div>

          <div class="form-items" v-if="[2,3].includes(tunnelForm.singleDoubleType)"
               style="padding-bottom: 10px">
            <IndexTipTitle title="左洞信息"></IndexTipTitle>
            <div class="j-w-ctn">
              <el-col :span="4">开始经度：</el-col>
              <el-col :span="8">
                <el-input type="number" v-model="tunnelForm.leftStartLatitude"
                          placeholder=""></el-input>
              </el-col>
              <el-col :span="4">开始纬度：</el-col>
              <el-col :span="2">
                <el-input type="number" v-model="tunnelForm.leftStartLongitude"
                          placeholder=""></el-input>
              </el-col>
            </div>
            <div class="j-w-ctn">
              <el-col :span="4">结束经度：</el-col>
              <el-col :span="8">
                <el-input type="number" v-model="tunnelForm.leftEndLatitude" placeholder=""></el-input>
              </el-col>
              <el-col :span="4">结束纬度：</el-col>
              <el-col :span="8">
                <el-input type="number" v-model="tunnelForm.leftEndLongitude" placeholder=""></el-input>
              </el-col>
            </div>
            <div class="j-w-ctn">
              <el-col :span="4">长度：</el-col>
              <el-col :span="8">
                <el-input v-model="tunnelForm.leftHoleLength" type="number" placeholder=""></el-input>
                <span class="sd">米</span>
              </el-col>
              <el-col :span="4">方向：</el-col>
              <el-col :span="8">
                <el-input v-model="tunnelForm.leftHoleDirection" placeholder=""></el-input>
              </el-col>
            </div>
            <div class="j-w-ctn stake">
              <el-col :span="4">起止桩号：</el-col>
              <el-col :span="12">
                K
                <el-input type="number" v-model.number="tunnelForm.startStakeMarkKm"
                          placeholder=""/>
                +
                <el-input type="number" v-model.number="tunnelForm.startStakeMarkM"
                          placeholder=""/>
                <span>~</span>
              </el-col>
              <el-col :span="12">
                K
                <el-input type="number" v-model="tunnelForm.endStakeMarkKm"
                          placeholder=""></el-input>
                +
                <el-input type="number" v-model="tunnelForm.endStakeMarkM"
                          placeholder=""></el-input>
              </el-col>
            </div>
          </div>

          <div class="form-items" v-if="[1,3].includes(tunnelForm.singleDoubleType)">
            <IndexTipTitle title="右洞信息"></IndexTipTitle>
            <div style="padding-bottom: 10px">

              <div class="j-w-ctn">
                <el-col :span="4">开始经度：</el-col>
                <el-col :span="8">
                  <el-input type="number" v-model="tunnelForm.rightStartLatitude"
                            placeholder=""></el-input>
                </el-col>
                <el-col :span="4">开始纬度：</el-col>
                <el-col :span="8">
                  <el-input type="number" v-model="tunnelForm.rightStartLongitude"
                            placeholder=""></el-input>
                </el-col>
              </div>
              <div class="j-w-ctn">
                <el-col :span="4">结束经度：</el-col>
                <el-col :span="8">
                  <el-input type="number" v-model="tunnelForm.rightEndLatitude"
                            placeholder=""></el-input>
                </el-col>
                <el-col :span="4">结束纬度：</el-col>
                <el-col :span="8">
                  <el-input type="number" v-model="tunnelForm.rightEndLongitude"
                            placeholder=""></el-input>
                </el-col>
              </div>
              <div class="j-w-ctn">
                <el-col :span="4">长度：</el-col>
                <el-col :span="8">
                  <el-input v-model="tunnelForm.rightHoleLength" type="number"
                            placeholder=""></el-input>
                  <span class="sd">米</span>
                </el-col>
                <el-col :span="4">方向：</el-col>
                <el-col :span="8">
                  <el-input v-model="tunnelForm.rightHoleDirection" placeholder=""></el-input>
                </el-col>
              </div>
              <div class="j-w-ctn stake">
                <el-col :span="4">起止桩号：</el-col>
                <el-col :span="12">
                  K
                  <el-input type="number" v-model.number="tunnelForm.startStakeMarkKmRight"
                            placeholder=""></el-input>
                  +
                  <el-input type="number" v-model.number="tunnelForm.startStakeMarkMRight"
                            placeholder=""></el-input>
                  <span>~</span>
                </el-col>
                <el-col :span="12">
                  K
                  <el-input type="number" v-model="tunnelForm.endStakeMarkKmRight"
                            placeholder=""></el-input>
                  +
                  <el-input type="number" v-model="tunnelForm.endStakeMarkMRight"
                            placeholder=""></el-input>
                </el-col>
              </div>
            </div>
          </div>

          <div class="form-items">
            <IndexTipTitle title="3D信息"></IndexTipTitle>
            <div class="j-w-ctn">
              <el-col :span="4">缩放比例：</el-col>
              <el-col :span="8">
                <el-input v-model="tunnelForm.lengthScale"
                          type="number"
                          placeholder=""/>
              </el-col>
            </div>
          </div>

          <div class="form-items">
            <IndexTipTitle title="其他信息"></IndexTipTitle>
            <div class="j-w-ctn">
              <el-col :span="4">排序：</el-col>
              <el-col :span="8">
                <el-input v-model="tunnelForm.sortInt"
                          type="number"
                          placeholder=""></el-input>
              </el-col>
              <el-col :span="4">是否启用：</el-col>
              <el-col :span="8">
                <el-switch v-model="tunnelForm.enableStatusName"></el-switch>
              </el-col>
            </div>
          </div>

          <div class="btm-textarea">
            <el-form-item label="备注:" prop="reamrks" style="margin-top: 22px;margin-left: 20px;">
              <el-input type="textarea"
                        maxlength="300"
                        :rows="2"
                        show-word-limit
                        placeholder="请输入备注信息"
                        v-model="tunnelForm.reamrks">
              </el-input>
            </el-form-item>
          </div>

          <el-form-item style="margin-top: 10px;margin-left: 20px;">
            <el-button type="primary" @click="submitForm('tunnelForm')">提交</el-button>
            <el-button @click="resetForm('tunnelForm')">重置</el-button>
          </el-form-item>

        </el-form>
      </div>
    </div>

    <OrganizePopup :showPopup="showOrganizePopup"
                   @handleClose="handleTipClose"
                   @btnCancel="handleTipClose"
                   @btnConfirm="subSelectedOrgan"
                   showButton
                   width="740px"
                   title="选择组织机构">
      <CascaderPopup :systemOrganization="systemOrganization"
                     @selectedOrganization="selectedOrganization"></CascaderPopup>
    </OrganizePopup>
  </form-page>
</template>

<script>
import hSelect from '../../components/h-select';
import IndexTipTitle from '../../components/index/tips-title';
import uploadImg from '../../components/basic/upload-img';

import OrganizePopup from '../../components/common-popup';
import CascaderPopup from '../../components/tunnel/cascader-selected';
import AddressInfo from '../../components/basic/address-info';

export default {
  name: 'add-tunnel',
  components: {
    hSelect,
    IndexTipTitle,
    OrganizePopup,
    CascaderPopup,
    uploadImg,
    AddressInfo
  },
  services: ['tunnel'],
  data() {
    return {
      tunnelForm: {
        laneNums: 2,     // 车道数
        cityId: '',          //城市Id
        id: '',
        tunnelPicture: '',
        tunnelType: '', // 隧道类型
        tunnelName: '',  //隧道名称
        organName: '',   //组织机构名,只做展示
        organizationId: '',  //组织机构id
        belongsStretch: '',  //所属路段
        speedLimit: '',      //限速
        startStakeMarkKm: '',    //开始桩号
        startStakeMarkM: '',    //开始桩号
        endStakeMarkKm: '',      //结束桩号
        endStakeMarkM: '',      //结束桩号
        startStakeMarkKmRight: '',    //右洞开始桩号
        startStakeMarkMRight: '',    //右洞开始桩号
        endStakeMarkKmRight: '',      //结束桩号
        endStakeMarkMRight: '',      //结束桩号
        startStakeMark: '',  //开始桩号
        endStakeMark: '',    //结束桩号
        tunnelDescribe: '',  //隧道描述
        singleDoubleType: 3, //单双洞类型
        singleDoubleTypeName: '',
        leftHoleLength: '',  //左洞长度
        leftStartLatitude: '',   //左洞开始经度
        leftStartLongitude: '',  //左洞开始维度
        leftEndLatitude: '',    //左洞结束经度
        leftEndLongitude: '',    //左洞结束纬度
        rightStartLatitude: '', // 右洞开始经度
        rightStartLongitude: '',// 右洞开始纬度
        rightEndLatitude: '',    //右洞结束经度
        rightEndLongitude: '',   //右洞结束纬度
        leftHoleDirection: '',   //左洞方向
        rightHoleLength: '',   //有洞长度
        rightHoleDirection: '',  //右洞方向
        showMode: 0,     //2D显示模式
        sortInt: '',     //排序
        enableStatusName: false,     //是否启用
        lengthScale: 0.25 // 3D缩放比例
      },
      showOrganizePopup: false,
      systemOrganization: [],  //组织机构
      selectedOrgan: {
        organName: '',
        organizationId: ''
      }

    };
  },

  computed: {
    singleDoubleTypeName() {
      switch (this.tunnelForm.singleDoubleType) {
        case 1:
          return '单右洞'
        case 2:
          return '单左洞'
        case 3:
          return '双洞'
      }
    },

    enableStatus() {
      return this.enableStatusName ? 1 : 0
    }
  },

  mounted() {
    //查询组织机构
    this.getSystemOrganization();
    let {type, id} = this.$route.query;

    if (type === 'edit' && id) {
      this.$service.tunnel.getById(id).then(res => {
        if (res.tunnelType) {
          res.tunnelType = String(res.tunnelType);
        }
        res.enableStatusName = res.enableStatus == 1 ? true : false;  //启用状态
        res.organName = res.organizationName || '';                  //组织机构名称
        // this.tunnelForm = res;

        for(const key in this.tunnelForm) {
          if (res[key] !== undefined && res[key] !== null) this.tunnelForm[key] = res[key]
        }
      });
      // console.log(this.$refs.hSelect.value)
      // debugger
    } else {
      //初始化表单模板
      this.initFormParam();
    }
  },
  methods: {
    //初始化表单模板
    initFormParam() {
      Object.assign(this.$data['tunnelForm'], this.$options.data()['tunnelForm'])
    },

    //解析数据反选到页面上
    selectInvertData(data) {
      let {singleDoubleType} = data;
    },

    //查询组织机构
    getSystemOrganization() {
      this.$service.tunnel.getSystemOrganization().then(res => {
        this.systemOrganization = res || [];
      });
    },

    selectedOrganization(data) {  //选择组织机构
      this.selectedOrgan.organName = data.name;
      this.selectedOrgan.organizationId = data.organizationId;
    },

    handleTipClose() {   //关闭或取消清空假模板
      this.selectedOrgan.organName = '';
      this.selectedOrgan.organizationId = '';
      this.showOrganizePopup = false;
    },

    subSelectedOrgan() { //赋予表单所属部门数据
      if (!this.selectedOrgan.organizationId) {
        return;
      }
      this.tunnelForm.organName = this.selectedOrgan.organName;
      this.tunnelForm.organizationId = this.selectedOrgan.organizationId;
      this.showOrganizePopup = false;
    },

    //提交表单
    submitForm(formName) {
      let tunnelForm = this.tunnelForm;
      if (this.tunnelForm.singleDoubleType !== 1 && (!tunnelForm.startStakeMarkKm || !tunnelForm.startStakeMarkM || !tunnelForm.endStakeMarkKm || !tunnelForm.endStakeMarkM)) {
        return this.$ctx.toastError('请填写左洞桩号!');
      }
      if (this.tunnelForm.singleDoubleType !== 2 && (!tunnelForm.startStakeMarkKmRight || !tunnelForm.startStakeMarkMRight || !tunnelForm.endStakeMarkKmRight || !tunnelForm.endStakeMarkMRight)) {
        return this.$ctx.toastError('请填写右洞桩号!');
      }
      if (tunnelForm.singleDoubleType === 2) {    // 单左洞
        if (!tunnelForm.leftStartLatitude || !tunnelForm.leftStartLongitude) {
          this.$ctx.toastError('请填写完整左洞经纬度信息!');
          return;
        }
      } else if (tunnelForm.singleDoubleType === 1) {     // 单右洞
        if (!tunnelForm.rightEndLatitude || !tunnelForm.rightEndLongitude) {
          this.$ctx.toastError('请填写完整右洞经纬度信息!');
          return;
        }
      } else if (tunnelForm.singleDoubleType === 3) {     // 双洞
        if (!tunnelForm.leftStartLatitude || !tunnelForm.leftStartLongitude || !tunnelForm.rightEndLatitude || !tunnelForm.rightEndLongitude) {
          this.$ctx.toastError('请填写完整左右洞经纬度信息!');
          return;
        }
      }

      this.$refs[formName].validate((valid) => {
        if (!valid) return;
        this.$confirm('确定提交？', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          showClose: false
        }).then(() => {
          this.handleParams();
        });
      });
    },

    //重置表单
    resetForm() {
      this.$confirm('确定清除数据？', '提示', {
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false
      }).then(() => {
        this.initFormParam();
      });
    },

    // 提交表单
    handleParams() {
      this.tunnelForm.cityName = this.$refs.city.getSelectedName();
      this.tunnelForm.singleDoubleTypeName = this.singleDoubleTypeName
      this.tunnelForm.enableStatus = this.enableStatus

      //隧道类型
      let selectedType = this.$refs.hSelect.options;
      if (Array.isArray(selectedType)) {
        selectedType.forEach(item => {
          if (item.value === this.tunnelForm.tunnelType) {
            //隧道类型中文名
            this.tunnelForm.tunnelTypeName = item.name;
          }
        });
      }

      // console.log('最终参数：', this.tunnelForm);

      let {type, id} = this.$route.query;

      if (type === 'edit' && id) {
        //更新隧道信息
        this.$service.tunnel.upDateTunnelInfo(this.tunnelForm).then(res => {
          this.$notifySuccess();
          this.$router.go(-1);
        });
        return;
      }

      //新增隧道信息
      this.$service.tunnel.addTunnelInfo(this.tunnelForm).then(res => {
        this.$notifySuccess();
        this.$router.go(-1);
      });
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .org input::-webkit-outer-spin-button,
/deep/ .org input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/deep/ .org input[type='number'] {
  -moz-appearance: textfield;
}

/deep/ .el-form-item__error {
  left: 20px !important;
}

img {
  height: 100%;
  width: 100%
}

::-webkit-scrollbar {
  display: none !important;
}

.form-items {
  margin-top: 30px;
  padding-bottom: 20px;
}

.el-col-4 {
  text-align: right;
}

/deep/ .btm-textarea .el-form-item__label {
  margin-left: -20px;
}

.org {
  padding-bottom: 1px;
  position: relative;
  height: 100%;
  background: linear-gradient(180deg, rgba(24, 38, 113, 1) 0%, rgba(24, 38, 113, 0.2) 100%);
  border-radius: 6px 6px 0px 0px;

  .add-tunnel-ctn {
    padding-top: 20px;
    margin-left: 30px;

    /deep/ .el-input {
      width: 224px;
    }

    /deep/ .el-form-item__label {
      width: 120px !important;
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #C1D9FF;
    }

    /deep/ .el-form-item__label:before {
      color: #FF0000;
    }

    /deep/ .el-input__inner {
      width: 100%;
      background-color: #123A84;
      border: none;
    }

    /deep/ .el-input__inner {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      // color: #2B63CA;
    }

    /deep/ .el-textarea {
      width: 448px;

      .el-textarea__inner {
        width: 100%;
        min-height: 96px !important;
        padding-bottom: 2px;
        background-color: #123A84;
        border: none;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #2B63CA;
      }

      .el-input__count {
        background: none;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #337CF3;
      }
    }

    /*   /deep/ .el-textarea__inner{
           width: 100%;
           min-height: 96px;
           background-color: #123A84;
           border: none;
       }*/

    /deep/ .el-radio__label {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #C1D9FF;
    }

    .zdy-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 32px;
      width: 224px;
      border-radius: 4px;
      font-size: 14px;
      color: #C1D9FF;
      font-family: PingFangSC-Regular, PingFang SC;
      background-color: #123A84;
      padding-left: 12px;
      padding-right: 10px;
    }

    .qzzh-ctn {
      position: relative;
      overflow: hidden;
      color: #C1D9FF;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;

      .upload-image {
        // height: 104px;
        // width: 104px;
      }
    }

    /deep/ .qzzh-ctn > .el-input {
      width: 60px;
      margin-left: 6px;
      margin-right: 6px;
    }

    .sd {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      margin-left: 10px;
      color: #337CF3;
    }
  }
}


.page-bg {
  margin-left: 20px;
  margin-right: 20px;
  width: calc(100% - 40px);
  padding-bottom: 20px;
  display: flex;
  justify-content: center;

  .page-ctn {
    width: 800px;
    background-color: #fff;
    padding-bottom: 40px;

    .model-title {
      padding-top: 2px;
      padding-bottom: 2px;
      border-left: 4px solid blue;
      padding-left: 10px;
    }
  }
}

.qzzh-ctn, .j-w-ctn {
  display: flex;
  align-items: center;

  span {
    margin-left: 10px;
    margin-right: 10px
  }

  /deep/ .el-input {
    width: 100px !important;
  }
}

.j-w-ctn {
  margin-top: 20px;
  margin-left: 40px;
  display: flex;
  align-items: center;
  font-size: 16px;
  width: 500px;
  color: #C1D9FF;

  &.stake {
    width: 640px;
  }
}

.j-w-title {
  margin-left: 60px;
}

/deep/ .el-upload-list--picture-card .el-upload-list__item {
  height: 104px;
  width: 104px;
}
</style>
