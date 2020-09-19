const moment = require("moment");
const ApiError = require("../ApiError");
const { countBy } = require("lodash");

const config = {
  /**
  * Validating JSON Body
  * @param {*} req
  * @param {*} res
  * @param {*} next
  */
 getConfig: (req, res, next) => {
    const config = {
      privacyOptions:[
        {label:'Public', value:0, icon:''},
        {label:'Private', value:1, icon:''},
        {label:'Friends', value:2, icon:''},
        {label:'Only Me', value:3, icon:''},
      ],
      reactions:[
        {name:'like', value:1, icon:''},
        {name:'heart', value:2, icon:''},
        {name:'shock', value:3, icon:''},
        {name:'laugh', value:4, icon:''},
        {name:'cry', value:5, icon:''},
      ],
      feelings:[
        {name:'happy', value:1, icon:''},
        {name:'loved', value:2, icon:''},
        {name:'blessed', value:3, icon:''},
        {name:'sad', value:4, icon:''},
        {name:'thankful', value:5, icon:''},
        {name:'excited', value:6, icon:''},
        {name:'crazy', value:7, icon:''},
        {name:'grateful', value:8, icon:''},
        {name:'blissful', value:9, icon:''},
        {name:'fantastic', value:10, icon:''},
        {name:'positive', value:11, icon:''},
        {name:'hopeful', value:12, icon:''},
        {name:'tired', value:13, icon:''},
        {name:'angry', value:14, icon:''},
        {name:'sick', value:15, icon:''},
        {name:'exhausted', value:16, icon:''},
      ],
      entityTypes:['feed', 'event', 'comment'],
      defaultEventImages:[],
      staticPages:{
        privacy:'This is dynamic privacy content',
        tnc:'This is dynamic Terms & Conditions content'
      },
      maxMediaAllowed:9
    }  
    
    res.status(200).send(config);
    next();
  },
  
}






module.exports = config;