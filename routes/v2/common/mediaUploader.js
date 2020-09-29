const cloudinary = require('cloudinary');
const multiparty = require("multiparty");
const async = require('async');
const jigrrConfig = require("../../../config/jigrrConfig").getConfig();

cloudinary.config({
  cloud_name: jigrrConfig.CLOUDINARY.CLOUD_NAME,
  api_key: jigrrConfig.CLOUDINARY.API_KEY,
  api_secret: jigrrConfig.CLOUDINARY.API_SECRET
});


const mediaUploader = {};

mediaUploader.uploadFormData = async(req, res, next) => {
  const form = new multiparty.Form();
  form.parse(req, (error, field, files) => {
    if(!files) return next();
    _uploader(files, (error, media = []) => {
      req._media = media;
      next();
    })
  })
}

mediaUploader.uploadReqFiles = async(req, res, next) => {
  const files = req._files;
  _uploader(files, (error, media = []) => {
    req._media = media;
    next();
  })
}

module.exports = mediaUploader;

const _uploader = (files, callback) => {
  if(!files) return next();
  console.log("media form data", JSON.stringify(files, null, 2));
  const imagePaths = files.image && files.image.map(_obj => _obj.path) || [];
  const videoPaths = files.video && files.video.map(_obj => _obj.path) || [];
  const scripts = [];
  const media = [];
  imagePaths.forEach(_img => {
    scripts.push(cb => _uploadImage(_img, (error, result) => {
      result && media.push(result);
      cb()
    }))
  })

  videoPaths.forEach(_vid => {
    scripts.push(cb => _uploadVideo(_vid, (error, result) => {
      result && media.push(result);
      cb()
    }))
  })

  async.parallelLimit(scripts, 5, () => {
    return callback(null, media)
  })
}

const _uploadImage = (image, callback) => {
  cloudinary.v2.uploader.upload(image, (error, result) => {
    if(result){
      return callback(null, {
        width: result.width,
        height: result.height,
        url: result.secure_url,
        type: "image",
        layout: _getLayout(result.width, result.height)
      })
    }
    return callback();
  })
}

const _uploadVideo = (video, callback) => {
  cloudinary.v2.uploader.upload(video, {
    resource_type: "video"
  }, (error, result) => {
    if(result){
      return callback(null, {
        width: result.width,
        height: result.height,
        url: result.secure_url,
        type: "video",
        layout: _getLayout(result.width, result.height)
      })
    }
    return callback();
  })
}

const _getLayout = (width, height) => {
  switch(true){
    case (width > height): return 'horizontal';
    case (width < height): return 'vertical';
    default: return 'square';
  }
}