import { memo, useEffect, useRef, useState } from "react";
import PageWapper from "../layout/PageWapper";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { IoIosArrowDroprightCircle } from "react-icons/io";

import off1 from "../../assets/images/Herosection/off1.png";
import off2 from "../../assets/images/Herosection/off2.png";
import off3 from "../../assets/images/Herosection/off3.png";
import off4 from "../../assets/images/Herosection/off4.png";
import off5 from "../../assets/images/Herosection/off5.png";
import off6 from "../../assets/images/Herosection/off6.png";

const HeroBanner = memo(function HeroBanner() {
  const images = [off1, off2, off3, off4, off5, off6];

  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const startAutoPlay = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);
  };

  const stopAutoPlay = () => {
    clearInterval(intervalRef.current);
  };

  const handelSlide = (n) => {
    stopAutoPlay();
    setCurrent((n + images.length) % images.length);
    startAutoPlay();
  };

  useEffect(() => {
    if (images.length === 0) return;
    startAutoPlay();

    return () => stopAutoPlay();
  }, [images.length]);

  return (
    <div className="max-[600px]:hidden">
      <PageWapper>
        <div className="flex flex-col justify-center items-center rounded-md my-5  relative border border-gray-200">
          <div className="flex justify-center items-center transition-all">
            <img
              src={images[current]}
              loading="lazy"
              className="object-contain max-[1000px]:w-full"
              alt="main page offer image"
            />
            <div className="w-full absolute flex justify-between p-5 text-4xl text-white">
              <button
                className="cursor-pointer hover:scale-104 rounded-2xl"
                onClick={() => handelSlide(current - 1)}
              >
                <IoIosArrowDropleftCircle />
              </button>
              <button
                className="cursor-pointer hover:scale-104"
                onClick={() => handelSlide(current + 1)}
              >
                <IoIosArrowDroprightCircle />
              </button>
            </div>
          </div>
          <div className="w-full h-10 flex gap-3 justify-center items-center">
            {images.map((item, index) => (
              <button
                tabIndex={index}
                onClick={() => handelSlide(index)}
                type="button"
                className={`p-1 rounded-full cursor-pointer transition-all ease-in-out delay-200 ${index === current ? "bg-blue-700 w-5 h-2.5" : "bg-blue-300 w-2.5 h-2.5 hover:bg-blue-400"}`}
                key={index}
              ></button>
            ))}
          </div>
        </div>
      </PageWapper>
    </div>
  );
});

export default HeroBanner;
