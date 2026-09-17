import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ProduceImageGallery = ({ imageUrls = [], cropName = 'Crop', gradeBadge }) => {
  const { t } = useLanguage();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fallback photos if list is empty
  const defaultImages = [
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600",
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600",
    "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600",
    "https://images.unsplash.com/photo-1595855759920-86582396756a?w=600"
  ];

  const photos = (imageUrls && imageUrls.length > 0) ? imageUrls : defaultImages;

  const handlePrev = (e) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setActiveIdx((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-2">
      {/* Main Image Container */}
      <div className="relative h-56 bg-slate-900 rounded-2xl overflow-hidden group shadow-inner border border-slate-200">
        <img
          src={photos[activeIdx]}
          alt={`${cropName} photo ${activeIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 cursor-pointer"
          onClick={() => setIsFullscreen(true)}
        />

        {/* Optional Grade Badge Overlay */}
        {gradeBadge && (
          <div className="absolute top-3 left-3 z-10">
            {gradeBadge}
          </div>
        )}

        {/* Counter Badge */}
        <div className="absolute top-3 right-3 z-10 bg-black/75 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-full text-[11px] font-black tracking-wider flex items-center space-x-1 border border-amber-400/30 shadow">
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('photosCountBadge', { current: activeIdx + 1, total: photos.length })}</span>
        </div>

        {/* Prev / Next Arrows */}
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition opacity-80 hover:opacity-100 z-10 shadow"
              title={t('prevPhoto')}
            >
              <ChevronLeft className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/90 text-white p-2 rounded-full transition opacity-80 hover:opacity-100 z-10 shadow"
              title={t('nextPhoto')}
            >
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
          </>
        )}

        {/* Fullscreen Expand Icon */}
        <button
          type="button"
          onClick={() => setIsFullscreen(true)}
          className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/90 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition z-10"
          title={t('fullscreenPhoto')}
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Thumbnail Strip for ALL Uploaded Pictures */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {photos.map((url, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveIdx(index)}
            className={`relative flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
              activeIdx === index 
                ? 'border-emerald-600 ring-2 ring-emerald-400 ring-offset-1 scale-105' 
                : 'border-slate-200 opacity-60 hover:opacity-100'
            }`}
          >
            <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
            {activeIdx === index && (
              <div className="absolute inset-0 bg-emerald-900/10" />
            )}
          </button>
        ))}
      </div>

      {/* Fullscreen Modal View */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute top-2 right-2 z-20 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={photos[activeIdx]}
              alt={`${cropName} full view`}
              className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/20"
            />

            <div className="mt-4 flex items-center space-x-4 text-white">
              <button
                type="button"
                onClick={handlePrev}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('prevPhoto')}</span>
              </button>
              
              <span className="text-xs font-bold text-amber-300">
                {cropName} - {t('photosCountBadge', { current: activeIdx + 1, total: photos.length })}
              </span>

              <button
                type="button"
                onClick={handleNext}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1"
              >
                <span>{t('nextPhoto')}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
