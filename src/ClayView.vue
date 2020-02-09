<script lang="ts">
import {
  Component, Model, Vue, Watch,
} from 'vue-property-decorator';
import {
  CreateElement, VNode,
} from 'vue';
import { ClayNode } from '@/typings/clay.d';
import ClayNodeBuilder from '@/ClayNodeBuilder';

    @Component({
      name: 'ClayView',
    })
export default class ClayView extends Vue {
        @Model('change', { type: Object, required: true }) readonly schema!: ClayNode;

        @Watch('internalSchema', { deep: true })
        onInternalSchemaUpdate() {
          this.$emit('change', this.internalSchema);
        }

        protected internalSchema: ClayNode = this.schema;

        render(h: CreateElement): VNode {
          const clayNodeBuilder = new ClayNodeBuilder(h);
          return clayNodeBuilder.parse(this.internalSchema);
        }
}
</script>
