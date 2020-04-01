import { mount } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';

describe('Clay View can render conditionally', () => {
  it('with if true', () => {
    const wrapper = mount(ClayView, {
      propsData: {
        schema: {
          namespace: 'key',
          component: 'div',
          children: {
            namespace: 'childHidden',
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
          namespace: 'key',
          component: 'div',
          children: {
            namespace: 'childHidden',
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
          namespace: 'key',
          component: 'div',
          children: {
            namespace: 'childHidden',
            component: 'span',
            ':if': 'childHidden.render',
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
          namespace: 'key',
          component: 'div',
          children: {
            namespace: 'childHidden',
            component: 'span',
            ':if': 'childHidden.render',
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
          namespace: 'root',
          component: { template: '<div><slot :show="false"></slot></div>' },
          scopedSlots: {
            default: {
              namespace: 'childHidden',
              component: 'span',
              ':if': 'root.$slot.default.show',
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
          namespace: 'key',
          component: 'div',
          children: {
            namespace: 'childHidden',
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
          namespace: 'key',
          component: 'div',
          children: {
            namespace: 'childHidden',
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
          namespace: 'key',
          component: 'div',
          children: {
            namespace: 'childHidden',
            component: 'span',
            ':show': 'childHidden.render',
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
          namespace: 'key',
          component: 'div',
          children: {
            namespace: 'childHidden',
            component: 'span',
            ':show': 'childHidden.render',
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
          namespace: 'root',
          component: { template: '<div><slot :show="false"></slot></div>' },
          scopedSlots: {
            default: {
              namespace: 'childHidden',
              component: 'span',
              ':show': 'root.$slot.default.show',
            },
          },
        },
      },
    });

    expect(wrapper.html()).toBe('<div><span style="display: none;"></span></div>');
  });
});
