import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import Template from "@/components/Template";

export default function UserRatingsTemplate() {
  const ratings = [
    {
      id: 1,
      firstName: "Jane",
      lastName: "Smith",
      location: "San Diego, USA",
      comment: "Deliveries are always on time and handled professionally.",
      rating: 5,
      imgSrc: "/1.jpg",
    },
    {
      id: 2,
      firstName: "John",
      lastName: "Smith",
      location: "London, United Kingdom",
      comment: "Super fast and reliable! My packages always arrive safely.",
      rating: 4,
      imgSrc: "/2.jpg",
    },
    {
      id: 3,
      firstName: "Lauren",
      lastName: "Mercer",
      location: "Paris, France",
      comment: "Highly recommended for international deliveries.",
      rating: 5,
      imgSrc: "/3.jpg",
    },
    {
      id: 4,
      firstName: "Cook",
      lastName: "Pu",
      location: "Shanghai, China",
      comment: "My packages always arrive intact and safe every time.",
      rating: 4,
      imgSrc: "/4.jpg",
    },
    {
      id: 5,
      firstName: "Lukas",
      lastName: "Reyes",
      location: "São Paulo, Brazil",
      comment: "Package always arrive on time, highly recommend service.",
      rating: 5,
      imgSrc: "/5.jpg",
    },
  ];

  return (
    <Template className="py-8">
      <div>
        <h2 className="text-3xl font-bold text-center mb-4">
          Customer Ratings
        </h2>

        <p className="text-center mb-8">
          Check out what our customers have to say about our delivery service.
        </p>

        <div className="overflow-hidden">
          <Swiper
            spaceBetween={30}
            loop
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            modules={[Autoplay]}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1000: { slidesPerView: 3 },
            }}
            className="h-[560px]">
            {ratings.map((comment) => (
              <SwiperSlide key={comment.id} className="h-full py-6 px-2">
                <div
                  className="
                    bg-white dark:bg-foreground
                    border-2 border-gray-900 dark:border-border
                    rounded-xl flex flex-col h-full
                    shadow-[0_10px_30px_-12px_rgba(0,0,0,0.35)]
                    transition-transform duration-300">
                  <div className="px-4 pt-4">
                    <div className="rounded-lg overflow-hidden border-[3px] border-red-600">
                      <img
                        src={comment.imgSrc}
                        alt={`${comment.firstName} ${comment.lastName}`}
                        className="w-full h-[250px] object-cover"
                        loading="lazy"/>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <blockquote className="relative text-lg italic leading-relaxed pl-6 mb-5 text-gray-900 dark:text-gray-100">
                      <span className="absolute left-0 top-1.5 h-[calc(100%-6px)] w-[4px] bg-red-600 rounded"/>
                      “{comment.comment}”
                    </blockquote>

                    <div className="flex items-center gap-1 mt-1 mb-3">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const filled = index < comment.rating;
                        return (
                          <span
                            key={index}
                            className={`text-2xl ${
                              filled
                                ? "text-yellow-400"
                                : "text-gray-600 dark:text-gray-300"
                            }`}>
                            ★
                          </span>
                        );
                      })}
                    </div>

                    <div className="mt-0.5">
                      <h3 className="text-3xl font-bold leading-tight mt-1 text-gray-900 dark:text-gray-100">
                        {comment.firstName} {comment.lastName}
                      </h3>

                      <p className="mt-0.5 text-base text-gray-900 dark:text-gray-100">
                        {comment.location}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </Template>
  );
}