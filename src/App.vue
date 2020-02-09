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
    this.schema.component = { template: '<h1><span v-text="bound"></span>lool <slot /></h1>', props: ['bound'] };
  }

        schema: ClayNode = {
          clayKey: 'root',
          component: {
            template: '<div><input v-model="data" /> <slot :scopedData="data" /></div>',
            props: ['bound'],
            data() {
              return {
                data: 'lala',
              };
            },
          },
          scopedSlots: {
            default: {
              key: 'rootSlot',
              content: {
                clayKey: 'slotChild',
                component: { template: '<div><div v-text="bla"></div><slot /></div>', props: ['bla'] },
                props: {
                  ':bla': 'rootSlot#scopedData',
                },
                scopedSlots: {
                  default: {
                    key: 'childSlot',
                    content: {
                      clayKey: 'slotChild1',
                      component: { template: '<div v-text="bla"></div>', props: ['bla'] },
                      props: {
                        ':bla': 'rootSlot#scopedData',
                      },
                      on: {
                      },
                    },
                  },
                },
              },
            },
          },
          data: {
            prop: 'lalalal',
          },
          props: {
            ':bound': 'prop',
          },
          nativeOn: {
            click(storage: DefaultStorageDriver) {
              storage.set('prop', Math.random());
            },
          },
        }

        render(h: CreateElement) {
          return h('div', '<h1>lalalal</h1>');
        }
}
</script>
