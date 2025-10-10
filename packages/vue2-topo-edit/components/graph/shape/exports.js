import registerBaseNode from './nodes/base-node';
import registerBaseifitNode from './nodes/base-ifit-node';
import registerBaseCombo from './nodes/base-combo';
import registerNode from './node';

export default (G6,vue) => {
  // 先注册基础节点
  registerBaseNode(G6,vue);
  registerBaseifitNode(G6,vue);
  // 注册组合节点
  registerBaseCombo(G6,vue);
  registerNode(G6);
};
