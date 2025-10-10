// 引入组件
import vue2TopoEdit from './vue2-topo-edit.vue'

// 为组件提供 install 安装方法，供按需引入
vue2TopoEdit.install = (Vue) => {
    Vue.component(vue2TopoEdit.name, vue2TopoEdit)
}

// 导出组件
export default vue2TopoEdit
