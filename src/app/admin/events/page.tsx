"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types";
import EventForm from "@/components/EventForm";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        setError("Erro ao carregar eventos");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId));
        alert("Evento excluído com sucesso!");
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao excluir evento");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erro ao excluir evento");
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEvent(null);
    fetchEvents();
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gerenciar Eventos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Novo Evento
        </button>
      </div>

      {showForm && <EventForm event={editingEvent} onClose={handleFormClose} />}

      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            <p>Nenhum evento criado ainda.</p>
            <p className="mt-2">
              Clique em &quot;Novo Evento&quot; para começar.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-24 h-24 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/96x96?text=Imagem+Indisponível";
                      }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{event.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-500">
                    <div>
                      <strong>Data:</strong>
                      <br />
                      {formatDate(event.date)}
                    </div>
                    <div>
                      <strong>Preço:</strong>
                      <br />
                      {formatPrice(event.price)}
                    </div>
                    <div>
                      <strong>Inscrições:</strong>
                      <br />
                      {event._count?.registrations || 0} pessoas
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
