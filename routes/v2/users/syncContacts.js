const {contacts: contactsMongo} = require("../../../core/mongo");
const ApiError = require("../ApiError");

const syncContacts = {};

syncContacts.upload = async(req, res, next) => {
  const userId = req._userId;
  const {contacts = []} = req.body;

  if(!contacts.length) return next(new ApiError(400, 'E0010004'))

  try{
    const response = await contactsMongo.instance.addContacts(userId, contacts.map(_obj => {
      if(_obj.countryCode && _obj.nationalNumber && _obj.contactName){
        return {
          [contactsMongo.NESTED_FIELDS[contactsMongo.FIELDS.CONTACTS].COUNTRY_CODE]: Number(_obj.countryCode),
          [contactsMongo.NESTED_FIELDS[contactsMongo.FIELDS.CONTACTS].NATIONAL_NUMBER]: Number(_obj.nationalNumber),
          [contactsMongo.NESTED_FIELDS[contactsMongo.FIELDS.CONTACTS].NUMBER_STRING]: `+${_obj.countryCode}${_obj.nationalNumber}`,
          [contactsMongo.NESTED_FIELDS[contactsMongo.FIELDS.CONTACTS].CONTACT_NAME]: _obj.contactName
        }
      }
    }).filter(el => el))
    res.status(200).send(response)
    next();
  }catch(e){
    console.log(e)
    return next(new ApiError(500, 'E0010002'));
  }
}

module.exports = syncContacts;