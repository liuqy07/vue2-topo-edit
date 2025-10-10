/**
 * 边动画合集
 */
// const ball1 = {
//   run (group) {
//     // 获得当前边的第1个图形，这里是边本身的 path
//     const path = group.get('children')[0];
//     const endArrowShape = path.get('endArrowShape');
//     const arrowSize = endArrowShape ? (endArrowShape.get('bbox') ? Math.max(endArrowShape.get('bbox').width, endArrowShape.get('bbox').height) : 0) : 0;
//     const startPoint = path.getPoint(0);
//     const endPoint = path.getPoint(1);
//     const length = path.getTotalLength();
//     const num =  1;
//     const imageUrl =require('../../../../../../assets/images/topo/flowStar.png')
//     if (length <= 40) return; // 线段太短就不要动画了

//     for (let i = 0; i < num; i++) {
//       const timeout = setTimeout(() => {

//         const circle = group.addShape('image', {
//           attrs: {
//             x: startPoint.x, // Set initial x position
//             y: startPoint.y  , // Set initial y position
//             width: 40, // Set width of the image
//             height: 4, // Set height of the image
//             img: imageUrl, // Specify the image URL
//           },
//           className: 'edge-runner',
//           name:      'edge-runner',
//         });

//         circle.animate(
//           ratio => {
//             const tmpPoint = path.getPoint(ratio); // Get the point on the path
//             const opacity = length - length * ratio >= arrowSize ? 1 : 0;
//             circle.set('hasChanged', false);
//             console.log("tmpPoint ====>",circle.attrs.width)
//             if(tmpPoint.x - circle.attrs.width < 0){
//               tmpPoint.x = 0
//             }else{
//               tmpPoint.x = tmpPoint.x - circle.attrs.width /2
//             }
//             const nextPoint = path.getPoint(Math.min(ratio + 1, 1)); // Get the next point on the path
//             // Calculate the angle in degrees
//             const dx = nextPoint.x - tmpPoint.x;
//             const dy = nextPoint.y - tmpPoint.y;
//             const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Convert radians to degrees

//             circle.set('hasChanged', false);
//             console.log("angle",angle)
//             // Update the position based on the calculated point
//             return {
//               x: tmpPoint.x , // Update x position
//               y: tmpPoint.y -2 , // Update y position
//               opacity: opacity, // Update opacity if needed
//               rotate: 30,
//             };
//           },
//           {
//             duration: 4500, // Adjust duration if needed
//             repeat: true, // Repeat the animation
//           },
//         );

//         // console.log("endArrowShape,endArrowShape",endArrowShape)
//     // 动画箭头
//     // if (endArrowShape) {

//     //   endArrowShape.animate(
//     //     ratio => {
//     //       const tmpArrowPoint = path.getPoint(ratio);
//     //       console.log("endArrowShape,endArrowShape",tmpArrowPoint.x)
//     //       return {
//     //         x: tmpArrowPoint.x,
//     //         y: tmpArrowPoint.y,
//     //         opacity: length - length * ratio >= arrowSize ? 1 : 0,
//     //       };
//     //     },
//     //     {
//     //       duration: 1000,
//     //       repeat: true,
//     //     },
//     //   );
//     // }

//       }, i * length);

//       group.runners.push(timeout);
//     }
//   },
//   stop (group) {
//     const runners = [];

//     group.get('children').forEach(child => {
//       if (child.get('className') === 'edge-runner') {
//         child.stopAnimate();
//         runners.push(child);
//       }
//     });

//     runners.forEach(runner => runner.remove());
//     // 清除所有定时器
//     group.runners.forEach(settimeout => {
//       clearTimeout(settimeout);
//     });
//     group.running = false;
//   },
// };

function interpolateColor(color1, color2, factor) {
  const result = color1.slice(); // Create a copy of color1
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
}

function rgbStringToArray(colorString) {
  // Check if the color is in hex format
  if (colorString.startsWith("#")) {
    // Remove the '#' and parse the hex color
    const hex = colorString.slice(1);
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }

  // If it's an RGB string format
  const rgbMatch = colorString.match(/\d+/g);
  if (rgbMatch) {
    return rgbMatch.map(Number);
  }

  // Return a default value if the format is unrecognized
  return [0, 0, 0]; // Default to black
}


const ball_cricle = {
  run(group) {
    // 获得当前边的第1个图形，这里是边本身的 path
    const back1 = group.addShape('circle', {
      zIndex: -3,
      attrs: {
        x: 0,
        y: 0,
        r,
        fill: cfg.color,
        opacity: 0.6,
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: 'back1-shape',
    });
    const back2 = group.addShape('circle', {
      zIndex: -2,
      attrs: {
        x: 0,
        y: 0,
        r,
        fill: cfg.color,
        opacity: 0.6,
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: 'back2-shape',
    });
    const back3 = group.addShape('circle', {
      zIndex: -1,
      attrs: {
        x: 0,
        y: 0,
        r,
        fill: cfg.color,
        opacity: 0.6,
      },
      // must be assigned in G6 3.3 and later versions. it can be any string you want, but should be unique in a custom item type
      name: 'back3-shape',
    });
    group.sort();


  },
  stop(group) {
    const runners = [];

    group.get("children").forEach((child) => {
      if (child.get("className") === "edge-runner") {
        child.stopAnimate();
        runners.push(child);
      }
    });
    runners.forEach((runner) => runner.remove());
    // 清除所有定时器
    group.running = false;
  },
};

const ball1 = {
  run(group) {
    // 获得当前边的第1个图形，这里是边本身的 path
    const path = group.get("children")[0];
    const shape = group.get("children")[0];
    const startPoint = path.getPoint(0);
    const length = path.getTotalLength();
    const num = 30;
    const startColor = rgbStringToArray("#E69C5F"); // Convert hex to RGB array 88EEE9 E69C5F
    const endColor = rgbStringToArray("#E8EA3C"); // Convert hex to RGB array
    if (length <= 40) return; // 线段太短就不要动画了
    let circleList = [];
    for (let i = 0; i < num; i++) {
      const ratio = i / (num - 1);
      const fillColor = interpolateColor(startColor, endColor, ratio);
      let _circle = group.addShape("circle", {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: fillColor,
          r: 2.8 - i * 0.06 < 0 ? 0 : 2.8 - i * 0.06,
        },
        className: "edge-runner-circle",
        name: "edge-runner-circle",
      });
      circleList.push(_circle);
    }

    let circleshape1 = group
      .getChildren()
      .find((item) => item.cfg.name == "circle-shape1");
    let circleshape2 = group
      .getChildren()
      .find((item) => item.cfg.name == "circle-shape2");

    circleList.forEach((item, index) => {
      item.animate(
        (ratio) => {
          // const fillColor = interpolateColor(startColor, endColor, ratio);
          // const tmpPoint = shape.getPoint(ratio);
          const x1 = shape.getPoint(0).x;
          const x2 = shape.getPoint(1).x;
          const y1 = shape.getPoint(0).y;
          const y2 = shape.getPoint(1).y;
          const distance = Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
          );
          let tmpPoint = shape.getPoint(ratio - (0.45 * index) / distance);
          circleshape1 &&  circleshape1.toFront();
          circleshape1 &&  circleshape2.toFront();
          // returns the modified configurations here, x and y here
          return {
            x: tmpPoint?.x || 0,
            y: tmpPoint?.y || 0,
            // color: fillColor
          };
        },
        {
          repeat: true, // Whether executes the animation repeatly
          duration: 6000, // the duration for executing once
        }
      );
    });

    // const circle = group.addShape('circle', {
    //   attrs: {
    //     x: startPoint.x,
    //     y: startPoint.y,
    //     fill: '#1890ff',
    //     r: 2,
    //   },
    //   className: 'edge-runner',
    //   name: 'edge-runner',
    // });
    // circle.animate(
    //   ratio => {
    //     const tmpPoint = path.getPoint(ratio);
    //     const opacity = length - length * ratio >= arrowSize ? 1 : 0;

    //     // ! 必须设置这个属性为false, 否则当起始位置落在画布外时将无法播放动画
    //     circle.set('hasChanged', false);

    //     // 返回需要变化的参数集，这里返回了位置 x 和 y
    //     return {
    //       ...tmpPoint,
    //       opacity,
    //     };
    //   },
    //   {
    //     duration: length >= 100 ? length * 3 : length * 5,
    //     repeat: true,
    //   },
    // );
  },
  stop(group) {
    const runners = [];
    group.get("children").forEach((child) => {
      if (child.get("className") === "edge-runner-circle") {
        child.stopAnimate();
        runners.push(child);
      }
    });
    runners.forEach((runner) => runner.remove());
    group.running = false;
  },
};

const ballloop = {
  run(group) {
    // 获得当前边的第1个图形，这里是边本身的 path

    const path = group.get("children")[0];
    const shape = group.get("children")[0];
    const startPoint = path.getPoint(0);
    const length = path.getTotalLength();
    const num = 30;
    const startColor = rgbStringToArray("#E69C5F"); // Convert hex to RGB array 88EEE9 E69C5F
    const endColor = rgbStringToArray("#E8EA3C"); // Convert hex to RGB array
    if (length <= 40) return; // 线段太短就不要动画了
    let circleList = [];
    for (let i = 0; i < num; i++) {
      const ratio = i / (num - 1);
      const fillColor = interpolateColor(startColor, endColor, ratio);
      let _circle = group.addShape("circle", {
        attrs: {
          x: startPoint.x,
          y: startPoint.y,
          fill: fillColor,
          r: 2.8 - i * 0.06 < 0 ? 0 : 2.8 - i * 0.06,
        },
        className: "edge-runner-circle",
        name: "edge-runner-circle",
      });
      circleList.push(_circle);
    }

    let circleshape1 = group
      .getChildren()
      .find((item) => item.cfg.name == "circle-shape1");
    let circleshape2 = group
      .getChildren()
      .find((item) => item.cfg.name == "circle-shape2");

    circleList.forEach((item, index) => {
      item.animate(
        (ratio) => {
          // const fillColor = interpolateColor(startColor, endColor, ratio);
          // const tmpPoint = shape.getPoint(ratio);
          const x1 = shape.getPoint(0).x;
          const x2 = shape.getPoint(1).x;
          const y1 = shape.getPoint(0).y;
          const y2 = shape.getPoint(1).y;
          const distance = Math.sqrt(
            Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)
          );
          let tmpPoint = shape.getPoint(ratio - (0.02 * index) / distance);
          circleshape1 &&  circleshape1.toFront();
          circleshape2 &&  circleshape2.toFront();
          // returns the modified configurations here, x and y here
          return {
            x: tmpPoint?.x || 0,
            y: tmpPoint?.y || 0,
            // color: fillColor
          };
        },
        {
          repeat: true, // Whether executes the animation repeatly
          duration: 10000, // the duration for executing once
        }
      );
    });

    // const circle = group.addShape('circle', {
    //   attrs: {
    //     x: startPoint.x,
    //     y: startPoint.y,
    //     fill: '#1890ff',
    //     r: 2,
    //   },
    //   className: 'edge-runner',
    //   name: 'edge-runner',
    // });
    // circle.animate(
    //   ratio => {
    //     const tmpPoint = path.getPoint(ratio);
    //     const opacity = length - length * ratio >= arrowSize ? 1 : 0;

    //     // ! 必须设置这个属性为false, 否则当起始位置落在画布外时将无法播放动画
    //     circle.set('hasChanged', false);

    //     // 返回需要变化的参数集，这里返回了位置 x 和 y
    //     return {
    //       ...tmpPoint,
    //       opacity,
    //     };
    //   },
    //   {
    //     duration: length >= 100 ? length * 3 : length * 5,
    //     repeat: true,
    //   },
    // );
  },
  stop(group) {
    const runners = [];
    group.get("children").forEach((child) => {
      if (child.get("className") === "edge-runner-circle") {
        child.stopAnimate();
        runners.push(child);
      }
    });
    runners.forEach((runner) => runner.remove());
    group.running = false;
  },
};
const ball2 = {
  run(group) {
    // 获得当前边的第1个图形，这里是边本身的 path
    const path = group.get("children")[0];
    const endArrowShape = path.get("endArrowShape");
    const arrowSize = endArrowShape
      ? endArrowShape.get("bbox")
        ? Math.max(
            endArrowShape.get("bbox").width,
            endArrowShape.get("bbox").height
          )
        : 0
      : 0;
    const startPoint = path.getPoint(0);
    const length = path.getTotalLength();
    const num = 1;

    if (length <= 40) return; // 线段太短就不要动画了
    const circle = group.addShape("circle", {
      attrs: {
        x: startPoint.x,
        y: startPoint.y,
        fill: "#1890ff",
        r: 3,
      },
      className: "edge-runner",
      name: "edge-runner",
    });

    circle.animate(
      (ratio) => {
        const tmpPoint = path.getPoint(ratio);
        const opacity = length - length * ratio >= arrowSize ? 1 : 0;
        // ! 必须设置这个属性为false, 否则当起始位置落在画布外时将无法播放动画
        circle.set("hasChanged", false);

        // 返回需要变化的参数集，这里返回了位置 x 和 y
        return {
          ...tmpPoint,
          opacity,
        };
      },
      {
        duration: 5000,
        repeat: true,
      }
    );
  },
  stop(group) {
    const runners = [];
    group.get("children").forEach((child) => {
      if (child.get("className") === "edge-runner") {
        child.stopAnimate();
        runners.push(child);
      }
    });

    runners.forEach((runner) => runner.remove());
    // 清除所有定时器

    group.running = false;
  },
};

const ball = {
  run(group) {
    // 获得当前边的第1个图形，这里是边本身的 path
    const path = group.get("children")[0];
    const endArrowShape = path.get("endArrowShape");
    const arrowSize = endArrowShape
      ? endArrowShape.get("bbox")
        ? Math.max(
            endArrowShape.get("bbox").width,
            endArrowShape.get("bbox").height
          )
        : 0
      : 0;
    const startPoint = path.getPoint(0);
    const length = path.getTotalLength();
    const num = Math.floor(length / 100) || 1;

    if (length <= 40) return; // 线段太短就不要动画了

    for (let i = 0; i < num; i++) {
      const timeout = setTimeout(() => {
        const circle = group.addShape("circle", {
          attrs: {
            x: startPoint.x,
            y: startPoint.y,
            fill: "#1890ff",
            r: 2,
          },
          className: "edge-runner",
          name: "edge-runner",
        });

        circle.animate(
          (ratio) => {
            const tmpPoint = path.getPoint(ratio);
            const opacity = length - length * ratio >= arrowSize ? 1 : 0;

            // ! 必须设置这个属性为false, 否则当起始位置落在画布外时将无法播放动画
            circle.set("hasChanged", false);

            // 返回需要变化的参数集，这里返回了位置 x 和 y
            return {
              ...tmpPoint,
              opacity,
            };
          },
          {
            duration: length >= 100 ? length * 3 : length * 5,
            repeat: true,
          }
        );
      }, i * length);

      group.runners.push(timeout);
    }
  },
  stop(group) {
    const runners = [];

    group.get("children").forEach((child) => {
      if (child.get("className") === "edge-runner") {
        child.stopAnimate();
        runners.push(child);
      }
    });

    runners.forEach((runner) => runner.remove());
    // 清除所有定时器
    group.runners.forEach((settimeout) => {
      clearTimeout(settimeout);
    });
    group.running = false;
  },
};

const dash = {
  run(group, stroke) {
    let index = 0;
    // 获得当前边的第1个图形，这里是边本身的 path
    const path = group.get("children")[0];
    path.attrs.stroke = stroke.stroke;
    path.attrs.lineWidth = stroke.lineWidth;
    path.set("visible", false);
    const dashLine = group.addShape("path", {
      attrs: {
        offset: path.attrs.offset, //path.attrs.offset,
        path: path.attrs.path,
        stroke: stroke.stroke,
        lineWidth: stroke.lineWidth,
        opacity: path.attrs.opacity,
        startArrow: false,
        endArrow: false,
        lineAppendWidth: 1, // 防止线太细没法点中
      },
      name: "edge-dash",
    });

    dashLine.toFront();

    // dashLine.toBack()
    // path.toBack()

    dashLine.animate(
      (radio) => {
        index++;
        if (index > 9) {
          index = 0;
        }
        return {
          lineDash: [5, 5],
          lineDashOffset: -index,
        };
      },
      {
        repeat: true,
        duration: 3000,
      }
    );
  },
  stop(group, stroke) {
    // 获得当前边的第1个图形，这里是边本身的 path
    const path = group
      .get("children")
      .find((item) => item.cfg.name === "edge-dash");
    const path1 = group
      .get("children")
      .find((item) => item.cfg.name === "edge-shape");

    if (path) {
      path.remove();
      group.running = false;
    }

    if (path1) {
      path1.set("visible", true);
      path1.attrs.stroke = stroke ? stroke.stroke : "#1890FF";
      path1.attrs.lineWidth = stroke ? stroke.lineWidth : "1";
    }
  },
};

export default {
  ball,
  dash,
  ball1,
  ball2,
  ballloop,
  ball_cricle
};
