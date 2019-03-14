import Alert from './Alert';

import { use, registerComponent } from '@/utils/plugins';

const Plugin = {
  install(Vue) {
    registerComponent(Vue, Alert);
  }
};

use(Plugin);

export default Plugin;

export { Alert };
