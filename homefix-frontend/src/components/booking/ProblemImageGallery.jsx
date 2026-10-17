import React, { useState, useEffect, useCallback } from 'react';
import {
  Camera,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  X,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import './ProblemImageGallery.css';

/**
 * Standardized Problem Image Gallery with 3:4 Passport Aspect Ratio & Lightbox.
 * Designed for HomeFix Technician Request Review & Booking Inspection.
 */
export default function ProblemImageGallery({
  images = [],
  title = 'Customer Problem Photos',
  helperText = 'Review the photos before accepting the request.',
  emptyMessage = 'No problem photos attached.',
  className = ''
}) {
  const [activeIdx, setActiveIdx] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // 1, 1.5, 2
  const [brokenImages, setBrokenImages] = useState({});

  const validImages = Array.isArray(images) ? images : [];
  const hasImages = validImages.length > 0;

  // Open Lightbox
  const handleOpenLightbox = (index) => {
    setActiveIdx(index);
    setZoomLevel(1);
  };

  // Close Lightbox
  const handleCloseLightbox = useCallback(() => {
    setActiveIdx(null);
    setZoomLevel(1);
  }, []);

  // Previous image
  const handlePrev = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setActiveIdx((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
      setZoomLevel(1);
    },
    [validImages.length]
  );

  // Next image
  const handleNext = useCallback(
    (e) => {
      if (e) e.stopPropagation();
      setActiveIdx((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
      setZoomLevel(1);
    },
    [validImages.length]
  );

  // Cycle zoom
  const toggleZoom = (e) => {
    if (e) e.stopPropagation();
    setZoomLevel((prev) => {
      if (prev === 1) return 1.5;
      if (prev === 1.5) return 2;
      return 1;
    });
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseLightbox();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, handleCloseLightbox, handlePrev, handleNext]);

  // Mark broken image
  const handleImageError = (index) => {
    setBrokenImages((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div className={`problem-gallery-section ${className}`}>
      {/* Gallery Header */}
      <div className="problem-gallery-header">
        <div className="gallery-title-group">
          <span className="gallery-header-icon" aria-hidden="true">
            <Camera size={15} />
          </span>
          <h3 className="gallery-main-heading">{title}</h3>
        </div>

        {hasImages ? (
          <span className="gallery-count-badge">
            {validImages.length} {validImages.length === 1 ? 'attachment' : 'attachments'}
          </span>
        ) : null}
      </div>

      {hasImages && helperText ? (
        <p className="gallery-helper-hint">{helperText}</p>
      ) : null}

      {/* Gallery Body */}
      {hasImages ? (
        <div className="request-image-gallery" role="group" aria-label={title}>
          {validImages.map((imgUrl, idx) => {
            const isBroken = brokenImages[idx];
            return (
              <div
                key={idx}
                className="request-image-item"
                role="button"
                tabIndex={0}
                aria-label={`View customer photo ${idx + 1} of ${validImages.length}`}
                onClick={() => handleOpenLightbox(idx)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenLightbox(idx);
                  }
                }}
              >
                {!isBroken ? (
                  <img
                    src={imgUrl}
                    alt={`Customer uploaded evidence ${idx + 1}`}
                    className="request-image-thumb"
                    loading="lazy"
                    onError={() => handleImageError(idx)}
                  />
                ) : (
                  <div className="request-image-fallback">
                    <AlertCircle size={22} color="#94A3B8" />
                    <span>Photo unavailable</span>
                  </div>
                )}

                <div className="request-image-overlay">
                  <span className="image-number-pill">#{idx + 1}</span>
                  <span className="image-zoom-indicator">
                    <ZoomIn size={12} />
                    <span>Inspect</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="problem-gallery-empty">
          <span className="empty-gallery-icon" aria-hidden="true">
            <Camera size={18} />
          </span>
          <div>
            <p className="empty-gallery-title">{emptyMessage}</p>
            <p className="empty-gallery-sub">
              The customer did not attach diagnostic photos for this service request.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Lightbox Modal */}
      {activeIdx !== null && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={handleCloseLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Photo Inspector Lightbox"
        >
          {/* Top Bar */}
          <div className="lightbox-top-bar" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-title-wrap">
              <span className="lightbox-badge">
                {activeIdx + 1} of {validImages.length}
              </span>
              <span className="lightbox-filename">Customer Diagnostic Photo</span>
            </div>

            <div className="lightbox-controls">
              <button
                type="button"
                className={`lightbox-btn ${zoomLevel > 1 ? 'active' : ''}`}
                onClick={toggleZoom}
                title={`Current zoom: ${zoomLevel}x. Click to cycle zoom.`}
                aria-label="Toggle photo zoom"
              >
                {zoomLevel === 1 ? <ZoomIn size={17} /> : zoomLevel === 1.5 ? <ZoomOut size={17} /> : <RotateCcw size={17} />}
              </button>

              <button
                type="button"
                className="lightbox-btn lightbox-close-btn"
                onClick={handleCloseLightbox}
                title="Close lightbox (Esc)"
                aria-label="Close photo inspector"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Lightbox Image Stage */}
          <div className="lightbox-stage" onClick={handleCloseLightbox}>
            {validImages.length > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn prev"
                onClick={handlePrev}
                title="Previous photo (Left Arrow)"
                aria-label="Previous photo"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <img
              src={validImages[activeIdx]}
              alt={`High-resolution problem inspection ${activeIdx + 1}`}
              className={`lightbox-main-img ${
                zoomLevel === 1.5 ? 'zoomed-15' : zoomLevel === 2 ? 'zoomed-20' : ''
              }`}
              onClick={(e) => e.stopPropagation()}
            />

            {validImages.length > 1 && (
              <button
                type="button"
                className="lightbox-nav-btn next"
                onClick={handleNext}
                title="Next photo (Right Arrow)"
                aria-label="Next photo"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          {/* Lightbox Footer with Keyboard Hints */}
          <div className="lightbox-footer" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-kbd-hints">
              <span className="lightbox-kbd-hint">
                <kbd>←</kbd> <kbd>→</kbd> Navigate
              </span>
              <span className="lightbox-kbd-hint">
                <kbd>Esc</kbd> Close
              </span>
            </div>
            <span>Click backdrop to dismiss</span>
          </div>
        </div>
      )}
    </div>
  );
}
