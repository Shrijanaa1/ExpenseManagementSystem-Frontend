<template>
  <form @submit.prevent="submitForm">
    <div class="p-field">
      <label for="amount">Amount</label>
      <InputNumber id="amount" v-model="form.amount" mode="currency" currency="USD"/>
    </div>

    <div class="p-field">
      <label for="type">Type</label>
      <Dropdown id="type" :options="types" optionLabel="label" optionValue="value" v-model="form.type" @change="fetchCategories"/>
    </div>

    <div class="p-field">
      <label for="category">Category</label>
      <Dropdown id="category" :options="categories" v-model="form.category"/>
    </div>

    <div class="p-field">
      <label for="description">Description</label>
      <InputText id="description" v-model="form.description"/>
    </div>

    <Button label="Save" type="submit" icon="pi pi-save"/>
  </form>
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
</script>
