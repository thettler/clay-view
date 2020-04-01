<template>
    <div>
        <clay-view :h="$createElement" v-model="schema"/>
        <!--        <button @click="bla">some</button>-->
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ClayView from '@/ClayView.vue';
import { ClayNode } from '@/typings/clay.d';
import ClayStorage from '@/ClayStorage.vue';

    @Component({
      name: 'App',
      components: { ClayStorage, ClayView },
    })
export default class App extends Vue {
        schema: ClayNode = {
          namespace: 'root',
          component: {
            template: '<div><slot :scopedData="data" /></div>',
            data() {
              return {
                data: 'initalData',
              };
            },
          },
          data: {
            parentData: 'Test data',
          },
          scopedSlots: {
            default: {
              namespace: 'child',
              component: 'div',
              children: [
                {
                  namespace: 'child1',
                  component: 'input',
                  on: {
                    ':input': '|> (event)=>root.parentData = event.target.value',
                  },
                },
                {
                  namespace: 'child2',
                  component: 'span',
                  ':text': 'root.parentData',
                },
              ],
            },
          },
        };

  // render(h: CreateElement) {
  //   return h('div', '<h1>lalalal</h1>');
  // }
}
</script>
