<template>
    <div v-text="myProp"></div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

    @Component({
      name: 'BasicTestWithPropComponent',
    })
export default class BasicTestComponent extends Vue {
    @Prop() myProp!: any;
}
</script>
