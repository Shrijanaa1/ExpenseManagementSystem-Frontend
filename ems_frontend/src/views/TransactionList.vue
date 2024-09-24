<template>
  <div class="transactionList-container">
    <div :class="['transactionList-content', { 'sidebar-open': sidebarVisible }]">

    <h2>Transaction List</h2>

    <div class="add-transaction-container">
        <Button icon="pi pi-plus" class="add-button" @click="openDialog"/>
    </div>

    <DataTable 
      :value="transactions" 
      :lazy="true"
      :totalRecords="totalRecords"
      :loading="loading"
      :rows="rows"
      :first="first"
      :paginator="true"
      :rowsPerPageOptions="[5,10,20,50]"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      @page="onPage"
      responsiveLayout="scroll"
      v-model:filters="filters"
      filterDisplay="row"
    >

    <template #empty> No transactions found. </template>
    <template #loading> Loading transaction data. Please wait. </template>

    <Column field="id" header="ID" :filter="true" :showFilterMenu="false">
      <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" @input="() => { filterCallback(); onFilterChange(); }" placeholder="Search by ID"/>
      </template>
    </Column>


      <Column field="amount" header="Amount"></Column>
      <Column field="type" header="Type"></Column>
      <Column field="category" header="Category"></Column>

      <Column field="description" header="Description" :filter="true" :showFilterMenu="false">
        <template #filter="{ filterModel, filterCallback }"> <!-- filterModel holds current state of filter(value being typed) and filterCallback triggers filtering when the filter value changes-->
          <InputText v-model="filterModel.value" @input=" () => { filterCallback(); onFilterChange(); }" placeholder="Search by Description"/>
          <Select v-model="filterModel.customFilterType" :options="filterOptions"  optionLabel="label" placeholder="Select Filter Type" class="p-mr-2" @change="onFilterChange"/>
          </template>
      </Column>


      <Column header="Actions">
        <template #body="slotProps">  <!-- #body directive allows to pass specific row's data to the button -->
          <Button  icon="pi pi-pencil" class="edit-button" @click="editTransaction(slotProps.data)"/>
          <Button  icon="pi pi-trash"  @click="deleteTransaction(slotProps.data.id)"/>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog for adding/editing a transaction -->
    <Dialog
      header="Transaction"
      v-model:visible="dialogVisible"
      :closable="true"
    >

      <TransactionForm v-if="selectedTransaction" :transaction="selectedTransaction" @save="saveTransaction" @close="closeDialog"/>
    </Dialog>

  </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { ref, onMounted} from 'vue'; //ref: reactive references // onMounted: lifecycle hook that runs when component is mounted
import transactionService from '../router/transactionService';  //handles API requests to manage transaction
import TransactionForm from './TransactionForm.vue';
import { FilterMatchMode } from '@primevue/core/api';
import Select from 'primevue/select';

//Receive the sidebarVisible prop from the parent component(App.vue)
const props = defineProps({
    sidebarVisible: Boolean,
});

const transactions = ref([]);   //Holds list of transactions, initially an empty array
const selectedTransaction = ref(null);  //Stores transaction being edited/added. If null means no transaction selected
const dialogVisible = ref(false); //controls visibility of dialog
const errorMessage = ref(null);  // New state for errors


const totalRecords = ref(0); //Track total number of records
const loading = ref(false); //To track loading state
const first = ref(0);
const rows = ref(10);


const filters = ref({
  id: { value: null, matchMode: FilterMatchMode.EQUALS },  // value:null means no filter applied yet// matchMode means filter should match exact value
  description: { value: null, customFilterType: 'contains' }  // Custom filter for Description field
});

const filterOptions = [
  { label: 'Contains', value: 'contains' },
  { label: 'Starts With', value: 'startsWith' },
  { label: 'Ends With', value: 'endsWith' },
  { label: 'Equals', value: 'equals' },
];

//Load transactions lazily with pagination
const loadTransactions = async (page = 0, size = 10) => {
  loading.value = true;
  try {
    const response = await transactionService.getAll({
      page,
      size,
      sortBy: 'id',
      id: filters.value.id.value || null, //Passes the filter value for the id field or null if no value is set
      description: filters.value.description.value || null, //Passes the filter value for the description field or null
      filterType: filters.value.description.customFilterType || 'contains', // Pass custom filter type value for description or defaults to 'contains'
    });
    transactions.value = response.data.content; //once response is received , list of transaction(response.data.content) assigned to transaction reactive variable
    totalRecords.value = response.data.totalElements; //total number of records (used for pagination) is assigned to the totalRecords
  } catch (error) {
    console.error('Error loading transactions:', error);
    errorMessage.value = 'Failed to load transactions. Please try again later.';
  } finally {
    loading.value = false; //indicates loading has finished
  }
};


const onPage = (event) => {
  first.value = event.first;
  rows.value = event.rows;
  const currentPage = first.value / rows.value; 
  loadTransactions(currentPage, rows.value);
};


//Reset pagination when filters are applied
const onFilterChange = () => {
  first.value = 0; //Reset to first page when filter changes
  loadTransactions();
}


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
  selectedTransaction.value = { ...transaction }; //Assign the transaction to the selectedTransaction
  dialogVisible.value = true; //Open the dialog
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

.-container {
  display: flex;
}

.transactionList-content {
  padding-right: 1rem;
  flex-grow: 1; /* Allow the content to grow and fill the remaining space */
  width: 100%;
  transition: margin-left 0.3s ease;
}

.transactionList-content.sidebar-open {
  margin-left: 250px; /* Adjust this to the sidebar width */
}

.p-button{
  margin-right: 5px;
}

/* CSS for Add Transaction button on the right side */
.add-transaction-container {
  display: flex;
  justify-content: flex-end; /* Move the button to the right */
  margin-bottom: 15px; /* Space from the table */
}

</style>