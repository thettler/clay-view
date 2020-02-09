import { mount, Wrapper } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';
import { ClayNode } from '@/typings/clay.d';

describe('Clay View can render conditionally', () => {
  it('with if true', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          clayKey: 'key',
          component: 'div',
          children: {
            clayKey: 'childHidden',
            component: 'span',
            if: true,
          },
        },
      },
    });

    expect(wrapper.html()).toBe('<div><span></span></div>');
  });

  it('with if false', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          clayKey: 'key',
          component: 'div',
          children: {
            clayKey: 'childHidden',
            component: 'span',
            if: false,
          },
        },
      },
    });

    expect(wrapper.html()).toBe('<div></div>');
  });

  it('with bound if false', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          clayKey: 'key',
          component: 'div',
          children: {
            clayKey: 'childHidden',
            component: 'span',
            ':if': 'render',
            data: {
              render: false,
            },
          },
        },
      },
    });

    expect(wrapper.html()).toBe('<div></div>');
  });

  it('with bound if true', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          clayKey: 'key',
          component: 'div',
          children: {
            clayKey: 'childHidden',
            component: 'span',
            ':if': 'render',
            data: {
              render: true,
            },
          },
        },
      },
    });

    expect(wrapper.html()).toBe('<div><span></span></div>');
  });

  it('with bound if false in Scoped Slot', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          clayKey: 'key',
          component: { template: '<div><slot :show="false"></slot></div>' },
          scopedSlots: {
            default: {
              key: 'scope',
              content: {
                clayKey: 'childHidden',
                component: 'span',
                ':if': 'scope#show',
              },
            },
          },
        },
      },
    });

    expect(wrapper.html()).toBe('<div></div>');
  });

  it('with show true', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          clayKey: 'key',
          component: 'div',
          children: {
            clayKey: 'childHidden',
            component: 'span',
            show: true,
          },
        },
      },
    });

    expect(wrapper.html()).toBe('<div><span></span></div>');
  });

  it('with show false', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          clayKey: 'key',
          component: 'div',
          children: {
            clayKey: 'childHidden',
            component: 'span',
            show: false,
          },
        },
      },
    });

    expect(wrapper.html()).toBe('<div><span style="display: none;"></span></div>');
  });

  it('with bound show false', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          clayKey: 'key',
          component: 'div',
          children: {
            clayKey: 'childHidden',
            component: 'span',
            ':show': 'render',
            data: {
              render: false,
            },
          },
        },
      },
    });

    expect(wrapper.html()).toBe('<div><span style="display: none;"></span></div>');
  });

  it('with bound show true', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          clayKey: 'key',
          component: 'div',
          children: {
            clayKey: 'childHidden',
            component: 'span',
            ':show': 'render',
            data: {
              render: true,
            },
          },
        },
      },
    });

    expect(wrapper.html()).toBe('<div><span></span></div>');
  });

  it('with bound show false in Scoped Slot', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          clayKey: 'key',
          component: { template: '<div><slot :show="false"></slot></div>' },
          scopedSlots: {
            default: {
              key: 'scope',
              content: {
                clayKey: 'childHidden',
                component: 'span',
                ':show': 'scope#show',
              },
            },
          },
        },
      },
    });

    expect(wrapper.html()).toBe('<div><span style="display: none;"></span></div>');
  });
});
