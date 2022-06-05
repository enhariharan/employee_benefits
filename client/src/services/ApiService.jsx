import axiosRequest from './AxiosService.jsx';

function get(url, data) {
  return axiosRequest({
    url: url,
    method: 'GET',
  });
}

function post(url, data) {
  return axiosRequest({
    url: url,
    method: 'POST',
    data: data,
  });
}

function put(url, data) {
  return axiosRequest({
    url: url,
    method: 'PUT',
    data: data,
  });
}

function deleteRq(url, data) {
  return axiosRequest({
    url: url,
    method: 'DELETE',
    data: data,
  });
}

const ApiService = {
  get,
  post,
  put,
  deleteRq,
};

export default ApiService;
