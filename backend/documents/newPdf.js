export default function pdfTemplate(arr) {
    // Opening HTML tags
    let html = `<!doctype html>
      <html>
      <head>
      <style>
      table {
        border-collapse: collapse;
        width: 100%;
      }
  
      th, td {
        border: 1px solid black;
        padding: 8px;
        text-align: center;
      }
      </style>
      </head>
      <body>
      <table>
    `;
  
    // Generating table rows and cells from the array
    for (let i = 0; i < arr.length; i++) {
      html += '<tr>';
      for (let j = 0; j < arr[i].length; j++) {
        html += `<td>${arr[i][j]}</td>`;
      }
      html += '</tr>';
    }
  
    // Closing HTML tags
    html += `
      </table>
      </body>
      </html>`;
  
    return html;
  }
  