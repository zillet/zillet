import { mount } from '@vue/test-utils';
import ZIcon from './Icon';

describe('ZIcon', () => {
  it('is called', () => {
    const wrapper = mount(ZIcon);
    expect(wrapper.name()).toBe('ZIcon');
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
