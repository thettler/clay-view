import { mount } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';
import { ClayNode } from '@/typings/clay.d';

describe('Clay View can render normal html', () => {
  it('without any attributes', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'h1',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toMatch('<h1></h1>');
  });

  it('with classes string Syntax', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'h1',
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
      component: 'h1',
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
      component: 'h1',
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
      component: 'h1',
      style: { color: 'red' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<h1 style="color: red;"></h1>');
  });

  it('with domProps', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'input',
      domProps: { value: 'propValue' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect((wrapper.element as HTMLInputElement).value).toBe('propValue');
  });

  it('with attrs', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'input',
      attrs: { id: 'id' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<input id="id">');
  });

  it('with ref', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'input',
      ref: 'ref',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect((wrapper.vm.$refs.ref as HTMLInputElement).outerHTML).toBe('<input>');
  });

  it('with inner text', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'div',
      text: 'Some Text',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div>Some Text</div>');
  });

  it('with inner children', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'div',
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
});
