import React, { useState, useRef } from 'react';
import axios from 'axios';

const FileUpload = ({ onPdfUpload, uploadProgress }) => {
  const [file, setFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const [localUploadProgress, setLocalUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelection(files[0]);
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelection(selectedFile);
  };

  const handleFileSelection = (selectedFile) => {
    setError(null);

    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size should be less than 10MB');
      return;
    }

    setFile(selectedFile);
    uploadFile(selectedFile);
  };

  const uploadFile = async (selectedFile) => {
    try {
      // First, notify parent component that we're starting upload
      onPdfUpload(selectedFile);
      
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(
        'http://localhost:5000/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setLocalUploadProgress(progress);
          },
        }
      );
      
      console.log("File upload response:", response);
      console.log('Upload success:', response.data);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('File upload failed');
      setLocalUploadProgress(0);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const UploadIcon = () => (
    <svg
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-white"
    >
      <path
        fillRule="evenodd"
        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );


  const currentProgress = uploadProgress || localUploadProgress;

 
  if (currentProgress > 0 && currentProgress < 100) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-5">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-purple-500 text-base font-medium">
              <div className="w-4 h-4 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
              Uploading PDF
            </div>
            <div className="text-purple-500 text-base font-semibold">{currentProgress}%</div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded transition-all duration-300 ease-out relative"
              style={{ width: `${currentProgress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Upload complete UI - centered on screen
  if (currentProgress === 100) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-5">
        <div className="w-full max-w-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-green-500 text-base font-medium">
              ✓ Upload Complete
            </div>
            <div className="text-green-500 text-base font-semibold">100%</div>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded" style={{ width: '100%' }}></div>
          </div>
          {file && (
            <p className="text-gray-600 text-sm mt-4 text-center">
              File: {file.name}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Initial upload UI - centered on screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-5">
      <div
        className={`
          bg-white border-2 border-dashed rounded-xl p-15 text-center w-full max-w-md
          transition-all duration-300 cursor-pointer
          ${isDragOver
            ? 'border-purple-500 bg-gray-50 transform scale-105'
            : error
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-purple-500 hover:bg-gray-50'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{ padding: '60px 40px' }}
      >
        <div className={`
          w-12 h-12 mx-auto mb-6 rounded-lg flex items-center justify-center
          ${error ? 'bg-red-500' : 'bg-purple-500'}
        `}>
          <UploadIcon />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Upload PDF to start chatting
        </h3>

        <p className="text-sm text-gray-500 mb-0">
          Click or drag and drop your file here
        </p>

        {error && (
          <p className="text-red-600 text-sm mt-2">{error}</p>
        )}

        {file && !error && (
          <p className="text-green-600 text-sm mt-4">
            ✓ Selected: {file.name}
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleChange}
        className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
        style={{ clip: 'rect(0, 0, 0, 0)' }}
      />
    </div>
  );
};

export default FileUpload;