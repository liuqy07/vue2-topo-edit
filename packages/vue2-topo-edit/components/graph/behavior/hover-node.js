export default (G6 ,registerObj) => {
  const {isEdit} = registerObj
  G6.registerBehavior('hover-node', {
    getEvents () {
      return {
        'node:mouseenter': 'onNodeEnter',
        'node:mouseleave': 'onNodeLeave',
        'combo:mouseenter': 'onNodeEnter',
        'combo:mouseleave': 'onNodeLeave',
      };
    },
    shouldBegin () {
      return true;
    },
    onNodeEnter (e) {
      if (!this.shouldBegin(e)) return;
      // 显示当前节点的锚点
     isEdit? e.item.setState('anchorShow', true) : '' // 二值状态
    },
    onNodeLeave (e) {
      if (!this.shouldBegin(e)) return;
      // 将锚点再次隐藏
      isEdit? e.item.setState('anchorShow', false) : ''; // 二值状态
    },
  });
};
