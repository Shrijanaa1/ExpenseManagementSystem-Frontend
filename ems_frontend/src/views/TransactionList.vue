<template>
  <div>
    <h2>Transaction List</h2>

    <Button label="Add Transaction" icon="pi pi-plus" class="add-button" @click="openDialog"/>

    <DataTable :value="transactions" responsiveLayout="scroll">
      <Column field="id" header="ID"></Column>
      <Column field="amount" header="Amount"></Column>
      <Column field="type" header="Type"></Column>
      <Column field="category" header="Category"></Column>
      <Column field="description" header="Description"></Column>
      <Column header="Actions">
        <template #body="slotProps">  <!-- #body directive allows to pass specific row's data to the button -->
          <Button label="Edit" icon="pi pi-pencil" class="p-button-sm edit-button" @click="editTransaction(slotProps.data)"/>
          <Button label="Delete" icon="pi pi-trash" class="p-button-sm p-button-danger" @click="deleteTransaction(slotProps.data.id)"/>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog for adding/editing a transaction -->
    <Dialog
      header="Transaction"
      v-model:visible="dialogVisible"
      @hide="closeDialog" 
      :closable="true"
    >

    <!-- To change default header of give custom view -->
    <!-- <template #header> 
      Test
    </template> -->

      <TransactionForm :transaction="selectedTransaction" @save="saveTransaction" @close="closeDialog"/>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted} from 'vue'; //ref: reactive references // onMounted: lifecycle hook that runs when component is mounted
import transactionService from '../router/transactionService';  //handles API requests to manage transaction
import TransactionForm from './TransactionForm.vue';

const transactions = ref([]);   //Holds list of transactions, initially an empty array
const selectedTransaction = ref(null);  //Stores transaction being edited/added. If null means no transaction selected
const dialogVisible = ref(false); //controls visibility of dialog
const errorMessage = ref(null);  // New state for errors

// Load transactions initially
const loadTransactions = async () => { //method called when component is mounted
  try {
    const response = await transactionService.getAll(); //makes API call to fetch all transactions and populate transactions array with response data
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
  console.log("Dialog is closing");
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
      await transactionService.update(transaction.id, transaction); //If transaction has id, it updated transaction
    } else {
      await transactionService.create(transaction); //if no id, it creates new transaction
    }
    loadTransactions(); //reloads list of transaction
    dialogVisible.value = false;  //closes dialog
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

onMounted(loadTransactions);  //this lifecycle hook calls loadTransactions when the component is first mounted, ensuring that the list of transactions is fetched as soon as the component renders
</script>

<style >
.edit-button{
  padding: 5px;
}

.add-button{
margin-bottom: 15px;
}

.p-dialog-header	{
  background-color: gainsboro !important;
}

.p-dialog-title{
  font-size: 20px !important;
  font-weight: bold !important;
}


</style>