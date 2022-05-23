const AWS = require("aws-sdk");

const getImage = (req, res, next) => {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
    region: "us-east-1",
  });

  const s3 = new AWS.S3();

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.params.name,
  };

  s3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.locals.data = data;
    next();
  });
};

module.exports = getImage;
