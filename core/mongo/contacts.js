const { query } = require("express");
const user = require("../Redis/user");
const {MongoDB} = require("./db");
const collectionName = "contacts";
const FIELDS = {
  USER_ID: 'user_id',
  CONTACTS: 'contacts'
}

const NESTED_FIELDS = {
  [FIELDS.CONTACTS]: {
    COUNTRY_CODE: 'country_code',
    NATIONAL_NUMBER: 'national_number',
    NUMBER_STRING: 'number_string',
    CONTACT_NAME: 'contact_name'
  }
}

class Contacts extends MongoDB {
  constructor(){
    super();
  }


  async init() {
    if(!this.collection) {
      const db = await super.getDBInstance();
      this.collection = db.collection(collectionName);
    }
  }

  getCollectionInstance() {
    return this.collection;
  }

  addContacts(userId, contacts = []){
    return new Promise((resolve, reject) => {
      if(!contacts.length) return resolve();
      const bulkArray = [];
      bulkArray.push({
        "updateOne": {
          "filter": {
            [FIELDS.USER_ID]: userId
          },
          "update": {
            "$addToSet": {
              [FIELDS.CONTACTS]: {
                "$each": contacts
              }
            }
          },
          "upsert": true
        }
      })
      this.collection.bulkWrite(bulkArray, (error, result) => {
        if(error) return reject(error);
        resolve(result);
      })
    })
  }

}

module.exports = {
  instance: new Contacts(),
  FIELDS,
  NESTED_FIELDS
};