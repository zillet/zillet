import Textarea from './Textarea';

import { use, registerComponent } from '@/utils/plugins';

const Plugin = {
  install(Vue) {
    registerComponent(Vue, Textarea);
  }
};

use(Plugin);

export default Plugin;

export { Textarea };
