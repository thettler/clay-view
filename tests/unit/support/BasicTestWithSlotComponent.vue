<template>
    <div><slot /></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

    @Component({
      name: 'BasicTestWithSlotComponent',
    })
export default class BasicTestWithSlotComponents extends Vue {

}
</script>
