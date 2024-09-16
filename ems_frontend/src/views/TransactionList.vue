<template>
  <div>
    <h2>Transaction List</h2>

    <Button label="Add Transaction" icon="pi pi-plus" class="p-button-sm p-mt-3" @click="openDialog"/>

    <DataTable :value="transactions" responsiveLayout="scroll">
      <Column field="id" header="ID"></Column>
      <Column field="amount" header="Amount"></Column>
      <Column field="type" header="Type"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="description" header="Description"></Column>
      <Column header="Actions">
        <template #body="slotProps">
          <Button label="Edit" icon="pi pi-pencil" class="p-button-sm edit-button" @click="editTransaction(slotProps.data)"/>
          <Button label="Delete" icon="pi pi-trash" class="p-button-sm p-button-danger" @click="deleteTransaction(slotProps.data.id)"/>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog for adding/editing a transaction -->
    <Dialog
      header="Transaction"
      :visible="dialogVisible"
      @hide="closeDialog" 
      :closable="true"
    >
      <TransactionForm :transaction="selectedTransaction" @save="saveTransaction" @close="closeDialog"/>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import transactionService from '../router/transactionService';
import TransactionForm from './TransactionForm.vue';

const transactions = ref([]);
const selectedTransaction = ref(null);
const dialogVisible = ref(false);
const errorMessage = ref(null);  // New state for errors

// Load transactions initially
const loadTransactions = async () => {
  try {
    const response = await transactionService.getAll();
    transactions.value = response.data;
  } catch (error) {
    console.error('Error loading transactions:', error);
    errorMessage.value = 'Failed to load transactions. Please try again later.';
  }
};

// Open dialog for new transaction
const openDialog = () => {
  selectedTransaction.value = { amount: 0, type: 'INCOME', category: 'SALARY', description: '' };
  dialogVisible.value = true;
};

// Close dialog
const closeDialog = () => {
  dialogVisible.value = false; // Set dialogVisible to false when closing the dialog
};

// Edit transaction
const editTransaction = (transaction) => {
  selectedTransaction.value = { ...transaction };
  dialogVisible.value = true;
};

//save transaction and reload list
const saveTransaction = async (transaction) => {
  try {
    if (transaction.id) {
      await transactionService.update(transaction.id, transaction);
    } else {
      await transactionService.create(transaction);
    }
    loadTransactions();
    dialogVisible.value = false;
  } catch (error) {
    console.error('Error saving transaction:', error);
    errorMessage.value = 'Failed to save transaction. Please try again later.';
  }
};

//Delete transaction
const deleteTransaction = async (id) => {
  try {
    await transactionService.delete(id);
    loadTransactions();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    errorMessage.value = 'Failed to delete transaction. Please try again later.';
  }
};

onMounted(loadTransactions);
</script>

<style scoped>
.edit-button{
  padding: 5px;
}


</style>