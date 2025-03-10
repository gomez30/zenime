import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaHistory, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "@/src/context/LanguageContext";

const ContinueWatching = () => {
  const [watchList, setWatchList] = useState([]);
  const { language } = useLanguage();
  const swiperRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("continueWatching") || "[]");
    setWatchList(data);
  }, []);

  // Memoize watchList to avoid unnecessary re-renders
  const memoizedWatchList = useMemo(() => watchList, [watchList]);

  const removeFromWatchList = (episodeId) => {
    setWatchList((prevList) => {
      const updatedList = prevList.filter(
        (item) => item.episodeId !== episodeId
      );
      localStorage.setItem("continueWatching", JSON.stringify(updatedList));
      return updatedList;
    });
  };

  if (memoizedWatchList.length === 0) return null;

  return (
    <div className="mt-6 max-[1200px]:px-6 max-md:px-0">
      <div className="flex items-center justify-between max-md:pl-4">
        <div className="flex items-center gap-x-2 justify-center">
          <FaHistory className="text-[#ffbade]" />
          <h1 className="text-[#ffbade] text-2xl font-bold max-[450px]:text-xl max-[450px]:mb-1 max-[350px]:text-lg">
            Continue Watching
          </h1>
        </div>

        <div className="flex gap-x-2 pr-2 max-[350px]:hidden">
          <button className="btn-prev bg-gray-700 text-white p-3 rounded-full hover:bg-gray-500 transition max-[768px]:p-2">
            <FaChevronLeft className="text-xs" />
          </button>
          <button className="btn-next bg-gray-700 text-white p-3 rounded-full hover:bg-gray-500 transition max-[768px]:p-2">
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>

      <div className="relative mx-auto overflow-hidden z-[1] mt-6 max-[450px]:mt-3">
        <Swiper
          ref={swiperRef}
          className="w-full h-full"
          slidesPerView={2}
          spaceBetween={15}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 10 },
            480: { slidesPerView: 3, spaceBetween: 12 },
            640: { slidesPerView: 4, spaceBetween: 15 },
            768: { slidesPerView: 4, spaceBetween: 15 },
            1024: { slidesPerView: 5, spaceBetween: 15 },
            1300: { slidesPerView: 6, spaceBetween: 15 },
            1600: { slidesPerView: 7, spaceBetween: 20 },
          }}
          modules={[Navigation]}
          navigation={{
            nextEl: ".btn-next",
            prevEl: ".btn-prev",
          }}
        >
          {memoizedWatchList.map((item, index) => (
            <SwiperSlide
              key={index}
              className="text-center flex justify-center items-center"
            >
              <div className="w-full h-auto pb-[140%] relative inline-block overflow-hidden">
                <button
                  className="absolute top-2 right-2 bg-black text-white px-3 py-2 bg-opacity-60 rounded-full text-sm z-10 font-extrabold hover:bg-white hover:text-black transition-all"
                  onClick={() => removeFromWatchList(item.episodeId)}
                >
                  ✖
                </button>

                <Link
                  to={`/watch/${item.animeInfo?.id}?ep=${item.episodeId}`}
                  className="inline-block bg-[#2a2c31] absolute left-0 top-0 w-full h-full"
                >
                  <img
                    src={item.animeInfo?.poster}
                    alt={item.animeInfo?.title}
                    className="block w-full h-full object-cover hover:cursor-pointer"
                    title={item.animeInfo?.title}
                    loading="lazy"
                  />
                </Link>

                <div className="absolute bottom-0 left-0 flex flex-col gap-y-2 right-0 p-2 bg-gradient-to-t from-black via-black/80 to-transparent max-[450px]:gap-y-1">
                  <p className="text-white text-md font-bold text-left truncate max-[450px]:text-sm">
                    {language === "EN"
                      ? item.animeInfo?.title
                      : item.animeInfo?.japanese_title}
                  </p>
                  <p className="text-gray-300 text-sm font-semibold text-left max-[450px]:text-[12px]">
                    Episode {item.episodeNum}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ContinueWatching;
