"use client";

import { useEffect, useState } from "react";
import { Registration } from "@/types";
import Link from "next/link";

export default function MeusEventosPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch("/api/registrations");
      if (response.ok) {
        const data = await response.json();
        setRegistrations(data);
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

  const handlePayment = async (registrationId: string) => {
    try {
      const response = await fetch("/api/payments/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registrationId }),
      });

      if (response.ok) {
        alert("Pagamento simulado com sucesso! Verifique seu email.");
        fetchRegistrations(); // Refresh the list
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao processar pagamento");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Erro ao processar pagamento");
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

  const paidRegistrations = registrations.filter(
    (reg) => reg.status === "paid"
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Eventos</h1>

      {registrations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            <p>Você ainda não se inscreveu em nenhum evento.</p>
            <p className="mt-2">
              <Link href="/" className="text-blue-600 hover:text-blue-500">
                Descubra eventos incríveis
              </Link>
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Payments */}
          {registrations.filter((reg) => reg.status === "pending").length >
            0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Aguardando Pagamento
              </h2>
              <div className="grid gap-4">
                {registrations
                  .filter((reg) => reg.status === "pending")
                  .map((registration) => (
                    <div
                      key={registration.id}
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {registration.event?.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {registration.event?.description}
                          </p>
                          <div className="mt-2 text-sm text-gray-500">
                            <p>
                              Data:{" "}
                              {registration.event?.date &&
                                formatDate(registration.event.date)}
                            </p>
                            <p>
                              Preço:{" "}
                              {registration.event?.price &&
                                formatPrice(registration.event.price)}
                            </p>
                          </div>
                        </div>
                        <div className="ml-4 flex flex-col items-end space-y-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pendente
                          </span>
                          <button
                            onClick={() => handlePayment(registration.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                          >
                            Simular Pagamento
                          </button>
                        </div>
                      </div>

                      {registration.qrCode && (
                        <div className="mt-4 p-4 bg-white rounded border">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            QR Code PIX:
                          </p>
                          <img
                            src={registration.qrCode}
                            alt="QR Code PIX"
                            className="w-32 h-32"
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Paid Events */}
          {paidRegistrations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Eventos Confirmados
              </h2>
              <div className="grid gap-4">
                {paidRegistrations.map((registration) => (
                  <div
                    key={registration.id}
                    className="bg-green-50 border border-green-200 rounded-lg p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {registration.event?.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {registration.event?.description}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          <p>
                            Data:{" "}
                            {registration.event?.date &&
                              formatDate(registration.event.date)}
                          </p>
                          <p>
                            Preço:{" "}
                            {registration.event?.price &&
                              formatPrice(registration.event.price)}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Confirmado
                      </span>
                    </div>

                    {registration.qrCode && (
                      <div className="mt-4 p-4 bg-white rounded border">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          QR Code de Entrada:
                        </p>
                        <img
                          src={registration.qrCode}
                          alt="QR Code de Entrada"
                          className="w-32 h-32"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                          Apresente este QR Code na entrada do evento
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
