<template>
    <div class="form-wrapper">
      <form @submit.prevent="handleSubmit" class="form-container">
        <div class="p-field">
          <label for="amount" class="labels">Amount</label>
          <InputNumber 
            id="amount" 
            v-model="form.amount" 
            mode="currency" 
            currency="NPR" 
            class="input-field" 
          />
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
            class="input-field" 
          />
          <div v-if="formErrors.category" class="error">{{ formErrors.category }}</div>
        </div>
  
        <div class="p-field">
          <label for="description" class="labels">Description</label>
          <InputText 
            id="description" 
            v-model="form.description" 
            class="input-field" 
          />
          <div v-if="formErrors.description" class="error">{{ formErrors.description }}</div>
        </div>
  
        <div class="button-row">
          <Button 
            label="Save" 
            type="submit" 
            icon="pi pi-save" 
            class="save-button" 
          />
          <Button 
            label="Cancel" 
            type="button" 
            icon="pi pi-times" 
            class="cancel-button" 
            @click="$emit('close')" 
          />
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  import * as yup from 'yup';
  import transactionService from '@/router/transactionService';
  
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
  
  // Yup schema for validation
  const schema = yup.object().shape({
    amount: yup.number().required('Amount is required').positive('Amount must be positive'),
    type: yup.string().required('Type is required'),
    category: yup.string().required('Category is required'),
    description: yup.string().min(2, 'Description must be at least 2 characters').required('Description is required')
  });
  
  const fetchCategories = async () => {
    const response = await transactionService.getCategories(form.value.type);
    categories.value = response.data;
  };
  
  watch(() => props.transaction, (newValue) => {
    form.value = { ...newValue };
    fetchCategories();
  }, { immediate: true });
  
  const validateField = async (field) => {
    try {
      await schema.validateAt(field, form.value);
      formErrors.value[field] = '';
    } catch (err) {
      formErrors.value[field] = err.message;
    }
  };
  
  watch(() => form.value.amount, () => validateField('amount'));
  watch(() => form.value.type, () => validateField('type'));
  watch(() => form.value.category, () => validateField('category'));
  watch(() => form.value.description, () => validateField('description'));
  
  const validateForm = async () => {
    try {
      Object.keys(formErrors.value).forEach(key => formErrors.value[key] = '');
      await schema.validate(form.value, { abortEarly: false });
      return true;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        err.inner.forEach(validationError => {
          formErrors.value[validationError.path] = validationError.message;
        });
      }
      return false;
    }
  };
  
  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (isValid) {
      emit('save', form.value);
    }
  };
  </script>
  
  <style scoped>
  .form-wrapper {
    background-color: #ffffff;
    padding: 40px;
    box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    max-width: 600px;
    margin: auto;
  }
  
  .labels {
    font-weight: bold;
    display: inline-block;
    margin-bottom: 5px;
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
  