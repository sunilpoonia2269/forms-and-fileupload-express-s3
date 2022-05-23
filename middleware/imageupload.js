const AWS = require("aws-sdk");

const imageUpload = (req, res, next) => {
  if (Array.isArray(req.files.samplefile)) {
    for (let i = 0; i < req.files.samplefile.length; i++) {
      const fileContent = Buffer.from(req.files.samplefile[i].data, "binary");
      uploadImagesToS3(fileContent, req.files.samplefile[i].name, next);
    }
  } else {
    const fileContent = Buffer.from(req.files.samplefile.data, "binary");
    uploadImagesToS3(fileContent, req.files.samplefile.name, next);
  }
};

function uploadImagesToS3(fileContent, name, next) {
  const config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
    region: "us-east-1",
  };

  const s3 = new AWS.S3(config);

  const params = {
    Bucket: "my-test-bucket-for-nodejs",
    Key: name,
    Body: fileContent,
  };

  s3.putObject(params, (err, data) => {
    if (err) {
      return res.status(400).json({ error: true, message: err });
    }

    next();
  });
}

module.exports = imageUpload;
