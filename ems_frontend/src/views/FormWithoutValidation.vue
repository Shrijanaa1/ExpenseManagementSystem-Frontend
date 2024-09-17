<template>
    <div class="form-wrapper">
    <form @submit.prevent="submitForm" class="form-container"> <!-- default behavior (page reload) is prevented, and instead, the submitForm function is called -->
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
        <Select id="category" :options="categories" v-model="form.category" class="input-field" />  <!-- categories dynamically fetched from the server (bound to categories) -->
      </div>
  
      <div class="p-field">
        <label for="description" class="labels">Description</label>
        <InputText id="description" v-model="form.description" class="input-field"/>
      </div>
  
      <div class="button-row">
        <Button label="Save" type="submit" icon="pi pi-save" class="save-button"/>
        <Button label="Cancel" type="button" icon="pi pi-times" class="cancel-button" @click="$emit('close')"/> <!-- Triggers an event that closes the form -->
      </div>
    </form>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';  //ref: to create reactive variables that tracks for changes 
                                     // watch: function that reacts to changes in specific values and runs a function when watched value changes
  import transactionService from '@/router/transactionService';
  
  
  const props = defineProps({  // props: data passed to the component from a parent. Here it expects a transaction object
    transaction: Object,
  });
  
  const emit = defineEmits(['save', 'close']);   //events that component can emit(trigger)
  
  const form = ref({ ...props.transaction });    // ...(spread) operator used to copy all properties of props.transaction into new object   //ref: (Automatically update UI when form changes)
  
  const types = [
    { label: 'Income', value: 'INCOME' },
    { label: 'Expense', value: 'EXPENSE' },
  ];
  
  const categories = ref([]); //eactive empty array, which will be filled with the available categories fetched from the server
  
  const fetchCategories = async () => {  //asynchronous function that fetches categories from the server based on the selected transaction type
    const response = await transactionService.getCategories(form.value.type);  //Pauses the function execution until transactionService.getCategories() returns a value (a promise)
    categories.value = response.data;  // result is stored in categories.value, making it reactive and updating the UI automatically
  };
  
  watch(() => props.transaction, (newValue) => { //tracks changes to props.transactin, when it changes callback function is triggered
    form.value = { ...newValue };     //updated form value with new transaction object
    fetchCategories();    //fetches new categories based on updated transaction type
  }, { immediate: true });   //ensures watch is triggered immediately when the component is created
  
  const submitForm = () => {   
    emit('save', form.value);  //When the form is submitted, this function emits a save event with the form data 
  };
  
  const closeForm = () => {
    emit('close');
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
  
  .description-field {
    min-height: 100px;
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
  
  /* Add hover effect to input fields */
  .input-field:hover {
    background-color: #fafafa;
  }
  </style>