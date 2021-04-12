<template>
  <div>
    <el-form :inline="true">
      <el-row>
        <el-form-item prop="resolutionPower" label="分辨率">
          <el-select
            filterable
            class="content-play-select"
            v-model="playDetail.resolutionPower"
            clearable
            placeholder="选择分辨率"
          >
            <el-option
              v-for="item in resolutionPowerArr"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="playDetail.templetName"
            placeholder="请输入内容"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="updateTpls"
            >查询</el-button
          >
          <el-button type="primary" @click="insert">新增</el-button>
          <el-button type="primary" @click="addcofig">确认</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <div class="flex">
      <div>
        <el-table
          :data="tplList"
          ref="multipleTable"
          border
          height="550px"
          tooltip-effect="dark"
          @selection-change="tplSelectionChange"
        >
          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column prop="templetName" label="名称">
            <template slot-scope="scope">
              <div class="tpl-item">
                <el-button
                  type="text"
                  size="small"
                  @click="openChange(scope.row)"
                >
                  {{ scope.row.templetName || scope.row.text }}</el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="resolutionPower" label="分辨率">
            <template slot-scope="scope">
              <div class="tpl-item">
                {{ scope.row.resolutionPower }}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="templetName" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                icon="el-icon-edit"
                size="small"
                @click="handleClick(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="deleteClick(scope.row)"
                icon="el-icon-delete-solid"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <live
        :live="textObj"
        :imgUrls="imgUrls"
        :resolutionPower="resolutionPower"
        :mode="templateType"
        :textArr="textArr"
        :orginBmps="bmps"
        :idx="idx"
        @imgChange="imgChange"
        ref="live"
        class="live"
      ></live>
    </div>
    <popup
      :width="$getPx(872)"
      :title="title"
      v-if="addCafagfalog"
      :show-popup="addCafagfalog"
      @handleClose="addCafagfalog = false"
     
    >
      <modalAdd ref="modalAdds"  @close="close"></modalAdd>
    </popup>
  </div>
</template>
<script>
import live from "./editor/live.vue";
import modalAdd from "./modal-add";
export default {
  name: "operater",
  components: {
    live,
    modalAdd,
  },
  computed: {
    title() {
      return this.isEdit ? '编辑节目' : '新增节目'
    },
  },
  services: ["_2d"],
  props: {
    tunnelId: String,
  },
  data() {
    return {
      addCafagfalog: false,

      resolutionPowerArr: JSON.parse(
        localStorage.getItem("resolutionPower") || "[]"
      ),

      playDetail: {
        templetName: "",
        resolutionPower: "",
      },
      modalObjarr: [],
      idx: 1,
      tplList: [],
      textObj: {},
      imgUrls: "",
      templateType: "",
      textArr: [],
      bmps: [],
      resolutionPower: '96*48',
      live: {},
      isEdit:null,
    };
  },
  watch: {
    tunnelId: {
      handler(obj) {
        this.updateTpls();
      },
      deep: true,
    },
  },
  mounted() {
    this.updateTpls();
  },
  methods: {
    // select(selection, row) {
    //   if (selection.length > 1) {
    //     let del_row = selection.shift();
    //     this.$refs.multipleTable.toggleRowSelection(del_row, false);
    //   }
    // },
    // selectAll(selection) {
    //   if (selection.length > 1) {
    //     selection.length = 1;
    //   }
    // },
    //新增
    insert(){
      this.addCafagfalog =true;
      this.isEdit= null;
    },
    //编辑
    handleClick(row){
      this.addCafagfalog =true;
      this.isEdit = row.id;
      this.$nextTick(()=>{
        this.$refs.modalAdds.opens(row)
      },100) 
      
    },
    close(even){
      this.addCafagfalog=even;
      this.updateTpls();
    },
    imgChange() {},
    openChange(val) {
      // if (val.length === 0) {
      //   return;
      // }
      let live = JSON.parse(val.templetText || {});
      this.textObj = live;
      //console.log(live)
      this.resolutionPower = live.resolutionPower;
      this.textArr = [live.text];
    },
    tplSelectionChange(val) {
      this.modalObjarr = val;
    },
    deleteClick(row) {
      let id = row.id; 
      this.$service._2d.deleteInfoBoardTmp(id).then(() => {
        this.updateTpls();
        this.$notifySuccess();
      });
    },

    //updateDevices() {
    // 更新设备
    //   this.$service._2d
    //     .getTunnelDeviceTypeList(this.tunnelId, "intelligenceboard")
    //     .then((res) => {
    //       this.deviceList = res.map((v, i) => {
    //         return { index: i + 1, ...v };
    //       });

    //       if (this.deviceList.length > 0)
    //         this.getBoardDeviceInfo(this.deviceList[0].id);
    //     });
    // },
    addcofig() {
      console.log(this.modalObjarr)
      this.$emit("modalObj", this.modalObjarr);
    },
    updateTpls() {
      // 更新模板resolutionPower
      this.$service._2d
        .getInfoBoardTmpList(this.tunnelId, this.playDetail)
        .then((res) => {
          this.tplList = res.map((v, i) => {
            return { ...v };
          });
        });
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .el-table {
  width: 700px;
}
.live {
  margin: auto;
}
</style>
