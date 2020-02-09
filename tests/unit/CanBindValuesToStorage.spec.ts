import { mount } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';
import { ClayNode } from '@/typings/clay.d';

describe('Clay View binding', () => {
  it('to reactive data', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: { template: '<div v-text="myProp"></div>', props: ['myProp'] },
      data: {
        myData: 'storageValue',
      },
      props: {
        ':myProp': 'myData',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div>storageValue</div>');
  });

  it('to reactive nested data', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: { template: '<div v-text="myNestedProp"></div>', props: ['myNestedProp'] },
      data: {
        myNestedData: { more: { value: 'nestedValue' } },
      },
      props: {
        ':myNestedProp': 'myNestedData.more.value',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div>nestedValue</div>');
  });

  it('class with bound string', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: { template: '<div></div>' },
      data: {
        class: 'boundClass',
      },
      ':class': 'class',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes()).toEqual(['boundClass']);
  });

  it('class with bound array', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: { template: '<div></div>' },
      data: {
        class: ['boundClass', 'more'],
      },
      ':class': 'class',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes()).toEqual(['boundClass', 'more']);
  });

  it('class with bound object', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: { template: '<div></div>' },
      data: {
        class: { boundClass: true, more: true, notThere: false },
      },
      ':class': 'class',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes()).toEqual(['boundClass', 'more']);
  });

  it('class can be merged with static class', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: { template: '<div></div>' },
      data: {
        class: { boundClass: true },
      },
      class: 'staticClass',
      ':class': 'class',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.classes()).toEqual(['staticClass', 'boundClass']);
  });

  it('domProps', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'input',
      data: {
        myData: 'boundDomProp',
      },
      domProps: {
        ':value': 'myData',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect((wrapper.element as HTMLInputElement).value).toBe('boundDomProp');
  });

  it('styles', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'div',
      data: {
        style: 'red',
      },
      style: {
        ':color': 'style',
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div style="color: red;"></div>');
  });

  it('attrs', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'div',
      data: {
        id: 'boundId',
      },
      attrs: { ':id': 'id' },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div id="boundId"></div>');
  });

  it('bound to textchild', () => {
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'div',
      data: {
        text: 'text content',
      },
      ':text': 'text',
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(wrapper.html()).toBe('<div>text content</div>');
  });
});
