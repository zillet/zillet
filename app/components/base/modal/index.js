import Modal from './Modal';

import { use, registerComponent } from '@/utils/plugins';

const Plugin = {
  install(Vue) {
    registerComponent(Vue, Modal);
  }
};

use(Plugin);

export default Plugin;

export { Modal };
