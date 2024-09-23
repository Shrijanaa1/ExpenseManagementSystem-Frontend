export const validateRequired = (value) => {
    if (!value || value.toString().trim() === '') {  //checks if value is falsy(null, undefined, 0, false)
      return 'This field is required'; //If value is falsy or empty string, it returns error message
    }
    return ''; //If value is valid, it returns empty string(indicating no validation error)
  };
  
export const validateNumber = (value) => {
    if (isNaN(value)) { //If value is Not a Number
      return 'This field must be a number';
    }
    if (Number(value) <= 0) {
      return 'The value must be a positive number';
    }
    return '';
  };
  
export const validateMinLength = (value, minLength) => {
    if (!value || value.length < minLength) {
      return `This field must be at least ${minLength} characters`;
    }
    return '';
  };
  
export const validatePattern = (value, regex, errorMessage) => {
    if (!regex.test(value)) {
      return errorMessage;
    }
    return '';
  };

  