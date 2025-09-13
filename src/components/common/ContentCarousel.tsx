import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

interface CarouselProps {
  children: React.ReactNode[];
}

export const ContentCarousel: React.FC<CarouselProps> = ({ children }) => {
  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={16}
      slidesPerView={1.1}
      centeredSlides={true}
      pagination={{ clickable: true }}
      className="!pb-8"
    >
      {children.map((child, index) => (
        <SwiperSlide key={index}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
};
