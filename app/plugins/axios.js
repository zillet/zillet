export default function({ $axios }) {
  $axios.onRequest(config => {
    try {
      const node = JSON.parse(localStorage.getItem('_selected_node'));
      if (node && node.url) config.baseURL = node.url;
    } catch (error) {
      // error
    }
    config.headers.post['Content-Type'] = 'application/json';
  });
}
