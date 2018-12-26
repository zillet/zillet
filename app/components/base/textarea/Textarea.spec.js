import { mount } from '@vue/test-utils';
import ZTextarea from './Textarea';

describe('ZTextarea', () => {
  it('is called', () => {
    const wrapper = mount(ZTextarea);
    expect(wrapper.name()).toBe('ZTextarea');
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
