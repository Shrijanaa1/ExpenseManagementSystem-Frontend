<template>
  <div class="transactionList-container">
    <div :class="['transactionList-content', { 'sidebar-open': sidebarVisible }]">
      <h2>Transaction List</h2>

      <div class="add-transaction-container">
        <Button icon="pi pi-plus" class="add-button" @click="openDialog" />
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
        @filter="onFilterChange"
        responsiveLayout="scroll"
        v-model:filters="filters"
        filterDisplay="row"
      >
        <template #empty> No transactions found. </template>
        <template #loading> Loading transaction data. Please wait. </template>

        <Column field="id" header="ID" :filter="true" :showFilterMenu="false">
          <template #filter="{ filterModel, filterCallback }">
            <InputText v-model="filterModel.value" @input="() => { filterCallback(); onFilterChange(); }" placeholder="Search by ID" />
          </template>
        </Column>

        <Column field="amount" header="Amount"></Column>
        <Column field="type" header="Type"></Column>
        <Column field="category" header="Category"></Column>

        <Column field="description" header="Description" :filter="true">
          <template #filter="{ filterModel, filterCallback }">
              <InputText v-model="filterModel.value" @input="() => { filterCallback(); }" placeholder="Search by Description" />
          </template>
        </Column>

        <Column header="Actions">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" class="edit-button" @click="editTransaction(slotProps.data)" />
            <Button icon="pi pi-trash" @click="confirmDeleteTransaction(slotProps.data.id)" />
          </template>
        </Column>
      </DataTable>

      <!-- Dialog for adding/editing a transaction -->
      <Dialog
        header="Transaction"
        v-model:visible="dialogVisible"
        :closable="true"
      >
        <TransactionForm v-if="selectedTransaction" :transaction="selectedTransaction" @save="saveTransaction" @close="closeDialog" />
      </Dialog>

      <!-- Confirm and Toast components-->
      <Toast />
      <ConfirmDialog />
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted } from 'vue';
import transactionService from '../router/transactionService';
import TransactionForm from './TransactionForm.vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/useToast'


const props = defineProps({
  sidebarVisible: Boolean,
});

const transactions = ref([]);
const selectedTransaction = ref(null);
const dialogVisible = ref(false);
const errorMessage = ref(null);
const totalRecords = ref(0);
const loading = ref(false);
const first = ref(0);
const rows = ref(10);

const filters = ref({
  id: { value: null, matchMode: FilterMatchMode.EQUALS },
  description: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

// Load transactions with filtering
const loadTransactions = async (page = 0, size = 10) => {
  loading.value = true;
  try {
    const response = await transactionService.getAll({
      page,
      size,
      sortBy: 'id',
      id: filters.value.id.value || null,
      description: filters.value.description.value || null,
      filterType: filters.value.description.matchMode || 'contains', // Use the selected filter match mode
  });

    transactions.value = response.data.content;
    totalRecords.value = response.data.totalElements;
  } catch (error) {
    console.error('Error loading transactions:', error);
    errorMessage.value = 'Failed to load transactions. Please try again later.';
  } finally {
    loading.value = false;
  }
};

const onPage = (event) => {
  first.value = event.first;
  rows.value = event.rows;
  const currentPage = first.value / rows.value;
  loadTransactions(currentPage, rows.value);
};

const onFilterChange = () => {
  first.value = 0; // Reset to first page when filter changes
  loadTransactions();
};

// Open dialog for new transaction
const openDialog = () => {
  selectedTransaction.value = { amount: 0, type: 'INCOME', category: 'SALARY', description: '' };
  dialogVisible.value = true;
};

// Close dialog
const closeDialog = () => {
  dialogVisible.value = false;
};

// Edit transaction
const editTransaction = (transaction) => {
  selectedTransaction.value = { ...transaction };
  dialogVisible.value = true;
};

// Save transaction and reload list
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

// // Delete transaction
// const deleteTransaction = async (id) => {
//   try {
//     await transactionService.delete(id);
//     loadTransactions();
//   } catch (error) {
//     console.error('Error deleting transaction:', error);
//     errorMessage.value = 'Failed to delete transaction. Please try again later.';
//   }
// };


const confirm = useConfirm();
const toast = useToast();

// Confirm delete transaction
const confirmDeleteTransaction = (id) => {
  confirm.require({
    message: 'Do you want to delete this transaction?',
    header: 'Confirm Deletion',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger',
    },
    accept: async () => {
      try {
        await transactionService.delete(id);
        loadTransactions();
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Transaction deleted', life: 3000 });
      } catch (error) {
        console.error('Error deleting transaction:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete transaction', life: 3000 });
      }
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'Transaction deletion cancelled', life: 3000 });
    },
  });
};

onMounted(loadTransactions);
</script>

<style>
.transactionList-container {
  display: flex;
}

.transactionList-content {
  padding-right: 1rem;
  flex-grow: 1;
  width: 100%;
  transition: margin-left 0.3s ease;
}

.transactionList-content.sidebar-open {
  margin-left: 250px;
}

.p-button {
  margin-right: 5px;
}

.add-transaction-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
}

</style>
