import React, { useState, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = ({ pdfFile, pageNumber, onPageChange, pdfPages, onLoadSuccess }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setIsLoading(false);
    setError(null);
    if (onLoadSuccess) {
      onLoadSuccess({ numPages });
    }
  };

  const onDocumentLoadError = (error) => {
    setIsLoading(false);
    setError('Failed to load PDF');
    console.error('PDF load error:', error);
  };

  const hasMultiplePages = pdfPages && pdfPages > 1;

  return (
    <div className="relative w-full h-full bg-white border-0 lg:border lg:border-gray-200 lg:rounded-lg lg:shadow-sm overflow-hidden flex flex-col">
      <div className="flex-1 bg-gray-100 relative overflow-auto scrollbar-hide" style={{ height: 'calc(100% - 52px)' }}>
        {!pdfFile ? (
          <div className="flex items-center justify-center text-gray-500 h-full p-4">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm">No PDF loaded</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-start justify-center py-2 px-2 md:py-4 md:px-2">
            <Document 
              file={pdfFile} 
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              className="flex items-start justify-center w-full max-w-full"
              loading={
                <div className="flex flex-col items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-500 mb-2"></div>
                  <span className="text-sm text-gray-600">Loading PDF...</span>
                </div>
              }
              error={
                <div className="flex flex-col items-center justify-center text-red-500 p-4">
                  <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-center">{error || 'Failed to load PDF'}</p>
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                width={window.innerWidth > 768 ? undefined : window.innerWidth - 32}
                height={undefined}
                scale={window.innerWidth > 768 ? 1.0 : undefined}
                className="pdf-page-container bg-white shadow-lg w-full max-w-full"
                style={{
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto'
                }}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                loading={
                  <div className="flex items-center justify-center p-4 bg-gray-50 border border-gray-300 min-h-64 w-full mx-auto">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  </div>
                }
                error={
                  <div className="flex items-center justify-center p-4 bg-red-50 border border-red-300 min-h-64 text-red-500 w-full mx-auto">
                    <div className="text-center">
                      <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">Error loading page</p>
                    </div>
                  </div>
                }
              />
            </Document>
          </div>
        )}

        {hasMultiplePages && !isLoading && (
          <div className="fixed bottom-4 left-4 lg:bottom-16 lg:left-4 flex space-x-2 z-20">
            <button
              onClick={() => onPageChange(Math.max(pageNumber - 1, 1))}
              disabled={pageNumber <= 1}
              className="p-2 sm:p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl"
              title="Previous Page"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={() => onPageChange(Math.min(pageNumber + 1, pdfPages || 1))}
              disabled={pageNumber >= (pdfPages || 1)}
              className="p-2 sm:p-3 bg-white border border-gray-300 rounded-full shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-xl"
              title="Next Page"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span className="text-xs sm:text-sm font-medium text-gray-700">Document</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-600">
            Page {pageNumber} of {pdfPages || '?'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;