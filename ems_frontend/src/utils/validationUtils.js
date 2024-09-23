export const validateRequired = (value, fieldName) => {
    if (!value || value.toString().trim() === '') {  //checks if value is falsy(null, undefined, 0, false)
      return `${fieldName} is required`; // Dynamic error message for fields (Eg: Amount is required) // Using backticks(``) instead of single quote('') allows to include variables directly within the string.
    }
    return ''; //If value is valid, it returns empty string(indicating no validation error)
  };
  
export const validateNumber = (value, fieldName) => {
    if (isNaN(value)) { //If value is Not a Number
      return `${fieldName} must be a number`;
    }
    if (Number(value) < 0) {
      return `${fieldName} must be a positive number`;
    }
    return '';
  };
  
export const validateMinLength = (value, minLength, fieldName) => {
    if (!value || value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters`;
    }
    return '';
  };
  
  