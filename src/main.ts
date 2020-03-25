import Vue from 'vue';
import App from './App.vue';
import ExampleComponent from './ExampleComponent.vue';

Vue.config.productionTip = false;
Vue.component('example-component', ExampleComponent);
new Vue({
  render: h => h(App),
}).$mount('#app');
