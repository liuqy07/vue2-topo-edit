/**
 * @author claude
 * @date 2020/3/15
 * @description 注册基础节点, 其他节点都在此基础上继承和扩展
 */

// import anchorEvent from "../nodes/anchor-event";
// import dragcombo from "./drag-combo-size";
// import defaultStyles from "../defaultStyles";

import itemEvents from "../nodes/item-event";
import anchorEvent from "../nodes/anchor-event";
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

/*
 * 注册基础node => 添加锚点/图标 => 绘制node => 初始化node状态 => node动画(设置交互动画)
 */

export default (G6) => {
  G6.registerCombo(
    "base-combo",
    {
      getShapeStyle(cfg) {
        const width = cfg.style.width || 80;
        const height = cfg.style.height || 40;
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
      // 绘制图标

      // 绘制锚点
      initAnchor(cfg, group) {
        group.anchorShapes = [];
        group.showAnchor = () => {
          this.drawAnchor(cfg, group);
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
      },
      drawAnchor(cfg, group) {
        // },200)
        const { type, direction, anchorPointStyles } = group.getFirst().attr();
        const item = group.get("children")[0];
        const bBox = item.getBBox();
      
        bBox.x = -bBox.width / 2;
        bBox.y = -bBox.height / 2;
        const anchors = this.getAnchorPoints(cfg);

        // 绘制锚点坐标
        anchors &&
          anchors.forEach((p, i) => {
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
      },
      /* 添加文本节点 */
      /* https://g6.antv.vision/zh/docs/manual/advanced/keyconcept/shape-and-properties/#%E6%96%87%E6%9C%AC-text */
      addLabel(cfg, group, attrs) {
        const { labelText, labelCfg, labels } = attrs;
        const [width, height] = attrs.size;
        // 字体小于12时 svg会报错
        /* if (labelCfg && labelCfg.fontSize < 12) {
             labelCfg.fontSize = 12;
           } */
        // 多行文本
        if (labels) {
          labels.forEach((item) => {
            const {
              label,
              labelCfg: { maxlength },
              className,
            } = item;

            let text = maxlength ? label.substr(0, maxlength) : label || "";

            if (label.length > maxlength) {
              text = `${text}...`;
            }

            group.addShape("text", {
              attrs: {
                text,
                ...item,
                ...item.labelCfg,
                ...item.labelCfg.style,
              },
              className: `node-text ${className}`,
              draggable: true,
            });
          });
        } else if (labelText) {
          const { maxlength } = labelCfg;

          let text = maxlength
            ? labelText.substr(0, maxlength)
            : labelText || "";

          if (labelText.length > maxlength) {
            text = `${text}...`;
          }

          group.addShape("text", {
            attrs: {
              text,
              x: 0,
              y: -height / 2, //单行文本的偏移量
              ...labelCfg,
              ...labelCfg.style,
            },
            className: "node-text",
            draggable: true,
          });
        }
      },
      draw(cfg, group) {
        return this.drawShape(cfg, group);
      },

      /* 绘制节点，包含文本 */
      drawShape(cfg, group) {
        // 元素分组
        // 合并外部样式和默认样式
        const style = this.getShapeStyle(cfg);
        cfg.padding = cfg.padding || [0, 0, 0, 0];

        style.width = Number(style.width || 80); // 默认宽度保障可见性
        style.height = Number(style.height || 40);
        style.size = [style.width, style.height];
     
        const shape = group.addShape(this.shapeType, {
          // shape 属性在定义时返回
          attrs: {
            ...style,
            padding: cfg.padding,
            size: style.size,
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
        //this.addLabel(cfg, group, attrs);
        // 添加锚点

        return shape;
      },
      afterDraw(cfg, combo) {
        this.initAnchor(cfg, combo);
        //  debugger
      },
      afterUpdate(cfg, combo) {
      
      },

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
  );
  //  正方形的父容器自定义

  G6.registerCombo(
    "base-combo-rect",
    {
      getShapeStyle(cfg) {
        const width = cfg.style.width || 80;
        const height = cfg.style.height || 40;
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
      // 绘制锚点
      initAnchor(cfg, group) {
        group.anchorShapes = [];
        group.showAnchor = () => {
          this.drawAnchor(cfg, group);
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
      },
      drawAnchor(cfg, group) {
        // },200)
        const { type, direction, anchorPointStyles } = group.getFirst().attr();
        const item = group.get("children")[0];
        const bBox = item.getBBox();

        bBox.x = -bBox.width / 2;
        bBox.y = -bBox.height / 2;
        const anchors = this.getAnchorPoints(cfg);

        // 绘制锚点坐标
        anchors &&
          anchors.forEach((p, i) => {
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
      },
      /* 添加文本节点 */
      /* https://g6.antv.vision/zh/docs/manual/advanced/keyconcept/shape-and-properties/#%E6%96%87%E6%9C%AC-text */
      addLabel(cfg, group, attrs) {
        const { labelText, labelCfg, labels } = attrs;
        const [width, height] = attrs.size;
        // 字体小于12时 svg会报错
        /* if (labelCfg && labelCfg.fontSize < 12) {
        labelCfg.fontSize = 12;
      } */
        // 多行文本
        if (labels) {
          labels.forEach((item) => {
            const {
              label,
              labelCfg: { maxlength },
              className,
            } = item;

            let text = maxlength ? label.substr(0, maxlength) : label || "";

            if (label.length > maxlength) {
              text = `${text}...`;
            }

            group.addShape("text", {
              attrs: {
                text,
                ...item,
                ...item.labelCfg,
                ...item.labelCfg.style,
              },
              className: `node-text ${className}`,
              draggable: true,
            });
          });
        } else if (labelText) {
          const { maxlength } = labelCfg;

          let text = maxlength
            ? labelText.substr(0, maxlength)
            : labelText || "";

          if (labelText.length > maxlength) {
            text = `${text}...`;
          }

          group.addShape("text", {
            attrs: {
              text,
              x: 0,
              y: -height / 2, //单行文本的偏移量
              ...labelCfg,
              ...labelCfg.style,
            },
            className: "node-text",
            draggable: true,
          });
        }
      },
      draw(cfg, group) {
        return this.drawShape(cfg, group);
      },

      /* 绘制节点，包含文本 */
      drawShape(cfg, group) {
        cfg.padding = cfg.padding || [5, 5, 5, 5];
        const style = this.getShapeStyle(cfg);
        style.width = Number(style.width || 80); // 默认宽度保障可见性
        style.height = Number(style.height || 40);
        style.size = [style.width, style.height];
    
        const shape = group.addShape(this.shapeType, {
          // shape 属性在定义时返回
          attrs: {
            ...style,
            x: -style.width / 2 - 40,
            y: -style.height / 2 ,
            width: style.width,
            height: style.height,

            fill: "#F8FAFE", // 强制定义填充色
            stroke: "#999",
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

        this.initAnchor(cfg, group);

        return shape;
      },
      afterDraw(cfg, combo) {
        // let group = combo.get("children")[0];
        // group.attrs.x = 0;
      },
      afterUpdate(cfg, combo) {
      
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
    //"rect"
  );

  G6.registerCombo(
    "cloud-combo",
    {
      afterDraw(cfg, group) {
        // 定义云形路径（关键形状）
   
        const path = [
          ["M", 101, 23],
          ["C", 128, 23, 150, 43, 152, 70],
          ["C", 164, 77, 171, 91, 171, 106],
          ["C", 171, 122, 163, 136, 151, 143],
          ["C", 145, 148, 137, 152, 128, 152],
          ["L", 39.8586957, 152],
          ["C", 18, 152, 2, 135, 2, 114],
          ["L", 2, 109],
          ["C", 2, 95, 9, 83, 21, 77],
          ["C", 20, 76, 20, 75, 20, 74],
          ["C", 20, 56, 35, 42, 52, 42],
          ["C", 55, 42, 57, 42, 60, 43],
          ["C", 69, 31, 84, 23, 101, 23],
          ["Z"],
        ];

        // 主图形（云层）
        const shape = group.addShape("path", {
          attrs: {
            x: 0,
            y: 0,
            path: path,
            stroke: "#999",
            fill: "#F8FAFE",
            with: 500,
            height: 500,
            size: [200, 500],
            lineWidth: 1,
            lineDash: [1, 2],
          },
          name: "cloud-shape",
        });

        // 设置连线吸附锚点（边缘关键位置）
        cfg.anchorPoints = [
          [0.5, 0], // 顶部中点
          [1, 0.3], // 右中
          [0.5, 1], // 底部中点
          [0, 0.3], // 左中
        ];

        return shape;
      },
      // 继承基础 Combo 属性（如子节点自动布局）:ml-citation{ref="5,8" data="citationList"}
    },
    "rect"
  );
};
