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
            :data-shape="item?.type ?? 'img-node'"
            :data-width="item.width"
            :data-height="item.height"
            :data-level="item.level"
          >
            <img :src="getImageUrl(item.imgsrc)" alt="" :style="{ width: item.width }" />
            <el-tooltip
              class="item"
              effect="light"
              :content="item.level.toUpperCase()"
              placement="bottom"
            >
              <span>{{ item.level.toUpperCase() }}</span>
            </el-tooltip>
            <span>{{ item.title }}</span>
          </div>
          <div>
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
            data-label="123123"
            data-shape="base-combo"
            data-width="65"
            data-height="65"
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
            data-label=" "
            data-shape="base-combo-rect"
            data-width="100"
            data-height="100"
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
  </div>
</template>

<script>

export default {
  name: "ItemPanel1",
  props: {
    imgurl: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  created() {
    this.getqueryIcon();
  },

  computed: {

  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    const iconTool = this.$refs.itemPanel?.querySelector(".icon-tool");
    if (iconTool) {
      // 移除时使用同一个函数引用
      iconTool.removeEventListener("dragstart", this.handleDragStart);
    }
    if (this.preventDrop) {
      document.removeEventListener("drop", this.preventDrop);
    }
  },
  methods: {
    getImageUrl (name){
      // return new URL(`/svg/${name}`, import.meta.url).href
     return '@/assets/svg/' + name.replace('.png', '.svg')
    },
    getqueryIcon() {
      // this.$store.dispatch("SET_IMGURL",this.imgurl)
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
  width:  100%;
  height: auto;
  background: #fff;
  transition: transform 0.3s ease-in-out;
  border-right: 1.5px solid #dcdee2;

  .icon-tool {
    width: 100%;
    .group {
      padding: 12px 12px;
      display: flex;
      flex-wrap: wrap;
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
        height: auto;
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
</style>
