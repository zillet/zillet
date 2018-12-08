const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

const parseJSON = response => {
  return response.json();
};

export default ({ env }, inject) => {
  inject('fetch', (url, params) => {
    return new Promise((resolve, reject) => {
      if (!url || url === '') {
        try {
          const node = JSON.stringify(localStorage.getItem('_selected_node'));
          if (node && node.url) url = node.url;
          else {
            url = env.node.url;
          }
        } catch (error) {
          url = env.node.url;
        }
      }
      params.headers = {
        'Content-Type': 'application/json'
      };
      fetch(url, params)
        .then(checkStatus)
        .then(parseJSON)
        .then(data => {
          resolve(data);
        })
        .catch(error => {
          reject(error);
        });
    });
  });
};
