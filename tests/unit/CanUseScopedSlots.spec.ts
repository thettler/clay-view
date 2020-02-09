import { mount } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';
import { ClayNode } from '@/typings/clay.d';

describe('Clay View scoped slots', () => {
  it('props work', async (done) => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: {
        template: '<div><input type="text" v-model="data" /><slot :scopedData="data" /></div>',
        data() {
          return {
            data: 'initalData',
          };
        },
      },
      scopedSlots: {
        default: {
          key: 'rootSlot',
          content: {
            clayKey: 'slotChild',
            component: { template: '<div v-text="bla"></div>', props: ['bla'] },
            props: {
              ':bla': 'rootSlot#scopedData',
            },
          },
        },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><input type="text"><div>initalData</div></div>');

    const textInput = wrapper.find('input[type="text"]');
    (textInput.element as HTMLInputElement).value = 'newValue';
    textInput.trigger('input');
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toBe('<div><input type="text"><div>newValue</div></div>');
    done();
  });

  it('can be nested', async (done) => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: {
        template: '<div><input type="text" v-model="data" /><slot :scopedData="data" /></div>',
        data() {
          return {
            data: 'initalData',
          };
        },
      },
      scopedSlots: {
        default: {
          key: 'rootSlot1',
          content: {
            clayKey: 'slotChild',
            component: {
              template: '<div><div v-text="bla"></div> <slot childScopeData="childData"></slot></div>',
              props: ['bla'],
            },
            props: {
              ':bla': 'rootSlot1#scopedData',
            },
            scopedSlots: {
              default: {
                key: 'childSlot',
                content: {
                  clayKey: 'slotChildChild',
                  component: {
                    template: '<div><div v-text="bla"></div><div v-text="blaBla"></div></div>',
                    props: ['bla', 'blaBla'],
                  },
                  props: {
                    ':bla': 'rootSlot1#scopedData',
                    ':blaBla': 'childSlot#childScopeData',
                  },
                },
              },
            },
          },
        },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><input type="text"><div><div>initalData</div> <div><div>initalData</div><div>childData</div></div></div></div>');
    done();
  });

  it('are scoped and can not be accessed outside', async (done) => {
    const consolError = console.error;
    console.error = () => {
    };
    const schema: ClayNode = {
      clayKey: 'key',
      component: {
        template: '<div><slot :scopedData="data" /></div>',
        data() {
          return {
            data: 'initalData',
          };
        },
      },
      scopedSlots: {
        default: {
          key: 'rootSlot',
          content: {
            clayKey: 'slotChild',
            component: {
              template: '<div><slot childScopeData="childData"></slot></div>',
              props: ['childSlot'],
            },
            props: {
              ':childSlot': 'childSlot#childScopeData',
            },
            scopedSlots: {
              default: {
                key: 'childSlot',
                content: {
                  clayKey: 'slotChildChild',
                  component: { template: '<div></div>', props: ['rootSlot', 'childSlot'] },
                },
              },
            },
          },
        },
      },
    };

    try {
      const wrapper = mount(ClayView, {
        propsData: { schema },
      });
      expect(true).toBeFalsy();
    } catch (e) {
      expect(e.message).toEqual('ScopedSlot childSlot does not exist');
    }
    console.error = consolError;
    done();
  });

  it('binding can be used in text', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: {
        template: '<div><slot :scopedData="data" /></div>',
        data() {
          return {
            data: 'fromScope',
          };
        },
      },
      scopedSlots: {
        default: {
          key: 'rootSlot',
          content: {
            clayKey: 'slotChild',
            component: 'span',
            ':text': 'rootSlot#scopedData',
          },
        },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><span>fromScope</span></div>');
  });

  it('domProps work', async (done) => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: {
        template: '<div><slot :scopedData="data" /></div>',
        data() {
          return {
            data: 'scopeValue',
          };
        },
      },
      scopedSlots: {
        default: {
          key: 'rootSlot',
          content: {
            clayKey: 'slotChild',
            component: 'input',
            domProps: {
              ':value': 'rootSlot#scopedData',
            },
          },
        },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><input></div>');

    const textInput = wrapper.find('input');
    expect((textInput.element as HTMLInputElement).value).toBe('scopeValue');
    done();
  });

  it('attrs work', async (done) => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: {
        template: '<div><slot :scopedData="data" /></div>',
        data() {
          return {
            data: 'scopeValue',
          };
        },
      },
      scopedSlots: {
        default: {
          key: 'rootSlot',
          content: {
            clayKey: 'slotChild',
            component: 'div',
            attrs: {
              ':id': 'rootSlot#scopedData',
            },
          },
        },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><div id="scopeValue"></div></div>');
    done();
  });

  it('styles work', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: {
        template: '<div><slot :scopedData="data" /></div>',
        data() {
          return {
            data: 'red',
          };
        },
      },
      scopedSlots: {
        default: {
          key: 'rootSlot',
          content: {
            clayKey: 'slotChild',
            component: 'div',
            style: {
              ':color': 'rootSlot#scopedData',
            },
          },
        },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><div style="color: red;"></div></div>');
  });

  it('class work', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: {
        template: '<div><slot :scopedData="data" /></div>',
        data() {
          return {
            data: 'scopedClass',
          };
        },
      },
      scopedSlots: {
        default: {
          key: 'rootSlot',
          content: {
            clayKey: 'slotChild',
            component: 'div',
            ':class': 'rootSlot#scopedData',
          },
        },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><div class="scopedClass"></div></div>');
  });
  it('events work', () => {
    let eventTriggered = false;
    const schema: ClayNode = {
      clayKey: 'key',
      component: {
        template: '<div><slot :event="scopeEvent" /></div>',
        methods: {
          scopeEvent() {
            eventTriggered = true;
          },
        },
      },
      scopedSlots: {
        default: {
          key: 'rootSlot',
          content: {
            clayKey: 'slotChild',
            component: 'button',
            on: {
              ':click': 'rootSlot#event',
            },
          },
        },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><button></button></div>');
    wrapper.find('button').trigger('click');
    expect(eventTriggered).toBeTruthy();
  });
  it('native events work', () => {
    let eventTriggered = false;
    const schema: ClayNode = {
      clayKey: 'key',
      component: {
        template: '<div><slot :event="scopeEvent" /></div>',
        methods: {
          scopeEvent() {
            eventTriggered = true;
          },
        },
      },
      scopedSlots: {
        default: {
          key: 'rootSlot',
          content: {
            clayKey: 'slotChild',
            component: { template: '<button></button>' },
            nativeOn: {
              ':click': 'rootSlot#event',
            },
          },
        },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><button></button></div>');
    wrapper.find('button').trigger('click');
    expect(eventTriggered).toBeTruthy();
  });
});
