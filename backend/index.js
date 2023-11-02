// app.mjs
import express from 'express';
import mongoose from 'mongoose';
import { json, urlencoded } from 'express';
import pdf from 'html-pdf';
import cors from 'cors';
import pdfTemplate1 from './documents/index.js';
import pdfTemplate2 from './documents/newPdf.js';
import fs from 'fs';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

// POST endpoint for creating PDF
app.post('/create-pdf', (req, res) => {
  const pdfOptions = { format: 'Letter' }; // Adjust the format as needed
  const pdfFilePath = 'rezultati.pdf';

  pdf.create(pdfTemplate2(req.body), pdfOptions).toFile(pdfFilePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating PDF');
    } else {
      res.status(200).send('PDF created');
    }
  });
});

// GET endpoint for serving the PDF
app.get('/fetch-pdf', (req, res) => {
  const pdfFilePath = 'rezultati.pdf';
  fs.promises.readFile(pdfFilePath)
    .then(data => {
      res.contentType('application/pdf');
      res.send(data);
    })
    .catch(err => {
      console.error(err);
      res.status(500).send('Error reading PDF');
    });
});

//--------------------------------------
const mongoUrl =
  "mongodb+srv://adarsh:adarsh@cluster0.zllye.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));
  //----------------------------------
  const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
//----------------------------------
require("./pdfDetails");
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage });

app.post("/upload-files", upload.single("file"), async (req, res) => {
  console.log(req.file);
  const title = req.body.title;
  const fileName = req.file.filename;
  try {
    await PdfSchema.create({ title: title, pdf: fileName });
    res.send({ status: "ok" });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-files", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {}
});
//------------------------------------------------
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
