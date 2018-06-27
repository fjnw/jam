const dotenv = require('dotenv');

dotenv.load();

const config = {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET
}

const cloudinary = require('cloudinary');
cloudinary.config(config);

//due to heroku, had to change to another hosting image service
exports.uploadToCloudinary = function(file){
    return new Promise(function(resolve, reject){
        cloudinary.v2.uploader.upload(file.path, (err, result)=>{
            if(err) return reject(err)

            return resolve(result);
        });
    });
}