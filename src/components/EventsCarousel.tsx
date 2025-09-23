"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, Clock, DollarSign, Users, MapPin } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EventsCarouselProps {
  events: Event[];
}

export function EventsCarousel({ events }: EventsCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleParticipate = async (eventId: string) => {
    setLoading(eventId);
    try {
      // Check if user is logged in by trying to create registration
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (response.status === 401) {
        // User not logged in, redirect to login with eventId
        toast.info("Faça login para se inscrever no evento");
        router.push(`/login?eventId=${eventId}`);
        return;
      }

      if (response.ok) {
        toast.success("Inscrição realizada com sucesso!");
        // Redirect to user's events page to see the QR code
        router.push("/meus-eventos");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao se inscrever no evento");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao se inscrever no evento");
    } finally {
      setLoading(null);
    }
  };

  if (events.length === 0) {
    return null;
  }

  // Calculate slides per view based on number of events
  const getSlidesPerView = () => {
    if (events.length === 1) return 1;
    if (events.length === 2) return 1;
    if (events.length === 3) return 2; // Show 2 events at a time, allowing navigation to the 3rd
    return 3; // For 4+ events, show 3 at a time
  };

  // Get current event for displaying info below
  const getCurrentEvent = () => {
    return events[currentSlide] || events[0];
  };

  const currentEvent = getCurrentEvent();

  // Calculate max width based on number of events
  const getMaxWidth = () => {
    if (events.length === 1) return "max-w-lg"; // Smaller for 1 event
    if (events.length === 2) return "max-w-2xl"; // Larger for 2 events
    if (events.length === 3) return "max-w-5xl"; // Larger for 3 events
    return "max-w-full"; // Full width for 4+ events
  };

  return (
    <div className={`w-full px-10 mx-auto ${getMaxWidth()}`}>
      {/* Image Carousel */}
      <div className="relative">
        <Swiper
          onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
          spaceBetween={30}
          slidesPerView={getSlidesPerView()}
          centeredSlides={events.length <= 2}
          loop={events.length > 1}
          autoplay={
            events.length > 1
              ? {
                  delay: 3000,
                  disableOnInteraction: false,
                }
              : false
          }
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation, Autoplay]}
          className="events-carousel"
          breakpoints={{
            320: {
              slidesPerView: 1, // Mobile always 1
              spaceBetween: 20,
            },
            768: {
              slidesPerView: events.length === 3 ? 2 : 1, // Tablet shows 2 for 3 events, 1 for others
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: getSlidesPerView(), // Desktop shows according to logic
              spaceBetween: 30,
            },
          }}
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/600x340/f3f4f6/6b7280?text=Imagem+Indisponível";
                  }}
                />
                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Event Information Below Carousel */}
      <div className="text-center">
        {/* Event Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6 px-4">
          {currentEvent.title}
        </h3>

        {/* Event Details */}
        <div className="flex flex-wrap justify-center gap-6 mb-6 px-4">
          {/* Distance */}
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2 text-violet-600" />
            <span className="font-medium">{currentEvent.distance}</span>
          </div>

          {/* Date */}
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-2 text-violet-600" />
            <span className="font-medium">{formatDate(currentEvent.date)}</span>
          </div>

          {/* Time */}
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2 text-violet-600" />
            <span className="font-medium">{formatTime(currentEvent.date)}</span>
          </div>

          {/* Price */}
          <div className="flex items-center text-gray-600">
            <DollarSign className="w-5 h-5 mr-2 text-violet-600" />
            <span className="text-lg text-violet-700 font-bold">
              {formatPrice(currentEvent.price)}
            </span>
          </div>

          {/* Registrations Count */}
          {currentEvent._count && (
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2 text-violet-600" />
              <span className="font-medium">
                {currentEvent._count.registrations} inscritos
              </span>
            </div>
          )}
        </div>

        {/* Participate Button */}
        <Button
          onClick={() => handleParticipate(currentEvent.id)}
          disabled={loading === currentEvent.id}
          className="rounded-full font-medium bg-violet-600 hover:bg-violet-700 text-white shadow-sm hover:shadow-md transition-all duration-200 px-12 py-4 text-lg"
          size="lg"
        >
          {loading === currentEvent.id ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Inscrevendo...
            </div>
          ) : (
            "Participar"
          )}
        </Button>
      </div>

      {/* Custom Styles for Swiper */}
      <style jsx global>{`
        .events-carousel .swiper-slide {
          height: auto;
        }

        /* Pagination Styles */
        .events-carousel .swiper-pagination {
          bottom: 10px !important;
          position: relative !important;
          margin-top: 20px !important;
        }

        .events-carousel .swiper-pagination-bullet {
          width: 12px !important;
          height: 12px !important;
          background: #8b5cf6 !important;
          opacity: 0.3 !important;
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
        }

        .events-carousel .swiper-pagination-bullet-active {
          opacity: 1 !important;
          transform: scale(1.3) !important;
        }

        /* Navigation arrows */
        .events-carousel .swiper-button-next,
        .events-carousel .swiper-button-prev {
          color: #8b5cf6 !important;
          background: white !important;
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          transition: all 0.3s ease !important;
          margin-top: 0 !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
        }

        .events-carousel .swiper-button-next:hover,
        .events-carousel .swiper-button-prev:hover {
          background: #8b5cf6 !important;
          color: white !important;
          transform: translateY(-50%) scale(1.1) !important;
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3) !important;
        }

        /* Smaller arrow icons */
        .events-carousel .swiper-button-next::after,
        .events-carousel .swiper-button-prev::after {
          font-size: 10px !important;
          font-weight: bold !important;
        }

        /* Target the specific navigation icon class */
        .events-carousel .swiper-navigation-icon {
          width: 20px !important;
          height: 20px !important;
        }

        .events-carousel .swiper-button-next {
          right: 10px !important;
        }

        .events-carousel .swiper-button-prev {
          left: 10px !important;
        }

        /* Responsive adjustments */
        @media (max-width: 1023px) {
          .events-carousel .swiper-button-next,
          .events-carousel .swiper-button-prev {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .events-carousel {
            padding: 15px 0 30px 0;
          }

          .events-carousel .swiper-pagination {
            margin-top: 15px !important;
          }
        }
      `}</style>
    </div>
  );
}
