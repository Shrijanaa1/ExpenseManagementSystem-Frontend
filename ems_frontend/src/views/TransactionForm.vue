<template>
  <div class="form-wrapper">
  <form @submit.prevent="submitForm" class="form-container">
    <div class="p-field">
      <label for="amount" class="labels">Amount</label>
      <InputNumber id="amount" v-model="form.amount" mode="currency" currency="NPR" class="input-field"/>
    </div>

    <div class="p-field">
      <label for="type" class="labels">Type</label>
      <Select id="type" :options="types" optionLabel="label" optionValue="value" v-model="form.type" @change="fetchCategories" class="input-field"/>
    </div>

    <div class="p-field">
      <label for="category" class="labels">Category</label>
      <Select id="category" :options="categories" v-model="form.category" class="input-field" />
    </div>

    <div class="p-field">
      <label for="description" class="labels">Description</label>
      <InputText id="description" v-model="form.description" class="input-field"/>
    </div>

    <div class="button-row">
      <Button label="Save" type="submit" icon="pi pi-save" class="save-button"/>
      <Button label="Cancel" type="button" icon="pi pi-times" class="cancel-button" @click="$emit('close')"/>
    </div>
  </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import transactionService from '@/router/transactionService';

const props = defineProps({
  transaction: Object,
});

const emit = defineEmits(['save']);

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

watch(() => props.transaction, (newValue) => {
  form.value = { ...newValue };
  fetchCategories();
}, { immediate: true });

const submitForm = () => {
  emit('save', form.value);
};

const closeForm = () => {
  emit('close');
};
</script>

<style scoped>

.form-wrapper {
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
}

.labels{
  font-weight: bold;
  padding-right: 100px;
}

.input-field {
  flex: 1;
  padding: 5px;
  margin-bottom: 10px;
}

/* Adding custom styling for the Save button */
.button-row {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.save-button {
  padding: 10px 20px;
  margin: 2px;
  background-color: #007ad9;
  color: white;
  font-size: 1rem;
}

.cancel-button {
  padding: 10px 20px;
  margin: 2px;
  background-color: #ff4d4f;
  color: white;
  font-size: 1rem;
}

.save-button:hover {
  background-color: #005ea7;
}

.cancel-button:hover {
  background-color: #d43f3a;
}
</style>
