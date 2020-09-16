const moment = require("moment");

const validations = {

    isValidEmail : (email) =>{

    },

    isValidPhone : (phone) =>{

    },

    //WE WILL USE THIS FUNCTION TO FILTER ABUSIVE/SPAM WORDS
    isAbusiveContent = (comment) =>{
        return false;
    }

}

module.exports = validations;