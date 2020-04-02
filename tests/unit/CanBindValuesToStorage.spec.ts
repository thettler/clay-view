import { mount } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';
import { ClayNode } from '@/typings/clay.d';

describe('Clay View binding', () => {
  it('to reactive data', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: { template: '<div v-text="myProp"></div>', props: ['myProp'] },
      data: {
        myData: 'storageValue',
      },
      props: {
        ':myProp': 'root.myData',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div>storageValue</div>');
  });

  it('to reactive nested data', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: { template: '<div v-text="myNestedProp"></div>', props: ['myNestedProp'] },
      data: {
        myNestedData: { more: { value: 'nestedValue' } },
      },
      props: {
        ':myNestedProp': 'root.myNestedData.more.value',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div>nestedValue</div>');
  });

  it('class with bound string', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: { template: '<div></div>' },
      data: {
        class: 'boundClass',
      },
      ':class': 'root.class',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes()).toEqual(['boundClass']);
  });

  it('class with bound array', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: { template: '<div></div>' },
      data: {
        class: ['boundClass', 'more'],
      },
      ':class': 'root.class',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes()).toEqual(['boundClass', 'more']);
  });

  it('class with bound object', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: { template: '<div></div>' },
      data: {
        class: { boundClass: true, more: true, notThere: false },
      },
      ':class': 'root.class',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes()).toEqual(['boundClass', 'more']);
  });

  it('class can be merged with static class', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: { template: '<div></div>' },
      data: {
        class: { boundClass: true },
      },
      class: 'staticClass',
      ':class': 'root.class',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes()).toEqual(['staticClass', 'boundClass']);
  });

  it('domProps', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'input',
      data: {
        myData: 'boundDomProp',
      },
      domProps: {
        ':value': 'root.myData',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect((wrapper.element as HTMLInputElement).value).toBe('boundDomProp');
  });

  it('styles', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      data: {
        style: 'red',
      },
      style: {
        ':color': 'root.style',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div style="color: red;"></div>');
  });

  it('attrs', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      data: {
        id: 'boundId',
      },
      attrs: { ':id': 'root.id' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div id="boundId"></div>');
  });

  it('bound to text child', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      data: {
        text: 'text content',
      },
      ':text': 'root.text',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div>text content</div>');
  });

  it('bound to html child', () => {
    const schema: ClayNode = {
      namespace: 'root',
      component: 'div',
      data: {
        html: '<span>html content</span>',
      },
      ':html': 'root.html',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><span>html content</span></div>');
  });

  it('works with nested values as well', () => {
    const schema: ClayNode = {
      namespace: 'parent',
      component: 'div',
      data: {
        text: 'text content',
      },
      children: {
        namespace: 'child',
        component: 'span',
        ':text': 'parent.text',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div><span>text content</span></div>');
  });
});
