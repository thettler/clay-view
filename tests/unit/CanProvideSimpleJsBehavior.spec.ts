import { mount } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';

describe('Clay View can execute js code', () => {
  it('and is on default disabled', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          namespace: 'key',
          component: 'div',
          ':text': '|> "Test"',
        },
      },
    });

    expect(wrapper.html()).toBe('<div>|&gt; "Test"</div>');
  });

  it('simple string return', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          namespace: 'key',
          component: 'div',
          ':text': '|> "Test"',
        },
        config: {
          enableJsExecution: true,
        },
      },
    });

    expect(wrapper.html()).toBe('<div>Test</div>');
  });

  it('and has store access', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          namespace: 'namespace',
          component: 'div',
          ':text': '|> namespace.myData',
          data: {
            myData: 'Test data',
          },
        },
        config: {
          enableJsExecution: true,
        },
      },
    });

    expect(wrapper.html()).toBe('<div>Test data</div>');
  });

  it('can access store inside of its scope', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          namespace: 'parent',
          component: 'div',
          children: {
            namespace: 'child',
            component: 'div',
            ':text': '|> parent.shouldNotBeAccessed',
          },
          data: {
            shouldNotBeAccessed: 'Test data',
          },
        },
        config: {
          enableJsExecution: true,
        },
      },
    });

    expect(wrapper.html()).toBe('<div><div>Test data</div></div>');
  });

  it('can not access store outside of its scope', (done) => {
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
                ':text': '|> child1.shouldNotBeAccessed',
              },
            ],
          },
          config: {
            enableJsExecution: true,
          },
        },
      });

      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message).toEqual('child1 is not defined');
    }
    console.error = consolError;
    done();
  });

  it('can mutate store', async (done) => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          namespace: 'parent',
          component: 'div',
          children: {
            namespace: 'child',
            component: 'div',
            domProps: { id: 'child' },
            on: {
              ':click': '|> () => {parent.myData = "altered"}',
            },
            ':text': 'parent.myData',
          },
          data: {
            myData: 'Test data',
          },
        },
        config: {
          enableJsExecution: true,
        },
      },
    });
    expect(wrapper.html()).toBe('<div><div id="child">Test data</div></div>');
    wrapper.find('#child').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toBe('<div><div id="child">altered</div></div>');
    done();
  });
});
