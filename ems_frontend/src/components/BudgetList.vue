<template>
    <div class="budgetList-container">
      <div :class="['budgetList-content', { 'sidebar-open': sidebarVisible }]">
        <h2>Budget List</h2>
  
        <div class="add-budget-container">
          <Button icon="pi pi-plus" class="add-button" @click="openDialog" />
        </div>
  
        <div class="reload-budget-container">
          <Button icon="pi pi-refresh" class="reload-button" @click="reloadBudgets" label="Reload Budgets" />
        </div>

        <DataTable
          :value="budgets"
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
        >
          <template #empty> No budgets found. </template>
          <template #loading> Loading budget data. Please wait. </template>
  
          <Column field="id" header="ID" />
          <Column field="category" header="Category" />
          <Column field="budgetLimit" header="Budget Limit" />
          <Column field="remainingAmount" header="Remaining Amount" />
          <Column field="startDate" header="Start Date" /> 
          <Column field="endDate" header="End Date" />
          <Column field="remarks" header="Remarks" />
  
          <Column header="Actions">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" class="edit-button" @click="editBudget(slotProps.data)" />
              <Button icon="pi pi-trash" @click="confirmDeleteBudget(slotProps.data.id)" />
            </template>
          </Column>
        </DataTable>
  
        <!-- Dialog for adding/editing a Budget -->
        <Dialog
          header="Budget"
          v-model:visible="dialogVisible"
          :closable="true"
        >
          <BudgetForm v-if="selectedBudget" :budget="selectedBudget" @save="saveBudget" @close="closeDialog" />
        </Dialog>
  
        <!-- Confirm and Toast components-->
        <Toast />
        <ConfirmDialog />
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, ref, onMounted } from 'vue';
  import budgetService from '../router/services';
  import { useConfirm } from 'primevue/useconfirm';
  import { useToast } from 'primevue/useToast'
  import BudgetForm from './BudgetForm.vue';
  
  
  const props = defineProps({
    sidebarVisible: Boolean,
  });
  
  const budgets = ref([]); //holds list of Budgets that will be displayed in UI
  const selectedBudget = ref(null); //used for editing or viewing details
  const dialogVisible = ref(false); //Controls visibility of dialog
  const errorMessage = ref(null); //Stores error message
  const totalRecords = ref(0); //Stores total number of Budgets available in backend(for pagination)
  const loading = ref(false); //shows loading spinner
  const first = ref(0); //index of first record, initially 0, meaning first page
  const rows = ref(10); //No of rows displayed per page, initially set to 10
  
  // Load Budgets with filtering
  const loadBudgets = async (page = 0, size = 10) => {
    loading.value = true;
    try {
      const response = await budgetService.getAllBudgets({
        page,
        size,
        sortBy: 'id'
    });
  
      budgets.value = response.data.content; // Stores the fetched Budgets in the Budgets array to be displayed
      totalRecords.value = response.data.totalElements; // Set total record count for pagination
    } catch (error) {
      console.error('Error loading budgets:', error);
      errorMessage.value = 'Failed to load budgets. Please try again later.';
    } finally {
      loading.value = false;
    }
  };
  
  const onPage = (event) => {
    first.value = event.first;
    rows.value = event.rows;
    const currentPage = first.value / rows.value;
    loadBudgets(currentPage, rows.value);
  };
  
  // Open dialog for new Budget
  const openDialog = () => {
    selectedBudget.value = { category: '', budgetLimit: 0, startDate: '', endDate: '' };
    dialogVisible.value = true;
  };
  
  // Close dialog
  const closeDialog = () => {
    dialogVisible.value = false;
  };
  
  // Edit Budget
  const editBudget = (budget) => {
    selectedBudget.value = { ...budget };  //(...) spread operator, create a copy of the Budget object so that editing the Budget does not affect the original data until explicitly saved
    dialogVisible.value = true; // Open the dialog after setting the selected budget
};
  
  // Save Budget and reload list
  const saveBudget = async (budget) => {
    try {
      if (budget.id) {
        await budgetService.updateBudget(budget.id, budget);
      } else {
        await budgetService.createBudget(budget);
      }
      loadBudgets();
      dialogVisible.value = false;
    } catch (error) {
      console.error('Error saving budget:', error);
      errorMessage.value = 'Failed to save budget. Please try again later.';
    }
  };
  
  
  const confirm = useConfirm();
  const toast = useToast();
  
  // Confirm delete Budget
  const confirmDeleteBudget = (id) => {
    confirm.require({  //triggers a confirmation dialog
      message: 'Do you want to delete this budget?',
      header: 'Confirm Delete',
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
      accept: async () => {   //asynchronous because it involves server request
        try { 
          await budgetService.deleteBudget(id); 
          loadBudgets();   //reloads Budget list to reflect changes
          toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Budget deleted', life: 3000 }); //message disappers after 3 seconds
        } catch (error) {
          console.error('Error deleting budget:', error);
          toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete Budget', life: 3000 });
        }
      },
      reject: () => {
        toast.add({ severity: 'error', summary: 'Rejected', detail: 'Budget deletion cancelled', life: 3000 });
      },
    });
  };
  
  const reloadBudgets = async () => {
    try {
      loading.value = true;
      await budgetService.updateAllBudgetsRemainingAmounts(); // Call the backend API to update remaining amounts
      loadBudgets(); // Reload the budget list
      toast.add({ severity: 'success', summary: 'Reloaded', detail: 'Budgets reloaded successfully', life: 3000 });
    } catch (error) {
      console.error('Error reloading budgets:', error);
      toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to reload budgets', life: 3000 });
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadBudgets); //perform actions when the component is mounted (e.g., fetch data)
  
  </script>
  
  <style>
  .budgetList-container {
    display: flex;
  }
  
  .budgetList-content {
    padding-right: 1rem;
    flex-grow: 1;
    width: 100%;
    transition: margin-left 0.3s ease;
  }
  
  .budgetList-content.sidebar-open {
    margin-left: 250px;
  }
  
  .p-button {
    margin-right: 5px;
  }
  
  .add-budget-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;
  }
  
  </style>
  