<template>
  <div class="root" style="width: 100%; height: 100%;">
    <el-button type="primary" @click="clickgraph"> 123123 </el-button>
    <item-panel class="itemPanel" :imgurl="imgurl"  />
    <div :id="domId" ref="canvasPanel" class="canvasPanel" @dragover.prevent />

    <el-drawer title="属性面板"  :visible.sync="configVisible">
      <div id="configPanel">
        <el-collapse v-model="activeNames" v-if="configType == 'node'">
          <solt>
            <el-collapse-item title="设备信息" name="1"> </el-collapse-item>
          </solt>
          <el-collapse-item title="图片设置" name="2">
            <div class="form-item">
              <label>宽度</label>
              <el-input v-model="node.width" size="small"></el-input>
            </div>
            <div class="form-item">
              <label>高度</label>
              <el-input v-model="node.height" size="small"></el-input>
            </div>
            <div class="form-item">
              <!-- <label>图片地址</label> <el-input size="small"></el-input> -->
              <label>图片地址</label>
              <el-select v-model="node.img" placeholder="请选择">
                <el-option
                  v-for="(itemimglist, index) in imglistAll"
                  :key="index"
                  :label="itemimglist.level"
                  :value="itemimglist.imgsrc"
                  :change="changeingsrc(itemimglist)"
                >
                  <span style="float: left">{{ itemimglist.level }}</span>
                  <img
                    :src="getImageUrl(itemimglist.imgsrc)"
                    alt=""
                    style="
                      float: right;
                      color: #8492a6;
                      width: 20px;
                      margin-top: 10px;
                    "
                  />
                </el-option>
              </el-select>
            </div>
          </el-collapse-item>
          <el-collapse-item title="标题设置" name="3">
            <div class="form-item">
              <label>标题</label>
              <el-input v-model="node.label" size="small"></el-input>
            </div>
            <div class="form-item">
              <label>字体大小</label>
              <el-input
                v-model="labelCfg.style.fontSize"
                size="small"
              ></el-input>
            </div>
            <div class="form-item">
              <label>文本颜色</label>
              <el-input v-model="labelCfg.style.fill" size="small"></el-input>
            </div>
            <div class="form-item">
              <label>文本描边</label>
              <el-input v-model="labelCfg.style.stroke" size="small"></el-input>
            </div>
          </el-collapse-item>
        </el-collapse>

        <el-collapse v-else-if="configType == 'edge'">
          <el-collapse-item title="线条设置">
            <div class="form-item">
              <label>线条颜色</label>
              <el-input v-model="line.style.stroke" size="small"></el-input>
            </div>

            <div class="form-item">
              <label>曲线样式</label>
              <el-input v-model="line.style.lineDash" size="small"></el-input>
            </div>

            <div class="form-item">
              <label>标题</label>
              <el-input v-model="line.label" size="small"></el-input>
            </div>
            <div class="form-item">
              <label>字体大小</label>
              <el-input
                v-model="labelCfgLine.style.fontSize"
                size="small"
              ></el-input>
            </div>
            <div class="form-item">
              <label>文本颜色</label>
              <el-input
                v-model="labelCfgLine.style.fill"
                size="small"
              ></el-input>
            </div>
          </el-collapse-item>
        </el-collapse>

        <el-collapse v-else-if="configType == 'combo'">
          <el-collapse-item title="组件设置">
            <div class="form-item">
              <label>标题</label>
              <el-input v-model="combo.label" size="small"></el-input>
            </div>
            <div class="form-item">
              <label>标题位置</label>
              <el-select
                v-model="labelCfgCombo.position"
                class="m-2"
                placeholder="Select"
                size="small"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

            <div class="form-item">
              <label>对齐方式</label>
              <el-input
                v-model="labelCfgCombo.style.textAlign"
                size="small"
              ></el-input>
            </div>

            <div class="form-item">
              <label>上下偏移量</label>
              <el-input v-model="labelCfgCombo.refY" size="small"></el-input>
            </div>
            <div class="form-item">
              <label>左右偏移量</label>
              <el-input v-model="labelCfgCombo.refX" size="small"></el-input>
            </div>

            <div class="form-item">
              <label>字体大小</label>
              <el-input
                v-model="labelCfgCombo.style.fontSize"
                size="small"
              ></el-input>
            </div>
            <div class="form-item">
              <label>文字颜色</label>
              <el-input
                v-model="labelCfgCombo.style.stroke"
                size="small"
              ></el-input>
            </div>

            <div class="form-item">
              <label>背影填充色</label>
              <el-input v-model="combo.style.fill" size="small"></el-input>
            </div>
          </el-collapse-item>
        </el-collapse>

        <div class="footerBtn">
          <el-button @click="configVisible = false">取消</el-button>
          <el-button class="save" @click="save">保存</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import G6 from "@antv/g6";
import registerFactory from "../../components/graph/graph";
import ItemPanel from "./ItemPanel.vue";
import topoData from "./data";
// import data from "./data.js";
import { imglistAll as imglistAll1, imgurl } from "../static/static";
// import { reactive, toRaw } from "vue";

// import Vue from 'vue'
// import ElementUI from 'element-ui';
// Vue.use(ElementUI);

export default {
  name: "graphVue",
  props: {
    isEdit: {
      type: Boolean,
      default: ()=>{
        return true
      }
    },
    imgurl: {
      type: Array,
      default: () => {
        return imgurl;
      },
    },
    domId: {
      type: String,
      default: () => {
        return "canvasPanel";
      },
    },
    width: {
      type: String,
    },
    height: {
       type: String,
    }
  },
  components: {
    ItemPanel,
  },
  data() {
    return {
      // isEdit: true,
      
      imglistAll1: imglistAll1,
      dropCombo: false,
      graph: {},
      options: [
        {
          label: "top",
          value: "top",
        },
        {
          label: "bottom",
          value: "bottom",
        },
        {
          label: "left",
          value: "left",
        },
        {
          label: "right",
          value: "right",
        },
      ],
      combo: {
        size: [60, 60],
        width: 60,
        height: 60,
        stroke: "#999",
        fill: "#F8FAFE",
        style: {
          stroke: "#999",
          fill: "#F8FAFE",
          lineWidth: 1,
          lineDash: [1, 2],
        },
        label: "",
      },
      line: {
        label: "",
        style: {
          lineDash: [1, 0],
          stroke: "",
          lineWidth: "",
        },
      },

      labelCfg: {
        style: {
          fontSize: 12,
          fill: "",
          fontWeight: 400,
          stroke: "",
        },
      },

      labelCfgLine: {
        style: {
          // refX: undefined,
          // refY: undefined,
          fontSize: 12,
          position: "",
          fill: "#1890ff",
          autoRotate: false,
        },
      },

      labelCfgCombo: {
        position: "top",
        refX: undefined,
        refY: undefined,
        style: {
          fontSize: 12,
          fill: "",
          stroke: "",
          textAlign: "center",
        },
      },
      configType: "node",

      node: {
        label: "",
        width: 40,
        height: 35,
        stroke: "",
        img: "",
      },
      activeNames: 1,
      configVisible: false,
      isMouseDown: false,
      config: "",
      tooltip: "",
      top: 0,
      left: 0,
    };
  },
  computed: {
    configData() {
      return {
        ...this.node,
        labelCfg: this.labelCfg,
      };
    },
    configcomboData() {
      let labelCfgCombo = JSON.parse(JSON.stringify(this.labelCfgCombo));
      for (const key in labelCfgCombo) {
        if (key == "refX" || key == "refY") {
          labelCfgCombo[key] = Number(labelCfgCombo[key]);
        }
      }
      console.log("labelCfgCombo", labelCfgCombo);
      return {
        ...this.combo,
        labelCfg: labelCfgCombo,
      };
    },

    configLineData() {
      let labelCfgLine = JSON.parse(JSON.stringify(this.line.style));
      let lineDash = labelCfgLine?.lineDash ?? undefined;
      if (lineDash) {
        if (Object.prototype.toString.call(lineDash) == "[object String]") {
          labelCfgLine.lineDash = JSON.parse(lineDash);
        }
      }
      return {
        label: this.line.label,
        style: {
          ...labelCfgLine,
        },
        labelCfg: this.labelCfgLine,
      };
    },
    imglistAll() {
      return this.imglistAll1.filter((item) => {
        return item.level == this.node.level;
      });
    },
    comboRef() {
      return (
        this.labelCfgCombo.position === "top" ||
        this.labelCfgCombo.position === "bottom"
      );
    },
  },
  mounted() {
    // 创建画布
    this.$nextTick(() => {
      this.createGraphic();
      this.initGraphEvent();
    });
  },
  beforeUnmount() {
    this.graph.destroy();
  },
  methods: {
    clickgraph() {
      let graphdata = this.graph.save();
      this.$emit("saveTopo", graphdata);
      console.log("graphdata", graphdata);
      
      // console.log("S", graphdata, this.graph.getNodes());
    },
    getImageUrl(name) {
      return  require(`/src/assets/images/topo/${name}`)
    },
    changeingsrc() {},
    deepToRaw(obj) {
      let arr = ["wdith", "height", "refX", "refY"];
      if (!obj || typeof obj !== "object") {
        for (const key1 in obj) {
          if (arr.includes(key1)) obj[key1] = Number(obj[key1]);
        }
        return obj;
      }

      const rawObj = Array.isArray(obj) ? [] : {};
      for (const key in obj) {
        rawObj[key] = this.deepToRaw(obj[key]);
      }
      return rawObj;
    },
    createGraphic() {
      const vm = this;
      const grid = new G6.Grid();
      const menu = new G6.Menu({
        offsetX: 5,
        offsetY: 5,
        itemTypes: ["node", "edge", "combo"],
        getContent() {
          const outDiv = document.createElement("div");
          outDiv.className = "contextmenu";
          outDiv.style.cursor = "pointer";
          outDiv.innerHTML = `
            <li id="editNode"> 编辑节点 </li>
            <li id="deleteNode"> 删除节点 </li>
           `;
          return outDiv;
        },
        handleMenuClick(target, item) {
          const { id } = target;

          if (id) {
            vm[id](item);
          }
        },
      });
      const minimap = new G6.Minimap({
        size: [200, 100],
        position: "bottom-right",
        delegateStyle: {
          fill: "#f5f5f5",
          stroke: "#c2c8cc",
        },
      });
      const cfg = registerFactory(
        G6,
        {
          width: this.$refs.canvasPanel.innerwidth,
          height: this.$refs.canvasPanel.innerHeight,
          groupByTypes: true,
          // renderer: 'svg',
          layout: {
            type: "", // 位置将固定
          },
          defaultCombo: {
            type: "base-combo-rect",
          },
          modes: {
            // 支持的 behavior
            default: [
              "drag-shadow-node",
              "canvas-event",
              "drag-canvas",
              "delete-item",
              "hover-node",
              "hover-combo",
              "drag-canvas",
              "drag-node",
              "drag-combo",
              "collapse-expand-combo",
            ],
            originDrag: [
              {
                type: "canvas-event",
                enableDrop: true,
              },
              "drag-shadow-node",
              "drag-node",
              "canvas-event",
              "delete-item",
              "hover-node",
              "drag-combo",
              // "select-combo",
            ],
          },
          plugins: this.isEdit? [menu, minimap, grid] : [menu, minimap],
          // ... 其他G6原生入参
        },
        this
      );
      this.graph = new G6.Graph(cfg);
      this.graph.read(topoData); // 读取数据
    },

    isOutsideCombo(point, combo) {
      if (!combo || !point) return true;
      // 考虑 Combo 的 padding 和折叠状态
      const bbox = combo.getBBox();
      const padding = combo.getModel().padding || 0;
      return !(
        point.x >= bbox.minX - padding &&
        point.x <= bbox.maxX + padding &&
        point.y >= bbox.minY - padding &&
        point.y <= bbox.maxY + padding
      );
    },

    // 初始化图事件
    initGraphEvent() {
      this.graph.on("on-node-dragend", (e) => {
        const model = e.item.getModel();
        const comboId = model.comboId;
        const combo = this.graph.findById(comboId); // 自定义方法判断所属Combo
        const point = this.graph.getPointByClient(e.clientX, e.clientY);
        if (this.isOutsideCombo(point, combo)) {
          if (!combo) return;
          // combo.removeChild(e.item);
          this.$nextTick(() => {
            this.graph.refreshItem(combo);
            this.graph.updateComboTree(combo);
            let { r } = combo._cfg.sizeCache;
            if (r > 250) {
              this.graph.removeItem(e.item);
              model.id = this.guid();
              model.comboId = "";
              this.graph.addItem("node", model);
            }
          });
        }
      });

      this.graph.on("drop", (e) => {
        if (this.dropCombo) return;
        const { originalEvent } = e;
        if (originalEvent.dataTransfer) {
          const transferData =
            originalEvent.dataTransfer.getData("dragComponent");

          if (transferData) {
            this.addNode(transferData, e);
          }
        }
      });

      this.graph.on("combo:drop", (e) => {
        const { originalEvent } = e;

        if (originalEvent.dataTransfer) {
          const transferData =
            originalEvent.dataTransfer.getData("dragComponent");
          if (transferData) {
            let id = e.item.get("id");
            this.dropCombo = true;
            this.addNode(transferData, e, id);
            setTimeout(() => {
              this.dropCombo = false;
              this.graph.updateCombo(id);
            }, 1000);
          }
        }
      });

      this.graph.on("node:drop", (e) => {
        e.item.getOutEdges().forEach((edge) => {
          edge.clearStates("edgeState");
        });
      });

      // 鼠标拖拽到画布外时特殊处理
      this.graph.on("mousedown", () => {
        this.isMouseDown = true;
      });

      this.graph.on("mouseup", () => {
        this.isMouseDown = false;
      });

      this.graph.on("canvas:mouseleave", () => {
        this.graph.getNodes().forEach((x) => {
          const group = x.getContainer();

          group.clearAnchor();
          x.clearStates("anchorActived");
        });
      });

      this.graph.on("on-node-mousemove", (e) => {
        if (e && e.item) {
          this.tooltip = e.item.get("model").id;
          this.left = e.clientX + 20;
          this.top = e.clientY - 0;
        }
      });

      this.graph.on("on-node-mouseleave", (e) => {
        if (e && e.item) {
          this.tooltip = "";
          if (e && e.item) {
            e.item.getOutEdges().forEach((edge) => {
              edge.clearStates("edgeState");
            });
          }
        }
      });

      this.graph.on("before-node-removed", ({ target, callback }) => {
        console.log(target);
        setTimeout(() => {
          // 确认提示
          callback(true);
        }, 1000);
      });

      // this.graph.on("after-node-dblclick", (e) => {
      //   if (e && e.item) {
      //     console.log(e.item);
      //   }
      // });

      // this.graph.on("after-edge-selected", (e) => {
      //   this.configVisible = !!e;

      //   if (e && e.item) {
      //     this.config = e.item.get("model").id;

      //     this.graph.updateItem(e.item, {
      //       // shape: 'line-edge',
      //       style: {
      //         radius: 10,
      //         lineWidth: 2,
      //       },
      //     });
      //   }
      // });

      // this.graph.on("on-edge-mousemove", (e) => {
      //   if (e && e.item) {
      //     this.tooltip = e.item.get("model").label;
      //     this.left = e.clientX + 40;
      //     this.top = e.clientY - 20;
      //   }
      // });

      // this.graph.on("on-edge-mouseleave", (e) => {
      //   if (e && e.item) {
      //     this.tooltip = "";
      //   }
      // });

      this.graph.on(
        "before-edge-add",
        ({ source, target, sourceAnchor, targetAnchor }) => {
          console.log(source, target);
          setTimeout(() => {
            this.graph.addItem("edge", {
              id: `${+new Date() + (Math.random() * 10000).toFixed(0)}`, // edge id
              source: source.get("id"),
              target: target.get("id"),
              sourceAnchor,
              targetAnchor,
              label: "",
              labelCfg: {
                style: {
                  refX: "",
                  refY: "",
                  position: "",
                  autoRotate: false,
                },
              },
              // label:  'edge label',
            });
          }, 100);
        }
      );
    },

    deleteNode(item) {
      this.graph.removeItem(item);
    },
    async editNode(e) {
      await this.$nextTick();
      this.configVisible = true;
      this.visible = true;
      let model = e?._cfg.model;
      let type = e?._cfg.type;
      this.configType = type;
      let lineDash;
      switch (type) {
        case "node":
          this.node = Object.assign(this.node, model);
          this.labelCfg = Object.assign(this.labelCfg, model.labelCfg);
          break;
        case "edge":
          lineDash = this.configLineData?.style?.lineDash ?? [];

          this.line = Object.assign(this.configLineData, model);
          this.line.style.lineDash = JSON.stringify(lineDash);
          console.log("this.line", this.line, this.labelCfgLine);

          break;
        case "combo":
          this.combo = Object.assign(this.configcomboData, model);
          break;
        default:
          break;
      }
    },
    async save() {
      await this.$nextTick();
      const configType = this.configType;
      let model, combo;
      switch (configType) {
        case "node":
          model = this.deepToRaw(this.configData);
          this.graph.updateItem(this.node.id, model);
          break;
        case "edge":
          console.log("this.line", this.line);
          model = this.configLineData;
          console.log("model======>", model);

          this.graph.updateItem(this.line.id, model);
          break;
        // 可以有多个 case
        case "combo":
          model = this.deepToRaw(this.configcomboData);
          console.log("model======>1", model);

          this.graph.updateItem(this.combo.id, model);
          combo = this.graph.findById(this.combo.id);
          this.$nextTick(() => {
            this.graph.refreshItem(combo);
            this.graph.updateCombo(combo);
          });

          break;

        default:
        // 当 expression 不匹配任何 case 时执行的代码
      }
      this.configVisible = false;
    },
    // 添加节点
    addNode(transferData, { x, y }, comboId = "") {
      let shape = (JSON.parse(transferData)?.shape ?? "").toLocaleLowerCase();

      if (!shape.includes("combo")) {
        this.addimgNode(transferData, { x, y }, comboId);
      } else {
        this.addcombo(transferData, { x, y }, comboId);
      }
    },

    addimgNode(transferData, { x, y }, comboId) {
      let {
        label,
        shape = "img-node",
        fill,
        img,
        width,
        height,
        level,
      } = JSON.parse(transferData);
      const model = {
        id: this.guid(),
        comboId: comboId,
        level,
        label: label ? label : " ",
        labelCfg: {
          style: {
            fontSize: 12,
            fill: "",
            fontWeight: 400,
            stroke: "",
          },
        },
        //   counts: [12, 11], //一般问题 和严重问题的数量
        width: Number(width),
        height: Number(height),
        type: shape,
        img: img,
        style: {
          fill: fill || "",
          width: Number(width),
          height: Number(height),
        },
        // 坐标
        x,
        y,
      };

      const newNode = this.graph.addItem("node", model);
      this.graph.updateLayout({ refresh: true });

      return newNode;
    },

    addcombo(transferData, { x, y }) {
      let {
        label,
        shape = "img-node",
        // fill,
        width = 200,
        height = 200,
      } = JSON.parse(transferData);

      let model = {
        id: this.guid(),
        type: shape,
        // padding: [10, 10],
        size: [width === null ? 100 : width, height === null ? 100 : height],
        width: width,
        height: height,
        stroke: "#999",
        fill: "#F8FAFE",
        style: {
          stroke: "#999",
          fill: "#F8FAFE",
          lineWidth: 1,
          lineDash: [1, 2],
        },
        label: label,
        labelCfg: {
          position: "top",

          style: {
            fontSize: 12,
            fill: "#1890ff",
            stroke: "#1890ff",
            textAlign: "center",
          },
        },
        x,
        y,
      };
      let combo = this.graph.addItem("combo", model);
      let combo1 = this.graph.findById(combo.get("id"));
      let comboNode = JSON.parse(transferData);
      comboNode.shape = "img-node";
      comboNode.label = " ";

      // const modelNode = {
      //   id: this.guid(),
      //   comboId: combo.get("id"),
      //   level: "OLT",
      //   label: " ",
      //   labelCfg: toRaw(this.labelCfg),
      //   width: 40,
      //   height: 40,
      //   type: "img-node",
      //   img: "olt_1.png",
      //   style: {
      //     fill: "",
      //     width: 40,
      //     height: 40,
      //   },
      //   // 坐标
      //   x,
      //   y,
      // };
      //  this.addimgNode(JSON.stringify(comboNode), { x, y }, combo1);
      // this.graph.addItem("node", modelNode);
      this.$nextTick(() => {
        this.graph.updateCombo(combo1);
        setTimeout(() => {
          combo1.setState("anchorShow", false);
        }, 100);
      });

      //刷新拖入的当前分组容器
    },

    guid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.root {
  display: flex;
  position: relative;
  width: 100%;
  height: 100%; //calc(100vh - 50px);
  .itemPanel {
    flex-basis: 300px;
  }
  .canvasPanel {
    flex: 1;

    ::v-deep(.g6-component-contextmenu) {
      padding: 0px;
      .contextmenu {
        padding: 10px 2px;
        font-size: 14px;
        text-align: left;
        display: flex;
        flex-direction: column;
        li {
          flex: 1;
          margin: 0px;
          list-style: none;
          text-align: left;
          padding: 5px 10px;
        }
        li:hover {
          background: #ededed;
        }
      }
    }
  }
  .hidden {
    display: none;
  }
  ::v-deep(.g6-minimap) {
    position: absolute;
    right: 0;
    bottom: 0;
    background: #fff;
  }

  #configPanel {
    background: white;
    height: 100%;
    padding: 10px;

    .form-item {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      label {
        flex-basis: 80px;
      }
    }
  }
  .footerBtn {
    margin-top: 10px;
    text-align: center;
  }
}
/* 提示框的样式 */
.g6-tooltip {
  position: fixed;
  top: 0;
  left: 0;
  font-size: 12px;
  color: #545454;
  border-radius: 4px;
  border: 1px solid #e2e2e2;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: rgb(174, 174, 174) 0 0 10px;
  padding: 10px 8px;
}
</style>
