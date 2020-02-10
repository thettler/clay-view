import { mount } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';
import { ClayNode } from '@/typings/clay.d';

describe('Clay View scoped slots', () => {
  it('props work', async (done) => {
    const schema: ClayNode = {
      namespace: 'root',
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
          namespace: 'slotChild',
          component: { template: '<div v-text="bla"></div>', props: ['bla'] },
          props: {
            ':bla': 'root/slot/default::scopedData',
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
      namespace: 'root',
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
          namespace: 'child',
          component: {
            template: '<div><div v-text="bla"></div> <slot childScopeData="childData"></slot></div>',
            props: ['bla'],
          },
          props: {
            ':bla': 'root/slot/default::scopedData',
          },
          scopedSlots: {
            default: {
              namespace: 'slotChildChild',
              component: {
                template: '<div><div v-text="bla"></div><div v-text="blaBla"></div></div>',
                props: ['bla', 'blaBla'],
              },
              props: {
                ':bla': 'root/slot/default::scopedData',
                ':blaBla': 'child/slot/default::childScopeData',
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
      namespace: 'root',
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
          namespace: 'child',
          component: {
            template: '<div><slot childScopeData="childData"></slot></div>',
            props: ['childSlot'],
          },
          props: {
            ':childSlot': 'child/slot/default::childScopeData',
          },
          scopedSlots: {
            default: {
              namespace: 'slotChildChild',
              component: { template: '<div></div>', props: ['rootSlot', 'childSlot'] },
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
      expect(e.message).toEqual('Namespace child/slot/default does not exist');
    }
    console.error = consolError;
    done();
  });

  it('binding can be used in text', () => {
    const schema: ClayNode = {
      namespace: 'root',
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
          namespace: 'slotChild',
          component: 'span',
          ':text': 'root/slot/default::scopedData',
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
      namespace: 'root',
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
          namespace: 'slotChild',
          component: 'input',
          domProps: {
            ':value': 'root/slot/default::scopedData',
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
      namespace: 'root',
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
          namespace: 'slotChild',
          component: 'div',
          attrs: {
            ':id': 'root/slot/default::scopedData',
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
      namespace: 'root',
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
          namespace: 'slotChild',
          component: 'div',
          style: {
            ':color': 'root/slot/default::scopedData',
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
      namespace: 'root',
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
          namespace: 'slotChild',
          component: 'div',
          ':class': 'root/slot/default::scopedData',
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
      namespace: 'root',
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
          namespace: 'slotChild',
          component: 'button',
          on: {
            ':click': 'root/slot/default::event',
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
      namespace: 'root',
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
          namespace: 'slotChild',
          component: { template: '<button></button>' },
          nativeOn: {
            ':click': 'root/slot/default::event',
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
