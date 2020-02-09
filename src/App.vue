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
          clayKey: 'key',
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
              key: 'rootSlot1',
              content: {
                clayKey: 'slotChild',
                component: {
                  template: '<div><div v-text="bla"></div> <slot childScopeData="childData"></slot></div>',
                  props: ['bla'],
                },
                props: {
                  ':bla': 'rootSlot1#scopedData',
                },
                scopedSlots: {
                  default: {
                    key: 'childSlot',
                    content: {
                      clayKey: 'slotChildChild',
                      component: {
                        template: '<div><div v-text="bla"></div><div v-text="blaBla"></div></div>',
                        props: ['bla', 'blaBla'],
                      },
                      props: {
                        ':bla': 'rootSlot1#scopedData',
                        ':blaBla': 'childSlot#childScopeData',
                      },
                    },
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
