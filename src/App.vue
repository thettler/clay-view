<template>
    <div>
    <clay-view v-model="schema"/>
        <button @click="bla">some</button>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { CreateElement } from 'vue';
import ClayView from '@/ClayView.vue';
import { ClayNode } from '@/typings/clay.d';
import ClayStorage from '@/ClayStorage.vue';
import DefaultStorageDriver from '@/DefaultStorageDriver';

    @Component({
      name: 'App',
      components: { ClayStorage, ClayView },
    })
export default class App extends Vue {
  bla() {
    this.schema.children.show = !this.schema.children.show;
  }

        schema: ClayNode = {
          clayKey: 'key',
          component: 'div',
          children: {
            clayKey: 'child',
            component: 'span',
            text: 'lalal',
            show: true,
          },
        };

        render(h: CreateElement) {
          return h('div', '<h1>lalalal</h1>');
        }
}
</script>
