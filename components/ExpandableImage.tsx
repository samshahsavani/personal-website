'use client';

import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { imagePreviewSrc } from '@/lib/image-optimization';

type ExpandableImageProps = {
  src: string;
  fullSrc?: string;
  previewSrc?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  quality?: number;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  imageStyle?: CSSProperties;
};

export default function ExpandableImage({
  src,
  fullSrc,
  previewSrc,
  alt,
  fill = false,
  width = 1600,
  height = 1000,
  sizes,
  quality,
  priority = false,
  className,
  imageClassName,
  imageStyle,
}: ExpandableImageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const displaySrc = previewSrc ?? imagePreviewSrc(src);
  const zoomSrc = fullSrc ?? src;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setIsZoomed(false);

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const openImage = () => setIsOpen(true);

  const handleKeyboardOpen = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    event.preventDefault();
    openImage();
  };

  const image = fill ? (
    <Image
      src={displaySrc}
      alt={alt}
      fill
      priority={priority}
      quality={quality}
      sizes={sizes}
      className={imageClassName}
      style={imageStyle}
    />
  ) : (
    <Image
      src={displaySrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={quality}
      sizes={sizes}
      className={imageClassName}
      style={imageStyle}
    />
  );

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Expand image: ${alt}`}
        className={`group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:focus-visible:ring-white/40 ${fill ? 'absolute inset-0' : 'relative'} ${className ?? ''}`}
        onClick={openImage}
        onKeyDown={handleKeyboardOpen}
      >
        {image}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.04] dark:group-hover:bg-white/[0.05]" />
      </div>

      {isOpen &&
        createPortal(
          <div
            className={`fixed inset-0 z-[100] bg-black/95 backdrop-blur-md ${
              isZoomed
                ? 'overflow-auto cursor-zoom-out p-4 md:p-12'
                : 'flex cursor-zoom-in items-center justify-center p-4 md:p-8'
            }`}
            onClick={() => setIsOpen(false)}
          >
            <img
              src={zoomSrc}
              alt={alt}
              className={`bg-white shadow-2xl transition-all duration-300 ease-in-out ${
                isZoomed
                  ? 'm-auto block h-auto min-w-[200vw] max-w-none cursor-zoom-out lg:min-w-[150vw]'
                  : 'h-auto max-h-full w-auto max-w-full cursor-zoom-in object-contain'
              }`}
              style={isZoomed ? { minHeight: '100%' } : undefined}
              onClick={(event) => {
                event.stopPropagation();
                if (isZoomed) {
                  setIsOpen(false);
                  return;
                }

                setIsZoomed(true);
              }}
            />
          </div>,
          document.body,
        )}
    </>
  );
}
