import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8082/api/transactions', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  getAll() {
    return apiClient.get('');
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
