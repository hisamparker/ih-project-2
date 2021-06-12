// configs/cloudinary.config.js
// copy paste from Drones lab / Michaels lecture on Cloudinary

const cloudinary = require(`cloudinary`).v2;
const { CloudinaryStorage } = require(`multer-storage-cloudinary`);
// multer adds a body object and a file or files object to the request object,
// body object stores the values of text fields of a form and the file / files object store the files uploaded via the form
// like parser but for files
const multer = require(`multer`);

// config with all my project / personal / secret info
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

// instantiate instance of CloudinaryStorage and save it to a variable:
const storage = new CloudinaryStorage({
    // cloudinary: cloudinary,
    cloudinary,
    params: {
        folder: `cute-spot`, // The name of the folder in cloudinary
        allowedFormats: [`jpg`, `png`, `jpeg`], // file types allowed
        // this is in case you want to upload other type of files, not just images
        // params: { resource_type: `raw` },
    },
    filename(req, file, cb) {
        // The file on cloudinary would have the same name as the original file name
        cb(null, file.originalname);
    },
});

// tells multer to store uploads in storage because value and key are storage, can just say {storage} instead of storage : storage
const uploadCloud = multer({ storage });

module.exports = uploadCloud;

// if above doesn't work, try
// module.exports = {
//   cloudinary,
//   storage
// }
