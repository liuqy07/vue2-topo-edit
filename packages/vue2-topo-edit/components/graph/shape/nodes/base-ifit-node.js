/**
 * @author claude
 * @date 2020/3/15
 * @description 注册基础节点, 其他节点都在此基础上继承和扩展
 */

import itemEvents from './item-event'
import anchorEvent from './anchor-event'
import defaultStyles from '../defaultStyles'

const { iconStyles, nodeStyles, anchorPointStyles, nodeLabelStyles } = defaultStyles

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
      ...cfg.labelCfg
    },
    // 图标样式
    iconStyles: {
      ...iconStyles,
      ...cfg.iconStyles
    },
    // 锚点样式
    anchorPointStyles: {
      ...anchorPointStyles,
      ...cfg.anchorPointStyles
    },
    ...cfg.nodeStateStyles,
    // 锚点高亮样式
    anchorHotsoptStyles: cfg.anchorHotsoptStyles
  }
}

/*
 * 注册基础node => 添加锚点/图标 => 绘制node => 初始化node状态 => node动画(设置交互动画)
 */
export default (G6, vue) => {
  const Util = G6.Util
  G6.registerNode(
    'base-node-more',
    {
      getShapeStyle(cfg) {
        const width = cfg.style.width || 80
        const height = cfg.style.height || 40
        return getStyle.call(
          this,
          {
            width,
            height,
            radius: 20,
            // 将图形中心坐标移动到图形中心, 用于方便鼠标位置计算
            x: -width / 2,
            y: -height / 2
          },
          cfg
        )
      },
      // 绘制图标
      afterUpdate() {}
    },
    'single-node'
  )

  G6.registerNode(
    'base-node-ifit',
    {
      getShapeStyle(cfg) {
        const width = cfg.style.width || 80
        const height = cfg.style.height || 40
        return getStyle.call(
          this,
          {
            width,
            height,
            radius: 20,
            // 将图形中心坐标移动到图形中心, 用于方便鼠标位置计算
            x: -width / 2,
            y: -height / 2
          },
          cfg
        )
      },
      // 绘制图标
      drawIcon(cfg, group, attrs) {
        const { logoIcon, stateIcon } = attrs
        const icons = [logoIcon, stateIcon]

        icons.forEach(($item, index) => {
          if ($item) {
            const className = `${attrs.type}-${index === 0 ? 'logoIcon' : 'stateIcon'}`

            let item = group.$getItem(className)

            if (!item) {
              const icon = group.addShape($item.img ? 'image' : 'text', {
                attrs: {
                  ...$item,
                  ...$item.style
                },
                draggable: true,
                className
              })

              icon.toFront()
              item = group.$getItem(className)
            }

            if (item) {
              if ($item.show) {
                item.show()
              } else {
                item.hide()
              }
            }
          }
        })
      },
      // 绘制锚点
      initAnchor(cfg, group) {
        group.anchorShapes = []
        group.showAnchor = () => {
          this.drawAnchor(cfg, group)
        }
        group.clearAnchor = () => {
          if (group.anchorShapes) {
            const line = group.$getItem('dashed-line')

            if (line) {
              line.remove()
            }
            group.anchorShapes.forEach((a) => a.remove())
          }
          group.anchorShapes = []
        }
      },
      drawAnchor(cfg, group, attrs) {
        setTimeout(() => {
          // },200)
          const { type, direction, anchorPointStyles } = group.getFirst().attr()
          const item = group.get('children')[0]
          const bBox = item.getBBox()
          // bBox.x = -bBox.width/2
          // bBox.y = -bBox.height/2
          const anchors = this.getAnchorPoints(cfg)
          // 绘制锚点坐标
          anchors &&
            anchors.forEach((p, i) => {
              const diff = type === 'triangle-node' ? (direction === 'up' ? 1 : 0) : 0.5
              const x = bBox.width * (p[0] - 0.5)
              const y = bBox.height * (p[1] - diff)

              /**
               * 绘制三层锚点
               * 最底层: 锚点bg
               * 中间层: 锚点
               * 最顶层: 锚点group, 用于事件触发
               */
              // 视觉锚点
              const anchor = group.addShape('circle', {
                attrs: {
                  x: x,
                  y: y,
                  ...anchorPointStyles
                },
                zIndex: 1,
                nodeId: group.get('id'),
                className: 'node-anchor',
                draggable: true,
                isAnchor: true,
                index: i
              })

              // 锚点事件触发的元素
              const anchorGroup = group.addShape('circle', {
                attrs: {
                  x,
                  y,
                  r: 11,
                  fill: '#000',
                  opacity: 0
                },
                zIndex: 2,
                nodeId: group.get('id'),
                className: 'node-anchor-group',
                draggable: true,
                isAnchor: true,
                index: i
              })
              /**
               * 添加锚点事件绑定
               */
              anchorEvent(anchorGroup, group, p)

              group.anchorShapes.push(anchor)
              group.anchorShapes.push(anchorGroup)
            })

          // 查找所有锚点
          group.getAllAnchors = () => {
            return group.anchorShapes.filter((c) => c.get('isAnchor') === true)
          }
          // 查找指定锚点
          group.getAnchor = (i) => {
            return group.anchorShapes.filter((c) => c.get('className') === 'node-anchor' && c.get('index') === i)
          }
          // 查找所有锚点背景
          group.getAllAnchorBg = () => {
            return group.anchorShapes.filter((c) => c.get('className') === 'node-anchor-bg')
          }
        }, 200)
      },

      drawsscont1(cfg, group, attrs) {
        const width = cfg.style.width || 80
        const height = cfg.style.height || 40
        const alarmIcon = cfg.alarmIcon ? cfg.alarmIcon : false // serious严重问题数，urgent紧急问题数
        // let textNode = ' | '
        const group1 = group.addGroup({
          name: 'statusGroup1',
          capture: true,
          draggable: true
        })

        const child = group.getChildren().filter((item) => {
          return item.cfg.name == 'statusGroup1'
        })

        if (child.cfg && child.cfg.children && child.cfg.children.length > 0) {
          // 移除节点重新绘制
          child.child.cfg.children.forEach((item) => {
            item.remove()
          })
        }
        const imgalarm = '' //require('../../../../../../assets/images/topo/ifitTopo_new/warning.png')
        group1.addShape('image', {
          attrs: {
            x: width / 2,
            y: -height / 2 - 12,
            width: 18,
            height: 18,
            img: imgalarm,
            opacity: 1
          },
          className: 'node-alarm',
          draggable: true,
          capture: true // 允许触发事件
        })
      },
      // 添加链路状态显示的数字
      drawsscont(cfg, group, attrs) {
        const width = cfg.style.width || 80
        const height = cfg.style.height || 40
        const [urgent, serious] = cfg.counts ? cfg.counts : [] // serious严重问题数，urgent紧急问题数
        const textNode = ' | '
        const child = group.getChildren().filter((item) => {
          return item.cfg.name == 'statusGroup'
        })
        const group1 = child && child[0] ? child[0] : []
        if (group1.getChildren().length > 0) {
          // 移除节点重新绘制
          group1.getChildren().forEach((item) => {
            item.remove()
          })
        }
        console.log('child', child)
        // child?.[0]?.clear() ?? ''
        child.forEach((item) => {
          item.clear()
          // item.remove();
        })
        const urgentLenth = (urgent > serious ? urgent : serious).toString().length
        const imgalarm = ''
        group1.addShape('image', {
          attrs: {
            x: -width / 4 + 20,
            y: -height / 2 - 10,
            width: 18,
            height: 18,
            img: imgalarm,
            opacity: 1
          },
          className: 'node-alarm',
          draggable: true
        })

        group1.addShape('text', {
          attrs: {
            text: urgent || '0',
            x: width / 4 + 25,
            y: -height / 2 + 5,
            fill: '#f27859',
            fontSize: 10,
            textAlign: 'center'
            // stroke: "red",
          },
          className: 'node-alarm',
          draggable: true
        })

        group1.addShape('text', {
          attrs: {
            text: textNode,
            x: width / 4 + 25 + urgentLenth * 3.5,
            y: -height / 2 + 5,
            fill: '#f27859',
            fontSize: 10,
            textAlign: 'top'
          },
          className: 'node-alarm',
          draggable: true
        })

        group1.addShape('text', {
          attrs: {
            text: serious || '0',
            x: width / 4 + 25 + urgentLenth * 3.5 * 2 + 6,
            y: -height / 2 + 5,
            fill: '#ffb74b',
            fontSize: 10,
            textAlign: 'center'
            // stroke: "yellow",
          },
          className: 'node-alarm',
          draggable: true
        })
      },

      /* 添加文本节点 */
      /* https://g6.antv.vision/zh/docs/manual/advanced/keyconcept/shape-and-properties/#%E6%96%87%E6%9C%AC-text */
      addLabel(cfg, group, attrs) {
        const { label, labelCfg, labels, height } = attrs

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
              className
            } = item

            let text = maxlength ? label.substr(0, maxlength) : label || ' '

            if (label && label.length > maxlength) {
              text = `${text}...`
            }

            group.addShape('text', {
              attrs: {
                text,
                ...item,
                ...item.labelCfg,
                ...item.labelCfg.style
              },
              className: `node-text ${className}`,
              draggable: true
            })
          })
        } else {
          const { maxlength } = labelCfg

          let text = maxlength ? label.substr(0, maxlength) : label || ' '

          if (label && label.length > maxlength) {
            text = `${text}...`
          }

          const type = group.get('item').get('model').type
          let position_y = 0
          if (type == 'img-ifit') {
            position_y = height / 2 + 12
          } else if (type == 'img-cloud') {
            position_y = 0
          }
          group.addShape('text', {
            attrs: {
              text,
              x: 0,
              y: position_y, // 单行文本的偏移量
              ...labelCfg,
              ...labelCfg.style
            },
            className: 'node-text',
            draggable: true
          })
        }
      },

      /* 绘制节点，包含文本 */
      draw(cfg, group) {
        return this.drawShape(cfg, group)
      },
      /* 绘制节点，包含文本 */
      drawShape(cfg, group) {
        // 元素分组
        // 合并外部样式和默认样式
        // let  width = cfg.style.width || 80;
        // let  height = cfg.style.height || 40;
        const attrs = this.getShapeStyle(cfg, group)

        // 添加节点
        const shape = group.addShape(this.shapeType, {
          // shape 属性在定义时返回
          className: `${this.shapeType}-shape`,
          xShapeNode: true, // 自定义节点标识
          draggable: true,
          attrs
        })

        if (cfg.type == 'img-ifit1') {
          shape.attr('fill', '')
          // shape.attr("width", 40);
          // shape.attr("height", 40);
          const { width, height } = cfg
          const { fill } = attrs
          group.addShape('rect', {
            attrs: {
              className: `node-line-shape`,
              x: -width / 2,
              y: -height / 2,
              width: width,
              height: height,
              fill: fill
            },
            draggable: true
          })

          group.toBack()
        }

        // 存在图片节点时候，吧图片作为节点渲染
        if (cfg.img) {
          // let { width, height } = attrs;
          const { width, height } = attrs
          const imgsplit = cfg.img?.split('/') ?? []
          const imgurl = imgsplit[imgsplit.length - 1] ?? cfg.img
          const url = process.env.BASE_URL + 'svg/' + imgurl.replace('.png', '.svg')
          console.log('url', url)
          // const img = require(`@/assets/images/topo/ifitTopo_new/${imgurl}`) // require("@/assets/images/topo/ifitTopo_new/" + imgurl);
          group.addShape('image', {
            attrs: {
              x: -width / 2,
              y: -height / 2,
              width: width,
              height: height,
              img: url,
              opacity: 1,
              clipCfg: {
                show: false,
                type: 'circle',
                r: 50
              }
            },
            draggable: true,
            className: 'img-Node-ifit'
          })
          const rect = group.addShape('rect', {
            attrs: {
              className: 'imgrect',
              x: -width / 2 - 1,
              y: -height / 2 - 1,
              width: width + 2,
              height: height + 2,
              stroke: '#1890ff',
              lineWidth: 1.5,
              lineDash: [1.5, 1.5]
            },
            name: 'imgrect',
            draggable: true
          })
          rect.hide()
          group.toBack()
        }
        // 添加分组，留给上方的数字显示使用
        const group1 = group.addGroup({
          name: 'statusGroup',
          capture: false,
          draggable: false,
          visible: true
        })

        // 给 group 添加自定义方法 按className查找元素
        group.$getItem = (className) => {
          return group.get('children').find((item) => item.get('className') === className)
        }

        // 添加文本节点
        this.addLabel(cfg, group, attrs)
        // 添加图标
        this.drawIcon(cfg, group, attrs)
        // 添加锚点
        this.initAnchor(cfg, group)

        if (cfg.counts) {
          this.drawsscont(cfg, group, attrs)
        }

        if (cfg.alarmIcon) {
          this.drawsscont1(cfg, group, attrs)
        }

        group.toFront()
        return shape
      },
      /* 更新节点，包含文本 */
      update(cfg, node) {
        const model = node.get('model')
        const { attrs } = node.get('keyShape')
        const group = node.get('group')
        const circel_r = cfg.width >= cfg.height ? cfg.width : cfg.height
        attrs.r = circel_r / 2 + 2 || 20 // 修改图片大小时候，显示外部的圆圈大小
        const text = group.$getItem('node-text')
        const item = group.get('children')[0]
        const item1 = group.get('children')[1]
        const item2 = group.get('children')[2].get('children')
        const { width, height } = cfg.style
        // 更新文本内容
        const type = group.get('item').get('model').type
        const labelCfgstyle = model.labelCfg?.style || {}

        let position_y = 0
        if (type == 'img-ifit') {
          position_y = height / 2 + 12
        } else if (type == 'img-cloud') {
          position_y = 0
        }
        console.log('position_y===>', position_y)
        if (model.updateLabel) {
          position_y = position_y + 2
          labelCfgstyle.lineHeight = 15
          labelCfgstyle.textAlign = 'center'
          labelCfgstyle.textBaseline = 'top'
        }

        text &&
          text.attr({
            y: position_y, // 单行文本的偏移量
            text: model.label,

            ...labelCfgstyle
          })
        // 更新节点属性
        if (attrs.type === 'diamond-node') {
          const path = this.getPath({
            style: {
              size: model.size
            }
          })
          item.attr({
            ...attrs,
            ...model.style,
            path,
            width: model.size[0],
            height: model.size[1]
          })
        } else {
          const logoIcon = group.get('children').find((x) => x.cfg.className === `${attrs.type}-logoIcon`)

          if (logoIcon) {
            logoIcon.attr({ ...model.logoIcon })
          }

          const stateIcon = group.get('children').find((x) => x.cfg.className === `${attrs.type}-stateIcon`)
          if (stateIcon) {
            stateIcon.attr({ ...model.stateIcon })
          }

          item.attr({
            ...attrs,
            ...model.style,
            x: this.shapeType == 'circle' ? -0 : -width / 2,
            y: this.shapeType == 'circle' ? -0 : -height / 2
          })

          if (type == 'img-ifit' || type == 'img-cloud') {
            // let img
            // if (type == 'img-cloud') {
            //   if (cfg.img.length < 100 && cfg.img.indexOf('static') == -1 && cfg.img.indexOf('assets/') == -1) {
            //     img = require('@/assets/images' + cfg.img)
            //   } else if (cfg.img.indexOf('assets/') > -1) {
            //     img = require('@/assets/images/topo/topo_new/' + cfg.img.split('/')[cfg.img.split('/').length - 1])
            //   } else {
            //     img = cfg.img
            //   }
            // } else {
            //   const imgurl = cfg.img?.split('/')?.[cfg.img.split('/').length - 1] ?? 'a_leaf_1.png'
            //   img = require('@/assets/images/topo/ifitTopo_new/' + imgurl)
            // }
           const imgsplit = cfg.img?.split('/') ?? []
           const imgurl = imgsplit[imgsplit.length - 1] ?? cfg.img
           const url = process.env.BASE_URL + 'svg/' + imgurl.replace('.png', '.svg')

            item1.attr({
              x: -width / 2,
              y: -height / 2,
              width: width,
              height: height,
              img: url
            })
          }
        }
        group.toFront()

        if (cfg.counts && cfg.counts.length > 0) {
          this.drawsscont(cfg, group, attrs)
        } else if (!cfg.counts || (cfg.counts && cfg.counts.length == 0)) {
          const statusGroup = group.find((ele) => ele.get('name') == 'statusGroup')
          statusGroup.clear()
        }
      },
      afterUpdate(cfg, node) {
        // let { width, height } = cfg.style;
        const group = node.get('group')
        group.cfg.children[2].cfg.visible = true
        const keyShape = node.get('keyShape')

        if (cfg.type == 'img-ifit1') {
          keyShape.attr('fill', '')
        }
        const rect = group.get('children').find((item) => {
          return item.attrs.className === 'node-line-shape'
        })

        rect?.attr('fill', cfg.style.fill) ?? ''
        rect?.attr('width', cfg.style.width) ?? ''
        rect?.attr('height', cfg.style.height) ?? ''
        cfg.width = cfg.style.width
        cfg.height = cfg.style.height
        console.log('rectrectrectrect', rect)
        if (cfg.counts) {
          keyShape.attr('r', 36)
        }

        const rect1 = group.get('children').find((item) => {
          return item.attrs.className === 'imgrect'
        })
        rect1 && rect1.hide()
        group.toFront()
      },

      /* 设置节点的状态，主要是交互状态，业务状态请在 draw 方法中实现 */
      setState(name, value, item) {
        const buildInEvents = [
          'anchorShow',
          'anchorActived',
          'nodeState',
          'nodeState:default',
          'nodeState:selected_node',
          'nodeState:selected',
          'nodeState:hover',
          'nodeOnDragStart',
          'nodeOnDrag',
          'nodeOnDragEnd',
          'selected',
          'alarm-urgent',
          'alarm-general',
          'alarm-serious'
        ]
        const group = item.getContainer()
        if (group.get('destroyed')) return

        if (buildInEvents.includes(name)) {
          if (name.indexOf('alarm') > -1) {
            itemEvents['alarm-urgent'].call(this, value, group, name)
          } else {
            // 当元素存在告警的时候，点击选中其他不增加状态
            const hasalarm = item.getStates().some((ele) => {
              return ele.indexOf('alarm') > -1
            })

            if (!hasalarm) {
              itemEvents[name].call(this, value, group, name)
            }
          }
          // 内部this绑定到了当前item实例
        } else if (this.stateApplying) {
          this.stateApplying.call(this, name, value, item)
        } else {
          const rect = item._cfg.group.getChildren().find((item) => item.cfg.name == 'imgrect')
          const img = item._cfg.group.getChildren().find((item) => item.cfg.className == 'img-Node-ifit')
          let r = img?.attr()?.width + 5 || 20
          r = r / 2
          if (name == 'ifit-satus') {
            if (value) {
              rect && rect.show()
            } else {
              rect && rect.hide()
            }
          } else if (name == 'ifit-satus-animal') {
            if (value) {
              const children = item?._cfg.group?.getChildren() ?? []

              // children.forEach((e) => {
              //   if (e.cfg.name == "back-shape-animal") {

              //     e.stopAnimate();
              //     e.remove();
              //   }
              // });

              const backGrop = children.filter((item) => item.cfg.name == 'back-shape-animal')
              if (backGrop && backGrop.length > 2) {
                return false
              }

              const back1 = item._cfg.group.addShape('circle', {
                zIndex: -3,
                attrs: {
                  x: 0,
                  y: 0,
                  r: r - 1,
                  fill: '#F53F3F',
                  opacity: 0.1
                },
                // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                name: 'back-shape-animal'
              })
              const back2 = item._cfg.group.addShape('circle', {
                zIndex: -3,
                attrs: {
                  x: 0,
                  y: 0,
                  r: r - 1,
                  fill: '#F53F3F',
                  opacity: 0.1
                },
                // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                name: 'back-shape-animal'
              })
              const back3 = item._cfg.group.addShape('circle', {
                zIndex: -3,
                attrs: {
                  x: 0,
                  y: 0,
                  r: r - 1,
                  fill: '#F53F3F',
                  opacity: 0.1
                },
                // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
                name: 'back-shape-animal'
              })

              back1.animate(
                {
                  // Magnifying and disappearing
                  r: r + 6,
                  opacity: 0.1
                },
                {
                  duration: 3000,
                  easing: 'easeCubic',
                  delay: 0,
                  repeat: true // repeat
                }
              ) // no delay
              back2.animate(
                {
                  // Magnifying and disappearing
                  r: r + 6,
                  opacity: 0.2
                },
                {
                  duration: 3000,
                  easing: 'easeCubic',
                  delay: 1500,
                  repeat: true // repeat
                }
              ) // no delay
              back3.animate(
                {
                  // Magnifying and disappearing
                  r: r + 6,
                  opacity: 0.3
                },
                {
                  duration: 3000,
                  easing: 'easeCubic',
                  delay: 3000,
                  repeat: true // repeat
                }
              ) // no delay
              img.toFront()
            } else {
              const circlegroup = item._cfg.group.getChildren().filter((item) => item.cfg.name == 'back-shape-animal')
              circlegroup.forEach((item) => {
                item.stopAnimate()
                item.remove()
              })
            }
          }
        }
      },
      /* 获取锚点（相关边的连入点） */
      getAnchorPoints(cfg) {
        let arr = []
        if (vue.isEdit) {
          arr = [
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5]
          ]
          if (cfg.type == 'img-ifit1') {
            arr = [[0.5, 0.5]]
          }
        } else {
          ;[
            [0.5, 0],
            [1, 0.5],
            [0.5, 1],
            [0, 0.5],
            [0.5, 0.5]
          ]
        }

        return cfg.anchorPoints || arr
      }
    },
    'single-node'
  )

  // G6.registerNode(
  //   "base-node-ifit",
  //   {
  //     getShapeStyle(cfg) {
  //       const width = cfg.style.width || 80;
  //       const height = cfg.style.height || 40;
  //       return getStyle.call(
  //         this,
  //         {
  //           width,
  //           height,
  //           radius: 20,
  //           // 将图形中心坐标移动到图形中心, 用于方便鼠标位置计算
  //           x: -width / 2,
  //           y: -height / 2,
  //         },
  //         cfg
  //       );
  //     },
  //     // 添加链路状态显示的数字
  //     drawsscont(cfg, group, attrs) {
  //       const width = cfg.style.width || 80;
  //       const height = cfg.style.height || 40;
  //       const [urgent, serious] = cfg.counts ? cfg.counts : []; //serious严重问题数，urgent紧急问题数
  //       let textNode = " | ";
  //       let child = group.getChildren().filter((item) => {
  //         return item.cfg.name == "statusGroup";
  //       });
  //       let group1 = child && child[0] ? child[0] : [];
  //       if (group1.getChildren().length > 0) {
  //         // 移除节点重新绘制
  //         group1.getChildren().forEach((item) => {
  //           item.remove();
  //         });
  //       }

  //       let imgalarm = require("../../../../../../assets/images/一级告警.png");
  //       group1.addShape("image", {
  //         attrs: {
  //           x: -width / 4 - 9,
  //           y: -height / 2 - 30,
  //           width: 20,
  //           height: 20,
  //           img: imgalarm,

  //           // clipCfg: {
  //           //   show: false,
  //           //   type: 'circle',
  //           //   r: 6
  //           // }
  //         },
  //         className: "node-alarm",
  //         draggable: true,
  //       });
  //       group1.addShape("text", {
  //         attrs: {
  //           text: serious ? serious : "0",
  //           x: width / 4 - 4,
  //           y: -height / 2 - 15,
  //           fill: "#f27859",
  //           fontSize: 10,
  //           textAlign: "center",
  //           // stroke: "red",
  //         },
  //         className: "node-alarm",
  //         draggable: true,
  //       });

  //       group1.addShape("text", {
  //         attrs: {
  //           text: textNode,
  //           x: width / 4 + 0,
  //           y: -height / 2 - 15,
  //           fill: "#f27859",
  //           fontSize: 10,
  //           textAlign: "top",
  //         },
  //         className: "node-alarm",
  //         draggable: true,
  //       });

  //       group1.addShape("text", {
  //         attrs: {
  //           text: urgent ? urgent : "0",
  //           x: width / 4 + 15,
  //           y: -height / 2 - 15,
  //           fill: "#ffb74b",
  //           fontSize: 10,
  //           textAlign: "center",
  //           // stroke: "yellow",
  //         },
  //         className: "node-alarm",
  //         draggable: true,
  //       });
  //     },

  //     // 绘制锚点
  //     initAnchor(cfg, group) {
  //       group.anchorShapes = [];
  //       group.showAnchor = () => {
  //         this.drawAnchor(cfg, group);
  //       };
  //       group.clearAnchor = () => {
  //         if (group.anchorShapes) {
  //           const line = group.$getItem("dashed-line");

  //           if (line) {
  //             line.remove();
  //           }
  //           group.anchorShapes.forEach((a) => a.remove());
  //         }
  //         group.anchorShapes = [];
  //       };
  //     },
  //     drawAnchor(cfg, group, attrs) {
  //       setTimeout(() => {
  //         // },200)
  //         const { type, direction, anchorPointStyles } = group
  //           .getFirst()
  //           .attr();
  //         const item = group.get("children")[0];
  //         const bBox = item.getBBox();
  //         // bBox.x = -bBox.width/2
  //         // bBox.y = -bBox.height/2
  //         const anchors = this.getAnchorPoints(cfg);
  //         // 绘制锚点坐标
  //         anchors &&
  //           anchors.forEach((p, i) => {
  //             const diff =
  //               type === "triangle-node" ? (direction === "up" ? 1 : 0) : 0.5;
  //             const x = bBox.width * (p[0] - 0.5);
  //             const y = bBox.height * (p[1] - diff);

  //             /**
  //              * 绘制三层锚点
  //              * 最底层: 锚点bg
  //              * 中间层: 锚点
  //              * 最顶层: 锚点group, 用于事件触发
  //              */
  //             // 视觉锚点
  //             const anchor = group.addShape("circle", {
  //               attrs: {
  //                 x: x,
  //                 y: y,
  //                 ...anchorPointStyles,
  //               },
  //               zIndex: 1,
  //               nodeId: group.get("id"),
  //               className: "node-anchor",
  //               draggable: true,
  //               isAnchor: true,
  //               index: i,
  //             });

  //             // 锚点事件触发的元素
  //             const anchorGroup = group.addShape("circle", {
  //               attrs: {
  //                 x,
  //                 y,
  //                 r: 11,
  //                 fill: "#000",
  //                 opacity: 0,
  //               },
  //               zIndex: 2,
  //               nodeId: group.get("id"),
  //               className: "node-anchor-group",
  //               draggable: true,
  //               isAnchor: true,
  //               index: i,
  //             });
  //             /**
  //              * 添加锚点事件绑定
  //              */
  //             anchorEvent(anchorGroup, group, p);

  //             group.anchorShapes.push(anchor);
  //             group.anchorShapes.push(anchorGroup);
  //           });

  //         // 查找所有锚点
  //         group.getAllAnchors = () => {
  //           return group.anchorShapes.filter((c) => c.get("isAnchor") === true);
  //         };
  //         // 查找指定锚点
  //         group.getAnchor = (i) => {
  //           return group.anchorShapes.filter(
  //             (c) =>
  //               c.get("className") === "node-anchor" && c.get("index") === i
  //           );
  //         };
  //         // 查找所有锚点背景
  //         group.getAllAnchorBg = () => {
  //           return group.anchorShapes.filter(
  //             (c) => c.get("className") === "node-anchor-bg"
  //           );
  //         };
  //       }, 200);
  //     },
  //     /* 添加文本节点 */
  //     /* https://g6.antv.vision/zh/docs/manual/advanced/keyconcept/shape-and-properties/#%E6%96%87%E6%9C%AC-text */
  //     addLabel(cfg, group, attrs) {
  //       const { label, labelCfg, labels, height } = attrs;
  //       // 字体小于12时 svg会报错
  //       /* if (labelCfg && labelCfg.fontSize < 12) {
  //       labelCfg.fontSize = 12;
  //     } */
  //       // 多行文本
  //       if (labels) {
  //         labels.forEach((item) => {
  //           const {
  //             label,
  //             labelCfg: { maxlength },
  //             className,
  //           } = item;

  //           let text = maxlength ? label.substr(0, maxlength) : label || "";

  //           if (label.length > maxlength) {
  //             text = `${text}...`;
  //           }

  //           group.addShape("text", {
  //             attrs: {
  //               text,
  //               ...item,
  //               ...item.labelCfg,
  //               ...item.labelCfg.style,
  //             },
  //             className: `node-text ${className}`,
  //             draggable: true,
  //           });
  //         });
  //       } else if (label) {
  //         const { maxlength } = labelCfg;

  //         let text = maxlength ? label.substr(0, maxlength) : label || "";
  //         if (label.length > maxlength) {
  //           text = `${text}...`;
  //         }

  //         let type = group.get("item").get("model").type;
  //         let position_y = 0;
  //         if (type == "img-ifit") {
  //           position_y = height / 2 + 12;
  //         } else if (type == "img-cloud") {
  //           position_y = 0;
  //         }
  //         group.addShape("text", {
  //           attrs: {
  //             text,
  //             x: 0,
  //             y: position_y, //单行文本的偏移量
  //             ...labelCfg,
  //             ...labelCfg.style,
  //           },
  //           className: "node-text",
  //           draggable: true,
  //         });
  //       }
  //     },

  //     /* 绘制节点，包含文本 */
  //     draw(cfg, group) {
  //       return this.drawShape(cfg, group);
  //     },
  //     /* 绘制节点，包含文本 */
  //     drawShape(cfg, group) {
  //       // 元素分组
  //       const attrs = this.getShapeStyle(cfg, group);
  //       // 添加节点
  //       const shape = group.addShape(this.shapeType, {
  //         // shape 属性在定义时返回
  //         className: `${this.shapeType}-shape`,
  //         xShapeNode: true, // 自定义节点标识
  //         draggable: true,
  //         attrs,
  //       });
  //       // 存在图片节点时候，吧图片作为节点渲染
  //       if (cfg.img) {
  //         let { width, height } = attrs;
  //         let img = require("@/assets/images/topo/ifitTopo_new/" + cfg.img);
  //         group.addShape("image", {
  //           attrs: {
  //             x: -width / 2,
  //             y: -height / 2,
  //             width: width,
  //             height: height,
  //             img: img,
  //             opacity: 1,
  //             clipCfg: {
  //               show: false,
  //               type: "circle",
  //               r: 50,
  //             },
  //           },
  //           name: "imgnode",
  //           className: "img-Node-ifit",
  //           draggable: true,
  //         });
  //         let rect = group.addShape("rect", {
  //           attrs: {
  //             className: "imgrect",
  //             x: -width / 2 - 1,
  //             y: -height / 2 - 1,
  //             width: width + 2,
  //             height: height + 2,
  //             stroke: "#1890ff",
  //             lineWidth: 2.5,
  //             lineDash: [2, 2],
  //           },
  //           name: "imgrect",
  //           draggable: true,
  //         });

  //         rect.hide();
  //         group.toBack();
  //       }
  //       // 添加分组，留给上方的数字显示使用
  //       group.addGroup({
  //         name: "statusGroup",
  //         capture: false,
  //         draggable: false,
  //         visible: true,
  //       });

  //       // 给 group 添加自定义方法 按className查找元素
  //       group.$getItem = (className) => {
  //         return group
  //           .get("children")
  //           .find((item) => item.get("className") === className);
  //       };

  //       // 添加文本节点
  //       this.addLabel(cfg, group, attrs);
  //       // 添加图标
  //       // 添加锚点
  //       this.initAnchor(cfg, group);
  //       if (cfg.counts) {
  //         this.drawsscont(cfg, group, attrs);
  //       }
  //       group.toFront();
  //       return shape;
  //     },
  //     /* 更新节点，包含文本 */
  //     update(cfg, node) {
  //       let { width, height } = cfg.style;
  //       let group = node._cfg.group;
  //       // 更新文本内容
  //       let position_y = height / 2 + 12;

  //       const item = group.get("children")[0];
  //       const item1 = group.get("children")[1];
  //       const { attrs } = node.get("keyShape");

  //       const text = group
  //         .getChildren()
  //         .find((item) => item.cfg.className == "node-text");
  //       const model = node.get("model");
  //       text &&
  //         text.attr({
  //           opacity: 1,
  //           y: position_y, //单行文本的偏移量
  //           text: model.label,
  //           ...(model?.labelCfg?.style || {}),
  //         });
  //       // 更新节点属性
  //       //   let  img = require("@/assets/images/topo/ifitTopo/" + cfg.img)
  //       //   item1.attr({
  //       //     opacity: 1,
  //       //     x:-width/2,
  //       //     y:-height/2,
  //       //     width: width,
  //       //     height: height,
  //       //     img: img,
  //       //   });
  //       //  group.toFront()
  //       if (cfg.counts && cfg.counts.length > 0) {
  //         this.drawsscont(cfg, group, attrs);
  //       } else if (!cfg.counts || (cfg.counts && cfg.counts.length == 0)) {
  //         let statusGroup = group.find(
  //           (ele) => ele.get("name") == "statusGroup"
  //         );
  //         statusGroup.clear();
  //       }
  //     },
  //     afterUpdate(cfg, node) {
  //       let { width, height } = cfg.style;
  //       const group = node.get("group");
  //       group.toFront();
  //     },
  //     /* 设置节点的状态，主要是交互状态，业务状态请在 draw 方法中实现 */
  //     setState(name, value, item) {
  //       let rect = item._cfg.group
  //         .getChildren()
  //         .find((item) => item.cfg.name == "imgrect");
  //       let img = item._cfg.group
  //         .getChildren()
  //         .find((item) => item.cfg.className == "img-Node-ifit");
  //       let r = img?.attr()?.width || 20;
  //       r = r / 2;
  //       if (name == "ifit-satus") {
  //         if (value) {
  //           rect && rect.show();
  //         } else {
  //           rect && rect.hide();
  //         }
  //       } else if (name == "ifit-satus-animal") {
  //         if (value) {
  //           const back1 = item._cfg.group.addShape("circle", {
  //             zIndex: -3,
  //             attrs: {
  //               x: 0,
  //               y: 0,
  //               r: r - 1,
  //               fill: "#F53F3F",
  //               opacity: 0.1,
  //             },
  //             // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
  //             name: "back-shape-animal",
  //           });
  //           const back2 = item._cfg.group.addShape("circle", {
  //             zIndex: -3,
  //             attrs: {
  //               x: 0,
  //               y: 0,
  //               r: r - 1,
  //               fill: "#F53F3F",
  //               opacity: 0.1,
  //             },
  //             // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
  //             name: "back-shape-animal",
  //           });
  //           const back3 = item._cfg.group.addShape("circle", {
  //             zIndex: -3,
  //             attrs: {
  //               x: 0,
  //               y: 0,
  //               r: r - 1,
  //               fill: "#F53F3F",
  //               opacity: 0.1,
  //             },
  //             // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
  //             name: "back-shape-animal",
  //           });

  //           back1.animate(
  //             {
  //               // Magnifying and disappearing
  //               r: r + 6,
  //               opacity: 0.1,
  //             },
  //             {
  //               duration: 3000,
  //               easing: "easeCubic",
  //               delay: 0,
  //               repeat: true, // repeat
  //             }
  //           ); // no delay
  //           back2.animate(
  //             {
  //               // Magnifying and disappearing
  //               r: r + 6,
  //               opacity: 0.2,
  //             },
  //             {
  //               duration: 3000,
  //               easing: "easeCubic",
  //               delay: 1500,
  //               repeat: true, // repeat
  //             }
  //           ); // no delay
  //           back3.animate(
  //             {
  //               // Magnifying and disappearing
  //               r: r + 6,
  //               opacity: 0.3,
  //             },
  //             {
  //               duration: 3000,
  //               easing: "easeCubic",
  //               delay: 3000,
  //               repeat: true, // repeat
  //             }
  //           ); // no delay
  //           img.toFront();
  //         } else {
  //           let circlegroup = item._cfg.group
  //             .getChildren()
  //             .filter((item) => item.cfg.name == "back-shape-animal");
  //           circlegroup.forEach((item) => {
  //             item.stopAnimate();
  //             item.remove();
  //           });
  //         }
  //       }
  //     },
  //     /* 获取锚点（相关边的连入点） */
  //   },
  //   "single-node"
  // );
}
