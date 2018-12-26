import Blockies from './Blockies';

import { use, registerComponent } from '@/utils/plugins';

const Plugin = {
  install(Vue) {
    registerComponent(Vue, Blockies);
  }
};

use(Plugin);

export default Plugin;

export { Blockies };
