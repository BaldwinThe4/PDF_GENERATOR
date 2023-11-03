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
// POST endpoint for creating PDF and saving it to the database
app.post('/create-pdf', async (req, res) => {
  const pdfOptions = { format: 'Letter' }; // Adjust the format as needed

  // Create the PDF
  pdf.create(pdfTemplate2(req.body), pdfOptions).toBuffer((err, buffer) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error creating PDF');
    } else {
      // Save the PDF to the database
      const pdf = new PdfDetails({ pdfData: buffer });
// console.log(pdf);

      pdf.save()
        .then(() => {

          res.status(200).json({pdf, message: 'PDF created and saved to the database' });
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ message: 'Error saving PDF to the database' });
        });
    }
  });
});

// GET endpoint for serving the PDF by ID
app.get('/fetch-pdf/:id', (req, res) => {
  const pdfId = req.params.id;
console.log(pdfId);
  PdfDetails.findById(pdfId)
    .exec()
    .then((pdf) => {
      if (!pdf) {
        return res.status(404).json({ message: 'PDF not found' });
      }

      res.contentType('application/pdf');
      res.send(pdf.pdfData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: 'Error reading PDF from the database' });
    });
});


app.post('/save-pdf-to-database', async (req, res) => {
  try {
    const pdfBlob = req.body.pdfData; // Extract the PDF blob from FormData

    // Check if the pdfBlob is a valid Blob
    if (!pdfBlob || !(pdfBlob instanceof Blob)) {
      return res.status(400).json({ message: 'Invalid PDF data format' });
    }

    // Convert the Blob to a Buffer
    const pdfData = Buffer.from(await pdfBlob.arrayBuffer());

    const pdf = new PdfDetails({ pdfData: pdfData });
    await pdf.save();
    res.status(201).json({ message: 'PDF saved to the database' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving PDF to the database' });
  }
});


app.get('/download-pdf/:id', async (req, res) => {
  try {
    const pdfId = req.params.id;
    const pdf = await PdfDetails.findById(pdfId);

    if (!pdf) {
      return res.status(404).json({ message: 'PDF not found' });
    }

    const pdfBuffer = pdf.pdfData; // Assuming 'pdfData' is the field where the PDF is stored

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="generatedDocument.pdf"');

    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error serving the PDF' });
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
