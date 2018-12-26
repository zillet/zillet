import { mount } from '@vue/test-utils';
import ZUpload from './Upload';

describe('ZUpload', () => {
  it('is called', () => {
    const wrapper = mount(ZUpload);
    expect(wrapper.name()).toBe('ZUpload');
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
