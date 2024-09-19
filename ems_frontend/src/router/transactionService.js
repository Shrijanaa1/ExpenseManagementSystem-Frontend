import axios from 'axios';

const apiClient = axios.create({ //defining default settings for all HTTP requests made through it
  baseURL: 'http://localhost:8082/api/transactions', 
  headers: {
    'Content-Type': 'application/json', //data sent in requests will be in JSON format
  },
});

export default {  //exports an object that contains methods for interacting with the API
  getAll(params) {
    return apiClient.get('', { params });
  },
  getById(id) {
    return apiClient.get(`/${id}`);
  },
  create(transaction) {
    return apiClient.post('', transaction);
  },
  update(id, transaction) {
    return apiClient.put(`/${id}`, transaction);
  },
  delete(id) {
    return apiClient.delete(`/${id}`);
  },
  getCategories(type) {
    return apiClient.get(`/categories/${type}`);
  },
};
