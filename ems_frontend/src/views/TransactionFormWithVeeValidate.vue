<template>
  <div class="form-wrapper">
    <Form @submit="submitForm" class="form-container">
      <div class="p-field">
        <label for="amount" class="labels">Amount</label>
        <Field name="amount" v-slot="{ field, meta }">
          <InputNumber
            v-bind="field"
            id="amount"
            v-model="form.amount"
            mode="currency"
            currency="NPR"
            class="input-field"
          />
          <small v-if="meta.touched && meta.error" class="error-message">{{ meta.error }}</small>
        </Field>
      </div>

      <div class="p-field">
        <label for="type" class="labels">Type</label>
        <Field name="type" v-slot="{ field, meta }">
          <Select
            v-bind="field"
            id="type"
            :options="types"
            optionLabel="label"
            optionValue="value"
            v-model="form.type"
            @change="fetchCategories"
            class="input-field"
          />
          <small v-if="meta.touched && meta.error" class="error-message">{{ meta.error }}</small>
        </Field>
      </div>

      <div class="p-field">
        <label for="category" class="labels">Category</label>
        <Field name="category" v-slot="{ field, meta }">
          <Select
            v-bind="field"
            id="category"
            :options="categories"
            v-model="form.category"
            class="input-field"
          />
          <small v-if="meta.touched && meta.error" class="error-message">{{ meta.error }}</small>
        </Field>
      </div>

      <div class="p-field">
        <label for="description" class="labels">Description</label>
        <Field name="description" v-slot="{ field, meta }">
          <InputText
            v-bind="field"
            id="description"
            v-model="form.description"
            class="input-field"
          />
          <small v-if="meta.touched && meta.error" class="error-message">{{ meta.error }}</small>
        </Field>
      </div>

      <div class="button-row">
        <Button label="Save" type="submit" icon="pi pi-save" class="save-button" />
        <Button label="Cancel" type="button" icon="pi pi-times" class="cancel-button" @click="$emit('close')" />
      </div>
    </Form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Form, Field, defineRule, configure } from 'vee-validate';
import * as yup from 'yup';
import transactionService from '@/router/transactionService';

const props = defineProps({
  transaction: Object,
});

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

watch(
  () => props.transaction,
  (newValue) => {
    form.value = { ...newValue };
    fetchCategories();
  },
  { immediate: true }
);

const submitForm = (values) => {
  emit('save', form.value);
};

// Validation schema using Yup
const schema = yup.object({
  amount: yup.number().required('Amount is required').min(1, 'Amount must be greater than zero'),
  type: yup.string().required('Type is required'),
  category: yup.string().required('Category is required'),
  description: yup.string().required('Description is required'),
});

// Configure VeeValidate globally
configure({
  generateMessage: (context) => {
    const messages = {
      required: `${context.field} is required`,
      min: `${context.field} must be at least ${context.rule.params[0]}`,
    };
    return messages[context.rule.name] || `The field ${context.field} is invalid`;
  },
  validateOnInput: true, // Validate fields on input instead of just submit
});
</script>

<style scoped>
/* Add your styles */
.error-message {
  color: red;
  font-size: 0.875em;
  margin-top: 5px;
}
</style>
