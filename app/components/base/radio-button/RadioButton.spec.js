import { mount } from '@vue/test-utils';
import ZRadioButton from './RadioButton';

describe('ZRadioButton', () => {
  it('is called', () => {
    const wrapper = mount(ZRadioButton);
    expect(wrapper.name()).toBe('ZRadioButton');
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
