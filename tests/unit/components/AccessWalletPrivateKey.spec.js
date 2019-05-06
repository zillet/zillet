import { shallowMount } from '@vue/test-utils';
import AccessWalletPrivateKey from '@/components/AccessWalletPrivateKey.vue';
let baseProps = {
  privateKey: '05a331658ca9ea551bd9dcf209c7ece26f6d08c3eeb051b07debb95abf32f49b'
};

describe('AccessWalletPrivateKey', () => {
  it('is called', () => {
    const wrapper = shallowMount(AccessWalletPrivateKey);
    expect(wrapper.name()).toBe('PrivateKey');
    expect(wrapper.isVueInstance()).toBeTruthy();
  });
});
