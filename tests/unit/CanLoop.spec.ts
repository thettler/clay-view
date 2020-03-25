import { mount } from '@vue/test-utils';
import { ClayNode } from '../../src/typings/clay.d';
import ClayView from '@/ClayView.vue';

describe('Clay View can loop', () => {
  it('static array with one child object ', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      children: {
        namespace: 'child',
        component: 'span',
        for: ['item_1', 'item_2'],
        attrs: {
          ':data-index': 'child/for::index',
        },
        ':text': 'child/for::value',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><span data-index="0">item_1</span><span data-index="1">item_2</span></div>');
  });

  it('bound array with one child object ', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      children: {
        namespace: 'child',
        component: 'span',
        ':for': 'root::loopable',
        attrs: {
          ':data-index': 'child/for::index',
        },
        ':text': 'child/for::value',
      },
      data: {
        loopable: ['item_1', 'item_2'],
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });


    expect(wrapper.html()).toBe('<div><span data-index="0">item_1</span><span data-index="1">item_2</span></div>');
  });

  it('bound array with one deep nested child object ', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      children: {
        namespace: 'child1',
        component: 'div',
        children: {
          namespace: 'child',
          component: 'span',
          ':for': 'root::loopable',
          attrs: {
            ':data-index': 'child/for::index',
          },
          ':text': 'child/for::value',
        },
      },
      data: {
        loopable: ['item_1', 'item_2'],
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });


    expect(wrapper.html()).toBe('<div><div><span data-index="0">item_1</span><span data-index="1">item_2</span></div></div>');
  });

  it('static array with nested child object ', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      children: {
        namespace: 'child',
        component: 'span',
        for: ['item_1', 'item_2'],
        children: {
          namespace: 'nestedChild',
          component: 'b',
          attrs: {
            ':data-index': 'child/for::index',
          },
          ':text': 'child/for::value',
        },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><span><b data-index="0">item_1</b></span><span><b data-index="1">item_2</b></span></div>');
  });

  it('static obj with one child object ', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      children: {
        namespace: 'child',
        component: 'span',
        for: { key1: 'item_1', key2: 'item_2' },
        attrs: {
          ':data-index': 'child/for::index',
          ':data-key': 'child/for::key',
        },
        ':text': 'child/for::value',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><span data-index="0" data-key="key1">item_1</span><span data-index="1" data-key="key2">item_2</span></div>');
  });

  it('static obj with one child array ', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      children: [{
        namespace: 'child',
        component: 'span',
        for: { key1: 'item_1', key2: 'item_2' },
        attrs: {
          ':data-index': 'child/for::index',
          ':data-key': 'child/for::key',
        },
        ':text': 'child/for::value',
      }],
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><span data-index="0" data-key="key1">item_1</span><span data-index="1" data-key="key2">item_2</span></div>');
  });

  it('static obj with nested child object ', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      children: {
        namespace: 'child',
        component: 'span',
        for: { key1: 'item_1', key2: 'item_2' },
        children: {
          namespace: 'nestedChild',
          component: 'b',
          attrs: {
            ':data-index': 'child/for::index',
            ':data-key': 'child/for::key',
          },
          ':text': 'child/for::value',
        },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><span><b data-index="0" data-key="key1">item_1</b></span><span><b data-index="1" data-key="key2">item_2</b></span></div>');
  });

  it('bound obj with one child object ', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      children: {
        namespace: 'child',
        component: 'span',
        ':for': 'root::loopable',
        attrs: {
          ':data-index': 'child/for::index',
          ':data-key': 'child/for::key',
        },
        ':text': 'child/for::value',
      },
      data: {
        loopable: { key1: 'item_1', key2: 'item_2' },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><span data-index="0" data-key="key1">item_1</span><span data-index="1" data-key="key2">item_2</span></div>');
  });

  it('and bind key', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      children: {
        namespace: 'child',
        component: 'span',
        for: { key1: 'item_1', key2: 'item_2' },
        ':key': 'child/for::key',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    // @ts-ignore
    expect(wrapper.findAll('span').at(0).vnode.key).toBe('key1');
    // @ts-ignore
    expect(wrapper.findAll('span').at(1).vnode.key).toBe('key2');
  });
});
