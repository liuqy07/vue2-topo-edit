let position = {
  x: undefined,
  y: undefined,
};

export default (anchor, cfg, group, vue) => {
  if (!anchor) return false;
  // 鼠标移入事件
  // anchor.on("mouseenter", () => {
  //   anchor.attr({
  //     cursor: "crosshair",
  //   });
  // });

  // 拖拽事件
  anchor.on("dragstart", (e) => {
    let { x, y } = e;
    position.x = x;
    position.y = y;
  });

  // 拖拽中
  anchor.on("drag", (e) => {
    e.stopPropagation();
  });

  // 拖拽结束
  anchor.on("dragend", (e) => {
    e.stopPropagation();
    let { x, y } = e;
    let distanceX = x - position.x;
    let distanceY = y - position.y;
    let graph = vue.graph;
    group.cfg.item.getModel().size[0] += distanceX;
    group.cfg.item.getModel().size[1] += distanceY;
    let id = group.cfg.item.getModel().id;
    let model = group.cfg.item.getModel();
    let circleGroupp = group.cfg.children.find(item => item.cfg.className === "combo-drag")
    console.log("group",group, circleGroupp);
    setTimeout(() => {
      graph.updateItem(id, model);
    }, 10);


  });
};
