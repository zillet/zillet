import QrCode from './QrCode';

import { use, registerComponent } from '@/utils/plugins';

const Plugin = {
  install(Vue) {
    registerComponent(Vue, QrCode);
  }
};

use(Plugin);

export default Plugin;

export { QrCode };
