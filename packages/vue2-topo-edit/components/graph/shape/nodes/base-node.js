/**
 * @author claude
 * @date 2020/3/15
 * @description 注册基础节点, 其他节点都在此基础上继承和扩展
 */

// import itemEvents from "./item-event";
import anchorEvent from "./anchor-event";
import defaultStyles from "../defaultStyles";

const { iconStyles, nodeStyles, anchorPointStyles, nodeLabelStyles } =
  defaultStyles;

function getStyle(options, cfg) {
  return {
    ...cfg,
    // 自定义默认样式
    ...nodeStyles,
    ...options,
    // 当前节点样式
    ...cfg.style,
    // 文本配置
    labelCfg: {
      ...nodeLabelStyles,
      ...cfg.labelCfg,
    },
    // 图标样式
    iconStyles: {
      ...iconStyles,
      ...cfg.iconStyles,
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
export default (G6, registerObj) => {
 const {isEdit, getSates} = registerObj
  G6.registerNode(
    "base-node",
    {
      getShapeStyle(cfg) {
        const width = cfg.style.width || 80;
        const height = cfg.style.height || 40;
        return getStyle.call(
          this,
          {
            width,
            height,
            radius: 20,
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
      drawAnchor(cfg, group, attrs) {
        setTimeout(() => {
          // },200)
          const { type, direction, anchorPointStyles } = group
            .getFirst()
            .attr();
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
              (c) =>
                c.get("className") === "node-anchor" && c.get("index") === i
            );
          };
          // 查找所有锚点背景
          group.getAllAnchorBg = () => {
            return group.anchorShapes.filter(
              (c) => c.get("className") === "node-anchor-bg"
            );
          };
        }, 200);
      },
      // 添加链路状态显示的数字
      drawsscont(cfg, group) {
        const width = cfg.style.width || 80;
        const height = cfg.style.height || 40;
        const [urgent, serious] = cfg.counts ? cfg.counts : []; // serious严重问题数，urgent紧急问题数
        const textNode = " | ";
        const child = group.getChildren().filter((item) => {
          return item.cfg.name == "statusGroup";
        });
        const group1 = child && child[0] ? child[0] : [];
        if (group1.getChildren().length > 0) {
          // 移除节点重新绘制
          group1.getChildren().forEach((item) => {
            item.remove();
          });
        }

        group1.addShape("text", {
          attrs: {
            text: serious || "0",
            x: width / 2 + 10,
            y: -height / 2 + 5,
            fill: "#f27859",
            fontSize: 10,
            textAlign: "center",
            // stroke: "red",
          },
          className: "node-alarm",
          draggable: true,
        });

        group1.addShape("text", {
          attrs: {
            text: textNode,
            x: width / 2 + 19,
            y: -height / 2 + 4,
            fill: "#f27859",
            fontSize: 10,
            textAlign: "top",
          },
          className: "node-alarm",
          draggable: true,
        });

        group1.addShape("text", {
          attrs: {
            text: urgent || "0",
            x: width / 2 + 32,
            y: -height / 2 + 5,
            fill: "#ffb74b",
            fontSize: 10,
            textAlign: "center",
            // stroke: "yellow",
          },
          className: "node-alarm",
          draggable: true,
        });
      },
      /* 添加文本节点 */
      /* https://g6.antv.vision/zh/docs/manual/advanced/keyconcept/shape-and-properties/#%E6%96%87%E6%9C%AC-text */
      addLabel(cfg, group, attrs) {
        const { label, labelCfg, labels, height } = attrs;

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
        } else {
          const { maxlength } = labelCfg;
          let text = maxlength ? label.substr(0, maxlength) : label || " ";
          if (label.length > maxlength) {
            text = `${text}...`;
          }

          const type = group.get("item").get("model").type;
          let position_y = 0;
          if (type == "img-node") {
            position_y = height / 2 + 12;
          } else if (type == "img-cloud") {
            position_y = 0;
          }
          group.addShape("text", {
            attrs: {
              text,
              x: 0,
              y: position_y, // 单行文本的偏移量
              ...labelCfg,
              ...labelCfg.style,
            },
            className: "node-text",
            draggable: true,
          });
        }
      },

      /* 绘制节点，包含文本 */
      draw(cfg, group) {
        return this.drawShape(cfg, group);
      },
      /* 绘制节点，包含文本 */
      drawShape(cfg, group) {
        // 元素分组
        // 合并外部样式和默认样式
        const attrs = this.getShapeStyle(cfg, group);
        // 添加节点
        const shape = group.addShape(this.shapeType, {
          // shape 属性在定义时返回
          className: `${this.shapeType}-shape`,
          xShapeNode: true, // 自定义节点标识
          draggable: true,
          attrs,
        });
        // 存在图片节点时候，吧图片作为节点渲染
        if (cfg.imgSouce || cfg.img) {
          const { width, height } = attrs;
          let img = cfg.imgSouce
            ? cfg.imgSouce
            : require(`@@/vue2-topo-edit/img/${cfg.img}`);
          group.addShape("image", {
            attrs: {
              x: -width / 2,
              y: -height / 2,
              width: width,
              height: height,
              img: img,
              className:'ImageNode',
              opacity: 1, //this.shapeType == 'rect'? 1 : 1,
              clipCfg: {
                show: false,
                type: "circle",
                r: 50,
              },
            },
            draggable: true,
          });
          group.toBack();
        }
        // 记录状态数据
        group.addGroup({
          name: "statusGroup",
          capture: false,
          draggable: false,
          visible: true,
        });
        // 给 group 添加自定义方法 按className查找元素
        group.$getItem = (className) => {
          return group
            .get("children")
            .find((item) => item.get("className") === className);
        };

        // 添加文本节点
        this.addLabel(cfg, group, attrs);
        // 添加锚点
        this.initAnchor(cfg, group);
        if (cfg.counts) {
          this.drawsscont(cfg, group, attrs);
        }
        group.toFront();
        return shape;
      },
      /* 更新节点，包含文本 */
      update(cfg, node) {
        const model = node.get("model");
        const { attrs } = node.get("keyShape");
        const group = node.get("group");
        const circel_r = cfg.width >= cfg.height ? cfg.width : cfg.height;
        attrs.r = circel_r / 2 + 2 || 20; // 修改图片大小时候，显示外部的圆圈大小
        const text = group.$getItem("node-text");
        const item = group.get("children")[0];
        const item1 = group.get("children")[1];
        // const item2 = group.get('children')[2].get('children')
        const { width, height } = cfg.style;
        // 更新文本内容
        const type = group.get("item").get("model").type;
        const labelCfgstyle = model.labelCfg?.style || {};

        let position_y = 0;
        if (type == "img-node") {
          position_y = height / 2 + 12;
        } else if (type == "img-cloud") {
          position_y = 0;
        }
        console.log("position_y===>", position_y);
        if (model.updateLabel) {
          position_y = position_y + 2;
          labelCfgstyle.lineHeight = 15;
          labelCfgstyle.textAlign = "center";
          labelCfgstyle.textBaseline = "top";
        }
        text &&
          text.attr({
            y: position_y, // 单行文本的偏移量
            text: model.label,

            ...labelCfgstyle,
          });
        // 更新节点属性
        if (attrs.type === "diamond-node") {
          const path = this.getPath({
            style: {
              size: model.size,
            },
          });
          item.attr({
            ...attrs,
            ...model.style,
            path,
            width: model.size[0],
            height: model.size[1],
          });
        } else {
          const logoIcon = group
            .get("children")
            .find((x) => x.cfg.className === `${attrs.type}-logoIcon`);

          if (logoIcon) {
            logoIcon.attr({ ...model.logoIcon });
          }

          const stateIcon = group
            .get("children")
            .find((x) => x.cfg.className === `${attrs.type}-stateIcon`);
          if (stateIcon) {
            stateIcon.attr({ ...model.stateIcon });
          }
          item.attr({
            ...attrs,
            ...model.style,
            x: this.shapeType == "circle" ? -0 : -width / 2,
            y: this.shapeType == "circle" ? -0 : -height / 2,
          });

          if (type == "img-node" || type == "img-cloud") {
            let img = require(`@@/vue2-topo-edit/img/${cfg.img}`);

            item1.attr({
              x: -width / 2,
              y: -height / 2,
              width: width,
              height: height,
              img: img,
            });
          }
        }
        group.toFront();

        if (cfg.counts && cfg.counts.length > 0) {
          this.drawsscont(cfg, group, attrs);
        } else if (!cfg.counts || (cfg.counts && cfg.counts.length == 0)) {
          const statusGroup = group.find(
            (ele) => ele.get("name") == "statusGroup"
          );
          statusGroup && statusGroup.clear();
        }
      },
      afterUpdate(cfg, node) {
        // let { width, height } = cfg.style;
        const group = node.get("group");
        group.cfg.children[2].cfg.visible = true;
        const keyShape = node.get("keyShape");
        if (cfg.counts) {
          keyShape.attr("r", 36);
        }
        group.toFront();
      },

      /* 设置节点的状态，主要是交互状态，业务状态请在 draw 方法中实现 */
      setState(name, value, item) {
        // const buildInEvents = [
        //   "anchorShow",
        //   "anchorActived",
          // "nodeState",
          // "nodeState:default",
          // "nodeState:selected_node",
          // "nodeState:selected",
          // "nodeState:hover",
          // "nodeOnDragStart",
          // "nodeOnDrag",
          // "nodeOnDragEnd",
          // "selected",
          // "alarm-urgent",
          // "alarm-general",
          // "alarm-serious",
        // ];
        // const group = item.getContainer();
        // if (group.get("destroyed")) return;

        // if (buildInEvents.includes(name)) {
        //  itemEvents[name].call(this, value, group, name);
        // } else if (this.stateApplying) {
        //   this.stateApplying.call(this, name, value, item);
        // } else {
        //   console.warn(
        //     `warning: ${name} 事件回调未注册!\n可继承该节点并通过 stateApplying 方法进行注册\n如已注册请忽略 (-_-!)`
        //   );
        // }
        console.log("123123123",1)
        typeof(getSates) == 'function' ? getSates(name, value, item): ''
      },
      /* 获取锚点（相关边的连入点） */
      getAnchorPoints(cfg) {
        let arr = [];
        if (isEdit) {
          arr = [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5],
          ];
        } else {
          [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5],
            [0.5, 0.5],
          ];
        }

        return cfg.anchorPoints || arr;
      },
    },
    "single-node"
  );
};
