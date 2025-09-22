"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Event } from "@/types";
import EventForm from "@/components/EventForm";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  AlertCircle,
  Settings,
  Ticket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { classNames } from "@/lib/design-tokens";
import { toast } from "sonner";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [error, setError] = useState("");
  const [deletingEvent, setDeletingEvent] = useState<string | null>(null);

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
        toast.error("Erro ao carregar eventos");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Erro ao carregar eventos");
      toast.error("Erro ao carregar eventos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    setDeletingEvent(eventId);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId));
        toast.success("Evento excluído com sucesso!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao excluir evento");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao excluir evento");
    } finally {
      setDeletingEvent(null);
    }
  };

  const confirmDelete = (event: Event) => {
    if (confirm(`Tem certeza que deseja excluir o evento "${event.title}"?`)) {
      handleDelete(event.id);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleNewEvent = () => {
    setEditingEvent(null);
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

  if (loading) {
    return (
      <div className="min-h-full bg-gray-50 py-8">
        <div className={classNames.container.xl}>
          <div className="animate-pulse">
            <div className="flex justify-between items-center mb-8">
              <div className="h-8 bg-gray-200 rounded w-64"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="h-48">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-full bg-gray-50 py-8">
        <div className={classNames.container.xl}>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className={classNames.container.xl}>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-violet-600" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Gerenciar Eventos
              </h1>
            </div>
            <p className="text-gray-600">
              Crie, edite e gerencie os eventos da plataforma
            </p>
          </div>

          <Button onClick={handleNewEvent} className="rounded-full font-medium">
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Event Form Dialog */}
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>
                {editingEvent ? "Editar Evento" : "Novo Evento"}
              </DialogTitle>
            </DialogHeader>
            <EventForm event={editingEvent} onClose={handleFormClose} />
          </DialogContent>
        </Dialog>

        {/* Events List */}
        {events.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Ticket className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum evento criado
                </h3>
                <p className="text-gray-500 mb-6">
                  Comece criando seu primeiro evento para aparecer na
                  plataforma.
                </p>
                <Button onClick={handleNewEvent} className="rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Evento
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Event Image */}
                    <div className="flex-shrink-0">
                      <div className="w-full lg:w-40 h-32 lg:h-28 relative overflow-hidden rounded-xl">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/160x112/f3f4f6/6b7280?text=Imagem+Indisponível";
                          }}
                        />
                      </div>
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      {/* Meta Information */}
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4 text-violet-600" />
                          <div>
                            <div>{formatDate(event.date)}</div>
                            <div className="text-xs">
                              {formatTime(event.date)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {formatPrice(event.price)}
                            </div>
                            <div className="text-xs">Preço</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Users className="w-4 h-4 text-blue-600" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {event._count?.registrations || 0}
                            </div>
                            <div className="text-xs">Inscrições</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex lg:flex-col gap-2 lg:min-w-[120px]">
                      <Button
                        onClick={() => handleEdit(event)}
                        variant="outline"
                        size="sm"
                        className="flex-1 lg:flex-none"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>

                      <Button
                        onClick={() => confirmDelete(event)}
                        variant="outline"
                        size="sm"
                        disabled={deletingEvent === event.id}
                        className="flex-1 lg:flex-none text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        {deletingEvent === event.id ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                            Excluindo...
                          </div>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
