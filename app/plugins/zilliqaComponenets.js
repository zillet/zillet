import Vue from 'vue';
import * as components from '@/components/base';
for (let componentKey in components) {
  try {
    Vue.component(components[componentKey].name, components[componentKey]);
  } catch (e) {
    console.error(e);
  }
}
