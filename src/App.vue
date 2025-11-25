<template>
  <div id="app">
    <vue2TopoEdit />
    <div style="width: 100%; height: 300px">
      <graphTopo
        :graph.sync = 'graphTopo'
     
        :config="config"
        @node:click="nodeClick"
        @node:dblclick="nodedbClick"
        @register="register"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
  components: {},
  provide() {
    return {
      registerG6: this.register,
      setSates: this.setSates
    };
  },
  data() {
    return {
      graphTopo: {},
      config:{},
      // renderData: {
      //   nodes: [
      //     {
      //       id: "132154_015230016028",
      //       label: "SD-JN-SHMJ-A.LEAF-2.MCN.CX600-X8A-1",
      //       ip: "150.139.0.212",
      //       layer: "IPRAN_B",
      //       // img: 'ipran_b_1.png',
      //       radio: 1,
      //       imgSouce: require("@/assets/images/svg/163.svg"),
      //       type: "img-node",
      //       style: {
      //         width: 45,
      //         height: 38,
      //         cursor: "move",
      //         sourceAnchor:0,
      //         targetAnchor:0,
      //       },
      //       // x:100,
      //       // y:100,
      //     },
      //     {
      //       id: "132154_150139000011",
      //       label: "SD-JN-SHMJ-A.LEAF-2.MCN.CX600-X8A-1",
      //       ip: "150.139.0.212",
      //       layer: "IPRAN_B",
      //       // img: 'ipran_b_1.png',
      //       radio: 1,
      //       imgSouce: require("@/assets/images/svg/163.svg"),
      //       type: "img-node",
      //       style: {
      //         width: 45,
      //         height: 38,
      //         cursor: "move",
      //       },
      //       //  x:300,
      //       //  y: 100,
      //     },
      //   ],
      //   edges: [
      //     {
      //       source: "132154_015230016028",
      //       target: "132154_150139000011",
      //       offset: -10,
      //       label: "1111",
      //       labelCfg: {
      //         autoRotate: true,
      //         refY: 10,
      //       },
      //       type: "",
      //       dire: "positive",
      //       mainBak: "main",
      //       style: {
      //         lineDash: undefined,
      //         stroke: "#409eff",
      //         endArrow: {
      //           path: "M 0,0 L 8,4 L 7,0 L 8,-4 Z",
      //           fill: "#409eff",
      //           stroke: "#409eff",
      //         },
      //       },
      //     },
      //     {
      //       source: "132154_150139000011",
      //       target: "132154_015230016028",
      //       offset: 10,
      //       label: "2222",
      //       labelCfg: {
      //         autoRotate: true,
      //         refY: -10,
      //       },
      //       type: "",
      //       dire: "positive",
      //       mainBak: "main",
      //       style: {
      //         lineDash: undefined,
      //         stroke: "red",
      //         endArrow: {
      //           path: "M 0,0 L 8,4 L 7,0 L 8,-4 Z",
      //           fill: "red",
      //           stroke: "red",
      //         },
      //       },

      //       // type: 'custom-edge'
      //     },
      //   ],
      // },
      // config: {
      //   layout: " ",
      //   defaultEdge: {
      //     type: "line-edge", // polyline
      //     style: {
      //       stroke: "red",
      //       lineAppendWidth: 10, // 防止线太细没法点中
      //       startArrow: false,
      //       endArrow: {
      //         path: "M 0,0 L 8,4 L 7,0 L 8,-4 Z",
      //         fill: "#aab7c3",
      //         stroke: "#aab7c3",
      //       },
      //     },
      //   },
      // },
    };
  },
  methods: {
    nodeClick(...arg) {
      console.log("22", arg[0].item.get('id')); 
      // alarmMiddle //alarmMiddle
      const id = arg[0].item.get('id')
       let item = this.graphTopo.findById(id);
      if (item.hasState("nodeState:alarmMiddle")) {
        item.setState("nodeState:alarmMiddle", false);
      } else {
        item.setState("nodeState:alarmMiddle", true);
      }

    },
    nodedbClick(...arg) {

    },
    register(){},
    
    setSates(name, value, graphNode) {
    //  const group = graphNode.get('group')
    //  const image = group.get('children')[1]
    //  const node = group.getChildByIndex(0)
    //  const width = group.cfg.item._cfg.model.width ? group.cfg.item._cfg.model.width : group.cfg.item._cfg.model.style.width
    //  const height = group.cfg.item._cfg.model.height ? group.cfg.item._cfg.model.height : group.cfg.item._cfg.model.style.height
    
    // if (value) {
    //   const textStyle =  {}
    //   //  选中元素增加背景和动画
    //     node.animate(
    //       (ratio) => {
    //         const diff = ratio <= 0.5 ? ratio * 10 : (1 - ratio) * 10
    //         // 返回这一帧需要变化的参数集，这里只包含了半径
    //         return {
    //           r: (group.cfg.item._cfg.model.width + 4) / 2 + diff
    //         }
    //       },
    //       {
    //         repeat: true,
    //         duration: 3000,
    //         easing: 'easeCubic'
    //       }
    //     )
    //     image.animate(
    //       (ratio) => {
    //         const diff = ratio <= 0.5 ? ratio * 10 : (1 - ratio) * 10
    //         // 返回这一帧需要变化的参数集，这里只包含了半径
    //         return {
    //           width: width / 1.05 + diff,
    //           height: height / 1.05 + diff
    //         }
    //       },
    //       {
    //         repeat: true,
    //         duration: 3000,
    //         easing: 'easeCubic'
    //       }
    //     )
    // } else {
    //     const textStyle = {}
    //     image.stopAnimate()
    //     node.stopAnimate()
    //     image.attr('width', width)
    //     image.attr('height', height)
    //   }

    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
