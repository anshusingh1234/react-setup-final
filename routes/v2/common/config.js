const moment = require("moment");
const ApiError = require("../ApiError");

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
        {label:'Public', value:0, icon:'https://i.pinimg.com/474x/ea/c0/0d/eac00d6c59ecfa8218fc414f8bdfbe3d--internet-network-sign-painting.jpg'},
        {label:'Friends', value:1, icon:'https://www.adweek.com/wp-content/themes/adweek-next/src/images/default-profile.svg'},
        {label:'Only Me', value:2, icon:'https://www.iconfinder.com/data/icons/hawcons/32/698630-icon-114-lock-512.png'},
        {label:'Selected Friends', value:3, icon:'https://www.materialui.co/materialIcons/action/settings_grey_192x192.png'},
      ],
      reactions:[
        {name:'like', value:1, icon:''},
        {name:'heart', value:2, icon:''},
        {name:'shock', value:3, icon:''},
        {name:'laugh', value:4, icon:''},
        {name:'cry', value:5, icon:''},
      ],
      feelings:[
        {name:'happy', value:1, icon:'😀'},
        {name:'loved', value:2, icon:'🥰'},
        {name:'blessed', value:3, icon:'😇'},
        {name:'sad', value:4, icon:'😥'},
        {name:'thankful', value:5, icon:'🙏'},
        {name:'excited', value:6, icon:'🤩'},
        {name:'crazy', value:7, icon:'🤪'},
        {name:'grateful', value:8, icon:'🤗'},
        {name:'blissful', value:9, icon:''},
        {name:'fantastic', value:10, icon:''},
        {name:'positive', value:11, icon:''},
        {name:'hopeful', value:12, icon:''},
        {name:'tired', value:13, icon:'😓'},
        {name:'angry', value:14, icon:'😡'},
        {name:'sick', value:15, icon:'🤕'},
        {name:'exhausted', value:16, icon:'😒'},
      ],
      entityTypes:['feed', 'event', 'comment'],
      defaultEventImages:[
        {
          "width": 813,
          "height": 590,
          "url": "https://images.bewakoof.com/utter/banner-9-best-songs-that-will-make-you-an-antakshari-pro-1471579241.jpg",
        },
        {
          "width": 374,
          "height": 196,
          "url": "https://4.bp.blogspot.com/-vxaJNGGDvig/UYPD3vEClxI/AAAAAAAAAjA/WxzvETl7S7Y/w1200-h630-p-k-no-nu/Antakshari+sarthakahuja.blogspot.com.jpg",
        },
        {
          "width": 650,
          "height": 390,
          "url": "https://i.pinimg.com/736x/43/23/27/432327f68a83f9911cb25fea765e9252.jpg",
        },
        {
          "width": 626,
          "height": 417,
          "url": "https://image.freepik.com/free-vector/friends-video-calling-concept_23-2148504259.jpg",
        }
        
      ],
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