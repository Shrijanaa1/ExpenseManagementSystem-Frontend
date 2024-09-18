<template>
  <div class="form-wrapper">
    <form @submit.prevent="handleSubmit" class="form-container"> <!-- Prevents default form submission(or form reload) and triggers handleSubmit-->
      <div class="p-field">
        <label for="amount" class="labels">Amount</label>
        <InputNumber 
          id="amount" 
          v-model="form.amount" 
          mode="currency" 
          currency="NPR" 
          class="input-field" 
        />
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
    // .trim('Description cannot include leading or trailing spaces') //Trim spaces
    .required('Description is required')
    .matches(/^[a-zA-Z0-9 ]*$/, 'Description can only contain letters, numbers and spaces') //Custom validation
    .test(
      'no-leading-trailing-spaces',
      'Description cannot include leading or trailing spaces',
      (value) => value === value.trim()
    )
});

const fetchCategories = async () => {
  const response = await transactionService.getCategories(form.value.type);
  categories.value = response.data;
};

//Watch for changes in the transaction prop and update the form accordingly
watch(() => props.transaction, (newValue) => {
  form.value = { ...newValue };   //New value copied to form.value
  fetchCategories();
}, { immediate: true }); //so that watcher runs immediately when the component is mounted


//Validate a specific field in the form when it changes
const validateField = async (field) => {
  try {
    await schema.validateAt(field, form.value); //validates the specific field in the form.value object against the schema rules defined 
    formErrors.value[field] = ''; //If validation passes, the error for the field is cleared
  } catch (err) {
    formErrors.value[field] = err.message; //If validation fails, display the error in the UI
  }
};

//blur event bata garne
//dpn't use watcher// separate Currency and number (stirng and number mismatched)


//Trigger validation for individual fields when their values change
watch(() => form.value.amount, () => validateField('amount'));
watch(() => form.value.type, () => validateField('type'));
watch(() => form.value.category, () => validateField('category'));
watch(() => form.value.description, () => validateField('description'));

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
