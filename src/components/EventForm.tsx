"use client";

import { useState, useEffect } from "react";
import { Event } from "@/types";

interface EventFormProps {
  event?: Event | null;
  onClose: () => void;
}

export default function EventForm({ event, onClose }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    date: "",
    price: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        imageUrl: event.imageUrl,
        date: new Date(event.date).toISOString().slice(0, 16), // Format for datetime-local input
        price: event.price,
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const eventData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        price: Number(formData.price),
      };

      const url = event ? `/api/events/${event.id}` : "/api/events";
      const method = event ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alert(
          event
            ? "Evento atualizado com sucesso!"
            : "Evento criado com sucesso!"
        );
        onClose();
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao salvar evento");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Erro ao salvar evento");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {event ? "Editar Evento" : "Novo Evento"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Título
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700"
              >
                URL da Imagem
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                required
                value={formData.imageUrl}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-32 h-20 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/128x80?text=Erro";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium text-gray-700"
              >
                Data e Hora
              </label>
              <input
                id="date"
                name="date"
                type="datetime-local"
                required
                value={formData.date}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Preço (R$)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Salvando..." : event ? "Atualizar" : "Criar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
