import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ImageCarousel = ({ images, autoSlide = false, autoSlideInterval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const prevSlide = () => {
    if (isAnimating || !images?.length) return;
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setIsAnimating(true);
  };

  const nextSlide = () => {
    if (isAnimating || !images?.length) return;
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setIsAnimating(true);
  };

  const goToSlide = (slideIndex) => {
    if (isAnimating || !images?.length) return;
    setCurrentIndex((slideIndex + images.length) % images.length);
    setIsAnimating(true);
  };

  const handleDragEnd = (_, { offset, velocity }) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    if (offset.x < -80 || swipe < -500) nextSlide();
    if (offset.x > 80 || swipe > 500) prevSlide();
  };

  // Autoplay functionality
  useEffect(() => {
    if (!autoSlide || !images?.length) return;
    const slideInterval = setInterval(nextSlide, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [currentIndex, autoSlide, autoSlideInterval, isAnimating]);

  if (!images?.length) return null;

  const activeImage = images[currentIndex];
  const nextImage = images[(currentIndex + 1) % images.length];

  return (
    <div className="relative mx-auto h-[370px] w-full max-w-[430px] px-3 pb-7 pt-2 sm:h-[410px]">
      <div className="absolute inset-x-7 bottom-5 top-5 rotate-3 overflow-hidden rounded-sm bg-[#f7f1e5] p-3 shadow-[8px_10px_0_rgba(15,23,42,0.18)]">
        <div
          className="h-full w-full bg-cover bg-center grayscale-[15%]"
          style={{ backgroundImage: `url(${nextImage.url})` }}
        />
      </div>

      <AnimatePresence initial={false} onExitComplete={() => setIsAnimating(false)}>
        <motion.div
          key={currentIndex}
          className="absolute inset-x-3 top-2 z-10 cursor-grab touch-pan-y bg-white p-3 pb-4 shadow-[0_12px_26px_rgba(15,23,42,0.25)] active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -180, right: 180 }}
          dragElastic={0.7}
          onDragEnd={handleDragEnd}
          initial={{ opacity: 0.8, y: 34, rotate: -3, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, x: 520, rotate: 9, transition: { duration: 0.45, ease: "easeIn" } }}
          whileTap={{ scale: 1.02, rotate: -1 }}
          whileDrag={{ rotate: 4 }}
          transition={{ type: "spring", stiffness: 280, damping: 25 }}
        >
          <div className="relative aspect-[1.25] overflow-hidden bg-slate-200">
            <img
              src={activeImage.url}
              alt={activeImage.alt || activeImage.description || "Sierra Hacks memory"}
              className="h-full w-full object-cover grayscale-[12%]"
            />
            <span className="absolute left-3 top-3 bg-[#8bc3e6] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-slate-900 shadow-[2px_2px_0_rgba(15,23,42,0.35)]">
              Sierra Hacks / {String(currentIndex + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="min-h-[65px] pt-3">
            <p className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.08em] text-slate-600">
              {activeImage.description || "A snapshot from the Sierra Hacks archive."}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prevSlide}
        aria-label="Previous image"
        className=" cursor-pointer absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-slate-900 font-mono text-xl text-white shadow-[3px_3px_0_#8bc3e6] transition-transform hover:-translate-x-1"
      >
        ←
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next image"
        className=" cursor-pointer absolute right-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center bg-slate-900 font-mono text-xl text-white shadow-[3px_3px_0_#8bc3e6] transition-transform hover:translate-x-1"
      >
        →
      </button>

      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2">
        {images.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            aria-label={`Show image ${slideIndex + 1}`}
            className={`h-2 w-6 rounded-xl transition-all duration-300 ${
              currentIndex === slideIndex ? "bg-[#8bc3e6]" : "bg-slate-400/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
