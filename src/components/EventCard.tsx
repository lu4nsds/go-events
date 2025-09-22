"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/types";
import { classNames } from "@/lib/design-tokens";
import { toast } from "sonner";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleParticipate = async () => {
    setLoading(true);
    try {
      // Check if user is logged in by trying to create registration
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId: event.id }),
      });

      if (response.status === 401) {
        // User not logged in, redirect to login with eventId
        toast.info("Faça login para se inscrever no evento");
        router.push(`/login?eventId=${event.id}`);
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
      setLoading(false);
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

  const isEventToday = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    return (
      today.getDate() === eventDate.getDate() &&
      today.getMonth() === eventDate.getMonth() &&
      today.getFullYear() === eventDate.getFullYear()
    );
  };

  const isEventThisWeek = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const daysDiff = Math.ceil(
      (eventDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
    );
    return daysDiff >= 0 && daysDiff <= 7;
  };

  return (
    <Card
      className={`${classNames.card.hover} group h-full flex flex-col overflow-hidden border-0 shadow-md hover:shadow-lg rounded-xl`}
    >
      {/* Image Section */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/400x225/f3f4f6/6b7280?text=Imagem+Indisponível";
          }}
        />

        {/* Price Badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/95 text-violet-700 font-semibold text-sm px-3 py-1 shadow-sm">
            {formatPrice(event.price)}
          </Badge>
        </div>

        {/* Date Badge */}
        <div className="absolute top-3 left-3">
          <div className="bg-white/95 rounded-lg p-2 text-center min-w-[3rem] shadow-sm">
            <div className="text-xs font-medium text-gray-600 uppercase">
              {formatDate(event.date).split(" ")[1]}
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatDate(event.date).split(" ")[0]}
            </div>
          </div>
        </div>

        {/* Event Status Badges */}
        <div className="absolute bottom-3 left-3">
          {isEventToday(event.date) && (
            <Badge variant="destructive" className="text-xs font-medium">
              Hoje
            </Badge>
          )}
          {!isEventToday(event.date) && isEventThisWeek(event.date) && (
            <Badge className="bg-emerald-500 text-white text-xs font-medium">
              Esta semana
            </Badge>
          )}
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-violet-600 transition-colors duration-200">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
            {event.description}
          </p>

          {/* Meta Information */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <span>{formatDate(event.date)}</span>
            </div>

            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
              <span>{formatTime(event.date)}</span>
            </div>

            {event._count && (
              <div className="flex items-center text-xs text-gray-500">
                <Users className="w-3.5 h-3.5 mr-2 flex-shrink-0" />
                <span>{event._count.registrations} inscritos</span>
              </div>
            )}
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleParticipate}
          disabled={loading}
          className="w-full rounded-full font-medium bg-violet-600 hover:bg-violet-700 text-white shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
          size="default"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Inscrevendo...
            </div>
          ) : (
            "Participar"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
