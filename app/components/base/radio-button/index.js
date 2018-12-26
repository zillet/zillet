import RadioButton from './RadioButton';

import { use, registerComponent } from '@/utils/plugins';

const Plugin = {
  install(Vue) {
    registerComponent(Vue, RadioButton);
  }
};

use(Plugin);

export default Plugin;

export { RadioButton };
