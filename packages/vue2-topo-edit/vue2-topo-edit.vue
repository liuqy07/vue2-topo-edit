<template>
  <div style="width: 1500px; height: 500px;">
      <graph :isEdit="false"/>
       <!-- <span>1312312</span>
       <div>12312312</div> -->
  </div>
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui';
Vue.use(ElementUI);
import graph from './pages/graph/graph.vue';
export default {
  name: 'vue2TopoEdit',
  components: {
    graph,
  },
}
</script>

<style scoped>

</style>
