export default function({ $axios }) {
  $axios.onRequest(config => {
    try {
      const node = JSON.parse(localStorage.getItem('_selected_node'));
      console.log(config);
      // if (node && node.url) config.baseURL = `${node.url}/api`;
    } catch (error) {
      // error
    }
    config.headers.post['Content-Type'] = 'application/json';
    config.headers.common['Access-Control-Allow-Origin'] = '*';
  });
}
