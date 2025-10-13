/**
 * @author claude
 * @date 2020/3/15
 * @description 注册基础edge, 其他edge都在此基础上继承和扩展
 */

import animation from "./edge-animations";
import itemEvents from "../nodes/item-event";
import hvh_h from "./hvh-h.js";
import hvh from "./hvh.js";

/*
 * flow:
 * 继承 edge => 绘制edge => 设置edge状态
 */

function drawShape(cfg, group) {
  const { startPoint, endPoint } = cfg;
  group.running = false;
  group.runners = [];
  // 当前配置覆盖全局配置
  const shapeStyle = Object.assign({}, this.getShapeStyle(cfg), {
    ...cfg.edgeStateStyles,
  });
  const keyShape = group.addShape("path", {
    className: "edge-shape",
    name: "edge-shape",
    attrs: shapeStyle,
  });

  
  if (cfg.visible == 0) {
  
    // 如果是断开状态显示红色X
    const image = group.addShape("image", {
      attrs: {
        x: (startPoint.x + endPoint.x) / 2 - 10, // 居中
        y: (startPoint.y + endPoint.y) / 2 - 10,
        width: 20,
        height: 20,
        img: '', //require("@/assets/images/topo/topo_new/interrupt.png"),
        zIndex: 100,
   
        clipCfg: {
          show: false,
          type: "circle",
          r: 50,
        },
      },
      zIndex: 10,
      draggable: true,
    });
    group.sort();
    image.toFront();
    group.toFront
  }
  const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);

  // let labelText =  group.addShape('text', {
  //   name: 'myText',
  //   attrs: {
  //     text: '',
  //     x: (startPoint.x + endPoint.x) / 4,
  //     y: (startPoint.y + endPoint.y) / 2 ,
  //     fontSize: 10,
  //     textAlign: 'center',
  //     textBaseline: 'middle',
  //     fill: '#000',
  //     labelAutoRotate:true,
  //   },
  // });
  // labelText.toFront();
  return keyShape;
}
// function afterUpdate(cfg, group) {
  // console.log("cfg",cfg)
  // const { startPoint, endPoint } = cfg;
  // const statusGroup = group._cfg.group.getChildren().filter(ele => ele.get("name") === "myText");
  // const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
  // if (statusGroup.length > 0) {
  //   statusGroup[0].attrs.x = (startPoint.x + endPoint.x) / 4;
  //   statusGroup[0].attrs.y = (startPoint.y + endPoint.y) / 2;
  //   statusGroup[0].toFront();
  // }
// }

function setState(name, value, item, type) {
  const buildInEvents = [
    "edgeState",
    "edgeState:default",
    "edgeState:selected",
    "edgeState:hover",
    "edgeState:alarm-urgent",
    "edgeState:alarm-jam",
    "edgeState:alarm-serious",
    "edgeState:alarm-general",
    "edgeState:alarm-normal",
    "edgeState:alarm-deafult",
    "edgeState:alarm-deafult-reverse",
    "selected",
  ];
  const group = item.getContainer();
  if (group.get("destroyed")) return;
  if (buildInEvents.includes(name)) {
    // 内部this绑定到了当前item实例
    if (name == "edgeState:alarm-urgent") {
      itemEvents["edgeState:alarm"].call(this, value, group, {
        stroke: "#ed4014",
        lineWidth: "1.5",
      });
    } else if (name == "edgeState:alarm-jam") {
      itemEvents["edgeState:jam"].call(this, value, group, {
        stroke: "l(0) 0:#1c946e  0.5:#f26222  1:#1890ff",
        lineWidth: "1",
      });
    } else if (name == "edgeState:alarm-serious") {
      itemEvents["edgeState:alarm"].call(this, value, group, {
        stroke: "#ff9900",
        lineWidth: "2",
      });
    } else if (name == "edgeState:alarm-general") {
      itemEvents["edgeState:alarm"].call(this, value, group, {
        stroke: "#f0dc4d",
        lineWidth: "1",
      });
    }else if (name == "edgeState:alarm-deafult") {
      itemEvents["edgeState:alarm-deafult"].call(this, value, group, 'Forward') 
    }else if (name == "edgeState:alarm-deafult-reverse") {
      itemEvents["edgeState:alarm-deafult"].call(this, value, group, 'reverse') 
    }
     else {
      itemEvents[name].call(this, value, group);
    }
  } else if (this.stateApplying) {
    this.stateApplying.call(this, name, value, item);
  } else {
    console.warn(`warning: edge ${name} 事件回调未注册!`);
  }
}

function runAnimate(group, animationType, store) {
  if (group.running) {
    stopAnimate(group, animationType);
  }
  group.running = true;
  group.toFront();
  animation[animationType].run.call(this, group, store);
}

// 停止动画并删除动画元素
function stopAnimate(group, animationType, store) {
  animation[animationType].stop.call(this, group, store);
}



// 继承方法
function inheritEdge(G6, name) {

  G6.registerEdge(
    `${name}-edge`,
    {
      drawShape,
      // update,
      // afterUpdate,
      setState,
      runAnimate,
      stopAnimate,
    },
    name
  );
}

export default (G6) => {
  const edgeArray = ["line", "polyline", "quadratic", "cubic", "arc"];

  edgeArray.forEach((edge) => {
    inheritEdge(G6, edge);
  });

  hvh(G6, {
    drawShape,
    // update,
    // afterUpdate,
    setState,
    runAnimate,
    stopAnimate,
  });
  hvh_h(G6, {
    drawShape,
    // update,
    // afterUpdate,
    setState,
    runAnimate,
    stopAnimate,
  });
};
