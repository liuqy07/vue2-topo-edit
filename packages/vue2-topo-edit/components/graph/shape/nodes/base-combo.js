/**
 * @author claude
 * @date 2020/3/15
 * @description 注册基础节点, 其他节点都在此基础上继承和扩展
 */

import itemEvents from "./item-event";
import anchorEvent from "./anchor-event";
import dragcombo from "./drag-combo-size";
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

export default (G6, vue) => {
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
            //   stroke: "#999",
            //   fill: "#F8FAFE",
            //   lineWidth: 1,
            //   lineDash: [3, 2],
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

        // bBox.x = -bBox.width/2
        // bBox.y = -bBox.height/2
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
        const attrs = this.getShapeStyle(cfg, group);
        const style = this.getShapeStyle(cfg);

        // group.get("children")[1].attrs
        // console.log("group,",group.get("children").attrs)
        // 添加节点

        // attrs.width = 200
        // attrs.height = 200
        // attrs.style.width = 200
        // attrs.style.height = 200
        // attrs.style.r = 100
        // console.log("style=========================",style.r, attrs.style.r)
        //attrs.style.width = attrs.style.size[0]
        //attrs.style.height =attrs.style.size[1]
        // attrs.x = -attrs.width/2
        // attrs.y = - attrs.height/2

        // attrs.r = 100
        // attrs.x = 0
        // attrs.y = 0
        // let r =   attrs.size[0]

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
        // 添加文本节点
        //this.addLabel(cfg, group, attrs);
        // 添加锚点

        this.initAnchor(cfg, group);

        return shape;
      },
      afterDraw(cfg, combo) {
        // console.log("combo",combo)
      },
      afterUpdate(cfg, combo) {
        // console.log("combo
        // 收缩combo的时候，将首个元素隐藏，避免收起时候连线不到边缘
        if (combo._cfg.nodes[0] && combo._cfg.nodes[0]._cfg.visible == false) {
          // combo.fixCollapseSize = 30
          combo._cfg.nodes[0]._cfg.visible = true;
        }
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
    //"rect"
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
        this.initAnchor(cfg, group);
        return shape;
      },
      afterDraw(cfg, combo) {},
      afterUpdate(cfg, combo) {
        let group = combo.get("group").get("children")[1];
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
    //"rect"
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
            let anchor, anchorGroup;
            /**
             * 绘制三层锚点
             * 最底层: 锚点bg
             * 中间层: 锚点
             * 最顶层: 锚点group, 用于事件触发
             */
            // 视觉锚点

            if (anchors.length !== i + 1) {
              anchor = group.addShape("circle", {
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
              anchorGroup = group.addShape("circle", {
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

              anchorEvent(anchorGroup, group, p);
              anchor && group.anchorShapes.push(anchor);
              anchorGroup && group.anchorShapes.push(anchorGroup);
            } else {
              anchor = group.$getItem("combo-drag");
              if(anchor){
                anchor.remove()
              }
              // anchor && anchor.forEach(item =>{
              //   item.remove()
              // })
              // if (anchor) group.remove(anchor);
              anchor = group.addShape("circle", {
                attrs: {
                  x: x,
                  y: y,
                  ...anchorPointStyles,
                },
                zIndex: 1,
                nodeId: group.get("id"),
                className: "combo-drag",
                draggable: true,
                isAnchor: false,
                index: i,
              });
              dragcombo(anchor, cfg, group,vue);
            }

            /**
             * 添加锚点事件绑定
             */
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
        this.initAnchor(cfg, group);
        return shape;
      },
      afterDraw(cfg, group) {
        const attrs = this.getShapeStyle(cfg, group);
        const style = this.getShapeStyle(cfg);
        let image = group.addShape("image", {
          attrs: {
            // path: 'M0,0 L20,0 L10,20 Z',
            x: -style.size[0] , // 居中
            y: -style.size[1] ,
            width: style.size[0] ,
            height: style.size[1] ,
            img: '', // require("../../../../../../assets/images/topo/comclound.png"), // 替换为实际图片 URL //require("../../../../../../assets/icons/svg/abnormalTraffic.svg").default,
            cursor: "pointer",
          },
          name: "combo-bg-image", // 标识名称
          xShapeNode: true, // 自定义节点标识
          draggable: true, // 禁止图片单独拖拽
        });
        image.hide();
      },
      afterUpdate(cfg, combo) {
        let group = combo.get("group").get("children")[1];
        // group.attrs.x = 0;
        console.log("combo---->",combo)
        let width = combo._cfg.model.size[0]  * 1.4;
        let height = combo._cfg.model.size[1] * 1.6;

        let img = combo._cfg.group
          .getChildren()
          .find((item) => item.cfg.name == "combo-bg-image");
        img.attr("width", width );
        img.attr("height", height );
        img.attr("x", -width / 2 );
        img.attr("y", -height / 2  );

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
    //"rect"
  );
};
