require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const AWS = require("aws-sdk");
const imageUpload = require("./middleware/imageupload");
const getImage = require("./middleware/imageretrieve");
const { PORT } = process.env || 3000;

const app = express();

app.set("view engine", "ejs");
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    // useTempFiles: true,
    // tempFileDir: "/tmp/",
  })
);

// Routes

app.get("/myget", (req, res) => {
  // In templating engines + get form - Data comes in absolute url so you
  // have to use req.query to get data
  console.log(req.query);

  res.status(200).send(req.query);
});

app.post("/mypost", imageUpload, (req, res) => {
  if (Array.isArray(req.files.samplefile)) {
    const imageArray = [];
    for (let i = 0; i < req.files.samplefile.length; i++) {
      imageArray.push(
        `data:${req.files.samplefile[i].mimetype};base64,${Buffer.from(
          req.files.samplefile[i].data
        ).toString("base64")}`
      );
    }
    res.status(200).render("imageupload", {
      image: imageArray,
    });
  } else {
    res.status(200).render("imageupload", {
      image: [
        `data:${req.files.samplefile.mimetype};base64,${Buffer.from(
          req.files.samplefile.data
        ).toString("base64")}`,
      ],
    });
  }
});

app.get("/getimage/:name", getImage, (req, res) => {
  console.log(res.locals.data);
  res.status(200).render("imageupload", {
    image: `data:image/jpg;base64,${Buffer.from(res.locals.data.Body).toString(
      "base64"
    )}`,
  });
});

app.get("/mygetform", (req, res) => {
  res.status(200).render("getform");
});

app.get("/mypostform", (req, res) => {
  res.status(200).render("postform");
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
