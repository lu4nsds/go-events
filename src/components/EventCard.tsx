"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Event } from "@/types";

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
        // User not logged in, redirect to register
        router.push(`/register?eventId=${event.id}`);
        return;
      }

      if (response.ok) {
        // Redirect to event registration page or payment page
        router.push(`/evento/${event.id}/inscricao`);
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao se inscrever no evento");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erro ao se inscrever no evento");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Image
        src={event.imageUrl}
        alt={event.title}
        width={400}
        height={200}
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src =
            "https://via.placeholder.com/400x200?text=Imagem+Indisponível";
        }}
      />

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {event.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            <p>{formatDate(event.date)}</p>
            {event._count && <p>{event._count.registrations} inscritos</p>}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">
              {formatPrice(event.price)}
            </p>
          </div>
        </div>

        <button
          onClick={handleParticipate}
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Carregando..." : "Participar"}
        </button>
      </div>
    </div>
  );
}
