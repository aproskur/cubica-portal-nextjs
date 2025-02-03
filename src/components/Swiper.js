"use client";

import { useState } from "react";
import { Swiper as SwiperReact, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

const Swiper = ({ images = [] }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            {images.length > 0 ? (
                <>
                    {/* Main Swiper (Big Image) */}
                    <SwiperReact
                        modules={[Navigation, Pagination, Thumbs]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        loop={true}
                        thumbs={{ swiper: thumbsSwiper }} // Ensure correct linking to thumbnails
                        style={{ marginBottom: "10px" }}
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index} style={{ display: "flex", justifyContent: "center" }}>
                                <img
                                    src={image}
                                    alt={`Slide ${index + 1}`}
                                    style={{
                                        width: "100%",
                                        height: "300px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </SwiperReact>

                    {/* Thumbnail Swiper */}
                    <SwiperReact
                        onSwiper={setThumbsSwiper} // Fix: Properly assigns the Swiper instance
                        modules={[Thumbs, FreeMode]}
                        spaceBetween={10}
                        slidesPerView={images.length < 5 ? images.length : 5}
                        watchSlidesProgress // Ensures the active thumbnail updates
                        freeMode // Allows smooth scrolling and clicking thumbnails
                        slideToClickedSlide // Enables clicking on thumbnails to change the main image
                        watchOverflow // Prevents issues when images are fewer than slidesPerView
                        style={{ cursor: "pointer" }}
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index} style={{ cursor: "pointer" }}>
                                <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    style={{
                                        width: "100px",
                                        height: "70px",
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                        border: "2px solid transparent",
                                        cursor: "pointer",
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </SwiperReact>
                </>
            ) : (
                <p>No images available</p>
            )}
        </div>
    );
};

export default Swiper;
