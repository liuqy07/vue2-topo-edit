import G6 from '@antv/g6'

export default function () {
  G6.registerEdge(
    'edge-alarm',
    {
      calculatePointOnLine(pointA, pointB, distanceFromA) {
        const dx = pointB.x - pointA.x
        const dy = pointB.y - pointA.y
        // 计算两点间距离
        const totalDistance = Math.sqrt(dx * dx + dy * dy)
        // 计算比例因子
        const ratio = distanceFromA / totalDistance
        // 计算目标点坐标
        return {
          // x: pointA.x + dx * ratio,
          // y: pointA.y + dy * ratio
          x: pointA.x,
          y: pointA.y
        }
      },
      afterDraw(cfg, group) {
        console.log('line-alarm', cfg, group, group.get('children'))
        const shape = group.get('children')[0]
        const shape1 = group.get('children').find((item) => item.cfg.className == 'edge-label')
        let imgalarm
        const imgalarm1 = require('@/assets/images/一级告警.png')
        const imgalarm2 = require('@/assets/images/二级告警.png')
        const imgalarm3 = require('@/assets/images/三级告警.png')
        shape.attr('opacity', '0')
        // shape1.attr('opacity', '0')
        const style_copy = shape.attr()
        const style_copy1 = shape1?.attr() ?? {}
        const curveOffset = (cfg.startPoint.x - cfg.endPoint.x) / 2
        style_copy.curveOffset = curveOffset
        const length = style_copy1?.text?.replace(/\s/g, '')?.length ?? 0
        const fontSize = style_copy?.fontSize ?? 12
        const distance = fontSize * length === 0 ? 0 : Math.ceil((fontSize * length) / 2)
        const dispoint = this.calculatePointOnLine({ x: style_copy1.x, y: style_copy1.y }, cfg.startPoint, distance)
        debugger
        const textBBox = shape1?.getBBox() ?? { width: 3.33, height: fontSize }
        if (cfg.alarmseverity == '1') {
          imgalarm = imgalarm1
        } else if (cfg.alarmseverity == '2') {
          imgalarm = imgalarm2
        } else if (cfg.alarmseverity == '3') {
          imgalarm = imgalarm3
        } else {
          imgalarm = imgalarm1
        }
        group.addShape('image', {
          attrs: {
            img: imgalarm,
            x: dispoint.x - 28,
            y: dispoint.y - (textBBox.height) / 2,
            width: 20,
            height: 20,
            opacity: 1
          },
          name: 'path-image'
        })
        group.addShape('path', {
          attrs: {
            ...style_copy,
            // curveOffset: 500,
            opacity: 1
          },
          // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
          name: 'path-copy'
        })
        // const textBBox = shape1.getBBox()
        // img.attr('x', -textBBox.width - 10)
        // console.log('shape1===》', textBBox)
      },
      afterUpdate(cfg, group) {
        const shape = group._cfg.group.get('children')[0]
        const path = group._cfg.group.getChildren().find((item) => item.cfg.name == 'path-copy')
        const image = group._cfg.group.getChildren().find((item) => item.cfg.name == 'path-image')
        const label = group._cfg.group.getChildren().find((item) => item.cfg.className == 'edge-label')
        // const style_copy1 = label?.attr() ?? {}
        // const length = style_copy1?.text?.replace(/\s/g, '')?.length ?? 0
        // const fontSize = style_copy1?.fontSize ?? 12
        // const distance = fontSize * length === 0 ? 0 : Math.ceil((fontSize * length) / 2)
        // const dispoint = this.calculatePointOnLine({ x: style_copy1.x, y: style_copy1.y }, cfg.startPoint, distance)
        // const curveOffset = (cfg.startPoint.x - cfg.endPoint.x) / 2
        const textBBox = label.getBBox()
        debugger
        path.attr('path', shape.attr('path'))
        image.attr('x', textBBox.minX - 28)
        image.attr('y', textBBox.minY - (textBBox.height) / 2)
      },
      setState(name, value, item) {}
    },
    'quadratic' // 继承直线的方法
  )
}
