<template>
  <div class="form-wrapper">
    <form @submit.prevent="handleSubmit" class="form-container"> <!-- Prevents default form submission(or form reload) and triggers handleSubmit-->
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
        
        <div v-if="formErrors.amount" class="error">{{ formErrors.amount }}</div>  <!-- For displaying error message  -->
      </div>

      <div class="p-field">
        <label for="type" class="labels">Type</label> <!-- It binds form.type and options prop is linked to type array -->
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
        <Button 
          label="Save" 
          type="submit" 
          icon="pi pi-save" 
          class="p-button-success" 
        />
        <Button 
          label="Cancel" 
          type="button" 
          icon="pi pi-times" 
          class="p-button-danger" 
          @click="$emit('close')" 
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';    //ref:updates UI dynamically wehn value changes
import * as yup from 'yup';
import transactionService from '@/router/transactionService';

import { debounce } from 'lodash'; 

// Wrap the validateField function with debounce
const debouncedValidateField = debounce((field) => validateField(field), 200);


const props = defineProps({ transaction: Object }); //Initialize form with default values
const emit = defineEmits(['save', 'close']);  //Emits custom event to save/close form

const form = ref({ ...props.transaction }); //

const types = [
  { label: 'Income', value: 'INCOME' },
  { label: 'Expense', value: 'EXPENSE' },
];

const categories = ref([]); //Initially empty, later populated by fetchCategories method based on the selected type

//for holding error messages
const formErrors = ref({  
  amount: '',
  type: '',
  category: '',
  description: ''
});

// Yup schema for defining validation rules
const schema = yup.object().shape({
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be positive'),
  type: yup
    .string()
    .required('Type is required'),
  category: yup
    .string()
    .required('Category is required'),
  description: yup
    .string()
    .min(2, 'Description must be at least 2 characters')
    .required('Description is required')
    .matches(/^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/, 'Description can only contain letters, numbers and spaces, and cannot start or end with spaces') //Custom validation
});

const fetchCategories = async () => {
  const response = await transactionService.getCategories(form.value.type);
  categories.value = response.data;
};

//Validate a specific field when blur event is triggered
const validateField = async (field) => {
  try {
    await schema.validateAt(field, form.value); //validates the specific field in the form.value object against the schema rules defined 
    formErrors.value[field] = ''; //If validation passes, the error for the field is cleared
  } catch (err) {
    formErrors.value[field] = err.message; //If validation fails, display the error in the UI
  }
};


//Validate the entire form when the user tries to submit it
const validateForm = async () => {
  try {
    Object.keys(formErrors.value).forEach(key => formErrors.value[key] = ''); //all existing error messages are cleared by setting each key in formErrors.value to an empty string
    await schema.validate(form.value, { abortEarly: false }); //called to called to validate the entire form object // abortEarly:false option ensures that Yup continues validating all fields, even if one field fails
    return true; //If validation passes, the function returns true
  } catch (err) {
    if (err instanceof yup.ValidationError) {  //If validation fails, Yup throws a ValidationError
      err.inner.forEach(validationError => {  //err.inner array contains details about all validation errors
        formErrors.value[validationError.path] = validationError.message;  //each error is mapped to the corresponding form field by updating formErrors.value[validationError.path] with the error message
      });
    }
    return false;
  }
};

//Handle form submission by validating the form and emitting a save event if validation passes
const handleSubmit = async () => {
  const isValid = await validateForm();
  if (isValid) {
    emit('save', form.value);
  }
};

</script>

<style scoped>
.form-wrapper {
  padding: 10px;
}

.labels {
  font-weight: bold;
}

.amount-wrapper{
  display: flex;
  align-items: center;
}

.currency-label{
  margin-right: 3px;
  font-weight: bold;
}

.input-field {
  width: 100%;
  margin-bottom: 10px;
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
</style>
