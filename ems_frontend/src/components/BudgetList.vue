<template>
  <div class="budgetList-container">
    <div :class="['budgetList-content', { 'sidebar-open': sidebarVisible }]">
      <h2>Budget List</h2>

      <div class="add-budget-container">
        <Button icon="pi pi-plus" class="add-button" @click="openDialog" />
        <Button icon="pi pi-refresh" class="reload-button" @click="reloadBudgets" />
        <Button icon="pi pi-file-pdf" @click="previewPDF" />
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
        class="datatable"
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
            <Button icon="pi pi-pencil" @click="editBudget(slotProps.data)" />
            <Button icon="pi pi-trash" @click="confirmDeleteBudget(slotProps.data.id)" />
            <Button icon="pi pi-eye" @click="viewBudget(slotProps.data)" />
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

      <!-- Dialog for viewing budget details -->
      <Dialog
        header="Budget Details"
        v-model:visible="viewDialogVisible"
        :closable="true"
      >
        <div v-if="selectedBudget">
          <p><strong>ID:</strong> {{ selectedBudget.id }}</p>
          <p><strong>Category:</strong> {{ selectedBudget.category }}</p>
          <p><strong>Budget Limit:</strong> {{ selectedBudget.budgetLimit }}</p>
          <p><strong>Remaining Amount:</strong> {{ selectedBudget.remainingAmount }}</p>
          <p><strong>Start Date:</strong> {{ selectedBudget.startDate }}</p>
          <p><strong>End Date:</strong> {{ selectedBudget.endDate }}</p>
          <p><strong>Remarks:</strong> {{ selectedBudget.remarks }}</p>

          <!-- Print Button -->
          <Button label="Print" icon="pi pi-print" @click="printBudgetDetails" />
        </div>
      </Dialog>

      <!-- Dialog for selecting paper size-->
      <Dialog v-model:visible="paperSizeDialogVisible" header="Select Paper Size" :closable="true" style="width: 30vw;">
        <div>
          <p>Select the paper size for the PDF:</p>
          <Select v-model="selectedPaperSize" :options="paperSizes" optionLabel="label" optionValue="value" placeholder="Select Paper Size" />
        </div>
        <div class="p-dialog-footer" style="margin-top: 1rem;">
          <Button label="Generate PDF" icon="pi pi-check" @click="generatePDF" />
        </div>
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
import html2pdf from 'html2pdf.js';

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
      //Find the budget in the list and update it
      const index = budgets.value.findIndex(b => b.id === budget.id);
      if(index != -1){
        budgets.value[index] = {...budget}; //Update only the modified row
      }
    } else {
      const newBudget = await budgetService.createBudget(budget);
      budgets.value.push(newBudget.data); //Add the newly created budget to the list
    }
    // loadBudgets();
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

const paperSizeDialogVisible = ref(false); //Controls visibility of the paper size dialog
const selectedPaperSize = ref(null); //Holds the selected paper size
  //Dropdown for paper sizes
const paperSizes = ref([ 
    { label: 'A3', value: 'a3' },
    { label: 'A4', value: 'a4' },
    { label: 'A5', value: 'a5' },
    { label: 'Letter', value: 'letter' },
    { label: '58x200 mm', value: [58, 200] }
]);

  const previewPDF = () => {
    paperSizeDialogVisible.value = true; //show paper size selection dialog
  };

  const generatePDF = () => {
    
    const element = document.querySelector('.datatable'); //selects datatable element

    // Temporarily hide columns and pagination (by adding a class to hide them)
    const actionColumn = document.querySelectorAll('th:last-child, td:last-child');
    const paginator = document.querySelector('.p-paginator');

    //Hide elements
    // actionButtons.forEach(btn => btn.style.display = 'none');
    actionColumn.forEach(col => col.style.display = 'none');
    if(paginator) paginator.style.display = 'none';

    const opt = {
      margin: [10, 10],
      filename: 'budget-list.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: selectedPaperSize.value || 'a4', orientation: 'portrait' }
    }; 

    // Create a PDF and convert it to Blob
    html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {

      pdf.autoPrint();  // Automatically trigger the print dialog
      window.open(pdf.output('bloburl'), '_blank'); // Open the PDF in a new tab with print dialog
      
      actionColumn.forEach(col => col.style.display = '');
      if(paginator) paginator.style.display = '';
    });
  };


// const previewPDF = () => {
//   const element = document.querySelector('.datatable'); //selects datatable element

//   // Temporarily hide action buttons and pagination (by adding a class to hide them)
//   // const actionButtons = document.querySelectorAll('.pi-pencil, .pi-trash, .pi-eye');
//   const actionColumn = document.querySelectorAll('th:last-child, td:last-child');
//   const paginator = document.querySelector('.p-paginator');

//   //Hide elements
//   // actionButtons.forEach(btn => btn.style.display = 'none');
//   actionColumn.forEach(col => col.style.display = 'none');
//   if(paginator) paginator.style.display = 'none';

//   const opt = {
//     margin: [10, 10],
//     filename: 'budget-list.pdf',
//     image: { type: 'jpeg', quality: 0.98 },
//     html2canvas: { scale: 2 },
//     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
//   }; 

//   // Create a PDF and convert it to Blob
//   html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
//     // Generates a downloadable or viewable link for the Blob
//     // const url = URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf'} ));
    
//     // Open the URL in a new tab for preview
//     // const newWindow = window.open(url, '_blank');

//     // if(!newWindow){  
//     //   alert("Please allow popups for this site to view the PDF.");
//     // } 

//     pdf.autoPrint();  // Automatically trigger the print dialog
//     window.open(pdf.output('bloburl'), '_blank'); // Open the PDF in a new tab with print dialog

//     //Restore elements visibility after generating pdf
//     // actionButtons.forEach(btn => btn.style.display = '');
//     actionColumn.forEach(col => col.style.display = '');
//     if(paginator) paginator.style.display = '';
//   });
// };

const viewDialogVisible = ref(false);

//view budget details
const viewBudget = (budget) => {
  selectedBudget.value = { ...budget };  // Create a copy of the Budget object for viewing
  viewDialogVisible.value = true; //open the view dialog
}

//Print budget details
const printBudgetDetails = (budget) => {
  // Custom HTML content for the print preview with budget details
  const content = `
    <div>
      <h1>Budget Details for ID: ${budget.id}</h1>
      <p><strong>Category:</strong> ${budget.category}</p>
      <p><strong>Budget Limit:</strong> ${budget.budgetLimit}</p>
      <p><strong>Remaining Amount:</strong> ${budget.remainingAmount}</p>
      <p><strong>Start Date:</strong> ${budget.startDate}</p>
      <p><strong>End Date:</strong> ${budget.endDate}</p>
      <p><strong>Remarks:</strong> ${budget.remarks}</p>
    </div>
  `;

  // Create an element to hold the custom content temporarily
  const element = document.createElement('div');
  element.innerHTML = content;
  document.body.appendChild(element); // Append it to the body to use it for PDF generation

  const opt = {
    margin: [10, 10], //10mm margin on all sides
    filename: `budget-details-${budget.id}.pdf`,
    // jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Create a PDF and convert it to Blob
  html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
    
    pdf.autoPrint();  // Automatically trigger the print dialog
    window.open(pdf.output('bloburl'), '_blank'); // Open the PDF in a new tab with print dialog
 
  });

  // Remove the temporary element after generating the PDF
  document.body.removeChild(element);
};


onMounted(loadBudgets); //perform actions when the component is mounted (e.g., fetch data)

</script>

<style scoped>
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


