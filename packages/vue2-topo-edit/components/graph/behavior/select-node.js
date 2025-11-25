// 点选项目
export default G6 => {
  G6.registerBehavior('select-node', {
    // 默认配置
    getDefaultCfg () {
      return {
        // 多选
        multiple: false,
      };
    },
    // 事件映射
    getEvents () {
      return {
        'node:click':      'onNodeClick',
        'node:dblclick':   'ondblClick',
        'canvas:click':    'onCanvasClick',
        'node:mouseenter': 'onNodeMouseEnter',
        'node:mousemove':  'onNodeMouseMove',
        'node:mouseleave': 'onNodeMouseLeave',

        'combo:click':      'onComboClick', //将点击事件传递给实例的函数
        // 'combo:dblclick':   'ondblClick',
        // 'canvas:click':    'onCanvasClick',
        // 'combo:mouseenter': 'onNodeMouseEnter',
        // 'combo:mousemove':  'onNodeMouseMove',
        // 'combo:mouseleave': 'onNodeMouseLeave',
      };
    },
    shouldBegin (e) {
      return true;
    },
    // 点击事件
    onComboClick (e) {
      if (!this.shouldBegin(e)) return;
      // 先将所有当前是 click 状态的节点/edge 置为非 selected 状态
      this._clearSelected();
      e.item.toFront();
      // 获取被点击的节点元素对象, 设置当前combo节点的 对象设置位选中的状态
      e.item.setState('combo:selected',true); 
  
      // 将点击事件发送给 graph 实例
      this.graph.emit('after-combo-selected', e);
    },
    
    onNodeClick (e) {
      if (!this.shouldBegin(e)) return;
      // 先将所有当前是 click 状态的节点/edge 置为非 selected 状态
      if( e.item.getModel().type == 'img-cloud'){
        return  false
      }


      this._clearSelected();
     
      e.item.toFront();
      // 获取被点击的节点元素对象, 设置当前节点的 click 状态为 selected
      if(e.item.hasState("selected_alarm")){
        return 
      }
      e.item.setState('nodeState:selected', true);
      // 将点击事件发送给 graph 实例
      this.graph.emit('after-node-selected', e);
    },
    ondblClick (e) {
      if (!this.shouldBegin(e)) return;
      // 先将所有当前是 click 状态的节点/edge 置为非 selected 状态
      // this._clearSelected();
       
      if( e.item.getModel().type !== 'img-cloud'){
        e.item.toFront();
      }


     
      // 获取被点击的节点元素对象, 设置当前节点的 click 状态为 true
      // e.item.setState('nodeState', 'selected');
      // 将点击事件发送给 graph 实例
      this.graph.emit('after-node-dblclick', e);
    },
    onCanvasClick (e) {
      if (!this.shouldBegin(e)) return;
    
      this._clearSelected();
      this.graph.emit('on-canvas-click', e);
    },

    onNodeMouseEnter (e) {
      if (!this.shouldBegin(e)) return;
        // if(e.item.getModel().type  != 'img-cloud'){
        //   e.item.toFront()
        //   return false
        // }
      // if (!this.shouldBegin(e)) return;
      // if (!e.item.hasState('nodeState:selected')) {
      //   e.item.setState('nodeState', 'hover');
      // }
      if( e.item.getModel().type == 'img-cloud'){
        return  false
      }
      
      this.graph.emit('on-node-mouseenter', e);
    },
    onNodeMouseMove (e) {
      if (!this.shouldBegin(e)) return;
      this.graph.emit('on-node-mousemove', e);
    },
    // 移出 node
    onNodeMouseLeave (e) {
      if (!this.shouldBegin(e)) return;

      this.graph.emit('on-node-mouseleave', e);
    },
    // 清空已选
    _clearSelected () {
      const selectedNodes1 = this.graph.findAllByState('node', 'nodeState:selected');  //默认选中的状态
      const selectedNodes2 = this.graph.findAllByState('node', 'nodeState:selected_node'); //通过IP或者搜索的时候默认增加的状态
      const selectedNodes =[...selectedNodes1,...selectedNodes2]
      selectedNodes.forEach(node => {
        let states = [...node.getStates()] //获取这个节点的所有状态
        console.log("states",states)
        node.clearStates(states); //清楚所有的状态
        // node.clearStates(['nodeState:selected_node','nodeState:selected' ,'nodeState:hover']);
      });

      const selectedEdges = this.graph.findAllByState('edge', 'edgeState:selected');

      selectedEdges.forEach(edge => {
        edge.clearStates(['edgeState:selected', 'edgeState:hover']);
      });

      const selectedCombos = this.graph.findAll('combo',combo=>{
           return combo
      });
      selectedCombos.forEach(combo => {
        
          combo.setState("combo:selected", false)
      });
    
      this.graph.emit('after-node-selected');
    },
  });
};
