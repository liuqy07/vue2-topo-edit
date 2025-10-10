<template>
  <div id="itemPanel" ref="itemPanel" :class="{ hidden: itemVisible }">
    <div class="icon-tool">
      <div>
        <h3 class="grouptitle" style="border-bottom: 1.5px solid #dcdee2">
          <i class="el-icon-circle-plus-outline"></i>
          网元组件
        </h3>
        <div class="group">
          <div
            v-for="(item, index) of imgurl"
            :key="index"
            class="node"
            draggable="true"
            data-label=""
            :data-img="item.imgsrc"
            data-shape="img-node"
            :data-width="item.width"
            :data-height="item.height"
            :data-level="item.level"
          >
            <img
              :src="getSvg(item.imgsrc)"
              alt=""
              :style="{ width: item.width }"
              @dblclick="changeImg(item)"
            />
            <el-tooltip
              class="item"
              effect="light"
              :content="item.level.toUpperCase()"
              placement="right"
            >
              <span>{{ item.level.toUpperCase() }}</span>
            </el-tooltip>

            <span>{{ item.title }}</span>
          </div>
          <div>
            <!-- <svg-icon slot="prefix" icon-class="addIcon" /> -->
            <i class="el-icon-plus svg-icon" @click="openAddicon"></i>
          </div>
        </div>
        <!-- 容器组件 -->
        <h3 class="grouptitle">
          <i class="el-icon-circle-plus-outline"></i>
          分组组件
        </h3>
        <div class="group grouptwo">
          <div
            class="node"
            draggable="true"
            data-label=""
            data-shape="base-combo"
          >
            <svg class="svgcom">
              <circle
                cx="60"
                cy="28"
                r="28"
                style="stroke-dasharray: 3 2"
                class="cricle"
              />
            </svg>
          </div>

          <div
            class="node"
            draggable="true"
            data-label=""
            data-shape="base-combo-rect"
          >
            <svg class="svgcom">
              <rect
                x="20"
                y="0"
                width="50"
                height="50"
                style="stroke-dasharray: 3 2"
                class="cricle"
              />
            </svg>
          </div>
        </div>
        <!-- 云团组件 -->
        <h3 class="grouptitle">
          <i class="el-icon-circle-plus-outline"></i>
          云团组件
        </h3>
        <div class="group groupthree">
          <div
            class="node"
            draggable="true"
            data-label=""
            data-shape="img-cloud"
            data-img="@/assets/images/topo/vector.png"
          >
            <img src="@/assets/images/topo/vector.png" alt="" />
            <span>CN2</span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <!-- <el-dialog
        :close-on-click-modal="false"
        custom-class="dialogimg"
        title="图片修改"
        :append-to-body="true"
        :modal-append-to-body="true"
        :visible.sync="Visible"
        width="500px"
        :before-close="dialogClose"
        :show-close="true"
        top="15vh !important"
      >
        <el-form ref="formName" :model="form" :rules="rules" :label-width="formLabelWidth">
          <el-form-item label="图片宽度" prop="width">
            <el-input-number v-model="form.width" size="mini" label="输入宽度"></el-input-number>
          </el-form-item>
          <el-form-item label="图片高度" prop="height">
            <el-input-number v-model="form.height" size="mini" label="输入宽度"></el-input-number>
          </el-form-item>
          <el-form-item label="设备层级" prop="name">
            <el-select v-model="form.name" placeholder="请选择设备层次" filterable clearable allow-create>
              <el-option v-for="dict in dict.type.rm_device_layer" :key="dict.value" :label="dict.value + '/' + dict.label" :value="dict.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片层级" prop="remark">
            <el-select v-model="form.remark" placeholder="请选择图片层级" filterable clearable @change="changedata">
              <el-option v-for="(dict, index) in imgTypeList" :key="index" :label="dict" :value="dict"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图片选择" prop="path">
            <el-select v-model="form.path" class="selectImg" size="small" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label }}</span>
                <img :src="item.valueSrc" alt="" style="float: right; color: #8492a6; width: 30px; height: 35px; margin-top: 0px" />
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="small" @click="dialogClose">取 消</el-button>
          <el-button size="small" type="primary" @click="submitForm">确 定</el-button>
        </div>
      </el-dialog> -->
    </div>
  </div>
</template>

<script>
// import { getSattic } from '../../components/data/static.js'
// import { editIcon } from "@/api/topo.js";
// import imglist from '@/views/ifitTopo/template/static/static.js'
// import { addIcon, editIcon } from '@/api/ifitTopo/template.js'

export default {
  name: "ItemPanel",
  // dicts: ["rm_device_layer"],
  // inject: ["getIcon"],
  data() {
    return {
      itemVisible: false,
      imgurl1: [
        // {
        //   id: "c0f53f9851d04d36876e23a5e4b70f30",
        //   revision: 0,
        //   imgsrc: "computer.png",
        //   width: 40,
        //   height: 35,
        //   level: "COMPUTER",
        //   remark: "COMPUTER",
        // },
        {
          id: "9c55d207693442e3a65684b75b96cc13",
          revision: 2,
          imgsrc: "sw_5.png",
          width: 40,
          height: 35,
          level: "CYW-SW",
          remark: "SW",
        },
        {
          id: "829650791b064b0cbbad950bd3b02623",
          revision: 3,
          imgsrc: "mse_9.png",
          width: 40,
          height: 35,
          level: "CYW-MSE",
          remark: "MSE",
        },
        {
          id: "67fb704832744b3e928c69df2f869121",
          revision: 7,
          imgsrc: "olt_1.png",
          width: 40,
          height: 35,
          level: "OLT",
          remark: "OLT",
        },
        {
          id: "bb3bad766b5b49cd9569f922ecc00aba",
          revision: 3,
          imgsrc: "p_1.png",
          width: 40,
          height: 35,
          level: "pUP",
          remark: "P",
        },
        {
          id: "f92ff04967054b6889f63baff5966322",
          revision: 1,
          imgsrc: "spine_1.png",
          width: 40,
          height: 35,
          level: "SPINE",
          remark: "SPINE",
        },
        {
          id: "f8d70da46fb94711a9af607e3fb03e38",
          revision: 1,
          imgsrc: "firewall.png",
          width: 40,
          height: 35,
          level: "FIREWALL",
          remark: "FIREWALL",
        },
        {
          id: "4dbb419743b14ec293db903e56597944",
          revision: 2,
          imgsrc: "asbr_5.png",
          width: 40,
          height: 35,
          level: "CYW-ASBR",
          remark: "ASBR",
        },
        {
          id: "ec2ed6b765c1467e8bfb97974afee1db",
          revision: 0,
          imgsrc: "board_leaf_6.png",
          width: 40,
          height: 35,
          level: "BORDERLEAF",
          remark: "BORDERLEAF",
        },
        {
          id: "977c4f7c91bf48229656b48e5052df19",
          revision: 1,
          imgsrc: "cr_4.png",
          width: 40,
          height: 35,
          level: "CYW-CR",
          remark: "CR",
        },
        {
          id: "d4a60c2d8e7a46659d668e92f38cd461",
          revision: 0,
          imgsrc: "ipran_a_6.png",
          width: 40,
          height: 35,
          level: "IPRAN_A",
          remark: "IPRANA",
        },
        {
          id: "949459cc7f4f49119a20cad58de64e39",
          revision: 1,
          imgsrc: "ipran_u_9.png",
          width: 40,
          height: 35,
          level: "IPRAN-U",
          remark: "IPRANU",
        },
        {
          id: "ec0deda727c54fffa72cb25aa2cc3d6a",
          revision: 1,
          imgsrc: "er_5.png",
          width: 40,
          height: 35,
          level: "AL_ER",
          remark: "ER",
        },
        {
          id: "922fb095e053414d8dc67815d1b9246b",
          revision: 1,
          imgsrc: "sr_3.png",
          width: 40,
          height: 35,
          level: "CYW-SR",
          remark: "SR",
        },
        {
          id: "b133009349494d039131e0255c6d5e6f",
          revision: 5,
          imgsrc: "dsw_3.png",
          width: 40,
          height: 35,
          level: "CYW-SW",
          remark: "DSW",
        },
        {
          id: "d6a093b781d44f39a5c6486e33b6b834",
          revision: 1,
          imgsrc: "bras_5.png",
          width: 40,
          height: 35,
          level: "CYW-BAS",
          remark: "BRAS",
        },
        {
          id: "f20265aac0f44059a90f6a34d6e865cb",
          revision: 0,
          imgsrc: "ce_6.png",
          width: 40,
          height: 35,
          level: "IPRAN_CE",
          remark: "CE",
        },
        {
          id: "e8ecd6a1219743baa9224b60efc7f012",
          revision: 0,
          imgsrc: "sr_2.png",
          width: 40,
          height: 35,
          level: "CYW-SR",
          remark: "SR",
        },
        {
          id: "4afed3eed56a47ceb59f4ef37798af05",
          revision: 0,
          imgsrc: "rr_4.png",
          width: 40,
          height: 35,
          level: "RR",
          remark: "RR",
        },
        {
          id: "793ad6f9216a47a79694ca7ba568507a",
          revision: 0,
          imgsrc: "pe_9.png",
          width: 40,
          height: 35,
          level: "PE",
          remark: "PE",
        },
        {
          id: "cddd2ce742e345498ca69d66b2569fb3",
          revision: 3,
          imgsrc: "dcgw_2.png",
          width: 40,
          height: 30,
          level: "DCGW",
          remark: "DCGW",
        },
        {
          id: "c237c167a98e43d5bb1a16d256d81ab1",
          revision: 2,
          imgsrc: "er_5.png",
          width: 40,
          height: 35,
          level: "MAN_ER",
          remark: "ER",
        },
        {
          id: "efaddf7923fd472cb06804708d6fdfb8",
          revision: 2,
          imgsrc: "dc_leaf_6.png",
          width: 40,
          height: 35,
          level: "DCLEAF",
          remark: "DCLEAF",
        },
        {
          id: "b65979edd76a47fa8382fcc5e58b0a10",
          revision: 2,
          imgsrc: "s_leaf_2.png",
          width: 40,
          height: 30,
          level: "SLEAF",
          remark: "SLEAF",
        },
        // {
        //   id: "c417d484e6e049c8bbf6ce24dbd73ec2",
        //   revision: 1,
        //   imgsrc: "basestation.png",
        //   width: 35,
        //   height: 60,
        //   level: "BASESTATION",
        //   remark: "BASESTATION",
        // },
        // {
        //   id: "a4e4dc0a78d44a2d8007f0ef0a44b823",
        //   revision: 0,
        //   imgsrc: "server.png",
        //   width: 40,
        //   height: 35,
        //   level: "SERVER",
        //   remark: "SERVER",
        // },
        {
          id: "963c0d8648c146f0b084530db8aa408b",
          revision: 1,
          imgsrc: "ipran_b_1.png",
          width: 40,
          height: 35,
          level: "IPRAN_B",
          remark: "IPRANB",
        },
        {
          id: "eeb7de44c426487699a155c64395856b",
          revision: 1,
          imgsrc: "a_leaf_8.png",
          width: 40,
          height: 35,
          level: "ALEAF",
          remark: "ALEAF",
        },
        {
          id: "6dd6eae7946e4f3ab19045b215cb5659",
          revision: 6,
          imgsrc: "ce_7.png",
          width: 40,
          height: 35,
          level: "IPRAN_CE",
          remark: "CE",
        },
      ],
      //   imglistAll: imglist.imglistAll,
      Visible: false,
      formLabelWidth: "80px",
      addType: "add",
      form: {
        id: "",
        revision: "",
        width: 40,
        height: 35,
        path: "",
        level: "",
        remark: "",
        name: "",
        type: "image",
        section: "node",
      },
      rules: {
        width: [{ required: true, message: "宽度是必填", trigger: "blur" }],
        height: [{ required: true, message: "高度是必填", trigger: "change" }],
        name: [
          { required: true, message: "设备层级是必填", trigger: "change" },
        ],
        remark: [
          { required: true, message: "图片层级是必填", trigger: "change" },
        ],
        path: [{ required: true, message: "图片为必填", trigger: "change" }],
      },
    };
  },
  computed: {
    imgurl() {
      const imgurl = this.imgurl1 ?? [];
      return imgurl.map((item) => {
        return item;
      });
    },

    // imgTypeList() {
    //   const arr = this.imglistAll.map((item) => item.remark)
    //   return [...new Set(arr)]
    // },
    // options() {
    //   return this.imglistAll
    //     .filter((item) => item.remark == this.form.remark)
    //     .map((item) => {
    //       return {
    //         label: item.imgsrc.replace('.png', ''),
    //         value: item.imgsrc,
    //         valueSrc: (process.env.BASE_URL + 'svg/' + item.imgsrc).replace('.png', '.svg')
    //       }
    //     })
    // }
  },

  mounted() {
    setTimeout(()=>{
     this.init();
    },500)
    
    // this.getqueryIcon()
  },

  methods: {
    getSvg(imgsrc) {
      console.log("imgsrc",imgsrc)
      // return require('@@/vue2-topo-edit/img/163.png')
      const path = imgsrc.replace('.png', '.svg')
      return  require(`@/assets/images/svg/${path}`)
        //  const url =  process.env.NODE_ENV === 'production' ? ( 'svg/' + imgsrc).replace('.png', '.svg'): `../../assets/images/svg/${imgsrc.replace('.png', '.svg')}`
        // if( process.env.NODE_ENV === 'production'){
        //   return url
        // }else{
        //  return new URL(`${url}`, import.meta.url).href
        // }
        
    },
    // getqueryIcon() {
    //   this.getIcon();
    // },
    changedata(item) {
      this.form.path = "";
      // this.options.filter((item1) => {
      //   if (item == item1.value) {
      //     return item
      //   }
      // })
      // this.form.path = imginfo[0].imgsrc;
      // this.form.path = imginfo[0].value;
    },

    submitForm() {
      this.$refs["formName"].validate((valid) => {
        if (valid) {
          this.submitFormdialog();
        }
      });
    },

    submitFormdialog() {
      //   const obj = {
      //     ...this.form
      //   }
      //   if (this.addType == 'add') {
      //     delete obj.revision
      //     addIcon(this.form).then(({ code }) => {
      //       this.Visible = false
      //       this.$modal.msgSuccess('新增成功')
      //       this.getqueryIcon()
      //     })
      //   } else if (this.addType == 'edit') {
      //     editIcon(obj).then(({ code }) => {
      //       if (code == '200') {
      //         this.Visible = false
      //         this.$modal.msgSuccess('修改成功')
      //         this.getqueryIcon()
      //       }
      //     })
      //   }
    },
    dialogClose() {
      this.$refs["formName"].resetFields();
      this.Visible = false;
    },
    changeImg(item) {
      this.form = {
        id: item.id,
        revision: item.revision,
        width: item.width,
        height: item.height,
        name: item.level,
        path: item.imgsrc,
        remark: item.remark,
      };
      this.Visible = true;
      this.addType = "edit";
    },
    init() {
      this.$nextTick(() => {
        this.bindevent();
      });
    },

    dragstartFn(event, target) {
      const shape = target.getAttribute("data-shape");
      const label = target.getAttribute("data-label");
      const fill = target.getAttribute("fill");
      const width = target.getAttribute("data-width");
      const height = target.getAttribute("data-height");
      const level = target.getAttribute("data-level");
      const img = target.getAttribute("data-img");
      event.dataTransfer.setData(
        "dragComponent",
        JSON.stringify({ label, shape, fill, img, width, height, level })
      );
    },

    bindevent() {
      const iconTool = this.$refs.itemPanel.querySelector(".icon-tool");
      this.handleDragStart = (event) => {
        let target = event.target;
        if (target.classList.contains("node")) {
          this.dragstartFn(event, target);
        } else if (event.target.parentNode.classList.contains("node")) {
          target = event.target.parentNode;
          this.dragstartFn(event, target);
        }
      };
      iconTool.addEventListener("dragstart", this.handleDragStart);
      this.preventDrop = (e) => e.preventDefault();
      document.addEventListener("drop", this.preventDrop);
    },

    openAddicon() {
      this.addType = "add";
      this.resetFrom();
      this.Visible = true;
    },
    resetFrom() {
      this.form.id = "";
      this.form.revision = "";
      this.form.width = 40;
      this.form.height = 35;
      this.form.name = "";
      this.form.path = "";
      this.form.level = "";
      this.form.remark = "";
    },
  },
};
</script>

<style lang="scss" scoped>
#itemPanel {
  // position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 250px;
  height: auto;
  background: #fff;
  transition: transform 0.3s ease-in-out;
  border-right: 1.5px solid #dcdee2;

  .icon-tool {
    width: 250px;
    .group {
      padding: 12px 12px;
      display: flex;
      flex-wrap: wrap;
      max-height: 450px;
      overflow: auto;
      div {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0px 0px;
      }
      .cricle {
        fill: #f8fafe;
        stroke: #999;
        stroke-width: 1;
      }
      /* 整体滚动条 */
      &::-webkit-scrollbar-track-piece {
        background: #d3dce6;
      }
      &::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #ededed;
        border-radius: 0px;
      }
      &::-webkit-scrollbar {
        width: 7px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 0px;
        background-image: -webkit-linear-gradient(
          45deg,
          rgba(255, 255, 255, 0.2) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255, 255, 255, 0.2) 50%,
          rgba(255, 255, 255, 0.2) 75%,
          transparent 75%,
          transparent
        );
      }
    }
    .grouptitle {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      text-align: left;
      background: #ededed;
      position: relative;
      left: 0;
      width: 100%;
      height: 32px;
      color: #666;
      font-weight: 700;
      font-size: 12px;
      line-height: 32px;
      i {
        display: inline;
        font-size: 16px;
        margin-right: 5px;
      }
    }

    .node {
      display: block;
      margin-bottom: 6px;
      cursor: move;
      display: inline-block;
      width: 20%;
      img {
        width: 36px;
        height: 36px;
      }
      span {
        font-size: 12px;
        cursor: auto;
        margin-top: 6px;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        text-align: center;
      }
    }
    .grouptwo {
      div {
        flex-direction: row;
      }
      .svgcom {
        width: 100%;
        height: 100%;
        display: inline-block;
      }
      .node {
        width: 50%;
        height: 70px;
      }
    }
    .groupthree {
      .node {
        width: 50%;
        justify-content: center;
        align-items: center;
        position: relative;
      }
      img {
        width: 100px;
        height: auto;
      }
      span {
        position: absolute;
        top: 15%;
        font-size: 14px;
      }
    }

    .svg-icon {
      width: 36px;
      height: 36px;
      text-align: center;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d2d7de;
    }
  }
}

.el-tooltip__popper.is-light {
  padding: 6px;
}

.el-select-dropdown .el-select-dropdown__item {
  height: 40px;
  line-height: 40px;
}

.dialogimg {
  .el-dialog__body {
    padding: 20px 20px;
  }
  .el-form-item {
    margin-bottom: 18px;
    .el-select {
      width: 100%;
    }
  }
}
</style>
