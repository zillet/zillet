import { mount } from '@vue/test-utils';
import ZInput from './Input';

describe('ZInput', () => {
  it('is called', () => {
    const wrapper = mount(ZInput);
    expect(wrapper.name()).toBe('ZInput');
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
