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

function setStyle(item, nodeStyle, text, textStyle) {
  item.attr(nodeStyle)
  if (text) {
    text.attr(textStyle)
  }
}

function getItemStyle(type, group, state = 'hover') {
  const item = group.get('item')
  const attrs = group.cfg.item._cfg.styles
  let originStyle = type === 'node' ? item.get('originStyle') : item.get('originStyle')['edge-shape']
  let activeStyle = attrs[`${type}State:${state}`]
  let defaultStyle = attrs[`${type}State:default`]

  if (type === 'edge' && defaultStyle && defaultStyle.lineWidth == null) {
    defaultStyle.lineWidth = 1
  }
  // 当传入的对象是combo的时候，获取

  if (type === 'combo') {
    originStyle = item.get('originStyle')
    activeStyle = attrs[`${type}State:${state}`]
    defaultStyle = attrs[`${type}State:default`]
  }

  return {
    activeStyle,
    defaultStyle,
    originStyle
  }
}

const events = {
  /**
   * @description 锚点事件
   * 显示/隐藏锚点
   */
  anchorShow(value, group) {
    // 锚点全局开关
    // changeData 时由于实例没销毁, 这里需要处理异常
    if (group.get('children')) {
      const { anchorControls } = group.get('children')[0].cfg.attrs
      if (anchorControls && anchorControls.hide) return false
    }

    if (value) {
      group.showAnchor(group)
    } else {
      group.clearAnchor(group)
    }
  },

  /**
   * @description 锚点激活事件
   */
  anchorActived(value, group) {
    // 锚点全局开关
    if (group.get('children')) {
      const { anchorControls } = group.get('children')[0].cfg.attrs

      if (anchorControls && anchorControls.hide) return false
    }

    if (value) {
      const model = group.get('item').getModel()
      const { anchorPoints, anchorHotsoptStyles } = model

      group.showAnchor(group)

      this.getAnchorPoints({ anchorPoints }).forEach((p, i) => {
        const bbox = group.get('children')[0].getBBox()
        // 激活元素
        const hotspot = group.addShape('circle', {
          zIndex: 0,
          attrs: {
            x: bbox.minX + bbox.width * p[0],
            y: bbox.minY + bbox.height * p[1],
            r: 0,
            opacity: 0.5,
            fill: '#1890ff',
            ...anchorHotsoptStyles
          },
          nodeId: group.get('item').get('id'),
          className: 'node-anchor-bg',
          draggable: true,
          isAnchor: true,
          index: i
        })

        // 锚点动画
        hotspot.animate(
          { r: 11 },
          {
            duration: 200
          }
        )

        group.sort() // 将group中的元素按照 zIndex 从大到小排序
        group.anchorShapes.push(hotspot)
      })

      group.anchorShapes.filter((item) => {
        if (item.get('className') === 'node-anchor') {
          item.toFront()
        }
        if (item.get('className') === 'node-anchor-group') {
          item.attr({
            r: ((anchorHotsoptStyles && anchorHotsoptStyles.r) || 11) + 2
          })
          item.toFront()
        }
      })
    } else {
      // 移除
      group.clearAnchor(group)
    }
  },

  /**
   * @description 边多状态事件
   */
  nodeState(value, group) {
    if (value === false) {
      // 清除所有状态
      events['nodeState:default'].call(this, true, group)
    } else {
      events[`nodeState:${value}`] && events[`nodeState:${value}`].call(this, value, group)
    }
  },

  /**
   * @description 节点恢复默认状态事件
   */
  'nodeState:default'(value, group) {
    if (value) {
      const node = group.getChildByIndex(0)
      const text = group.getChildByIndex(1)
      const { defaultStyle } = getItemStyle.call(this, 'node', group)

      if (!defaultStyle) return
      const textStyle = defaultStyle.labelCfg && defaultStyle.labelCfg.style ? defaultStyle.labelCfg.style : {}
      setStyle(node, defaultStyle, text, textStyle)
    }
  },

  // 添加 combo的 选择事件，选中之后显示不同的状态
  'combo:selected'(value, group) {
    const node = group.getChildByIndex(0)
    const text = group.getChildByIndex(1)
    const { activeStyle, defaultStyle } = getItemStyle.call(this, 'combo', group, 'selected')

    if (!activeStyle) return
    if (value) {
      const textStyle = defaultStyle.labelCfg && defaultStyle.labelCfg.style ? defaultStyle.labelCfg.style : {}
      setStyle(node, activeStyle, text, textStyle)
    } else {
      const textStyle = defaultStyle.labelCfg && defaultStyle.labelCfg.style ? defaultStyle.labelCfg.style : {}
      setStyle(node, defaultStyle, text, textStyle)
    }
  },
  // combo 组件的默认选中状态
  // "comboState:default"(value, group){
  //   if (value) {
  //     const node = group.getChildByIndex(0);
  //     const text = group.getChildByIndex(1);
  //     const { defaultStyle } = getItemStyle.call(this, 'combo', group);

  //     if (!defaultStyle) return;
  //     const textStyle = defaultStyle.labelCfg && defaultStyle.labelCfg.style ? defaultStyle.labelCfg.style : {};

  //     setStyle(node, defaultStyle, text, textStyle);
  //   }
  // },
  /**
   * @description 节点selected事件
   */
  // node点击之后出现的状态
  'nodeState:selected'(value, group, name) {
    console.log('nodeState:selected')
    const type = group.cfg.item._cfg.model.type
    const node = group.getChildByIndex(0)
    const text = group.getChildByIndex(1)
    node.attr('r', 25)
    const { activeStyle, defaultStyle } = getItemStyle.call(this, 'node', group, 'selected')

    if (value) {
      const textStyle = activeStyle.labelCfg && activeStyle.labelCfg.style ? activeStyle.labelCfg.style : {}
      //  选中元素增加背景和动画
      if (type == 'img-node' && !group.cfg.item.hasState('selected_alarm')) {
      } else if (type == 'img-cloud') {
        // 当是云团的时候，将阴影隐藏
        return
      }
      setStyle(node, activeStyle)
    } else {
      setStyle(node, defaultStyle)
    }
  },
  //  多选时候出现的状态
  selected(value, group, name) {
    const type = group.cfg.item._cfg.model.type
    const node = group.getChildByIndex(0)
    const text = group.getChildByIndex(1)
    const { activeStyle, defaultStyle } = getItemStyle.call(this, 'node', group, 'selected')
    if (value) {
      setStyle(node, activeStyle) // text, textStyle);
    } else {
      setStyle(node, defaultStyle)
    }
  },
  //  告警时的节点状态仅仅只是增加动画效果
  'alarm-urgent'(value, group, name) {
    const groupName = ['backAnimak-shapeOuter', 'backAnimak-shapeMiddle', 'backAnimak-shapeInner']

    let back1, back2, back3
    const animateArry = group.getChildren().filter((item) => {
      return groupName.includes(item.cfg.name)
    })

    if (value) {
      group.customAttribute = name
      group.attrs.opacity = '1'
      const r = group.cfg.item._cfg.model.width ? group.cfg.item._cfg.model.width / 2 + 4 : group.cfg.item._cfg.model.style.width / 2 + 2
      group.find((element) => {
        if (element.get('name') && element.get('name').indexOf('backAnimak') > -1) {
          animateArry.push(element)
          const color = store.state.topo.alarmlevel.node.filter((el) => {
            return el.name == name
          })[0].fill
          element.attrs.fill = color
        }
      })

      if (animateArry.length == 0) {
        let color = 'orange'
        if (store.state.topo && store.state.topo.alarmlevel && store.state.topo.alarmlevel.node) {
          const matched = store.state.topo.alarmlevel.node.filter((el) => el.name === name)
          if (matched.length > 0 && matched[0].fill) {
            color = matched[0].fill
          }
        }
        back1 = group.addShape('circle', {
          zIndex: -3,
          attrs: {
            x: 0,
            y: 0,
            r,
            fill: color,
            opacity: 0.4
          },
          name: 'backAnimak-shapeOuter'
        })
        back2 = group.addShape('circle', {
          zIndex: -2,
          attrs: {
            x: 0,
            y: 0,
            r,
            fill: color,
            opacity: 0.4
          },
          name: 'backAnimak-shapeMiddle'
        })
        back3 = group.addShape('circle', {
          zIndex: -1,
          attrs: {
            x: 0,
            y: 0,
            r,
            fill: color,
            opacity: 0.4
          },
          name: 'backAnimak-shapeInner'
        })
        group.sort() // Sort according to the zIndex
        back1.animate(
          {
            // Magnifying and disappearing
            r: r + 10,
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
            r: r + 10,
            opacity: 0.1
          },
          {
            duration: 3000,
            easing: 'easeCubic',
            delay: 1000,
            repeat: true // repeat
          }
        ) // 1s delay
        back3.animate(
          {
            // Magnifying and disappearing
            r: r + 10,
            opacity: 0.1
          },
          {
            duration: 3000,
            easing: 'easeCubic',
            delay: 2000,
            repeat: true // repeat
          }
        ) // 3s delay
      } else {
        group.attrs.opacity = '0.1'
        let shapeOuter, shapeMiddle, shapeInner

        group.getChildren().forEach((item) => {
          if (item.cfg.name == 'backAnimak-shapeOuter') {
            shapeOuter = item
          } else if (item.cfg.name == 'backAnimak-shapeMiddle') {
            shapeMiddle = item
          } else if (item.cfg.name == 'backAnimak-shapeInner') {
            shapeInner = item
          }
        })
        shapeOuter && shapeOuter.stopAnimate()
        shapeMiddle && shapeMiddle.stopAnimate()
        shapeInner && shapeInner.stopAnimate()
        shapeOuter && group.removeChild(shapeOuter)
        shapeMiddle && group.removeChild(shapeMiddle)
        shapeInner && group.removeChild(shapeInner)
      }
    } else {
      let shapeOuter, shapeMiddle, shapeInner
      group.getChildren().forEach((item) => {
        if (item.cfg.name == 'backAnimak-shapeOuter') {
          shapeOuter = item
        } else if (item.cfg.name == 'backAnimak-shapeMiddle') {
          shapeMiddle = item
        } else if (item.cfg.name == 'backAnimak-shapeInner') {
          shapeInner = item
        }
      })
      shapeOuter && shapeOuter.stopAnimate()
      shapeMiddle && shapeMiddle.stopAnimate()
      shapeInner && shapeInner.stopAnimate()
      shapeOuter && group.removeChild(shapeOuter)
      shapeMiddle && group.removeChild(shapeMiddle)
      shapeInner && group.removeChild(shapeInner)
    }
  },

  // 通过IP或者名称搜索之后对应的节点动画
  'nodeState:selected_node'(value, group, name) {
    const type = group.cfg.item._cfg.model.type
    const node = group.getChildByIndex(0)
    const text = group.getChildByIndex(1)
    const image = group.get('children')[1]
    const width = group.cfg.item._cfg.model.width ? group.cfg.item._cfg.model.width : group.cfg.item._cfg.model.style.width
    const height = group.cfg.item._cfg.model.height ? group.cfg.item._cfg.model.height : group.cfg.item._cfg.model.style.height
    let { activeStyle, defaultStyle } = getItemStyle.call(this, 'node', group, 'selected_node')
    if (!activeStyle) {
      activeStyle = {}
    }
    if (!defaultStyle) {
      defaultStyle = {}
    }
    if (value) {
      const textStyle = activeStyle.labelCfg && activeStyle.labelCfg.style ? activeStyle.labelCfg.style : {}
      //  选中元素增加背景和动画

      if (type == 'img-node' && !group.cfg.item.hasState('selected_alarm')) {
        //  activeStyle.stroke ='orange'
        //  activeStyle.fill ='orange'
        //  activeStyle.radius = 2
        node.animate(
          (ratio) => {
            const diff = ratio <= 0.5 ? ratio * 10 : (1 - ratio) * 10
            // 返回这一帧需要变化的参数集，这里只包含了半径
            return {
              // width:  group.cfg.item._cfg.model.width / 1.2 + diff,
              // height: group.cfg.item._cfg.model.height / 1.2 + diff,
              r: (group.cfg.item._cfg.model.width + 4) / 2 + diff
              //  x: group.cfg.item._cfg.model.x - diff/2,
              //  y: group.cfg.item._cfg.model.y - diff/2
            }
          },
          {
            repeat: true,
            duration: 3000,
            easing: 'easeCubic'
          }
        )
        image.animate(
          (ratio) => {
            const diff = ratio <= 0.5 ? ratio * 10 : (1 - ratio) * 10
            // 返回这一帧需要变化的参数集，这里只包含了半径
            return {
              width: group.cfg.item._cfg.model.width / 1.05 + diff,
              height: group.cfg.item._cfg.model.height / 1.05 + diff
            }
          },
          {
            repeat: true,
            duration: 3000,
            easing: 'easeCubic'
          }
        )
      }
      setStyle(node, activeStyle, text, textStyle)
    } else {
      const textStyle = defaultStyle && defaultStyle.labelCfg && defaultStyle.labelCfg.style ? defaultStyle.labelCfg.style : {}
      if (type == 'img-node' && !group.cfg.item.hasState('selected_alarm')) {
        image.stopAnimate()
        node.stopAnimate()
        //  defaultStyle.stroke =''
        //  defaultStyle.fill =''
        image.attr('width', width)
        image.attr('height', height)
      }
      setStyle(node, defaultStyle, text, textStyle)
    }
  },
  /**
   * @description 节点hover事件
   */
  'nodeState:hover'(value, group) {
    // const node = group.getChildByIndex(0);
    // const { activeStyle, defaultStyle } = getItemStyle.call(this, 'node', group, 'hover');
    // if (!activeStyle) return;
    // if (value) {
    //   setStyle(node, activeStyle);
    // } else {
    //   setStyle(node, defaultStyle);
    // }
  },

  /**
   * @description 边多状态事件
   */
  edgeState(value, group) {
    if (value === false) {
      // 清除所有状态
      events['edgeState:default'].call(this, true, group)
    } else {
      events[`edgeState:${value}`] && events[`edgeState:${value}`].call(this, value, group)
    }
  },

  /**
   * @description 边恢复默认状态事件
   */
  'edgeState:default'(value, group) {
    if (value) {
      const { activeStyle, defaultStyle, originStyle } = getItemStyle.call(this, 'edge', group)
      const edge = group.getChildByIndex(0)
      const { endArrow, startArrow } = edge.get('attrs')

      if (defaultStyle) {
        // 停止内部动画
        this.stopAnimate(group, activeStyle && activeStyle.animationType ? activeStyle.animationType : 'dash')
        setStyle(edge, { ...defaultStyle, animationType: activeStyle.animationType || 'dash' })

        if (endArrow) {
          edge.attr(
            'endArrow',
            endArrow === true
              ? true
              : {
                  path: endArrow.path,
                  fill: defaultStyle.stroke || originStyle.stroke
                }
          )
        }
        if (startArrow) {
          edge.attr(
            'startArrow',
            startArrow === true
              ? true
              : {
                  path: startArrow.path,
                  fill: defaultStyle.stroke || originStyle.stroke
                }
          )
        }
      }
    }
  },
  /**
   * @description 边恢复默认状态事件
   */
  'edgeState:jam'(value, group, stroke1) {
    if (value) {
      const { activeStyle, defaultStyle, originStyle } = getItemStyle.call(this, 'edge', group)

      const edge = group.getChildByIndex(0)
      console.log(edge)
      console.log(activeStyle)
      const { endArrow, startArrow, stroke } = edge.get('attrs')
      edge.attr('stroke', stroke1.stroke)
      if (defaultStyle) {
        // 停止内部动画
        this.stopAnimate(group, activeStyle && activeStyle.animationType ? activeStyle.animationType : 'dash')
        setStyle(edge, { ...defaultStyle, animationType: activeStyle.animationType || 'dash' })

        if (endArrow) {
          edge.attr(
            'endArrow',
            endArrow === true
              ? true
              : {
                  path: endArrow.path,
                  fill: defaultStyle.stroke || originStyle.stroke
                }
          )
        }
        if (startArrow) {
          edge.attr(
            'startArrow',
            startArrow === true
              ? true
              : {
                  path: startArrow.path,
                  fill: defaultStyle.stroke || originStyle.stroke
                }
          )
        }
      }
    }
  },

  /**
   * @description edge hover事件 stroke 表示不同的状态的需要对应的线条的状态
   */
  'edgeState:alarm'(value, group, stroke) {
    const path = group.getChildByIndex(0)
    const { endArrow, startArrow } = path.get('attrs')
    const { activeStyle, defaultStyle, originStyle } = getItemStyle.call(this, 'edge', group, 'alarm')
    if (!activeStyle) return
    if (value) {
      if (activeStyle.animate === true) {
        this.runAnimate(group, activeStyle.animationType || 'ball', stroke)
      } else if (typeof activeStyle.animate === 'function') {
        activeStyle.animate.call(this, group)
      } else {
        setStyle(path, activeStyle)
        if (endArrow) {
          path.attr(
            'endArrow',
            endArrow === true
              ? true
              : {
                  path: endArrow.path,
                  fill: activeStyle.stroke || originStyle.stroke
                }
          )
        }
        if (startArrow) {
          path.attr(
            'startArrow',
            startArrow === true
              ? true
              : {
                  path: startArrow.path,
                  fill: activeStyle.stroke || originStyle.stroke
                }
          )
        }
      }
    } else {
      if (activeStyle.animate === true) {
        stroke = { stroke: '#1890FF', lineWidth: '1' }
        // 停止动画
        this.stopAnimate(group, activeStyle.animationType || 'dash', stroke)
      } else if (typeof activeStyle.animate === 'function') {
        activeStyle.animate.call(this, group, 'stop')
      } else {
        setStyle(path, defaultStyle)
        if (endArrow) {
          path.attr(
            'endArrow',
            endArrow === true
              ? true
              : {
                  path: endArrow.path,
                  fill: defaultStyle.stroke || activeStyle.stroke || originStyle.stroke
                }
          )
        }
        if (startArrow) {
          path.attr(
            'startArrow',
            startArrow === true
              ? true
              : {
                  path: startArrow.path,
                  fill: defaultStyle.stroke || activeStyle.stroke || originStyle.stroke
                }
          )
        }
      }
    }
  },

  'edgeState:alarm-deafult'(value, group, stroke) {
    const path = group.getChildByIndex(0)
    const { endArrow, startArrow } = path.get('attrs')
    const { activeStyle, defaultStyle, originStyle } = getItemStyle.call(this, 'edge', group, 'alarm-deafult')
    if (!activeStyle) return
    if (value) {
      if (activeStyle.animate === true) {
        this.runAnimate(group, activeStyle.animationType || 'ball', stroke)
      } else if (typeof activeStyle.animate === 'function') {
        activeStyle.animate.call(this, group)
      } else {
        setStyle(path, activeStyle)
        if (endArrow) {
          path.attr(
            'endArrow',
            endArrow === true
              ? true
              : {
                  path: endArrow.path,
                  fill: activeStyle.stroke || originStyle.stroke
                }
          )
        }
        if (startArrow) {
          path.attr(
            'startArrow',
            startArrow === true
              ? true
              : {
                  path: startArrow.path,
                  fill: activeStyle.stroke || originStyle.stroke
                }
          )
        }
      }
    } else {
      if (activeStyle.animate === true) {
        stroke = { stroke: '#1890FF', lineWidth: '1' }
        // 停止动画
        this.stopAnimate(group, activeStyle.animationType || 'dash', stroke)
      } else if (typeof activeStyle.animate === 'function') {
        activeStyle.animate.call(this, group, 'stop')
      } else {
        setStyle(path, defaultStyle)
        if (endArrow) {
          path.attr(
            'endArrow',
            endArrow === true
              ? true
              : {
                  path: endArrow.path,
                  fill: defaultStyle.stroke || activeStyle.stroke || originStyle.stroke
                }
          )
        }
        if (startArrow) {
          path.attr(
            'startArrow',
            startArrow === true
              ? true
              : {
                  path: startArrow.path,
                  fill: defaultStyle.stroke || activeStyle.stroke || originStyle.stroke
                }
          )
        }
      }
    }
  },

  /**
   * @description edge 选中事件
   */

  'edgeState:selected'(value, group) {
    const path = group.getChildByIndex(0)
    const { endArrow, startArrow } = path.get('attrs')
    const { activeStyle, defaultStyle, originStyle } = getItemStyle.call(this, 'edge', group, 'selected')

    if (!activeStyle) return
    if (value) {
      if (activeStyle.animate === true) {
        // 执行内部动画
        this.runAnimate(group, activeStyle.animationType || 'dash')
      } else if (typeof activeStyle.animate === 'function') {
        // 执行外部动画
        activeStyle.animate.call(this, group)
      } else {
        setStyle(path, activeStyle)
        if (endArrow) {
          path.attr(
            'endArrow',
            endArrow === true
              ? true
              : {
                  path: endArrow.path,
                  fill: activeStyle.stroke || originStyle.stroke
                }
          )
        }
        if (startArrow) {
          path.attr(
            'startArrow',
            startArrow === true
              ? true
              : {
                  path: startArrow.path,
                  fill: activeStyle.stroke || originStyle.stroke
                }
          )
        }
      }
    } else {
      if (activeStyle.animate === true) {
        // 停止内部动画
        this.stopAnimate(group, activeStyle.animationType || 'dash')
      } else if (typeof activeStyle.animate === 'function') {
        // 停止外部动画
        activeStyle.animate.call(this, group, 'stop')
      } else {
        setStyle(path, defaultStyle)
        if (endArrow) {
          path.attr(
            'endArrow',
            endArrow === true
              ? true
              : {
                  path: endArrow.path,
                  fill: defaultStyle.stroke || activeStyle.stroke || originStyle.stroke
                }
          )
        }
        if (startArrow) {
          path.attr(
            'startArrow',
            startArrow === true
              ? true
              : {
                  path: startArrow.path,
                  fill: defaultStyle.stroke || activeStyle.stroke || originStyle.stroke
                }
          )
        }
      }
    }
  }
}

export default events
