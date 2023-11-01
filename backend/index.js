// app.mjs
import express from 'express';
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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
