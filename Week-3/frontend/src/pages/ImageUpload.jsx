import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [message, setMessage] = useState('');

  // Handle local image picker changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a local URL to preview the image on screen instantly
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit the file data to the Node backend using FormData
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('Please select an image first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile); // Matches upload.single('image') on backend

    try {
      setMessage('Uploading...');
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setMessage(response.data.message);
      setUploadedImageUrl(response.data.imageUrl); // Save URL returned from server
    } catch (err) {
      setMessage(err.response?.data?.message || 'Upload failed');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
      <h3>Assignment 2: Image Upload Portal</h3>
      {message && <p style={{ fontWeight: '500', color: message.includes('success') ? 'green' : 'black' }}>{message}</p>}
      
      <form onSubmit={handleUpload}>
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginBottom: '15px' }} />
        
        {/* Live Client-Side Image Preview Check */}
        {previewUrl && (
          <div style={{ margin: '15px 0' }}>
            <p style={{ fontSize: '12px', color: '#666' }}>Image Preview:</p>
            <img src={previewUrl} alt="Preview" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
        )}

        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Upload to Backend Server
        </button>
      </form>

      {/* Confirmed Server Image Display */}
      {uploadedImageUrl && (
        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
          <p style={{ color: 'green', fontSize: '13px' }}>Successfully Fetched live from Backend:</p>
          <img src={uploadedImageUrl} alt="Uploaded" style={{ width: '200px', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;