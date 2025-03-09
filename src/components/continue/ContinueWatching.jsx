import { Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaHistory, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "@/src/context/LanguageContext";

const ContinueWatching = () => {
  const [watchList, setWatchList] = useState([]);
  const { language } = useLanguage();
  const [showNavigation, setShowNavigation] = useState(false);
  const [maxVisibleSlides, setMaxVisibleSlides] = useState(1);
  const swiperRef = useRef(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("continueWatching") || "[]");
    setWatchList(data);
  }, []);
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      setMaxVisibleSlides(swiper.params.slidesPerView);
      setShowNavigation(watchList.length > swiper.params.slidesPerView);
    }
  }, [watchList]);
  const updateSlidesCount = (swiper) => {
    if (swiper) {
      setMaxVisibleSlides(swiper.params.slidesPerView);
      setShowNavigation(watchList.length > swiper.params.slidesPerView);
    }
  };

  const removeFromWatchList = (episodeId) => {
    const updatedList = watchList.filter(
      (item) => item.episodeId !== episodeId
    );
    setWatchList(updatedList);
    localStorage.setItem("continueWatching", JSON.stringify(updatedList));

    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;
      setShowNavigation(updatedList.length > swiper.params.slidesPerView);
    }
  };

  if (watchList.length === 0) return null;

  return (
    <div className="mt-6 max-[1200px]:px-6 max-md:px-0">
      <h1 className="text-[#ffbade] flex items-center gap-x-2 text-2xl font-bold max-md:pl-4">
        <FaHistory /> Continue Watching
      </h1>
      <div className="relative mx-auto overflow-hidden z-[1] mt-6">
        <Swiper
          ref={swiperRef}
          className="w-full h-full"
          spaceBetween={15}
          freeMode={true}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 }, // Extra small screens
            480: { slidesPerView: 2, spaceBetween: 12 }, // Small phones
            640: { slidesPerView: 3, spaceBetween: 15 }, // Tablets
            768: { slidesPerView: 4, spaceBetween: 15 }, // Small laptops
            1024: { slidesPerView: 5, spaceBetween: 15 }, // Desktops
            1300: { slidesPerView: 6, spaceBetween: 15 }, // Larger screens
            1600: { slidesPerView: 7, spaceBetween: 20 }, // Extra large screens
          }}
          modules={[Pagination, Navigation]}
          navigation={
            showNavigation
              ? { nextEl: ".btn-next", prevEl: ".btn-prev" }
              : false
          }
          onInit={updateSlidesCount}
          onResize={updateSlidesCount}
        >
          {watchList.map((item, index) => (
            <SwiperSlide
              key={index}
              className="text-center flex justify-center items-center"
              style={{ minWidth: "120px", maxWidth: "200px" }}
            >
              <div className="w-full h-auto pb-[140%] relative inline-block overflow-hidden">
                {/* Remove Button (Cross Icon) */}
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
                  />
                </Link>
                <div
                  className="absolute bottom-0 left-0 flex flex-col gap-y-2 right-0 p-2"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 70%,rgba(0, 0, 0, 0.4) 90%, transparent 100%)",
                  }}
                >
                  <p className="text-white text-md font-bold text-left truncate">
                    {language === "EN"
                      ? item.animeInfo?.title
                      : item.animeInfo?.japanese_title}
                  </p>
                  <p className="text-gray-300 text-sm font-semibold text-left">
                    Episode {item.episodeNum}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {showNavigation && (
          <div className="absolute top-0 right-0 bottom-0 w-[45px] flex flex-col space-y-2 max-[759px]:hidden">
            <div className="btn-next bg-[#383747] h-[50%] flex justify-center items-center rounded-[8px] cursor-pointer transition-all duration-300 ease-out hover:bg-[#ffbade] hover:text-[#383747]">
              <FaChevronRight />
            </div>
            <div className="btn-prev bg-[#383747] h-[50%] flex justify-center items-center rounded-[8px] cursor-pointer transition-all duration-300 ease-out hover:bg-[#ffbade] hover:text-[#383747]">
              <FaChevronLeft />
            </div>
          </div>
        )}
        {/* {showNavigation && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full z-20 animate-bounce transition-opacity duration-500">
            <FaChevronRight size={20} />
          </div>
        )}*/}
      </div>
    </div>
  );
};

export default ContinueWatching;
