<template>
  <div class="form-wrapper">
    <form @submit.prevent="handleSubmit" class="form-container">
      <div class="p-field">
        <label for="amount" class="labels">Amount</label>
        <div class="amount-wrapper">
          <span class="currency-label">NPR</span>
          <InputNumber 
            id="amount" 
            v-model="form.amount" 
            class="input-field" 
            @blur="debouncedValidateField('amount')" 
          />
        </div>
        <div v-if="formErrors.amount" class="error">{{ formErrors.amount }}</div>
      </div>

      <div class="p-field">
        <label for="type" class="labels">Type</label>
        <Select 
          id="type" 
          :options="types" 
          optionLabel="label" 
          optionValue="value" 
          v-model="form.type" 
          @change="fetchCategories"
          @blur="validateField('type')" 
          class="input-field" 
        />
        <div v-if="formErrors.type" class="error">{{ formErrors.type }}</div>
      </div>

      <div class="p-field">
        <label for="category" class="labels">Category</label>
        <Select 
          id="category" 
          :options="categories" 
          v-model="form.category" 
          @blur="validateField('category')"
          class="input-field" 
        />
        <div v-if="formErrors.category" class="error">{{ formErrors.category }}</div>
      </div>

      <div class="p-field">
        <label for="description" class="labels">Description</label>
        <InputText 
          id="description" 
          v-model="form.description" 
          @blur="validateField('description')"
          class="input-field" 
        />
        <div v-if="formErrors.description" class="error">{{ formErrors.description }}</div>
      </div>

      <div class="button-row">
        <Button label="Save" type="submit" icon="pi pi-save" class="save-button" />
        <Button label="Cancel" type="button" icon="pi pi-times" class="cancel-button" @click="$emit('close')" />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { validateRequired, validateNumber, validateMinLength } from '@/utils/validationUtils';
import transactionService from '@/router/services';

import { debounce } from 'lodash'; 

// Wrap the validateField function with debounce
const debouncedValidateField = debounce((field) => validateField(field), 200);

const props = defineProps({ transaction: Object });
const emit = defineEmits(['save', 'close']);
const form = ref({ ...props.transaction });

const types = [
  { label: 'Income', value: 'INCOME' },
  { label: 'Expense', value: 'EXPENSE' },
];

const categories = ref([]);
const formErrors = ref({  
  amount: '',
  type: '',
  category: '',
  description: ''
});

const fetchCategories = async () => {
  const response = await transactionService.getCategories(form.value.type);
  categories.value = response.data;
};

// Custom validation logic for each field
const validateField = (field) => {
  switch (field) {
    case 'amount':
      formErrors.value.amount = validateRequired(form.value.amount, 'Amount') || validateNumber(form.value.amount, 'Amount');
      break;
    case 'type':
      formErrors.value.type = validateRequired(form.value.type, 'Type');
      break;
    case 'category':
      formErrors.value.category = validateRequired(form.value.category, 'Category');
      break;
    case 'description':
      formErrors.value.description = validateRequired(form.value.description, 'Description') || validateMinLength(form.value.description, 2, 'Description');
      break;
    default:
      break;
  }
};

// Validate entire form before submission
const validateForm = () => {
  validateField('amount');
  validateField('type');
  validateField('category');
  validateField('description');
  return Object.values(formErrors.value).every((error) => error === ''); // Check if there are no errors
};

const handleSubmit = () => {
  if (validateForm()) {
    emit('save', form.value);
  }
};

</script>

<style scoped>
.form-wrapper {
  background-color: #ffffff;
  padding: 40px;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
}

.labels {
  font-weight: bold;
  display: inline-block;
  margin-bottom: 5px;
  color: #4a4a4a;
}

.amount-wrapper{
  display: flex;
  align-items: center;
}

.currency-label{
  margin-right: 3px;
  font-weight: bold;
  color: #4a4a4a;
}

.input-field {
  background-color: #f1f1f1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 15px;
  transition: all 0.3s;
}

.input-field:focus {
  border-color: #007ad9;
  background-color: #e8f0fe;
}

.button-row {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 30px;
}

.save-button,
.cancel-button {
  padding: 12px 25px;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  transition: background-color 0.3s, transform 0.2s;
}

.save-button {
  background-color: #007ad9;
  color: white;
}

.cancel-button {
  background-color: #ff4d4f;
  color: white;
}

.save-button:hover {
  background-color: #005ea7;
  transform: translateY(-2px);
}

.cancel-button:hover {
  background-color: #d43f3a;
  transform: translateY(-2px);
}

.error {
  color: red;
  font-size: 0.9rem;
}
</style>
