'use client';

import { useState, useEffect, useRef } from 'react';

interface PDFViewerProps {
  file: string;
  title: string;
}

declare global {
  interface Window {
    pdfjsLib: any;
  }
}

export default function PDFViewer({ file, title }: PDFViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);

  useEffect(() => {
    // Load PDF.js from CDN
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        loadPDF();
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (pdfDocRef.current) {
      renderPage(pageNum);
    }
  }, [pageNum]);

  useEffect(() => {
    // Re-render on window resize to fix initial sizing issues
    const handleResize = () => {
      if (pdfDocRef.current) {
        renderPage(pageNum);
      }
    };

    window.addEventListener('resize', handleResize);
    // Also trigger a re-render after a short delay to fix initial load
    const timer = setTimeout(() => {
      if (pdfDocRef.current) {
        renderPage(pageNum);
      }
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const loadPDF = async () => {
    try {
      const loadingTask = window.pdfjsLib.getDocument(file);
      const pdf = await loadingTask.promise;
      pdfDocRef.current = pdf;
      setNumPages(pdf.numPages);
      setLoading(false);
      renderPage(1);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(true);
      setLoading(false);
    }
  };

  const renderPage = async (num: number) => {
    if (!pdfDocRef.current || !canvasRef.current) return;

    const page = await pdfDocRef.current.getPage(num);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Use fixed scale for consistent sizing across all pages
    const scale = 1.8;
    const viewport = page.getViewport({ scale });

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  };

  const goToPrevious = () => {
    if (pageNum > 1) setPageNum(pageNum - 1);
  };

  const goToNext = () => {
    if (pageNum < numPages) setPageNum(pageNum + 1);
  };

  if (loading) {
    return (
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-black">
        <div className="flex items-center justify-center h-[700px]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-gray-300 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading presentation...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 p-8">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Unable to load PDF</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              View or download the presentation instead
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <a
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
            >
              Open in Browser
            </a>
            <a
              href={file}
              download
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-600 transition-colors font-medium"
            >
              Download
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-black shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Page {pageNum} of {numPages}
          </p>
        </div>
        <a
          href={file}
          download
          className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium inline-flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
      </div>

      {/* PDF Canvas - Premium feel */}
      <div className="bg-gray-100 dark:bg-gray-900 p-8 flex justify-center items-center min-h-[700px]">
        <div className="bg-white dark:bg-gray-950 shadow-2xl rounded-lg overflow-hidden max-w-full">
          <canvas ref={canvasRef} className="max-w-full h-auto" />
        </div>
      </div>

      {/* Navigation Controls - Minimal */}
      <div className="border-t border-gray-200 dark:border-gray-800 py-4 bg-white dark:bg-black">
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={goToPrevious}
            disabled={pageNum <= 1}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-sm text-gray-600 dark:text-gray-400 min-w-[100px] text-center">
            Page {pageNum} of {numPages}
          </div>

          <button
            onClick={goToNext}
            disabled={pageNum >= numPages}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
