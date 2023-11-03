import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import './App.css';
import Grid from './Grid';
function App() {
  const [formData, setFormData] = useState({
    name: 'Adrian',
    receiptId: 0,
    price1: 0,
    price2: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createAndDownloadPdf = () => {
    axios.post('/create-pdf', formData)
      .then(() => axios.get('/fetch-pdf', { responseType: 'blob' }))
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
        console.log(pdfBlob);
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
  
          // Step 4: Send the base64String to the server for database storage
          axios.post('/save-pdf-to-database', { pdfData: base64String })
            .then((response) => {
              // Step 5: Handle the response from the server
              console.log(response);
            });
        };
        reader.readAsDataURL(pdfBlob);
      
        saveAs(pdfBlob, 'generatedDocument.pdf');
        
      });
  };

  return (
    <div className="App">
      {/* <label>Name</label>
      <input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} /><br/>
      <label>Price</label>
      <input type="number" placeholder="Receipt ID" name="receiptId" value={formData.receiptId} onChange={handleChange} /><br/>
      <label>Price</label>
      <input type="number" placeholder="Price 1" name="price1" value={formData.price1} onChange={handleChange} /><br/>
      <label>Price</label>
      <input type="number" placeholder="Price 2" name="price2" value={formData.price2} onChange={handleChange} /><br/>
      <button onClick={createAndDownloadPdf}>Download PDF</button> */}
      <Grid/>
    </div>
  );
}

export default App;
