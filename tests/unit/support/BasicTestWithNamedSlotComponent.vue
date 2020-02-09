<template>
    <div><div data="default"><slot/></div><div data="slot"><slot name="slot" /></div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

    @Component({
      name: 'BasicTestWithNamedSlotComponent',
    })
export default class BasicTestWithNamedSlotComponent extends Vue {

}
</script>
