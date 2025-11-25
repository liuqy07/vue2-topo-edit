<template>
  <div :style="{width: width, height: height}">
      <!-- <graph :isEdit="isEdit" /> -->
       <span>我是topoedit</span>
  </div>
</template>

<script>
import Vue from 'vue'
import ElementUI from 'element-ui';
Vue.use(ElementUI);
// import graph from './pages/graph/graph.vue';
export default {
  name: 'vue2TopoEdit',
  props:{
    isEdit:{
      type:Boolean,
      default:()=>{
        return true
      }
    },
     width:{
      type:String,
      default:()=>{
        return '100%'
      }
    },
    height:{
      type:String,
      default:()=>{
        return '10px'
      }
    }
  },
  components: {},
}
</script>

<style scoped>

</style>
