import { mount } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';
import BasicTestComponent from '@/../tests/unit/support/BasicTestComponent.vue';
import BasicTestWithPropComponent from '@/../tests/unit/support/BasicTestWithPropComponent.vue';
import BasicTestWithSlotComponent from '@/../tests/unit/support/BasicTestWithSlotComponent.vue';
import BasicTestWithnamedSlotComponent from '@/../tests/unit/support/BasicTestWithNamedSlotComponent.vue';
import { ClayNode } from '@/typings/clay.d';

describe('Clay View can render single File Component', () => {
  it('without any attributes', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: BasicTestComponent,
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toMatch('<div></div>');
  });

  it('with classes string Syntax', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: BasicTestComponent,
      class: 'myClass',
    };
    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes('myClass')).toBeTruthy();
  });

  it('with classes array Syntax', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: BasicTestComponent,
      class: ['myArrClass'],

    };
    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes('myArrClass')).toBeTruthy();
  });

  it('with classes object Syntax', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: BasicTestComponent,
      class: { myObjClass: true },

    };
    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes('myObjClass')).toBeTruthy();
  });

  it('with styles object Syntax', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: BasicTestComponent,
      style: { color: 'red' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div style="color: red;"></div>');
  });

  it('with domProps', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: BasicTestComponent,
      domProps: { value: 'propValue' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect((wrapper.element as HTMLInputElement).value).toBe('propValue');
  });

  it('with props', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: BasicTestWithPropComponent,
      props: { myProp: 'propValue' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div>propValue</div>');
  });

  it('with slot', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: BasicTestWithSlotComponent,
      children: [
        {
          clayKey: 'key',
          component: 'span',
          children: [{
            clayKey: 'key',
            component: 'b',
            text: 'text',
          }],
        },
        {
          clayKey: 'key',
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
      clayKey: 'key',
      component: BasicTestWithNamedSlotComponent,
      children: [
        {
          clayKey: 'key',
          component: { template: '<span></span>' },
          slot: 'slot',
        },
        {
          clayKey: 'key',
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
      clayKey: 'key',
      component: BasicTestComponent,
      attrs: { id: 'id' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div id="id"></div>');
  });
});
