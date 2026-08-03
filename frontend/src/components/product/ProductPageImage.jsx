import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ProductPageImage = () => {
  const product = useSelector((state) => state.product.product);
  const images = product?.images ?? [];

  const [current, setCurrent] = useState(0);
  const scrollRef = useRef(null);
  const thumbRefs = useRef([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Reset to first image whenever a new product loads
  useEffect(() => {
    if (images.length > 0) {
      setCurrent(0);
    }
  }, [product]);

  const selectImage = images[current]?.image_name;

  const handleImageClick = (index) => {
    setCurrent(index);
  };

  const handelSlide = (index) => {
    if (images.length === 0) return;
    setCurrent((index + images.length) % images.length);
  };

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollState();
  }, [images]);

  // Scroll multiple thumbnails at a time (approx 3 thumbnails worth)
  const scrollByThumbs = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const thumbWidth = 96; 
    el.scrollBy({ left: direction * thumbWidth * 3, behavior: "smooth" });
  };

  // Auto-scroll the active thumbnail into view when selection changes
  useEffect(() => {
    thumbRefs.current[current]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [current]);

  return (
    <div>
      <div className="sticky top-25 max-[800px]:static border border-gray-200 h-fit w-full rounded-2xl p-3 sm:p-5 flex flex-col gap-2 justify-center">
        {/* Main image - fixed square box, image contained inside it */}
        <div className="relative flex justify-center items-center w-full">
          <div className="w-full max-w-105 aspect-square rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden transition-shadow duration-300 hover:shadow-lg p-1">
            <img
              src={`/image/product_img/${selectImage}`}
              alt={product?.name}
              className="w-full h-full object-contain transition-opacity duration-300"
            />
          </div>

          {images.length > 1 && (
            <div className="absolute inset-0 flex justify-between items-center p-2 sm:p-3 text-3xl sm:text-4xl text-white pointer-events-none">
              <button
                type="button"
                className="cursor-pointer hover:scale-104 rounded-full pointer-events-auto border text-black border-gray-200 bg-white/70 p-1 -translate-x-2 sm:-translate-x-5"
                onClick={() => handelSlide(current - 1)}
                aria-label="Previous image"
              >
                <IoIosArrowBack />
              </button>
              <button
                type="button"
                className="cursor-pointer hover:scale-104 rounded-full pointer-events-auto border text-black border-gray-200 bg-white/70 p-1 translate-x-2 sm:translate-x-5"
                onClick={() => handelSlide(current + 1)}
                aria-label="Next image"
              >
                <IoIosArrowForward />
              </button>
            </div>
          )}
        </div>

        {/* Mobile: dot indicators (thumbnails are hidden below 700px) */}
        {images.length > 1 && (
          <div className="hidden max-[700px]:flex justify-center items-center gap-1.5 py-1">
            {images.map((item, index) => (
              <button
                key={item?.id}
                type="button"
                onClick={() => handleImageClick(index)}
                aria-label={`Go to image ${index + 1}`}
                className={`rounded-full transition-all ${
                  index === current
                    ? "w-5 h-2 bg-blue-600"
                    : "w-2 h-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        )}

        {/* Desktop/tablet: scrollable thumbnail strip */}
        {images.length > 1 && (
          <div className="relative px-9 max-[700px]:hidden">
            {/* Left fade + button, only when there's content to scroll to */}
            {canScrollLeft && (
              <>
                <div className="pointer-events-none absolute left-9 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent z-10" />
                <button
                  type="button"
                  onClick={() => scrollByThumbs(-1)}
                  aria-label="Scroll thumbnails left"
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 cursor-pointer hover:scale-104 rounded-full border text-black border-gray-200 bg-white/70 p-1 text-[1rem]"
                >
                  <IoIosArrowBack />
                </button>
              </>
            )}

            <div
              ref={scrollRef}
              onScroll={updateScrollState}
              className="flex gap-1 p-1 overflow-x-auto w-full max-w-fit scrollbar-none rounded-2xl scroll-smooth snap-x snap-mandatory"
            >
              {images.map((item, index) => (
                <div
                  key={item?.id}
                  ref={(el) => (thumbRefs.current[index] = el)}
                  className={`snap-start w-20 h-20 aspect-square shrink-0 border m-1 rounded-lg cursor-pointer overflow-hidden bg-gray-50 flex items-center justify-center transition-all ${
                    index === current
                      ? "border-blue-500 border-2 scale-105"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => handleImageClick(index)}
                >
                  <img
                    src={`/image/product_img/${item?.image_name}`}
                    className="w-full h-full object-contain p-1"
                    alt={`${product?.name} - view ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            {canScrollRight && (
              <>
                <div className="pointer-events-none absolute right-9 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent z-10" />
                <button
                  type="button"
                  onClick={() => scrollByThumbs(1)}
                  aria-label="Scroll thumbnails right"
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 cursor-pointer hover:scale-104 rounded-full border text-black border-gray-200 bg-white/70 p-1 text-[1rem]"
                >
                  <IoIosArrowForward />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPageImage;