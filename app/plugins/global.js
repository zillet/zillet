import Vue from 'vue';
import * as components from '@/components/base';
import * as containers from '@/containers';

for (let componentKey in components) {
  try {
    Vue.component(components[componentKey].name, components[componentKey]);
  } catch (e) {
    console.error(e);
  }
}
for (let containersKey in containers) {
  try {
    Vue.component(containers[containersKey].name, containers[containersKey]);
  } catch (e) {
    console.error(e);
  }
}
