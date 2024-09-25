<template>
    <div class="budgetForm-container">
        <div :class="['budgetForm-content', { 'sidebar-open': sidebarVisible }]">

    <div class="form-wrapper">
        <form @submit.prevent="handleSubmit" class="form-container">
            <div class="p-field">
                <label for="category" class="block font-bold mb-3">Category</label>
                <Select 
                    id="category" 
                    v-model="budget.category" 
                    :options="categories"
                    placeholder="Select Category" 
                    fluid
                    @blur="validateField('category')"
                />
                <div v-if="formErrors.category" class="error">{{ formErrors.category }}</div>
            </div>

            <div class="p-field">
                <label for="budgetLimit" class="block font-bold mb-3">Budget Limit</label>
                <InputNumber 
                    id="budgetLimit" 
                    v-model="budget.budgetLimit" 
                    mode="currency" 
                    currency="NPR" 
                    locale="ne-NP" 
                    fluid
                    @blur="debouncedValidateField('budgetLimit')"  
                />
                <div v-if="formErrors.budgetLimit" class="error">{{ formErrors.budgetLimit }}</div>
            </div>

            <div class="p-field">
                <label for="startDate">Start Date</label>
                <DatePicker 
                    v-model="budget.startDate" 
                    showIcon 
                    fluid
                    @blur="validateField('startDate')"
                />
                <div v-if="formErrors.startDate" class="error">{{ formErrors.startDate }}</div>
            </div>

            <div class="p-field">
                <label for="endDate">End Date</label>
                <DatePicker 
                    v-model="budget.endDate" 
                    showIcon 
                    fluid
                    @blur="validateField('endDate')"
                />
                <div v-if="formErrors.endDate" class="error">{{ formErrors.endDate }}</div>
            </div>

            <div class="button-row">
                <Button label="Save" type="submit" icon="pi pi-save" class="p-button-success" />
                <Button label="Cancel" type="button" icon="pi pi-times" class="p-button-danger" @click="$emit('close')" />
            </div>

        </form>
    </div>
    </div>
</div>

</template>


<script setup>
import { ref, onMounted } from 'vue';
import { validateRequired, validateNumber } from '@/utils/validationUtils';
import budgetService from '@/router/services';
import { debounce } from 'lodash'; 
import DatePicker from 'primevue/datepicker';

import { defineProps } from 'vue';

//Receive the sidebarVisible prop from the parent component(App.vue)
const props = defineProps({
    budget: Object,
    sidebarVisible: Boolean, // Add sidebarVisible prop
});

const emit = defineEmits(['save', 'close']);
const form = ref(props.budget);


// Wrap the validateField function with debounce
const debouncedValidateField = debounce((field) => validateField(field), 200);


// Categories and filtering only `EXPENSE` types
const categories = ref([]);

// Fetch categories from the API on mount
const fetchCategories = async () => {
  try {
    const type = 'EXPENSE'; // Set the appropriate type (income or expense) dynamically
    const response = await budgetService.getBudgetCategories(type);
    categories.value = response.data; // Assuming response.data returns an array of categories
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const formErrors = ref({  
  category: '',
  budgetLimit: '',
  startDate: '',
  endDate: ''
});

// Custom validation logic for each field
const validateField = (field) => {
  switch (field) {
    case 'category':
      formErrors.value.category = validateRequired(form.value.category, 'Category');
      break;
    case 'budgetLimit':
      formErrors.value.budgetLimit = validateRequired(form.value.budgetLimit, 'budgetLimit') || validateNumber(form.value.budgetLimit, 'BudgetLimit');
      break;
    case 'startDate':
      formErrors.value.startDate = validateRequired(form.value.startDate, 'StartDate');
      break;
    case 'endDate':
      formErrors.value.endDate = validateRequired(form.value.endDate, 'endDate');
      break;
    default:
      break;
  }
};

// Validate entire form before submission
const validateForm = () => {
  validateField('category');
  validateField('budgetLimit');
  validateField('startDate');
  validateField('endDate');
  return Object.values(formErrors.value).every((error) => error === ''); // Check if there are no errors
};

const handleSubmit = () => {
  if (validateForm()) {
    emit('save', form.value);
  }
};

onMounted(() => {
  fetchCategories(); // Fetch categories when component is mounted
});

</script>

<style scoped>
.form-wrapper {
  padding: 10px;
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.error {
  color: red;
}

.budgetForm-container {
  display: flex;
}

.budgetForm-content {
  padding-right: 1rem;
  flex-grow: 1;
  width: 100%;
  transition: margin-left 0.3s ease;
}

.budgetForm-content.sidebar-open {
  margin-left: 250px;
}

</style>
