import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
const pdfId='6543e317511d7baa882482a9'
function generateRandomData(rows, columns) {
  const data = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      // Generate random data (for example, random numbers)
      row.push("Add data");
    }
    data.push(row);
  }
  return data;
}

function Grid() {
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
  const [tableData, setTableData] = useState([generateRandomData(rows, columns)]);
  const [data,setData]=useState([])

  const regenerateData = () => {
    setTableData(generateRandomData(rows, columns));
    setData(tableData);
  };

  const addRow = () => {
    const newRow = Array(columns).fill("Add data");
    setTableData([...tableData, newRow]);
    setRows(rows + 1);
    setData(tableData);
  };

  const addColumn = () => {
    const newTableData = tableData.map(row => [...row, "Add data"]);
    setTableData(newTableData);
    setColumns(columns + 1);
    setData(tableData);
  };

  const removeRow = () => {
    if (rows > 1) {
      const newTableData = tableData.slice(0, -1);
      setTableData(newTableData);
      setRows(rows - 1);
      setData(tableData);
    }
  };

  const removeColumn = () => {
    if (columns > 1) {
      const newTableData = tableData.map(row => row.slice(0, -1));
      setTableData(newTableData);
      setColumns(columns - 1);
      setData(tableData);
    }
  };

  const handleCellChange = (rowIndex, colIndex, newValue) => {
    const newTableData = [...tableData];
    newTableData[rowIndex][colIndex] = newValue;
    setTableData(newTableData);
    setData(tableData);
  };

  const tableStyle = {
    borderCollapse: 'collapse',
  };

  const cellStyle = {
    border: '1px solid #000',
    padding: '8px',
    textAlign: 'center',
  };
  const handleSubmit = () => {
    // Step 1: Generate the PDF and fetch it
    axios.post('/create-pdf', data)
      .then((want) => {
        // Assuming that the server returns the `pdfId` in the response
        // Step 2: Fetch the PDF by ID
        console.log(want);
        const pdfId='want.data.pdf._id';
console.log(pdfId);
        return axios.get(`/fetch-pdf/${pdfId}`, { responseType: 'blob' });
      })
      .then((response) => {
        if (response.status === 200) {
          const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          saveAs(pdfUrl, 'generatedDocument.pdf');
        } else {
          console.error('Failed to download the PDF');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  
  
  
  
  return (
    <div>
      <button onClick={regenerateData}>Generate Random Data</button>
      <button onClick={addRow}>Add Row (+)</button>
      <button onClick={addColumn}>Add Column (+)</button>
      <button onClick={removeRow}>Remove Row (-)</button>
      <button onClick={removeColumn}>Remove Column (-)</button>
      <table style={tableStyle}>
        <tbody>
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  style={cellStyle}
                  contentEditable={true}
                  onBlur={(e) =>
                    handleCellChange(rowIndex, colIndex, e.target.textContent)
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default Grid;















// import React, { useState } from 'react';

// function generateRandomData(rows, columns) {
//   const data = [];
//   for (let i = 0; i < rows; i++) {
//     const row = [];
//     for (let j = 0; j < columns; j++) {
//       // Generate random data (for example, random numbers)
//       row.push(Math.floor(Math.random() * 100));
//     }
//     data.push(row);
//   }
//   return data;
// }

// function Grid() {
//   const [rows, setRows] = useState(1);
//   const [columns, setColumns] = useState(1);
//   const [tableData, setTableData] = useState(generateRandomData(rows, columns));

//   const regenerateData = () => {
//     setTableData(generateRandomData(rows, columns));
//   };

//   const addRow = () => {
//     const newRow = Array(columns).fill(Math.floor(Math.random() * 100));
//     setTableData([...tableData, newRow]);
//     setRows(rows + 1);
//   };

//   const addColumn = () => {
//     const newTableData = tableData.map(row => [...row, Math.floor(Math.random() * 100)]);
//     setTableData(newTableData);
//     setColumns(columns + 1);
//   };

//   const removeRow = () => {
//     if (rows > 1) {
//       const newTableData = tableData.slice(0, -1);
//       setTableData(newTableData);
//       setRows(rows - 1);
//     }
//   };

//   const removeColumn = () => {
//     if (columns > 1) {
//       const newTableData = tableData.map(row => row.slice(0, -1));
//       setTableData(newTableData);
//       setColumns(columns - 1);
//     }
//   };

//   const tableStyle = {
//     borderCollapse: 'collapse',
//   };

//   const cellStyle = {
//     border: '1px solid #000',
//     padding: '8px',
//     textAlign: 'center',
//   };

//   return (
//     <div>
//       <button onClick={regenerateData}>Generate Random Data</button>
//       <button onClick={addRow}>Add Row (+)</button>
//       <button onClick={addColumn}>Add Column (+)</button>
//       <button onClick={removeRow}>Remove Row (-)</button>
//       <button onClick={removeColumn}>Remove Column (-)</button>
//       <table style={tableStyle}>
//         <tbody>
//           {tableData.map((row, rowIndex) => (
//             <tr key={rowIndex}>
//               {row.map((cell, colIndex) => (
//                 <td key={colIndex} style={cellStyle}>{cell}</td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Grid;
