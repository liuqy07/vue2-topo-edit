// 引入组件
import graphTopo from './pages/graph/topoShow.vue'

// 为组件提供 install 安装方法，供按需引入
graphTopo.install = (Vue) => {
    Vue.component(graphTopo.name, graphTopo)
}

// 导出组件
export default graphTopo
