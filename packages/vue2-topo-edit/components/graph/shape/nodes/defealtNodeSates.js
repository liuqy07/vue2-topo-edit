/**
 * @author claude
 * @date 2018/3/24
 * @description 通通来自于 behavior 里注册的事件
 */

// import defaultStyles from '../defaultStyles';

/**
 * @description 恢复节点/边/锚点默认样式
 */

// import store from '@/store'
import G6 from "@antv/g6";

function setStyle(item, nodeStyle, text, textStyle) {
  //   item.attr(nodeStyle);
  if (text) {
    text.attr(textStyle);
  }
}

function getItemStyle(type, group, state) {
  const item = group.get("item");
  const attrs = group.cfg.item._cfg.styles;

  let originStyle =
    type === "node"
      ? item.get("originStyle")
      : item.get("originStyle")["edge-shape"];
  let activeStyle = attrs[`${type}State:${state}`];
  let defaultStyle = attrs[`${type}State:default`];
  if (type === "edge" && defaultStyle && defaultStyle.lineWidth == null) {
    defaultStyle.lineWidth = 1;
  }
  // 当传入的对象是combo的时候，获取
  return {
    activeStyle,
    defaultStyle,
    originStyle,
  };
}

const events = {
  "nodeState:selected"(value, group) {
    const node = group.cfg.children.find(
      (item) => item.attrs.className == "ImageNode"
    );
    const text = group.cfg.children.find((item) => item.cfg.type == "text");

    if (value) {
      const { activeStyle, defaultStyle, originStyle } = getItemStyle.call(
        null,
        "node",
        group,
        "selected"
      );
      if (!activeStyle) return;
      const textStyle =
        activeStyle.labelCfg && activeStyle.labelCfg.style
          ? activeStyle.labelCfg.style
          : {};
      setStyle(undefined, undefined, text, textStyle);
      const rect = group
        .getChildren()
        .find((item) => item.cfg.name == "rectexternal");
      if (rect) {
        return false;
      }

      const img = group.$getItem();
      let { width = 50, height = 50 } = img.attrs;
      width = width + 18;
      height = width + 18;
      group.addShape("rect", {
        attrs: {
          className: "rectexternal",
          x: -width / 2 - 1,
          y: -height / 2 - 1,
          width: width + 2,
          height: height + 2,
          stroke: activeStyle?.stroke ?? "#1890ff",
          fill: activeStyle?.fill ?? "#E5F7FF",
          opacity: "1",
          lineWidth: 1,
          lineDash: [3, 3],
        },
        name: "rectexternal",
        draggable: true,
      });
      const rect1 = group
        .getChildren()
        .find((item) => item.cfg.name == "rectexternal");
      rect1.toBack();
    } else {
      const rect = group
        .getChildren()
        .find((item) => item.cfg.name == "rectexternal");
      if (rect) {
        rect ? rect.remove() : "";
      }
    }
  },

  "nodeState:hover"(value, group) {
    const node = group.cfg.children.find(
      (item) => item.attrs.className == "ImageNode"
    );
    const text = group.cfg.children.find((item) => item.cfg.type == "text");
    if (value) {
      const { activeStyle } = getItemStyle.call(this, "node", group, "hover");
      if (!activeStyle) return;
      const textStyle =
        activeStyle.labelCfg && activeStyle.labelCfg.style
          ? activeStyle.labelCfg.style
          : {};
      setStyle(node, activeStyle, text, textStyle);
      const rect = group
        .getChildren()
        .find((item) => item.cfg.name == "circleeEternal");
      if (rect) {
        return false;
      }
      const img = group.$getItem();
      let { width = 50, height = 50 } = img.attrs;
      const r = width > height ? width / 2 : height / 2;
      //  debugger
      // group.addShape("circle", {
      //   attrs: {
      //     className: "circleeEternal",
      //     x: -width / 2 + r,
      //     y: -height / 2 + r,
      //     r: r + 20,
      //     stroke: activeStyle?.stroke ?? "#1890ff",
      //     fill: activeStyle?.fill ?? "#E5F7FF",
      //     opacity: "1",
      //     lineWidth: 1,
      //     lineDash: [3, 3],
      //   },
      //   name: "circleeEternal",
      //   draggable: true,
      // });
      // const rect1 = group.getChildren().find((item) => item.cfg.name == "circleeEternal");
      // rect1.toBack();
      node.animate(
        (ratio) => {
          const scale = 1 + ratio * 0.2; // 缩放范围1~1.5
          return {
            matrix: G6.Util.transform(
              [1, 0, 0, 0, 1, 0, 0, 0, 1],
              [
                [
                  "t",
                  -width / 2 + width * ratio * 0.1,
                  -height / 2 + height * ratio * 0.1,
                ], // 移动到中心点
                ["s", scale, scale], // 缩放
                ["t", width / 2, height / 2], // 移回原位
              ]
            ),
          };
        },
        {
          duration: 1500,
          easing: "easeCubic",
          repeat: false,
        }
      );
    } else {
      const rect = group
        .getChildren()
        .find((item) => item.cfg.name == "circleeEternal");
      if (rect) {
        rect.remove();
      }
      const img = group.$getItem();
      let { width = 50, height = 50 } = img.attrs;
      const node = group.cfg.children.find(
        (item) => item.attrs.className == "ImageNode"
      );
      node.animate(
        (ratio) => {
          const scale = 1.2 - ratio * 0.2; // 缩放范围1~1.5
          return {
            matrix: G6.Util.transform(
              [1, 0, 0, 0, 1, 0, 0, 0, 1],
              [
                [
                  "t",
                  -width / 2 - width * ratio * 0.1,
                  -height / 2 - height * ratio * 0.1,
                ], // 移动到中心点
                ["s", scale, scale], // 缩放
                ["t", width / 2, height / 2], // 移回原位
              ]
            ),
          };
        },
        {
          duration: 1500,
          easing: "easeCubic",
          repeat: false,
        }
      );
    }
  },

  "nodeState:alarmLow"(value, group, name) {
    setcriclAnimal(value, group, name);
  },
  "nodeState:alarmMiddle"(value, group, name) {
 
    setcriclAnimal(value, group, name);
  },
  "nodeState:alarmHigh"(value, group, name) {
    setcriclAnimal(value, group, name);
  },
};

function setcriclAnimal(value, group, name) {
  const _name = name.split(':')?.[1] ?? 'deafult'
  const { activeStyle } = getItemStyle.call(this, "node", group, _name);
  if (!activeStyle) {
    return;
  }
  if (value) {
    const groupCricle =  group.getChildren()?.find((item) => item.cfg.name == "alarmGroup")
    if (groupCricle){
      groupCricle.remove()
    }
    const newgroup = group.addGroup({
      name: "alarmGroup",
      capture: false,
      draggable: false,
      visible: true,
    });
    const r = group.cfg.item._cfg.model.width
      ? group.cfg.item._cfg.model.width / 2 + 4
      : group.cfg.item._cfg.model.style.width / 2 + 2;
    const color = activeStyle?.fill ?? "red";

    const back1 = newgroup.addShape("circle", {
      zIndex: -3,
      attrs: {
        x: 0,
        y: 0,
        r,
        fill: color,
        opacity: 0.4,
      },
      name: "backAnimak-shapeOuter",
    });
    const back2 = newgroup.addShape("circle", {
      zIndex: -2,
      attrs: {
        x: 0,
        y: 0,
        r,
        fill: color,
        opacity: 0.4,
      },
      name: "backAnimak-shapeMiddle",
    });
    const back3 = newgroup.addShape("circle", {
      zIndex: -1,
      attrs: {
        x: 0,
        y: 0,
        r,
        fill: color,
        opacity: 0.4,
      },
      name: "backAnimak-shapeInner",
    });
    newgroup.toBack(); // Sort according to the zIndex
    back1.animate(
      {
        // Magnifying and disappearing
        r: r + 10,
        opacity: 0.1,
      },
      {
        duration: 3000,
        easing: "easeCubic",
        delay: 0,
        repeat: true, // repeat
      }
    ); // no delay
    back2.animate(
      {
        // Magnifying and disappearing
        r: r + 10,
        opacity: 0.1,
      },
      {
        duration: 3000,
        easing: "easeCubic",
        delay: 1000,
        repeat: true, // repeat
      }
    ); // 1s delay
    back3.animate(
      {
        // Magnifying and disappearing
        r: r + 10,
        opacity: 0.1,
      },
      {
        duration: 3000,
        easing: "easeCubic",
        delay: 2000,
        repeat: true, // repeat
      }
    ); // 3s delay
  } else {
    const newgroup =
      group.getChildren()?.find((item) => item.cfg.name == "alarmGroup") ?? undefined;
      newgroup?.getChildren()?.forEach((item) => {
      item && item.stopAnimate();
    })??''
    newgroup.remove();
  }
}
export default events;
