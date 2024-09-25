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
  getAllTransactions(params) {
    return transactionApiClient.get('', { params });
  },
  getTransactionById(id) {
    return transactionApiClient.get(`/${id}`);
  },
  createTransaction(transaction) {
    return transactionApiClient.post('', transaction);
  },
  updateTransaction(id, transaction) {
    return transactionApiClient.put(`/${id}`, transaction);
  },
  deleteTransaction(id) {
    return transactionApiClient.delete(`/${id}`);
  },
  getTransactionCategories(type) {
    return transactionApiClient.get(`/categories/${type}`);
  },


  //Budget API methods

  getAllBudgets(params) {
    return budgetApiClient.get('', { params });
  },
  getBudgetById(id) {
    return budgetApiClient.get(`/${id}`);
  },
  createBudget(budget) {
    return budgetApiClient.post('', budget);
  },
  updateBudget(id, budget) {
    return budgetApiClient.put(`/${id}`, budget);
  },
  deleteBudget(id) {
    return budgetApiClient.delete(`/${id}`);
  },
  getBudgetCategories(type) {
    return budgetApiClient.get(`/categories/${type}`);
  },
};


