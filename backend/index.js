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
import PdfDetails from'./pdfDetails.js'
const port = process.env.PORT || 5000;
app.use(express.json());
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
app.post('/save-pdf-to-database', async (req, res) => {
  try {
    const base64PdfData = req.body.pdfData;
console.log(base64PdfData);
    // Check if the base64PdfData is a string
    if (typeof base64PdfData !== 'string') {
      return res.status(400).json({ message: 'Invalid PDF data format' });
    }

    // Decode the base64 data into a Buffer
    const pdfData = Buffer.from(base64PdfData, 'base64');

    const pdf = new PdfDetails({ pdfData: pdfData });
    await pdf.save();
    res.status(201).json({ message: 'PDF saved to the database' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving PDF to the database' });
  }
});


const mongoUrl =
  "mongodb+srv://Sanchit:Qq4DAqrMfT1G3lrK@cluster0.irbupfc.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
