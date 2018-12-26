import { mount } from '@vue/test-utils';
import ZModal from './Modal';

describe('ZModal', () => {
  it('is called', () => {
    const wrapper = mount(ZModal);
    expect(wrapper.name()).toBe('ZModal');
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
