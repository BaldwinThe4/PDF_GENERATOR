// pdfDetails.js
import mongoose from 'mongoose';

const PdfDetailsSchema = new mongoose.Schema({
  pdfData: Buffer, // Use Buffer to store binary data
  title: String,
}, { collection: 'PdfDetails' });

const PdfDetails = mongoose.model('PdfDetails', PdfDetailsSchema);

export default PdfDetails; // Export the model
