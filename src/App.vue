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
          component: {
            template: '<div><input type="text" v-model="data" /><slot :scopedData="data" /></div>',
            data() {
              return {
                data: 'initalData',
              };
            },
          },
          scopedSlots: {
            default: {
              namespace: 'slotChild',
              component: {
                template: '<div><div v-text="bla"></div> <slot :childScopeData="\'childData\' + bla"></slot></div>',
                props: ['bla'],
              },
              props: {
                ':bla': 'root/slot/default::scopedData',
              },
              data: {
                data: 'something',
              },
              scopedSlots: {
                default: {
                  namespace: 'slotChildChild',
                  component: {
                    template: '<div><div v-text="bla"></div><div v-text="blaBla"></div> {{blaBlaa}}</div>',
                    props: ['bla', 'blaBla', 'blaBlaa'],
                  },
                  props: {
                    ':bla': 'root/slot/default::scopedData',
                    ':blaBla': 'slotChild/slot/default::childScopeData',
                    ':blaBlaa': 'slotChild::data',
                  },
                },
              },
            },
          },
        };

        render(h: CreateElement) {
          return h('div', '<h1>lalalal</h1>');
        }
}
</script>
