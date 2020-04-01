import { mount } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';

describe('Clay View restrict store access to scopes', () => {
  it('can not access store of neighbor element', (done) => {
    const consolError = console.error;
    console.error = () => {
    };
    try {
      const wrapper = mount(ClayView, {
        propsData: {
          schema: {
            namespace: 'parent',
            component: 'div',
            children: [
              {
                namespace: 'child1',
                component: 'div',
                data: {
                  shouldNotBeAccessed: 'Test data',
                },
              },
              {
                namespace: 'child2',
                component: 'div',
                ':text': 'child1.shouldNotBeAccessed',
              },
            ],
          },
        },
      });

      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message).toEqual('Namespace child1 does not exist');
    }
    console.error = consolError;
    done();
  });


  it('can mutated store of parent element', async (done) => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          namespace: 'parent',
          component: 'div',
          children: [
            {
              namespace: 'child1',
              component: 'input',
              on: {
                ':input': '|> (event)=>parent.parentData = event.target.value',
              },
            },
            {
              namespace: 'child2',
              component: 'span',
              ':text': 'parent.parentData',
            },
          ],
          data: {
            parentData: 'Test data',
          },
        },
        config: {
          enableJsExecution: true,
        },
      },
    });

    expect(wrapper.html()).toBe('<div><input><span>Test data</span></div>');

    const input = wrapper.find('input');
    // (input.element as HTMLInputElement).value = 'New data';
    input.setValue('New data');
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toBe('<div><input><span>New data</span></div>');
    done();
  });

  it('can mutated store of parent element in scoped Slot', async (done) => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          namespace: 'root',
          component: {
            template: '<div><slot :scopedData="data" /></div>',
            data() {
              return {
                data: 'initalData',
              };
            },
          },
          data: {
            parentData: 'Test data',
          },
          scopedSlots: {
            default: {
              namespace: 'child',
              component: 'div',
              children: [
                {
                  namespace: 'child1',
                  component: 'input',
                  on: {
                    ':input': '|> (event)=>root.parentData = event.target.value',
                  },
                },
                {
                  namespace: 'child2',
                  component: 'span',
                  ':text': 'root.parentData',
                },
              ],
            },
          },
        },
        config: {
          enableJsExecution: true,
        },
      },
    });

    expect(wrapper.html()).toBe('<div><div><input><span>Test data</span></div></div>');

    const input = wrapper.find('input');
    // (input.element as HTMLInputElement).value = 'New data';
    input.setValue('New data');
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toBe('<div><div><input><span>New data</span></div></div>');
    done();
  });
});
