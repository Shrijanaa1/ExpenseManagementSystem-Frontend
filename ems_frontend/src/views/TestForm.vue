<template>
    <div>
      <!-- Button to open the form dialog -->
      <Button label="Add Transaction" icon="pi pi-plus" @click="showDialog = true" />
      
      <!-- Transaction DataTable -->
      <DataTable :value="transactions" dataKey="id">
        <Column field="amount" header="Amount" />
        <Column field="type" header="Type" />
        <Column field="category" header="Category" />
        <Column field="description" header="Description" />
        <Column header="Actions" body="actionTemplate" />
      </DataTable>
      
      <!-- Dialog for Creating/Updating Transaction -->
      <Dialog header="Transaction" v-model:visible="showDialog">
        <form @submit.prevent="saveTransaction">
          <div class="p-fluid">
            <div class="p-field">
              <label for="amount">Amount</label>
              <InputText id="amount" v-model="transactionForm.amount" />
            </div>
            <div class="p-field">
              <label for="type">Type</label>
              <Select id="type" v-model="transactionForm.type" :options="transactionTypes" />
            </div>
            <div class="p-field">
              <label for="category">Category</label>
              <Select id="category" v-model="transactionForm.category" :options="categories" />
            </div>
            <div class="p-field">
              <label for="description">Description</label>
              <InputText id="description" v-model="transactionForm.description" />
            </div>
            <Button type="submit" label="Save" />
          </div>
        </form>
      </Dialog>
      
      <!-- Confirmation Dialog for Deletion -->
      <Dialog header="Confirm" v-model:visible="showConfirmDialog" :footer="confirmDialogFooter">
        <p>Are you sure you want to delete this transaction?</p>
      </Dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  const showDialog = ref(false);
  const showConfirmDialog = ref(false);
  const transactionForm = ref({
    amount: '',
    type: '',
    category: '',
    description: ''
  });
  const transactions = ref([]);
  const transactionTypes = ['INCOME', 'EXPENSE'];
  const categories = ref([]);
  
  const loadTransactions = async () => {
    try {
      const response = await axios.get('/api/transactions');
      transactions.value = response.data;
    } catch (error) {
      console.error('Error loading transactions', error);
    }
  };
  
  const loadCategories = async (type) => {
    try {
      const response = await axios.get(`/api/transactions/categories/${type}`);
      categories.value = response.data;
    } catch (error) {
      console.error('Error loading categories', error);
    }
  };
  
  const saveTransaction = async () => {
    try {
      if (transactionForm.value.id) {
        await axios.put(`/api/transactions/${transactionForm.value.id}`, transactionForm.value);
      } else {
        await axios.post('/api/transactions', transactionForm.value);
      }
      await loadTransactions();
      showDialog.value = false;
    } catch (error) {
      console.error('Error saving transaction', error);
    }
  };
  
  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      await loadTransactions();
      showConfirmDialog.value = false;
    } catch (error) {
      console.error('Error deleting transaction', error);
    }
  };
  
  const actionTemplate = (rowData) => {
    return (
      <>
        <Button icon="pi pi-pencil" class="p-button-rounded p-button-info p-mr-2" onClick={() => editTransaction(rowData)} />
        <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" onClick={() => confirmDelete(rowData.id)} />
      </>
    );
  };
  
  const editTransaction = (transaction) => {
    transactionForm.value = { ...transaction };
    showDialog.value = true;
  };
  
  const confirmDelete = (id) => {
    showConfirmDialog.value = true;
    deleteTransaction(id);
  };
  
  const confirmDialogFooter = (
    <>
      <Button label="No" icon="pi pi-times" onClick={() => showConfirmDialog.value = false} />
      <Button label="Yes" icon="pi pi-check" onClick={() => deleteTransaction(transactionForm.value.id)} />
    </>
  );
  
  onMounted(() => {
    loadTransactions();
  });
  </script>
  
  <style scoped>
  </style>
  