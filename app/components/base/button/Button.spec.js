import { mount } from '@vue/test-utils';
import ZButton from './Button';

describe('ZButton', () => {
  it('is called', () => {
    const wrapper = mount(ZButton);
    expect(wrapper.name()).toBe('ZButton');
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
