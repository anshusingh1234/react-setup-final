var nodemailer = require('nodemailer');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const fs = require("file-system")
let async = require("async")
const accountSid = 'AC596ef7dbd338dc52c4c1e41bd0fc477d';
const authToken = '5dcb0753a292c6d907ba7f17d7e8f80d';
const client = require('twilio')(accountSid, authToken);
const cloudinary = require('cloudinary');
const AWS = require('aws-sdk');
var FCM = require('fcm-node');
AWS.config.update({
  accessKeyId: "AKIAUTMEBPSKVAPU7Y4L",
  secretAccessKey: "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",
  region: 'us-east-1'
});
const sns = new AWS.SNS();
cloudinary.config({
  cloud_name: 'dl2d0v5hy',
  api_key: '841684319665911',
  api_secret: 'kG5j1sXJT3eeNAp5CtpZgIdfQzM'
});

const fetch = require('node-fetch');
const jConfig = require("../config/jigrrConfig").getConfig();


// // const accountSid = 'AC596ef7dbd338dc52c4c1e41bd0fc477d';
// // const authToken = '5dcb0753a292c6d907ba7f17d7e8f80d';
// // const accountSid = 'ACda96af644259e61a3e82b40b07b43adc';
// // const authToken = '34cbc940d2b2675e0747e6a0f6da6626';
// const client = require('twilio')(accountSid, authToken);

module.exports = {
  sendSMS: (mobileNumber, text, callback) => {
    client.messages.create({
      body: 'Your otp-  ' + text,
      to:  mobileNumber,
      // from: "+13367906768"
      from: "+18556220890"
    }, (twilioErr, twilioResult) => {
      if (twilioErr) {
        callback(twilioErr, null);
      }
      else {
        callback(null, twilioResult);
      }
    })
  },
  // sendSMSOTPSNS: function sendSMS(PhoneNumber, message, cb) {
  //   console.log("CC1111111C",message,PhoneNumber)
  //   sns.publish({
  //     Message: message,
  //     Subject: 'Jgrr Enterprises Otp',
  //     PhoneNumber: PhoneNumber
  //   }, (error, result) => {
  //     console.log(`SNS: `, error, result);
  //     cb(error, result);
  //   });
  // },
  sendSMSOTPSNS: function sendSMS(PhoneNumber, message, env, cb) {
    if(env !== 'prod') return cb();
    const token = jConfig.SINCH.TOKEN;
    const planId = jConfig.SINCH.PLAN_ID;

    const body = {
      to: [PhoneNumber],
      body: message
    }
    console.log(`----SINCH----`, Date.now(), JSON.stringify(body, null, 2))
    const headers = { 
      'Content-Type': 'application/json',  
      'Authorization':`Bearer ${token}`
    }

    const apiURL = `https://us.sms.api.sinch.com/xms/v1/${planId}/batches`;

    fetch(apiURL, {
      method: 'post',
      body:    JSON.stringify(body),
      headers: headers,
    })
    .then(res => res).then(json =>{
      return cb(null, json)
    }).catch(e => {
      return cb(e, null);
    })
  },
  getOTP() {
    var otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  },
  Paging(array, limit = 10, page = 1) {
    return array.slice(limit * (page - 1), limit * (page - 1) + limit);
  },
  adminEmail: (emailGiven, subject, name, text, callback) => {
    let html = `<html lang="en"><head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title></title>



    </head>
    <body style="margin: 0px; padding: 0px;">
    <div style="min-width:600px;margin:0px;background:#fff;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">

    <table style="width:600px;margin:0px auto;background:#48DA95;padding:0px;border: 4px solid black;    border-radius: 6px;" cellpadding="0" cellspacing="0" >
    <tbody>
    <tr>
    <td style='font-size: 16px;text-align:center;' >
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;">
    <tbody>
    <tr style="background-color:#4977D3; text-align:left;">
    <td style="font-size:16px;text-align:left;">
    <span style="display:inline-block;height: 100px;text-align:left;border-bottom: 4px solid black!important;border-right: 4px solid black!important;">
    <img src="https://lh3.googleusercontent.com/-gl4Gj5A0EC4/XjALlxZILdI/AAAAAAAAADM/tgb1cs9urUgPPqUPxR9RcAKwDrOewJ7OACK8BGAsYHg/s0/favicon.ico" style="padding: 0px;margin: 0px; width="100" height="100"">
    </span>
    </td>
    </tr>
    </tbody>
    </table>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;margin-bottom:50px;padding:0px 15px; ">
    <tbody>
    <tr>
    <td  style="text-align: center;     padding: 16px 0px;">
    <div style="color:#0513E7;font-size:25px;margin-bottom:5px;">Thank you for using Social media marketplace!</div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: justify; padding: 10px 0px;">
    <div style="color:#1C0790;font-size:20px;margin-bottom:5px;font-weight: 200;">${text}</div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: center;">
    <div style="color:#fff;font-size:25px;margin-bottom:5px;font-weight: 200;"></div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: center;    padding: 20px 0px;">

    </td>
    </tr>
    </tbody>
    </table>

    </table>
    </div>

    </body>
    </html>`

    console.log("22<>>>>>>>>>>>>>", emailGiven)
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        "user": global.gConfig.nodemailer.user,
        "pass": global.gConfig.nodemailer.pass
      }
    });
    var mailOptions = {
      from: "<do_not_reply@gmail.com>",
      to: emailGiven,
      subject: subject,
      html: html,
      text: text
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("this is error >>>>>>>>>>>38>>>>>. ", error);
        callback(error, null)
      } else {
        callback(null, info.response)
      }
    });

  },
  subAdminEmail: (emailGiven, text,subject, callback) => {
    let html = `<html lang="en"><head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title></title>
    </head>
    <body style="margin: 0px; padding: 0px;">
    <div style="min-width:600px;margin:0px;background:#fff;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">

    <table style="width:600px;margin:0px auto;background:#48DA95;padding:0px;border: 4px solid black;    border-radius: 6px;" cellpadding="0" cellspacing="0" >
    <tbody>
    <tr>
    <td style='font-size: 16px;text-align:center;' >
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;">
    <tbody>
    <tr style="background-color:#4977D3; text-align:left;">
    <td style="font-size:16px;text-align:left;">
    <span style="display:inline-block;height: 100px;text-align:left;border-bottom: 4px solid black!important;border-right: 4px solid black!important;">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRbOjNXusDbfOgC_MN0qmY041K049T_LUFCWM9k4wao8Dd66vlY" style="padding: 0px;margin: 0px; width="100" height="100"">
    </span>
    </td>
    </tr>
    </tbody>
    </table>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;margin-bottom:50px;padding:0px 15px; ">
    <tbody>
    <tr>
    <td  style="text-align: center;     padding: 16px 0px;">
    <div style="color:#0513E7;font-size:25px;margin-bottom:5px;">WELCOME TO BUILD_SOCIAL_MEDIA</div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: justify; padding: 10px 0px;">
    <div style="color:#1C0790;font-size:20px;margin-bottom:5px;font-weight: 200;">${text}</div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: center;">
    <div style="color:#fff;font-size:25px;margin-bottom:5px;font-weight: 200;"></div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: center;    padding: 20px 0px;">

    </td>
    </tr>
    </tbody>
    </table>

    </table>
    </div>

    </body>
    </html>`

    console.log("22<>>>>>>>>>>>>>", emailGiven)
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        "user": global.gConfig.nodemailer.user,
        "pass": global.gConfig.nodemailer.pass
      }
    });
    var mailOptions = {
      from: "<do_not_reply@gmail.com>",
      to: emailGiven,
      html: html,
      text: text,
      subject:subject
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("this is error >>>>>>>>>>>38>>>>>. ", error);
        callback(error, null)
      } else {
        callback(null, info.response)
      }
    });

  },
  emailSend: (email, text, callback) => {

    let html = `<html lang="en"><head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title></title>



    </head>
    <body style="margin: 0px; padding: 0px;">
    <div style="min-width:600px;margin:0px;background:#fff;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">

    <table style="width:600px;margin:0px auto;background:#48DA95;padding:0px;border: 4px solid black;    border-radius: 6px;" cellpadding="0" cellspacing="0" >
    <tbody>
    <tr>
    <td style='font-size: 16px;text-align:center;' >
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;">
    <tbody>
    <tr style="background-color:#4977D3; text-align:left;">
    <td style="font-size:16px;text-align:left;">
    <span style="display:inline-block;height: 100px;text-align:left;border-bottom: 4px solid black!important;border-right: 4px solid black!important;">
    <img src="https://res.cloudinary.com/dl2d0v5hy/image/upload/v1580106579/zpzfjodybyx17nwnquis.jpg" style="padding: 0px;margin: 0px; width="100" height="100"">
    </span>
    </td>
    </tr>
    </tbody>
    </table>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;margin-bottom:50px;padding:0px 15px; ">
    <tbody>
    <tr>
    <td  style="text-align: center;     padding: 16px 0px;">
    <div style="color:#0513E7;font-size:25px;margin-bottom:5px;">WELCOME TO ORBISTUR</div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: justify; padding: 10px 0px;">
    <div style="color:#1C0790;font-size:20px;margin-bottom:5px;font-weight: 200;">${text}</div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: center;">
    <div style="color:#fff;font-size:25px;margin-bottom:5px;font-weight: 200;"></div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: center;    padding: 20px 0px;">

    </td>
    </tr>
    </tbody>
    </table>

    </table>
    </div>

    </body>
    </html>`

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        "user": global.gConfig.nodemailer.user,
        "pass": global.gConfig.nodemailer.pass

      }
    });
    var mailOptions = {
      from: "<do_not_reply@gmail.com>",
      to: email,
      subject: 'Orbistur Enterprises',
      text: text,
      html: html
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        callback(error, null)
      } else {
        callback(null, info.response)
      }
    });

  },



  sendMail :function (email, subject,name,link, callback) {
    let html = `<html lang="en">
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Vendor & Users</title>
    </head>
    <body style="margin: 0px; padding: 0px; background-color: #eeeeee;">

    <div style="width:600px; margin:20px auto; background:#fff; font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">
    <div>
    <table style="width: 100%; border: 1px solid #ccc;border-radius:25px" cellpadding="0" cellspacing="0">
    <tbody>
    <tr style="margin:0;border-radius:25px;padding:0">
    <td bgcolor="#f1f1f1" height="100" style="text-align:center;background:#9e3487;">
    <img height="100" width="150" src="https://cpb-ap-se2.wpmucdn.com/mediafactory.org.au/dist/6/823/files/2018/03/new-media1-1024x675-copy1-2mdfxtg.png" alt="Email register" class="">
    </td>
    </tr>
    <tr>
    <td style="padding: 50px 15px 10px;">Dear ${name}, </td>
    </tr>
    <tr>
    <td style="padding: 10px 15px 10px;">Thank you for using Build Social Media </td>
    </tr>

    <tr>
    <td style="padding: 10px 15px 10px;">Click here to ${subject}: <a href= ${link}>Click Here</a> </td>
    </tr>


    <tr>
    <td style="padding: 25px 15px 20px;">
    Thanks &amp; Regards <br> Team
    Build Social Media
    </td>
    </tr>
    <tr>
    </tr>
    </tbody>
    </table>
    </div>
    </div>
    </body>
    </html>`
    const mailBody = {
      from: "<do_not_reply@gmail.com>",
      to: email,
      subject: subject,
      html: html
    };
    nodemailer.createTransport({
      service: 'GMAIL',
      auth: {
        user: global.gConfig.nodemailer.user,
        pass: global.gConfig.nodemailer.pass
      },
      port: 465,
      host: 'smtp.gmail.com'

    }).sendMail(mailBody, callback)
  },

  sendRewardMail :function (email, subject,name, callback) {
    let html = `<html lang="en">
    <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>Vendor & Users</title>
    </head>
    <body style="margin: 0px; padding: 0px; background-color: #eeeeee;">

    <div style="width:600px; margin:20px auto; background:#fff; font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">
    <div>
    <table style="width: 100%; border: 1px solid #ccc;border-radius:25px" cellpadding="0" cellspacing="0">
    <tbody>
    <tr style="margin:0;border-radius:25px;padding:0">
    <td bgcolor="#f1f1f1" height="100" style="text-align:center;background:#9e3487;">
    <img height="100" width="150" src="https://cpb-ap-se2.wpmucdn.com/mediafactory.org.au/dist/6/823/files/2018/03/new-media1-1024x675-copy1-2mdfxtg.png" alt="Email register" class="">
    </td>
    </tr>
    <tr>
    <td style="padding: 50px 15px 10px;">Dear ${name},You have been rewarded by JIGR by the Team Build social Media. </td>
    </tr>
    <tr>
    <td style="padding: 10px 15px 10px;">Thank you for using Build Social Media </td>
    </tr>
    <tr>
    <td style="padding: 25px 15px 20px;">
    Thanks &amp; Regards <br> Team
    Build Social Media
    </td>
    </tr>
    <tr>
    </tr>
    </tbody>
    </table>
    </div>
    </div>
    </body>
    </html>`
    const mailBody = {
      from: "<do_not_reply@gmail.com>",
      to: email,
      subject: subject,
      html: html
    };
    nodemailer.createTransport({
      service: 'GMAIL',
      auth: {
        user: global.gConfig.nodemailer.user,
        pass: global.gConfig.nodemailer.pass
      },
      port: 465,
      host: 'smtp.gmail.com'

    }).sendMail(mailBody, callback)
  },
  sendLink: (email, firstName, _id, callback) => {

    let html = `<html lang="en"><head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title></title>



    </head>
    <body style="margin: 0px; padding: 0px;">
    <div style="min-width:600px;margin:0px;background:#fff;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">

    <table style="width:600px;margin:0px auto;background:#48DA95;padding:0px;border: 4px solid black;    border-radius: 6px;" cellpadding="0" cellspacing="0" >
    <tbody>
    <tr>
    <td style='font-size: 16px;text-align:center;' >
    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;">
    <tbody>
    <tr style="background-color:#4977D3; text-align:left;">
    <td style="font-size:16px;text-align:left;">
    <span style="display:inline-block;height: 100px;text-align:left;border-bottom: 4px solid black!important;border-right: 4px solid black!important;">
    <img src="https://res.cloudinary.com/dl2d0v5hy/image/upload/v1580106579/zpzfjodybyx17nwnquis.jpg" style="padding: 0px;margin: 0px; width="100" height="100"">
    </span>
    </td>
    </tr>
    </tbody>
    </table>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;margin-bottom:50px;padding:0px 15px; ">
    <tbody>
    <tr>
    <td  style="text-align: center;     padding: 16px 0px;">
    <div style="color:#0513E7;font-size:25px;margin-bottom:5px;">WELCOME TO ORBISTUR</div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: center; padding: 10px 0px;">
    <div style="color:#1C0790;font-size:20px;margin-bottom:5px;font-weight: 200;"> Dear ${firstName}<p>Please click on the link for reset password.<a href = '${global.gConfig.url}/${_id}'><button> Click here </button></a></div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: center;">
    <div style="color:#fff;font-size:25px;margin-bottom:5px;font-weight: 200;"></div>
    </td>
    </tr>
    <tr>
    <td  style="text-align: center;    padding: 20px 0px;">

    </td>
    </tr>
    </tbody>
    </table>

    </table>
    </div>

    </body>
    </html>`

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        "user": global.gConfig.nodemailer.user,
        "pass": global.gConfig.nodemailer.pass

      }
    });
    var mailOptions = {
      from: "<do_not_reply@gmail.com>",
      to: email,
      subject: 'Orbistur Enterprises',
      //text: text,
      html: html
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        callback(error, null)
      } else {
        callback(null, info.response)
      }
    });

  },



  uploadImage(img, callback) {
    cloudinary.v2.uploader.upload(img, (err, result) => {
      if (err) {
        callback(err, null)
      }
      else {
        callback(null, result.secure_url)
      }
    });
  },


  multipleImageUploadCloudinary: (imageB64, callback) => {
    let imageArr = []
    async.eachSeries(imageB64, (items, callbackNextiteration) => {
      module.exports.uploadImage(items, (err, url) => {
        if (err)
        console.log("error is in line 119", err)
        else {
          imageArr.push(url);
          callbackNextiteration();
        }
      })
    }, (err) => {
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhh", imageArr)

      callback(null, imageArr);
    }

    )
  },
  multipleVideoUploadCloudinary: (imageB64, callback) => {
    let imageArr = []
    async.eachSeries(imageB64, (items, callbackNextiteration) => {
      module.exports.videoUpload(items, (err, url) => {
        if (err)
        console.log("error is in line 119", err)
        else {
          imageArr.push(url);
          callbackNextiteration();
        }
      })
    }, (err) => {
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhh", imageArr)

      callback(null, imageArr);
    }

    )
  },
  // videoUpload(base64, callback) {
  //   cloudinary.v2.uploader.upload(base64,
  //     {
  //       resource_type: "video",
  //     },
  //     function (error, result) {
  //       if (error) {
  //         callback(error, null)
  //       }
  //       else {
  //         callback(null, result.secure_url)
  //       }
  //     });
  // },

  uploadImg(img, callback) {
    cloudinary.v2.uploader.upload(img, (err, result) => {
      if(err){
        console.log("common error=>",err)
        callback(err, null)
      }
      else{
        callback(null, result.secure_url)
      }
    });
  },

  imageUploadCloudinary: (pic, callback) => {
    cloudinary.v2.uploader.upload(pic, {
      resource_type: "raw"
    }, (error, result) => {
      //console.log("ttttttttttttttttttttttttttttttttt", error, result)
      if (error) {
        callback(error, null)
      }
      else {
        callback(null, result.secure_url)
      }
    })
  },
  videoUpload:(base64, callback)=>{
    cloudinary.v2.uploader.upload(base64,
      {
        resource_type: "video",
      },
      function (error, result) {
        if (error) {
          callback(error, null)
        }
        else {
          callback(null, result.secure_url)
        }
      });
    },
    /**
    * Function Name : readAndWriteFile
    * Description   : read and write/upload the file to the project
    *
    *
    * @return otp
    */
    readAndWriteFile:(singleImg, newPath)=> {
      fs.readFile(singleImg.path, (err, data) => {
        if (err) {
          return res.send({ responseCode: 500, responseMessage: "Internal server error" })
        }
        else {
          fs.writeFile(newPath, data, (error, result) => {
            console.log(">>>>>>549", newPath, data)
            if (error)
            console.log('ERRRRRR!! :' + error);
            else {
              console.log('Fitxer: ' + singleImg.originalFilename + ' - ' + newPath);
            }
          })
        }

      })
    },

    //-------------------------Push notiFICATION----------
    pushNotification: (deviceToken, title, body, callback) => {
      var serverKey = 'AAAAZ2aopdo:APA91bEMglXrF64lrBuLULOP_oLfKzaPCteIM4Vx9RfZ_xm7Zi5cVvGI-vvM5lqOtnyTp2jRTPS2LXDS2XcHWfQ46LlOAoOJtXx9MVVib13zFvHF8n0SYiQlfRMcX9VYkFhxgeF3TbkT';
      var fcm = new FCM(serverKey);

      var message = {
        to: deviceToken, // required fill with device token or topics
        "content_available": true,
        notification: {
          title: title,
          body: body
        }
      };

      //callback style
      fcm.send(message, function (err, response) {
        if (err) {
          console.log(">>>>>>>>>>", err)
          callback(err, null)
        } else {
          console.log(">>>>>>>>>response", response)
          callback(null, response)
        }
      });

    },



  }
