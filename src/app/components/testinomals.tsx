import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export const Testimonials: React.FC = () => {
  return (
    <section className="w-full py-16 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-teal-600 mb-12">
          What Our Users Say
        </h2>

        <Carousel
          className="w-full max-w-3xl mx-auto"
          opts={{
            loop: true, // Enable infinite loop
          }}
        >
          <CarouselContent>
            {/* Testimonial 1 */}
            <CarouselItem>
              <div className="p-6">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 h-64">
                    <div className="flex flex-col items-center">
                      <Image
                        src="/doc1.webp"
                        alt="Dr. John Doe"
                        className="w-24 h-24 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-semibold text-teal-600 mb-4">
                        Dr. John Doe
                      </h3>
                      <p className="text-gray-700 mb-4">
                        This platform has helped me identify PTSD symptoms more
                        accurately, leading to better treatment plans for my
                        patients.
                      </p>
                      <p className="text-gray-500">Psychiatrist</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>

            {/* Testimonial 2 */}
            <CarouselItem>
              <div className="p-6">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 h-64">
                    <div className="flex flex-col items-center">
                      <Image
                        src="doc2.jpg"
                        alt="Dr. Jane Smith"
                        className="w-24 h-24 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-semibold text-teal-600 mb-4">
                        Dr. Jane Smith
                      </h3>
                      <p className="text-gray-700 mb-4">
                        The AI technology is a game-changer, providing valuable
                        insights to improve patient outcomes.
                      </p>
                      <p className="text-gray-500">Clinical Psychologist</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>

            {/* Testimonial 3 */}
            <CarouselItem>
              <div className="p-6">
                <Card>
                  <CardContent className="flex flex-col items-center justify-center p-6 h-64">
                    <div className="flex flex-col items-center">
                      <Image
                        src="doc3.jpg"
                        alt="Dr. Sarah Lee"
                        className="w-24 h-24 rounded-full mb-4"
                      />
                      <h3 className="text-xl font-semibold text-teal-600 mb-4">
                        Dr. Sarah Lee
                      </h3>
                      <p className="text-gray-700 mb-4">
                        A reliable and secure platform for analyzing PTSD
                        symptoms and improving patient care.
                      </p>
                      <p className="text-gray-500">Therapist</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default Testimonials;
