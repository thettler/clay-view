import { mount } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';
import { ClayNode } from '@/typings/clay.d';

describe('Clay View can render inline Components', () => {
  it('without any attributes', () => {
    const schema: ClayNode = {
      namespace: 'key',
      component: { template: '<div>Component</div>' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toMatch('<div>Component</div>');
  });

  it('with classes string Syntax', () => {
    const schema: ClayNode = {
      namespace: 'key',
      component: { template: '<div>Component</div>' },
      class: 'myClass',
    };
    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes('myClass')).toBeTruthy();
  });

  it('with classes array Syntax', () => {
    const schema: ClayNode = {
      namespace: 'key',
      component: { template: '<div>Component</div>' },
      class: ['myArrClass'],

    };
    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes('myArrClass')).toBeTruthy();
  });

  it('with classes object Syntax', () => {
    const schema: ClayNode = {
      namespace: 'key',
      component: { template: '<div>Component</div>' },
      class: { myObjClass: true },

    };
    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes('myObjClass')).toBeTruthy();
  });

  it('with styles object Syntax', () => {
    const schema: ClayNode = {
      namespace: 'key',
      component: { template: '<div></div>' },
      style: { color: 'red' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div style="color: red;"></div>');
  });

  it('with domProps', () => {
    const schema: ClayNode = {
      namespace: 'key',
      component: { template: '<div>Component</div>' },
      domProps: { value: 'propValue' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect((wrapper.element as HTMLInputElement).value).toBe('propValue');
  });

  it('with props', () => {
    const schema: ClayNode = {
      namespace: 'key',
      component: { template: '<div v-text="myProp" />', props: ['myProp'] },
      props: { myProp: 'propValue' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div>propValue</div>');
  });

  it('with slot', () => {
    const schema: ClayNode = {
      namespace: 'key',
      component: { template: '<div><slot /></div>' },
      children: [
        {
          namespace: 'key',
          component: 'span',
          children: [{
            namespace: 'key',
            component: 'b',
            text: 'text',
          }],
        },
        {
          namespace: 'key',
          component: 'a',
          text: 'link',
        },
      ],
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><span><b>text</b></span><a>link</a></div>');
  });

  it('with named slot', () => {
    const schema: ClayNode = {
      namespace: 'key',

      component: { template: '<div><div data="default"><slot/></div><div data="slot"><slot name="slot" /></div></div>' },
      children: [
        {
          namespace: 'key',
          component: { template: '<span></span>' },
          slot: 'slot',
        },
        {
          namespace: 'key',
          component: { template: '<a></a>' },
        },
      ],
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><div data="default"><a></a></div><div data="slot"><span></span></div></div>');
  });

  it('with attrs', () => {
    const schema: ClayNode = {
      namespace: 'key',
      component: { template: '<div></div>' },
      attrs: { id: 'id' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div id="id"></div>');
  });
});
