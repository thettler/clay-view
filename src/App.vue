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

    @Component({
      name: 'App',
      components: { ClayStorage, ClayView },
    })
export default class App extends Vue {
  bla() {
    this.schema.children.show = !this.schema.children.show;
  }

        schema: ClayNode = {
          namespace: 'root',
          component: 'div',
          children: {
            namespace: 'child',
            component: 'span',
            for: { key1: 'item_1', key2: 'item_2' },
            children: {
              namespace: 'nestedChild',
              component: 'b',
              attrs: {
                ':data-index': 'child/for::index',
                ':data-key': 'child/for::key',
              },
              ':text': 'child/for::value',
            },
          },
        };

        render(h: CreateElement) {
          return h('div', '<h1>lalalal</h1>');
        }
}
</script>
