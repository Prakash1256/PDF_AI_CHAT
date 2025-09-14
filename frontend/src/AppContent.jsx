import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import PdfViewer from './components/PdfViewer';
import ChatBox from './components/ChatBox';

function AppContent() {
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfPages, setPdfPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pdf');
  const navigate = useNavigate();

  useEffect(() => {
    const loadStoredPdf = async () => {
      try {
        const storedPdfData = sessionStorage.getItem('uploadedPdf');
        const storedPdfName = sessionStorage.getItem('uploadedPdfName');
        
        if (storedPdfData && storedPdfName) {
          console.log('Loading PDF from session storage...');
          
          const byteCharacters = atob(storedPdfData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          
          const file = new File([blob], storedPdfName, { type: 'application/pdf' });
          
          setPdfFile(file);
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          
          console.log('PDF loaded from session storage successfully');
        }
      } catch (error) {
        console.error('Error loading PDF from session storage:', error);
        sessionStorage.removeItem('uploadedPdf');
        sessionStorage.removeItem('uploadedPdfName');
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredPdf();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const currentPath = window.location.pathname;
      if (currentPath === '/chat' && (!pdfFile || !pdfUrl)) {
        console.log('No PDF found on chat page, redirecting to upload...');
        navigate('/');
      }
    }
  }, [pdfFile, pdfUrl, navigate, isLoading]);

  const handlePdfUpload = async (file) => {
    console.log('PDF upload started:', file.name);
    
    setPdfFile(file);
    
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    
    const url = URL.createObjectURL(file);
    setPdfUrl(url);
    
    try {
      const reader = new FileReader();
      reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        const bytes = new Uint8Array(arrayBuffer);
        const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
        const base64 = btoa(binary);
        
        sessionStorage.setItem('uploadedPdf', base64);
        sessionStorage.setItem('uploadedPdfName', file.name);
        console.log('PDF stored in session storage');
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error storing PDF in session storage:', error);
    }
    
    setPageNumber(1);
    setPdfPages(0);
    
    setUploadProgress(10);
    
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            console.log('Navigating to chat page...');
            navigate('/chat');
          }, 1000);
          return 100;
        }
        return Math.min(prev + 12, 95);
      });
    }, 400);

    setTimeout(() => {
      setUploadProgress(100);
    }, 3000);
  };

  const onLoadSuccess = ({ numPages }) => {
    console.log('PDF loaded successfully. Pages:', numPages);
    setPdfPages(numPages);
  };

  const handleBackToUpload = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    
    sessionStorage.removeItem('uploadedPdf');
    sessionStorage.removeItem('uploadedPdfName');
    
    setPdfFile(null);
    setPdfUrl(null);
    setUploadProgress(0);
    setPageNumber(1);
    setPdfPages(0);
    navigate('/');
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    console.log('AppContent state:', {
      pdfFile: !!pdfFile,
      pdfUrl: !!pdfUrl,
      uploadProgress,
      pdfPages,
      isLoading
    });
  }, [pdfFile, pdfUrl, uploadProgress, pdfPages, isLoading]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 overflow-hidden">
      <Routes>
        <Route path="/" element={
          <div className="max-w-full mx-auto p-4">
            <FileUpload 
              onPdfUpload={handlePdfUpload}
              uploadProgress={uploadProgress}
            />
          </div>
        } />
        
        <Route path="/chat" element={
          pdfFile && pdfUrl ? (
            <div className="h-screen flex flex-col relative">
              {/* Responsive Close Button */}
              <div className="fixed top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 z-50">
                <button
                  onClick={handleBackToUpload}
                  className="flex cursor-pointer items-center justify-center   w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 text-white bg-red-700 border border-red-700 rounded-full  hover:bg-red-600 hover:text-white transition-all    shadow-lg hover:shadow-xl    active:scale-95 transform"
                  title="Close and return to upload"
                  aria-label="Close and return to upload"
                >
                  <svg 
                    className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile/Tablet Tab Navigation */}
              <div className="lg:hidden bg-white border-b border-gray-200 flex z-10 sticky top-0">
                <button
                  onClick={() => setActiveTab('pdf')}
                  className={`flex-1 py-3 px-2 sm:px-4 text-center font-medium transition-colors ${
                    activeTab === 'pdf'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm sm:text-base">Document</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-3 px-2 sm:px-4 text-center font-medium transition-colors ${
                    activeTab === 'chat'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm sm:text-base">Chat</span>
                  </div>
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 flex min-h-0">
                {/* Desktop Layout */}
                <div className="hidden lg:flex flex-1 min-h-0">
                  <div className="w-1/2 h-full">
                    <PdfViewer
                      pdfFile={pdfUrl}
                      pageNumber={pageNumber}
                      onPageChange={setPageNumber}
                      pdfPages={pdfPages}
                      onLoadSuccess={onLoadSuccess}
                    />
                  </div>
                  
                  <div className="w-1/2 h-full">
                    <ChatBox pdfFile={pdfFile} />
                  </div>
                </div>

                {/* Mobile/Tablet Layout */}
                <div className="lg:hidden flex-1 min-h-0 relative">
                  <div className={`h-full ${activeTab === 'pdf' ? 'block' : 'hidden'} overflow-hidden`}>
                    <div className="h-full p-2 sm:p-3 md:p-4">
                      <PdfViewer
                        pdfFile={pdfUrl}
                        pageNumber={pageNumber}
                        onPageChange={setPageNumber}
                        pdfPages={pdfPages}
                        onLoadSuccess={onLoadSuccess}
                      />
                    </div>
                  </div>
                  
                  <div className={`h-full ${activeTab === 'chat' ? 'block' : 'hidden'} overflow-hidden`}>
                    <div className="h-full">
                      <ChatBox pdfFile={pdfFile} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-screen flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 max-w-md mx-auto w-full">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.684-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">No PDF Uploaded</h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6 text-center">Please upload a PDF file first to start chatting</p>
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-purple-500 text-white px-6 py-2 sm:py-3 rounded-lg hover:bg-purple-600 transition-colors font-medium text-sm sm:text-base"
                >
                  Upload PDF
                </button>
              </div>
            </div>
          )
        } />
      </Routes>
    </div>
  );
}

export default AppContent;