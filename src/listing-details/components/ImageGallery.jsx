import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

function ImageGallery({ carDetail }) {
  return (
    <div className="p-10 border rounded-xl shadow-md">
      <Carousel className="w-full">
        <CarouselContent>
          {carDetail?.images?.map((img, index) => (
            <CarouselItem key={index}>
              <img
                src={img.imageUrl}
                alt={`Car Image ${index + 1}`}
                className="w-full h-[500px] object-cover rounded-xl"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export default ImageGallery;
