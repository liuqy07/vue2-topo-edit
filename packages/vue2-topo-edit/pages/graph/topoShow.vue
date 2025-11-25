<template>
  <div class="root" style="width: 100%; height: 100%">
    <el-button @click="saveGraph">123123</el-button>
    <div :id="domId" ref="canvasPanel" class="canvasPanel" @dragover.prevent />
  </div>
</template>
<script>
import G6 from "@antv/g6";
import events from "@@/vue2-topo-edit/components/graph/shape/nodes/defealtNodeSates";
import registerFactory from "../../components/graph/graph";
import topoData from "./data";

export default {
  name: "graphTopo",
  inject: {
    registerG6: {
      default: () => {
        console.warn("父组件未提供registerG6event方法");
        return () => {}; // 返回空函数避免调用时报错
      },
    },
    setSates: {
      default: () => {
        return undefined;
      },
    },
  },
  props: {
    graph: {
      type: Object,
      default: () => {
        return {};
      },
    },
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    domId: {
      type: String,
      default: () => {
        return "canvasPanel";
      },
    },
    renderData: {
      type: Object,
      default: () => {
        return {
          nodes: [],
          edges: [],
        };
      },
    },
  },
  data() {
    return {
      graphInstance: {},
    };
  },

  mounted() {
    // 创建画布
    this.$nextTick(() => {
      this.createGraphic(this.config);
      this.initEvents();
    });
  },
  beforeUnmount() {
    this.graphInstance.destroy();
    this.$emit("update:graph", undefined);
  },
  computed: {
    topoData() {
      return this.renderData.nodes.length > 0 ? this.renderData : topoData;
    },
    registerObj() {
      return {
        isEdit: false,
        getSates: this.getSates,
      };
    },
  },
  methods: {
    saveGraph() {},
    // 修改自定义元素的sataets 可以根据不同的需要配置不同的状态值
    getSates(name, value, item) {
      this.setSates ? this.setSates(name, value, item) : "";
      const nodeState = [
        "nodeState:selected",
        "nodeState:hover",
        "nodeState:alarmLow",
        "nodeState:alarmMiddle",
        "nodeState:alarmHigh",
      ];
      if (nodeState.includes(name)) {
        const group = item.getContainer();
        if (group.get("destroyed")) return;
        events[name].call(this, value, group, name);
      } else {
        console.warn("未注册该事件");
      }
    },
    createGraphic(config = {}) {
      this.registerG6(G6);
      const cfg = registerFactory(
        G6,
        Object.assign(
          {
            width: this.$refs.canvasPanel.innerwidth,
            height: this.$refs.canvasPanel.innerHeight,
            groupByTypes: true,
            layout: {
              type: "", // 位置将固定
            },
            defaultEdge: {
              type: "line-edge", // polyline
              style: {
                stroke: "#ecf3ff",
                lineAppendWidth: 10, // 防止线太细没法点中
                startArrow: false,
                endArrow: false,
              },
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
            },
          },
          config
        ),
        this.registerObj
      );
      this.graphInstance = new G6.Graph(cfg);
      this.$emit("update:graph", this.graphInstance);
      this.graphInstance.read(this.topoData); // 读取数据
    },
    initEvents() {
      Object.keys(this.$listeners).forEach((eventName) => {
        this.graphInstance.on(eventName, (...arg) => {
          this.$emit(eventName, ...arg);
        });
      });
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
  ::v-deep(.g6-minimap) {
    position: absolute;
    right: 0;
    bottom: 0;
    background: #fff;
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
