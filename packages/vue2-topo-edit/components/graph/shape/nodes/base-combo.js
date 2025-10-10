/**
 * @author claude
 * @date 2020/3/15
 * @description 注册基础节点, 其他节点都在此基础上继承和扩展
 */

import itemEvents from "./item-event";
import anchorEvent from "./anchor-event";
// import dragcombo from "./drag-combo-size";
import defaultStyles from "../defaultStyles";

const { anchorPointStyles, nodeLabelStyles } = defaultStyles;

function getStyle(options, cfg) {
  return {
    ...cfg,
    // 自定义默认样式

    ...options,
    // 当前节点样式
    ...cfg.style,
    // 文本配置
    labelCfg: {
      ...nodeLabelStyles,
      ...cfg.labelCfg,
    },

    // 锚点样式
    anchorPointStyles: {
      ...anchorPointStyles,
      ...cfg.anchorPointStyles,
    },
    ...cfg.nodeStateStyles,
    // 锚点高亮样式
    anchorHotsoptStyles: cfg.anchorHotsoptStyles,
  };
}
// 绘制图标
function initAnchor(cfg, group, getAnchorPoints) {
  group.anchorShapes = [];
  group.showAnchor = () => {
    drawAnchor(cfg, group, getAnchorPoints);
  };
  group.clearAnchor = () => {
    if (group.anchorShapes) {
      const line = group.$getItem("dashed-line");
      if (line) {
        line.remove();
      }
      group.anchorShapes.forEach((a) => a.remove());
    }
    group.anchorShapes = [];
  };
}
function drawAnchor(cfg, group, getAnchorPoints) {
  // },200)
  const { type, direction, anchorPointStyles } = group.getFirst().attr();
  const item = group.get("children")[0];
  const bBox = item.getBBox();
  console.log("bBox--->", bBox);
  const anchors = getAnchorPoints(cfg);

  // 绘制锚点坐标
  anchors &&
    anchors.forEach((p, i) => {
      console.log("p--->", p);
      const diff =
        type === "triangle-node" ? (direction === "up" ? 1 : 0) : 0.5;
      const x = bBox.width * (p[0] - 0.5);
      const y = bBox.height * (p[1] - diff);

      /**
       * 绘制三层锚点
       * 最底层: 锚点bg
       * 中间层: 锚点
       * 最顶层: 锚点group, 用于事件触发
       */
      // 视觉锚点
      const anchor = group.addShape("circle", {
        attrs: {
          x: x,
          y: y,
          ...anchorPointStyles,
        },
        zIndex: 1,
        nodeId: group.get("id"),
        className: "node-anchor",
        draggable: true,
        isAnchor: true,
        index: i,
      });

      // 锚点事件触发的元素
      const anchorGroup = group.addShape("circle", {
        attrs: {
          x,
          y,
          r: 11,
          fill: "#000",
          opacity: 0,
        },
        zIndex: 2,
        nodeId: group.get("id"),
        className: "node-anchor-group",
        draggable: true,
        isAnchor: true,
        index: i,
      });

      /**
       * 添加锚点事件绑定
       */
      anchorEvent(anchorGroup, group, p);

      group.anchorShapes.push(anchor);
      group.anchorShapes.push(anchorGroup);
    });

  // 查找所有锚点
  group.getAllAnchors = () => {
    return group.anchorShapes.filter((c) => c.get("isAnchor") === true);
  };
  // 查找指定锚点
  group.getAnchor = (i) => {
    return group.anchorShapes.filter(
      (c) => c.get("className") === "node-anchor" && c.get("index") === i
    );
  };
  // 查找所有锚点背景
  group.getAllAnchorBg = () => {
    return group.anchorShapes.filter(
      (c) => c.get("className") === "node-anchor-bg"
    );
  };
}

/*
 * 注册基础node => 添加锚点/图标 => 绘制node => 初始化node状态 => node动画(设置交互动画)
 */

export default (G6) => {
  G6.registerCombo(
    "base-combo",
    {
      getShapeStyle(cfg) {
        const width = cfg.style.width || 100;
        const height = cfg.style.height || 100;
        const r = cfg.size[0];
        return getStyle.call(
          this,
          {
            width,

            height,
            radius: 2,
            r,
            // 将图形中心坐标移动到图形中心, 用于方便鼠标位置计算
            x: -width / 2,
            y: -height / 2,
          },
          cfg
        );
      },

      addLabel(cfg, group, attrs) {
        const { labelText, labelCfg } = attrs;
        const [height] = attrs.size;
        const { maxlength } = labelCfg;
        let text = maxlength ? labelText.substr(0, maxlength) : labelText || "";
        if (labelText.length > maxlength) {
          text = `${text}...`;
        }
        group.addShape("text", {
          attrs: {
            text,
            x: 0,
            y: -height / 2, // 单行文本的偏移量
            ...labelCfg,
            ...labelCfg.style,
          },
          className: "node-text",
          draggable: true,
        });
      },
      draw(cfg, group) {
        return this.drawShape(cfg, group, this.getAnchorPoints);
      },

      /* 绘制节点，包含文本 */
      drawShape(cfg, group) {
        // 元素分组
        // 合并外部样式和默认样式
        const attrs = this.getShapeStyle(cfg, group);
        const style = this.getShapeStyle(cfg);

        const shape = group.addShape(this.shapeType, {
          // shape 属性在定义时返回
          attrs: {
            ...style,
            padding: [0, 0, 0, 0],
            r: style.size[0],
            x: 0,
            y: 0,
          },
          className: `${this.shapeType}-shape`,
          xShapeNode: true, // 自定义节点标识
          draggable: true,
        });

        // 给 group 添加自定义方法 按className查找元素
        group.$getItem = (className) => {
          return group
            .get("children")
            .find((item) => item.get("className") === className);
        };
        // 添加锚点
        initAnchor(cfg, group, this.getAnchorPoints);
        return shape;
      },
      afterDraw(cfg, combo) {},
      afterUpdate(cfg, combo) {},
      setState(name, value, item) {
        const buildInEvents = [
          "anchorShow",
          "anchorActived",
          "nodeState",
          "nodeState:default",
          "nodeState:selected",
          // "nodeState:hover",
          "nodeOnDragStart",
          "nodeOnDrag",
          "nodeOnDragEnd",
          "combo:selected",
          "comboState:default",
        ];
        const group = item.getContainer();

        if (group.get("destroyed")) return;
        if (buildInEvents.includes(name)) {
          // 内部this绑定到了当前item实例
          itemEvents[name].call(this, value, group);
        } else if (this.stateApplying) {
          this.stateApplying.call(this, name, value, item);
        } else {
          console.warn(
            `warning: ${name} 事件回调未注册!\n可继承该节点并通过 stateApplying 方法进行注册\n如已注册请忽略 (-_-!)`
          );
        }
      },
      /* 获取锚点（相关边的连入点） */
      getAnchorPoints(cfg) {
        return (
          cfg.anchorPoints || [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5],
          ]
        );
      },
    },
    "circle"
    // "rect"
  );
  //  正方形的父容器自定义

  G6.registerCombo(
    "base-combo-rect",
    {
      getShapeStyle(cfg) {
        const width = cfg.style.width || 80;
        const height = cfg.style.height || 40;

        return getStyle.call(
          this,
          {
            width,
            height,
            radius: 2,
            // 将图形中心坐标移动到图形中心, 用于方便鼠标位置计算
            x: -width / 2,
            y: -height / 2,
          },
          cfg
        );
      },

      addLabel(cfg, group, attrs) {
        const { labelText, labelCfg } = attrs;
        const [height] = attrs.size;
        const { maxlength } = labelCfg;
        let text = maxlength ? labelText.substr(0, maxlength) : labelText || "";
        if (labelText.length > maxlength) {
          text = `${text}...`;
        }
        group.addShape("text", {
          attrs: {
            text,
            x: 0,
            y: -height / 2, // 单行文本的偏移量
            ...labelCfg,
            ...labelCfg.style,
          },
          className: "node-text",
          draggable: true,
        });
      },
      draw(cfg, group) {
        return this.drawShape(cfg, group, this.getAnchorPoints);
      },

      /* 绘制节点，包含文本 */
      drawShape(cfg, group) {
        // 元素分组
        // 合并外部样式和默认样式
        const attrs = this.getShapeStyle(cfg, group);
        const style = this.getShapeStyle(cfg);
        const shape = group.addShape("rect", {
          // shape 属性在定义时返回
          attrs: {
            ...style,
            x: 0,
            y: 0,
          },
          className: `${this.shapeType}-shape`,
          xShapeNode: true, // 自定义节点标识
          draggable: true,
        });

        // 给 group 添加自定义方法 按className查找元素
        group.$getItem = (className) => {
          return group
            .get("children")
            .find((item) => item.get("className") === className);
        };
        // 添加文本节点
        // 添加锚点
        initAnchor(cfg, group);
        return shape;
      },
      afterDraw(cfg, combo) {},
      afterUpdate(cfg, combo) {
        const group = combo.get("group").get("children")[1];
        group.attrs.x = 0;
      },
      setState(name, value, item) {
        const buildInEvents = [
          "anchorShow",
          "anchorActived",
          "nodeState",
          "nodeState:default",
          "nodeState:selected",
          "nodeState:hover",
          "nodeOnDragStart",
          "nodeOnDrag",
          "nodeOnDragEnd",
          "combo:selected",
          "comboState:default",
        ];
        const group = item.getContainer();

        if (group.get("destroyed")) return;
        if (buildInEvents.includes(name)) {
          // 内部this绑定到了当前item实例
          itemEvents[name].call(this, value, group);
        } else if (this.stateApplying) {
          this.stateApplying.call(this, name, value, item);
        } else {
          console.warn(
            `warning: ${name} 事件回调未注册!\n可继承该节点并通过 stateApplying 方法进行注册\n如已注册请忽略 (-_-!)`
          );
        }
      },
      /* 获取锚点（相关边的连入点） */
      getAnchorPoints(cfg) {
        return (
          cfg.anchorPoints || [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5],
          ]
        );
      },
    },
    "rect"
    // "rect"
  );

  G6.registerCombo(
    "base-combo-rect-img",
    {
      getShapeStyle(cfg) {
        const width = cfg.style.width || 80;
        const height = cfg.style.height || 40;

        return getStyle.call(
          this,
          {
            width,
            height,
            radius: 2,
            // 将图形中心坐标移动到图形中心, 用于方便鼠标位置计算
            x: -width / 2,
            y: -height / 2,
          },
          cfg
        );
      },

      addLabel(cfg, group, attrs) {
        const { labelText, labelCfg } = attrs;
        const [height] = attrs.size;
        const { maxlength } = labelCfg;
        let text = maxlength ? labelText.substr(0, maxlength) : labelText || "";
        if (labelText.length > maxlength) {
          text = `${text}...`;
        }
        group.addShape("text", {
          attrs: {
            text,
            x: 0,
            y: -height / 2, // 单行文本的偏移量
            ...labelCfg,
            ...labelCfg.style,
          },
          className: "node-text",
          draggable: true,
        });
      },
      draw(cfg, group) {
        return this.drawShape(cfg, group, this.getAnchorPoints);
      },

      /* 绘制节点，包含文本 */
      drawShape(cfg, group) {
        // 元素分组
        // 合并外部样式和默认样式
        const attrs = this.getShapeStyle(cfg, group);
        const style = this.getShapeStyle(cfg);

        const shape = group.addShape("rect", {
          // shape 属性在定义时返回
          attrs: {
            ...style,
            // stroke: "fff",
            // fill: "",
            // lineWidth: 0,
            // lineDash: [0, 0],
            x: 0,
            y: 0,
          },
          className: `${this.shapeType}-shape`,
          xShapeNode: true, // 自定义节点标识
          draggable: true,
        });

        // 给 group 添加自定义方法 按className查找元素
        group.$getItem = (className) => {
          return group
            .get("children")
            .find((item) => item.get("className") === className);
        };
        // 添加文本节点
        // 添加锚点
        initAnchor(cfg, group);
        return shape;
      },
      afterDraw(cfg, group) {
        const attrs = this.getShapeStyle(cfg, group);
        const style = this.getShapeStyle(cfg);
        const image = group.addShape("image", {
          attrs: {
            // path: 'M0,0 L20,0 L10,20 Z',
            x: -style.size[0], // 居中
            y: -style.size[1],
            width: style.size[0],
            height: style.size[1],
            img:   require('@/assets/images/topo/computer.png'), //new URL ("../../../../../../assets/images/topo/comclound.png", import.meta.url).href, // 替换为实际图片 URL //require("../../../../../../assets/icons/svg/abnormalTraffic.svg").default,
            cursor: "pointer",
          },
          name: "combo-bg-image", // 标识名称
          xShapeNode: true, // 自定义节点标识
          draggable: true, // 禁止图片单独拖拽
        });
        image.hide();
      },
      afterUpdate(cfg, combo) {
        const group = combo.get("group").get("children")[1];
        // group.attrs.x = 0;
        console.log("combo---->", combo);
        const width = combo._cfg.model.size[0] * 1.4;
        const height = combo._cfg.model.size[1] * 1.6;

        const img = combo._cfg.group
          .getChildren()
          .find((item) => item.cfg.name == "combo-bg-image");
        img.attr("width", width);
        img.attr("height", height);
        img.attr("x", -width / 2);
        img.attr("y", -height / 2);

        img.show();
      },
      setState(name, value, item) {
        const buildInEvents = [
          "anchorShow",
          "anchorActived",
          "nodeState",
          "nodeState:default",
          "nodeState:selected",
          "nodeState:hover",
          "nodeOnDragStart",
          "nodeOnDrag",
          "nodeOnDragEnd",
          "combo:selected",
          "comboState:default",
        ];
        const group = item.getContainer();

        if (group.get("destroyed")) return;
        if (buildInEvents.includes(name)) {
          // 内部this绑定到了当前item实例
          itemEvents[name].call(this, value, group);
        } else if (this.stateApplying) {
          this.stateApplying.call(this, name, value, item);
        } else {
          console.warn(
            `warning: ${name} 事件回调未注册!\n可继承该节点并通过 stateApplying 方法进行注册\n如已注册请忽略 (-_-!)`
          );
        }
      },
      /* 获取锚点（相关边的连入点） */
      getAnchorPoints(cfg) {
        return (
          cfg.anchorPoints || [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5],
            [1, 1],
          ]
        );
      },
    },
    "rect"
    // "rect"
  );

  G6.registerCombo(
    "base-combo-rect1",
    {
      getShapeStyle(cfg) {
        const width = cfg.style.width || 80;
        const height = cfg.style.height || 40;

        return getStyle.call(
          this,
          {
            width,
            height,
            radius: 2,
            // 将图形中心坐标移动到图形中心, 用于方便鼠标位置计算
            x: -width / 2,
            y: -height / 2,
          },
          cfg
        );
      },
      addLabel(cfg, group, attrs) {
        const { labelText, labelCfg } = attrs;
        const [height] = attrs.size;
        const { maxlength } = labelCfg;
        let text = maxlength ? labelText.substr(0, maxlength) : labelText || "";
        if (labelText.length > maxlength) {
          text = `${text}...`;
        }
        group.addShape("text", {
          attrs: {
            text,
            x: 0,
            y: -height / 2, // 单行文本的偏移量
            ...labelCfg,
            ...labelCfg.style,
          },
          className: "node-text",
          draggable: true,
        });
      },
      drawShape(cfg, group) {
        return this.drawShape1(cfg, group, this.getAnchorPoints);
      },

      /* 绘制节点，包含文本 */
      drawShape1(cfg, group) {
        // 元素分组
        const attrs = this.getShapeStyle(cfg, group);
        const style = this.getShapeStyle(cfg);
        const shape = group.addShape("rect", {
          // shape 属性在定义时返回
          attrs: {
            ...style,
            x: 0,
            y: 0,
          },
          className: `${this.shapeType}-shape`,
          xShapeNode: true, // 自定义节点标识
          draggable: true,
        });
        console.log();
        // 给 group 添加自定义方法 按className查找元素
        group.$getItem = (className) => {
          return group
            .get("children")
            .find((item) => item.get("className") === className);
        };
        const direction = cfg?.direction ?? "left";
        const labelStr = (cfg?.label ?? "").trim();
        const fontSize = cfg?.labelCfg?.style?.fontSize ?? 12;
        const lineHeight = cfg?.labelCfg?.style?.lineHeight ?? 1.2;
        const labelArry = labelStr.split("");
        const width = labelArry.length * fontSize * lineHeight + 12;
        const height = fontSize * lineHeight + 8;
        const textContain = group.addShape("rect", {
          // shape 属性在定义时返回
          attrs: {
            ...style,
            width: width,
            height: height,
            lineDash: [],
            stroke: "#A0BAD2",
            x: 0,
            y: 0,
          },
          className: `${this.shapeType}-shape`,
          xShapeNode: true, // 自定义节点标识
          draggable: true,
        });
        const directionX = -width / 2;
        const directionY = -height / 2;
        textContain.attr("matrix", [
          1,
          0,
          0,
          0,
          1,
          0,
          directionX,
          directionY,
          1, // matrix 重新定义图形的旋转矩阵中心位置
        ]);
        //  判断当前的文字位于combo的方向为左右的时候
        if (direction == "left" || direction == "right") {
          // cfg.label = ''
          const textGroup = group.addGroup({
            attrs: {
              x: 0,
              y: 0,
            },
            name: "textGroup",
            capture: false,
            draggable: false,
            visible: true,
          });
          labelArry.forEach((item, index) => {
            textGroup.addShape("text", {
              attrs: {
                text: item,
                x: 0, // 左侧定位
                y: (index + 1) * fontSize * lineHeight,
                fontSize: fontSize,
                fill: "#1890ff",
                stroke: "#1890ff",
                textAlign: "center",
                textBaseline: "middle",
              },
            });
          });
          // const translateX = direction == 'left' ? -attrs.width / 2 - 10 : attrs.width / 2 + 10
          // // const translateY = -attrs.height / 2
          // textGroup.translate(translateX, -width / 2)
          // textContain.rotate(Math.PI / 2)
          // textContain.translate(translateX, 0)
        } else if (direction == "top" || direction == "bottom") {
          const translateY =
            direction == "top" ? -attrs.height / 2 - 10 : attrs.height / 2 + 10;
          const text = cfg.label;
          // cfg.label = ''
          const labelShape = group.addShape("text", {
            attrs: {
              text: text,
              x: 0, // 左侧定位
              y: 0,
              fontSize: fontSize,
              fill: "#1890ff",
              stroke: "#1890ff",
              textAlign: "center",
              textBaseline: "middle",
            },
          });
          //  labelShape.translate(0, translateY)
          //  textContain.translate(0, translateY)
        }
        initAnchor(cfg, group);
        // 给 group 添加自定义方法 按className查找元素
        group.$getItem = (className) => {
          return group
            .get("children")
            .find((item) => item.get("className") === className);
        };
        return shape;
      },
      afterDraw(cfg, combo) {
        cfg.label = "";
        setTimeout(() => {
          combo.cfg.item.refresh();
        }, 500);
      },
      afterUpdate(cfg, combo) {
        console.log("13123123");
        const direction = cfg?.direction ?? "left";
        const attrs = combo._cfg.group.getChildren()[0].attrs;
        const shape = combo._cfg.group.getChildren()[1];
        const textGroup = combo._cfg.group.getChildren()[2];
        const attrs1 = shape.attrs;

        const labelStr = (cfg?.labelCfg?.text ?? "").trim();
        const fontSize = cfg?.labelCfg?.style?.fontSize ?? 12;
        const lineHeight = cfg?.labelCfg?.style?.lineHeight ?? 1.2;
        const labelArry = labelStr.split("");
        const width = labelArry.length * fontSize * lineHeight + 12;
        const height = fontSize * lineHeight + 8;
        shape.attr("matrix", [
          1,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          1, // matrix 重新定义图形的旋转矩阵中心位置
        ]);
        textGroup.attr("matrix", [
          1,
          0,
          0,
          0,
          1,
          0,
          0,
          0,
          1, // matrix 重新定义图形的旋转矩阵中心位置
        ]);
        if (direction == "left" || direction == "right") {
          const translateX =
            direction == "left" ? -attrs.width / 2 : attrs.width / 2;
          textGroup.translate(translateX, -width / 2);
          shape.rotate(Math.PI / 2);
          shape.translate(translateX + 10, -width / 2);
        } else if (direction == "top" || direction == "bottom") {
          const translateY =
            direction == "top"
              ? -attrs.height / 2 - height / 2
              : attrs.height / 2 - height / 2;
          shape.translate(-attrs1.width / 2, translateY);
          textGroup.translate(0, translateY + height / 2);
        }

        //  combo.getGraph().refreshItem(combo);
        // const group = combo.get('group').get('children')[1]
        // group.attrs.x = 0
      },
      setState(name, value, item) {
        const buildInEvents = [
          "anchorShow",
          "anchorActived",
          "nodeState",
          "nodeState:default",
          "nodeState:selected",
          "nodeState:hover",
          "nodeOnDragStart",
          "nodeOnDrag",
          "nodeOnDragEnd",
          "combo:selected",
          "comboState:default",
        ];
        const group = item.getContainer();

        if (group.get("destroyed")) return;
        if (buildInEvents.includes(name)) {
          // 内部this绑定到了当前item实例
          itemEvents[name].call(this, value, group);
        } else if (this.stateApplying) {
          this.stateApplying.call(this, name, value, item);
        } else {
          console.warn(
            `warning: ${name} 事件回调未注册!\n可继承该节点并通过 stateApplying 方法进行注册\n如已注册请忽略 (-_-!)`
          );
        }
      },
      /* 获取锚点（相关边的连入点） */
      getAnchorPoints(cfg) {
        return (
          cfg.anchorPoints || [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5],
          ]
        );
      },
    },
    "rect"
  );
};
