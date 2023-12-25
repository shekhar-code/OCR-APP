// client/src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const processIdCard = async () => {
    const formData = new FormData();
    formData.append('idCard', file);

    try {
      const response = await fetch('http://localhost:5000/api/ocr', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setOcrResult(data.result.result);
    } catch (error) {
      console.error('Error processing ID card:', error);
    }
  };

  return (
    <div className="App">
      <h1>Thai ID Card OCR App</h1>
      <input type="file" accept=".png, .jpg, .jpeg" onChange={handleFileChange} />
      <button onClick={processIdCard}>Process ID Card</button>
      {ocrResult && (
        <div>
          <h2>OCR Result:</h2>
          <pre>{ocrResult}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
