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
  const containerRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);
  const pageRenderingRef = useRef(false);
  const pageNumPendingRef = useRef<number | null>(null);

  const [isRendered, setIsRendered] = useState(false);

  // Load PDF.js
  useEffect(() => {
    const loadScript = async () => {
      if (window.pdfjsLib) {
        loadPDF();
        return;
      }

      const scriptId = 'pdf-js-script';
      if (document.getElementById(scriptId)) {
        // Script is already loading, wait for it
        const checkLib = setInterval(() => {
          if (window.pdfjsLib) {
            clearInterval(checkLib);
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            loadPDF();
          }
        }, 100);
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          loadPDF();
        }
      };
      script.onerror = () => {
        console.error('Failed to load PDF.js');
        setError(true);
        setLoading(false);
      };
      document.body.appendChild(script);
    };

    loadScript();
  }, []);

  // Handle page changes
  useEffect(() => {
    if (pdfDocRef.current) {
      queueRenderPage(pageNum);
    }
  }, [pageNum]);

  // Handle resize with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (pdfDocRef.current && !loading) {
        queueRenderPage(pageNum);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [pageNum, loading]);

  const loadPDF = async () => {
    try {
      const loadingTask = window.pdfjsLib.getDocument(file);
      const pdf = await loadingTask.promise;
      pdfDocRef.current = pdf;
      setNumPages(pdf.numPages);
      setLoading(false);
      queueRenderPage(1);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(true);
      setLoading(false);
    }
  };

  const queueRenderPage = (num: number) => {
    if (pageRenderingRef.current) {
      pageNumPendingRef.current = num;
    } else {
      renderPage(num);
    }
  };

  const renderPage = async (num: number) => {
    if (!pdfDocRef.current || !canvasRef.current || !containerRef.current) return;

    pageRenderingRef.current = true;

    // Cancel any pending render task
    if (renderTaskRef.current) {
      try {
        await renderTaskRef.current.cancel();
      } catch (error) {
        // Ignore cancel errors
      }
    }

    try {
      const page = await pdfDocRef.current.getPage(num);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) return;

      // Calculate scale based on container width
      const containerWidth = containerRef.current.clientWidth;
      // Subtract padding (p-2 = 8px*2 = 16px on mobile, p-4 = 16px*2 = 32px on desktop)
      const padding = window.innerWidth < 640 ? 16 : 32;
      const availableWidth = containerWidth - padding;

      const pageViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(availableWidth / pageViewport.width, 2.5);
      const viewport = page.getViewport({ scale });

      // Handle High DPI (Retina) displays
      const outputScale = window.devicePixelRatio || 1;

      canvas.width = Math.floor(viewport.width * outputScale);
      canvas.height = Math.floor(viewport.height * outputScale);
      canvas.style.width = Math.floor(viewport.width) + "px";
      canvas.style.height = Math.floor(viewport.height) + "px";

      const transform = outputScale !== 1
        ? [outputScale, 0, 0, outputScale, 0, 0]
        : null;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        transform: transform,
      };

      renderTaskRef.current = page.render(renderContext);

      await renderTaskRef.current.promise;
      pageRenderingRef.current = false;
      setIsRendered(true);

      if (pageNumPendingRef.current !== null) {
        renderPage(pageNumPendingRef.current);
        pageNumPendingRef.current = null;
      }
    } catch (error: any) {
      if (error.name === 'RenderingCancelledException') {
        // Rendering cancelled, this is expected
      } else {
        console.error('Error rendering page:', error);
      }
      pageRenderingRef.current = false;
    }
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
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-sm text-gray-400 dark:text-gray-600">Loading...</div>
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
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-black shadow-lg" ref={containerRef}>
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
      <div className="bg-gray-100 dark:bg-gray-900 p-2 sm:p-4 flex justify-center items-start relative min-h-[300px]">
        {!isRendered && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-sm text-gray-400 dark:text-gray-600">Loading...</div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className={`max-w-full h-auto transition-opacity duration-500 ${isRendered ? 'opacity-100' : 'opacity-0'}`}
        />
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
