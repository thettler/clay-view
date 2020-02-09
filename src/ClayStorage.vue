<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  CreateElement, VNode, VNodeChildren, VNodeData,
} from 'vue';
import { ClayNode } from '@/typings/clay.d';

    @Component({
      name: 'ClayStorage',
    })
export default class ClayView extends Vue {
        data: any = {
          value: '',
        };

        render(h: CreateElement): VNode {
          // @ts-ignore
          return this.$scopedSlots.default(this.data);
        }
}
</script>
