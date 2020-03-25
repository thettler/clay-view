<template>
    <div>
        <clay-view :h="$createElement" v-model="schema"/>
<!--        <button @click="bla">some</button>-->
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
        schema: ClayNode = {
          namespace: 'root',
          component: 'div',
          children: [{
            namespace: 'example-component',
            component: 'example-component',
          }],
        };

        render(h: CreateElement) {
          return h('div', '<h1>lalalal</h1>');
        }
}
</script>
