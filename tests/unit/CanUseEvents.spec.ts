import { mount } from '@vue/test-utils';
import ClayView from '@/ClayView.vue';
import { ClayNode } from '@/typings/clay.d';

describe('Clay View can render Events', () => {
  it('tags can use normal on with js function', async (done) => {
    let clicked = false;
    const schema: ClayNode = {
      clayKey: 'key',
      component: 'button',
      on: {
        click() { clicked = true; },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(clicked).toBeFalsy();
    wrapper.trigger('click');
    await wrapper.vm.$nextTick();
    expect(clicked).toBeTruthy();
    done();
  });

  it('components can use normal on with js function', async (done) => {
    let clicked = false;
    const schema: ClayNode = {
      clayKey: 'key',
      component: { template: '<button @click="$emit(\'click\')"></button>' },
      on: {
        click() { clicked = true; },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(clicked).toBeFalsy();
    wrapper.trigger('click');
    await wrapper.vm.$nextTick();
    expect(clicked).toBeTruthy();
    done();
  });

  it('components can use native on with js function', async (done) => {
    let clicked = false;
    const schema: ClayNode = {
      clayKey: 'key',
      component: { template: '<button></button>' },
      nativeOn: {
        click() { clicked = true; },
      },
    };

    const wrapper = mount(ClayView, {
      propsData: { schema },
    });

    expect(clicked).toBeFalsy();
    wrapper.trigger('click');
    await wrapper.vm.$nextTick();
    expect(clicked).toBeTruthy();
    done();
  });
});
