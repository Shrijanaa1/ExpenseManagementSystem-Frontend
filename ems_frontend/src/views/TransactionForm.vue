<template>
  <div class="form-wrapper">
    <!-- Vee-Validate Form component -->
    <Form @submit="submitForm" v-slot="{ errors }" class="form-container">
      
      <!-- Amount Field -->
      <div class="p-field">
        <label for="amount" class="labels">Amount</label>
        <Field name="amount" rules="required|min_value:0.01" v-slot="{ field, errorMessage }">
          <!-- Using InputNumber in standard mode, without currency formatting -->
          <InputNumber 
            id="amount" 
            v-bind="field" 
            v-model.number="form.amount"  
            :min="0.01" 
            class="input-field" 
            @input="updateAmount"
          />
          <ErrorMessage name="amount" class="error" />
        </Field>
      </div>


      <!-- Type Field -->
      <div class="p-field">
        <label for="type" class="labels">Type</label>
        <Field name="type" rules="required" v-slot="{ field, errorMessage }">
          <Select id="type" v-bind="field" :options="types" optionLabel="label" optionValue="value" v-model="form.type" @change="fetchCategories" class="input-field" />
          <ErrorMessage name="type" class="error" />
        </Field>
      </div>

      <!-- Category Field -->
      <div class="p-field">
        <label for="category" class="labels">Category</label>
        <Field name="category" rules="required" v-slot="{ field, errorMessage }">
          <Select id="category" v-bind="field" :options="categories" v-model="form.category" class="input-field" />
          <ErrorMessage name="category" class="error" />
        </Field>
      </div>

      <!-- Description Field -->
      <div class="p-field">
        <label for="description" class="labels">Description</label>
        <Field name="description" rules="required|min:3|no_special_chars" v-slot="{ field, errorMessage }">
          <InputText id="description" v-bind="field" v-model="form.description" class="input-field" />
          <ErrorMessage name="description" class="error" />
        </Field>
      </div>

      <!-- Buttons -->
      <div class="button-row">
        <Button label="Save" type="submit" icon="pi pi-save" class="save-button" />
        <Button label="Cancel" type="button" icon="pi pi-times" class="cancel-button" @click="$emit('close')" />
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { required, min, min_value } from '@vee-validate/rules';
import { defineRule, configure } from 'vee-validate';
import transactionService from '@/router/transactionService';

// Registering validation rules
defineRule('required', required);
defineRule('min', min);
defineRule('min_value', min_value);

//Custom rule for perventing spaces and special characters
defineRule('no_special_chars', value => {
  if(!/^[a-zA-Z0-9\s]*$/.test(value)) {
    return 'Only letters, numbers and spaces are allowed';
  }
  if(value.startsWith(' ') || value.endsWith(' ')){
    return 'No leading or trailing spaces allowed';
  }
  return true; //Valid
})

// Form state
const props = defineProps({ transaction: Object });
const emit = defineEmits(['save', 'close']);
const form = ref({ ...props.transaction });

const types = [
  { label: 'Income', value: 'INCOME' },
  { label: 'Expense', value: 'EXPENSE' },
];

const categories = ref([]);

const fetchCategories = async () => {
  const response = await transactionService.getCategories(form.value.type);
  categories.value = response.data;
};

// const submitForm = (values) => {
//   emit('save', form.value);
// };

const submitForm = () => {
  // Parse amount value to float to ensure it's valid
  form.value.amount = parseFloat(form.value.amount);
  emit('save', form.value);
};

//Watcher to updaate form state
watch(() => props.transaction, (newValue) => {
  form.value = { ...newValue };
  fetchCategories();
}, { immediate: true });

// Update amount to ensure a numeric value is always passed
const updateAmount = (e) => {
  form.value.amount = parseFloat(e.value);
};

//Validate configuratio
configure({
  validateOnInput: true,
});

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

.save-button, .cancel-button {
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
  font-size: 0.875rem;
  margin-top: 5px;
}
</style>
