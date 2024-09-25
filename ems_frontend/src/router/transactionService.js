import axios from 'axios';

//Transaction API client
const transactionApiClient = axios.create({ //defining default settings for all HTTP requests made through it
  baseURL: 'http://localhost:8082/api/transactions', 
  headers: {
    'Content-Type': 'application/json', //data sent in requests will be in JSON format
  },
});

//Budget API client
const budgetApiClient = axios.create({ //defining default settings for all HTTP requests made through it
  baseURL: 'http://localhost:8082/api/budgets', 
  headers: {
    'Content-Type': 'application/json', //data sent in requests will be in JSON format
  },
});


export default { 

  //Transaction API methods
  getAll(params) {
    return transactionApiClient.get('', { params });
  },
  getById(id) {
    return transactionApiClient.get(`/${id}`);
  },
  create(transaction) {
    return transactionApiClient.post('', transaction);
  },
  update(id, transaction) {
    return transactionApiClient.put(`/${id}`, transaction);
  },
  delete(id) {
    return transactionApiClient.delete(`/${id}`);
  },
  getCategories(type) {
    return transactionApiClient.get(`/categories/${type}`);
  },


  //Budget API methods

  getById(id) {
    return budgetApiClient.get(`/${id}`);
  },
  create(budget) {
    return budgetApiClient.post('', budget);
  },
  update(id, budget) {
    return budgetApiClient.put(`/${id}`, budget);
  },
  delete(id) {
    return budgetApiClient.delete(`/${id}`);
  },

};


