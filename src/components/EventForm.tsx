"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Event } from "@/types";
import {
  Upload,
  ImageIcon,
  Calendar,
  DollarSign,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { classNames } from "@/lib/design-tokens";
import { toast } from "sonner";

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
  const [imagePreviewError, setImagePreviewError] = useState(false);

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
        toast.success(
          event
            ? "Evento atualizado com sucesso!"
            : "Evento criado com sucesso!",
          {
            description: event
              ? "As alterações foram salvas e já estão visíveis na plataforma."
              : "O novo evento está disponível para inscrições.",
          }
        );
        onClose();
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao salvar evento");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao salvar evento");
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

    // Reset image preview error when URL changes
    if (name === "imageUrl") {
      setImagePreviewError(false);
    }
  };

  const handleImageError = () => {
    setImagePreviewError(true);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title and Description */}
        <div className={classNames.grid.form}>
          <div className="md:col-span-2">
            <Label htmlFor="title" className="text-base font-medium">
              Título do Evento
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Ex: Workshop de React para Iniciantes"
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-base font-medium">
            Descrição
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Descreva os detalhes do seu evento, o que os participantes irão aprender ou experienciar..."
            className="mt-2 resize-none"
          />
        </div>

        {/* Image URL and Preview */}
        <div>
          <Label htmlFor="imageUrl" className="text-base font-medium">
            URL da Imagem de Capa
          </Label>
          <div className="mt-2 space-y-4">
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              required
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem-do-evento.jpg"
            />

            {/* Image Preview */}
            {formData.imageUrl && (
              <Card className="border-dashed">
                <CardContent className="p-4">
                  <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Preview da Imagem
                  </div>

                  {imagePreviewError ? (
                    <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Não foi possível carregar a imagem
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Verifique se a URL está correta
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[16/9] overflow-hidden rounded-lg border">
                      <Image
                        src={formData.imageUrl}
                        alt="Preview do evento"
                        fill
                        className="object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Date/Time and Price */}
        <div className={classNames.grid.form}>
          <div>
            <Label htmlFor="date" className="text-base font-medium">
              Data e Hora
            </Label>
            <div className="relative mt-2">
              <Input
                id="date"
                name="date"
                type="datetime-local"
                required
                value={formData.date}
                onChange={handleChange}
              />
              <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <Label htmlFor="price" className="text-base font-medium">
              Preço (R$)
            </Label>
            <div className="relative mt-2">
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                value={formData.price}
                onChange={handleChange}
                placeholder="0,00"
              />
              <DollarSign className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="sm:order-1"
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="sm:order-2 sm:ml-auto"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {event ? "Atualizando..." : "Criando..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {event ? (
                  <>
                    <FileText className="w-4 h-4" />
                    Atualizar Evento
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Criar Evento
                  </>
                )}
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
