<script lang="ts">
import {
  Component, Model, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { Component as VueComponent, CreateElement, VNode } from 'vue';
import { ClayConfig, ClayNode } from '@/typings/clay.d';
import ClayNodeBuilder from '@/ClayNodeBuilder';
import DefaultStorageDriver from '@/DefaultStorageDriver';

    @Component({
      name: 'ClayView',
    })
export default class ClayView extends Vue {
        @Prop({ type: Object, default: () => ({}) }) readonly components!: { [key: string]: VueComponent };

        @Prop({ type: Object, default: () => ({}) }) readonly config!: ClayConfig;

        @Model('change', { type: Object, required: true }) readonly schema!: ClayNode;

        @Watch('internalSchema', { deep: true })
        onInternalSchemaUpdate() {
          this.$emit('change', this.internalSchema);
        }

        protected internalSchema: ClayNode = this.schema;

        protected defaultConfig: ClayConfig = {
          enableJsExecution: false,
        };

        get mergedConfig(): ClayConfig {
          return {
            ...this.defaultConfig,
            ...this.config,
          };
        }

        render(h: CreateElement): VNode | undefined {
          const clayNodeBuilder = new ClayNodeBuilder(h, this.components, new DefaultStorageDriver(), this.mergedConfig);
          return clayNodeBuilder.parse(this.internalSchema);
        }
}
</script>
