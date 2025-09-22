"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, Users } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types";
import { classNames } from "@/lib/design-tokens";
import { toast } from "sonner";

interface FeaturedCarouselProps {
  events: Event[];
}

export function FeaturedCarousel({ events }: FeaturedCarouselProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  // Create infinite loop effect by duplicating events
  const extendedEvents =
    events.length > 1 ? [...events, ...events, ...events] : events;
  const centerIndex = events.length > 1 ? events.length : 0; // Start at center set

  useEffect(() => {
    if (!api) {
      return;
    }

    // Set initial position to center
    if (events.length > 1) {
      api.scrollTo(centerIndex, false);
    }

    setCurrent(api.selectedScrollSnap());

    const handleSelect = () => {
      const selected = api.selectedScrollSnap();
      setCurrent(selected);

      // Infinite loop logic
      if (events.length > 1) {
        if (selected === 0) {
          // If at the beginning, jump to the center set
          setTimeout(() => api.scrollTo(events.length, false), 50);
        } else if (selected === extendedEvents.length - 1) {
          // If at the end, jump to the center set
          setTimeout(() => api.scrollTo(events.length - 1, false), 50);
        }
      }
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api, events.length, extendedEvents.length, centerIndex]);

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

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="relative px-4 md:px-8 lg:px-16">
      <Carousel
        opts={{
          align: "center",
          loop: false, // We handle infinite loop manually
          startIndex: centerIndex,
          skipSnaps: false,
          dragFree: false,
        }}
        setApi={setApi}
        className="w-full max-w-7xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {extendedEvents.map((event, index) => {
            // Calculate which event is actually in center for styling
            const actualIndex = index % events.length;
            const isActive = actualIndex === current % events.length;

            return (
              <CarouselItem
                key={`${event.id}-${index}`}
                className={`pl-2 md:pl-4 ${
                  events.length === 1
                    ? "basis-full md:basis-2/3 lg:basis-1/2"
                    : "md:basis-1/2 lg:basis-1/3"
                }`}
              >
                <div
                  className={`${classNames.card.base} group cursor-pointer h-full transition-all duration-300 relative rounded-xl overflow-hidden`}
                >
                  {/* Overlay for non-active slides */}
                  {!isActive && events.length > 1 && (
                    <div className="absolute inset-0 bg-black/20 z-10 rounded-xl transition-opacity duration-300" />
                  )}
                  {/* Image */}
                  <div className="relative aspect-[16/9] overflow-hidden rounded-t-xl">
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x225/f3f4f6/6b7280?text=Imagem+Indisponível";
                      }}
                    />

                    {/* Price badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 text-violet-700 font-semibold text-sm px-3 py-1">
                        {formatPrice(event.price)}
                      </Badge>
                    </div>

                    {/* Date badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/95 rounded-lg p-2 text-center min-w-[3rem]">
                        <div className="text-xs font-medium text-gray-600 uppercase">
                          {formatDate(event.date).split(" ")[1]}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          {formatDate(event.date).split(" ")[0]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                        {event.description}
                      </p>

                      {/* Meta information */}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span>
                            {formatDate(event.date)} às {formatTime(event.date)}
                          </span>
                        </div>

                        {event._count && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{event._count.registrations} inscritos</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleParticipate(event.id)}
                      disabled={loading === event.id}
                      className="w-full rounded-full font-medium bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                    >
                      {loading === event.id ? "Inscrevendo..." : "Participar"}
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex -left-4 bg-white/90 border-gray-200 hover:bg-white hover:border-violet-300 text-gray-700" />
        <CarouselNext className="hidden md:flex -right-4 bg-white/90 border-gray-200 hover:bg-white hover:border-violet-300 text-gray-700" />
      </Carousel>

      {/* Mobile swipe indicator */}
      {events.length > 1 && (
        <div className="flex justify-center mt-4 md:hidden">
          <div className="flex space-x-2">
            {events.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === current % events.length
                    ? "bg-violet-600"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
