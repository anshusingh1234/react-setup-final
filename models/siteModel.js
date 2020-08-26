const mongoose = require('mongoose')
const schema = mongoose.Schema
const siteModel = new schema({
    name:String,
    email:String,
    website:String,
    phone:String,
    mobile:String,
    address:String,
    logo:String,
    favicon:String,
    chatMaxUserInGroup:Number,
      status: {
        type: String,
        enum: ['ACTIVE', 'BLOCK', 'DELETE'],
        default: 'ACTIVE'
   },

},{timestamps:true})
module.exports=mongoose.model("site",siteModel)
mongoose.model('site', siteModel).find((error, result) => {
    if (result.length == 0) {
        let obj1 = {
            'name': "Meet Magic",
            'email': "info@melado.com",
            'website': 'purework@demo.info',
            'phone': "9560440044",
            'mobile': "345456678.",
            'address': 'abcd'

        };
        mongoose.model('site', siteModel).create(obj1,
            (err, success) => {
                if (err)
                    console.log("Error is" + error)
                else
                    console.log("site data saved succesfully.", success);
            })
    }
});