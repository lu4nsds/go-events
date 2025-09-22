"use client";

import { useEffect, useState } from "react";
import { Registration } from "@/types";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  CreditCard,
  QrCode,
  CheckCircle,
  AlertCircle,
  Ticket,
  ArrowRight,
  Download,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { classNames } from "@/lib/design-tokens";
import { toast } from "sonner";

export default function MeusEventosPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingPayment, setProcessingPayment] = useState<string | null>(
    null
  );

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
        toast.error("Erro ao carregar seus eventos");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Erro ao carregar eventos");
      toast.error("Erro ao carregar seus eventos");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (registrationId: string) => {
    setProcessingPayment(registrationId);
    try {
      const response = await fetch("/api/payments/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ registrationId }),
      });

      if (response.ok) {
        toast.success(
          "Pagamento confirmado! Seu QR Code de entrada foi gerado.",
          {
            description: "Verifique seu email para mais detalhes.",
          }
        );
        fetchRegistrations(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao processar pagamento");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao processar pagamento");
    } finally {
      setProcessingPayment(null);
    }
  };

  const copyQrCodeToClipboard = async (qrCode: string) => {
    try {
      await navigator.clipboard.writeText(qrCode);
      toast.success("QR Code copiado para a área de transferência!");
    } catch {
      toast.error("Erro ao copiar QR Code");
    }
  };

  const downloadQrCode = (qrCode: string, eventTitle: string) => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `qr-code-${eventTitle.replace(/\s+/g, "-").toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code baixado com sucesso!");
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

  const QrCodeModal = ({
    qrCode,
    eventTitle,
    isPaid,
  }: {
    qrCode: string;
    eventTitle: string;
    isPaid: boolean;
  }) => (
    <DialogContent className="max-w-md bg-white">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-violet-600" />
          {isPaid ? "QR Code de Entrada" : "QR Code PIX"}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
            <Image
              src={qrCode}
              alt={isPaid ? "QR Code de Entrada" : "QR Code PIX"}
              width={200}
              height={200}
              className="w-48 h-48"
            />
          </div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            {isPaid
              ? "Apresente este QR Code na entrada do evento"
              : "Use este QR Code para fazer o pagamento via PIX"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => copyQrCodeToClipboard(qrCode)}
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copiar
          </Button>
          <Button
            variant="outline"
            onClick={() => downloadQrCode(qrCode, eventTitle)}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  if (loading) {
    return (
      <div className={classNames.container.xl}>
        <div className="py-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-48">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classNames.container.xl}>
        <div className="py-8">
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

  const pendingRegistrations = registrations.filter(
    (reg) => reg.status === "pending"
  );
  const paidRegistrations = registrations.filter(
    (reg) => reg.status === "paid"
  );

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className={classNames.container.xl}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Meus Eventos
          </h1>
          <p className="text-gray-600">
            Gerencie suas inscrições e acesse seus QR Codes de entrada
          </p>
        </div>

        {registrations.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <Ticket className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum evento encontrado
                </h3>
                <p className="text-gray-500 mb-6">
                  Você ainda não se inscreveu em nenhum evento. Descubra eventos
                  incríveis para participar!
                </p>
                <Button asChild className="rounded-full">
                  <Link href="/">
                    Descobrir Eventos
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Pending Payments Section */}
            {pendingRegistrations.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Aguardando Pagamento
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-amber-50 text-amber-700"
                  >
                    {pendingRegistrations.length}
                  </Badge>
                </div>

                <div className="grid gap-6">
                  {pendingRegistrations.map((registration) => (
                    <Card
                      key={registration.id}
                      className="border-amber-200 bg-amber-50/50"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Event Image */}
                          <div className="flex-shrink-0">
                            <div className="w-full lg:w-40 h-32 lg:h-28 relative overflow-hidden rounded-xl">
                              {registration.event?.imageUrl && (
                                <Image
                                  src={registration.event.imageUrl}
                                  alt={registration.event.title || ""}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {registration.event?.title}
                              </h3>
                              <p className="text-gray-600 line-clamp-2">
                                {registration.event?.description}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              {registration.event?.date && (
                                <>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {formatDate(registration.event.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                      {formatTime(registration.event.date)}
                                    </span>
                                  </div>
                                </>
                              )}
                              {registration.event?.price && (
                                <div className="flex items-center gap-1">
                                  <CreditCard className="w-4 h-4" />
                                  <span className="font-medium text-gray-900">
                                    {formatPrice(registration.event.price)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                            <Badge
                              variant="outline"
                              className="border-amber-300 text-amber-700 bg-amber-100"
                            >
                              Pagamento Pendente
                            </Badge>

                            <div className="flex gap-2 w-full lg:w-auto">
                              {registration.qrCode && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                      <QrCode className="w-4 h-4 mr-2" />
                                      PIX
                                    </Button>
                                  </DialogTrigger>
                                  <QrCodeModal
                                    qrCode={registration.qrCode}
                                    eventTitle={registration.event?.title || ""}
                                    isPaid={false}
                                  />
                                </Dialog>
                              )}

                              <Button
                                onClick={() => handlePayment(registration.id)}
                                disabled={processingPayment === registration.id}
                                size="sm"
                                className="flex-1 lg:flex-none"
                              >
                                {processingPayment === registration.id ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processando...
                                  </div>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Confirmar Pagamento
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Confirmed Events Section */}
            {paidRegistrations.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Eventos Confirmados
                  </h2>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-50 text-emerald-700"
                  >
                    {paidRegistrations.length}
                  </Badge>
                </div>

                <div className="grid gap-6">
                  {paidRegistrations.map((registration) => (
                    <Card
                      key={registration.id}
                      className="border-emerald-200 bg-emerald-50/50"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Event Image */}
                          <div className="flex-shrink-0">
                            <div className="w-full lg:w-40 h-32 lg:h-28 relative overflow-hidden rounded-xl">
                              {registration.event?.imageUrl && (
                                <Image
                                  src={registration.event.imageUrl}
                                  alt={registration.event.title || ""}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                          </div>

                          {/* Event Details */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {registration.event?.title}
                              </h3>
                              <p className="text-gray-600 line-clamp-2">
                                {registration.event?.description}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              {registration.event?.date && (
                                <>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {formatDate(registration.event.date)}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>
                                      {formatTime(registration.event.date)}
                                    </span>
                                  </div>
                                </>
                              )}
                              {registration.event?.price && (
                                <div className="flex items-center gap-1">
                                  <CreditCard className="w-4 h-4" />
                                  <span className="font-medium text-gray-900">
                                    {formatPrice(registration.event.price)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col items-end gap-3 lg:min-w-[200px]">
                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
                              ✓ Confirmado
                            </Badge>

                            {registration.qrCode && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full lg:w-auto"
                                  >
                                    <QrCode className="w-4 h-4 mr-2" />
                                    QR Code de Entrada
                                  </Button>
                                </DialogTrigger>
                                <QrCodeModal
                                  qrCode={registration.qrCode}
                                  eventTitle={registration.event?.title || ""}
                                  isPaid={true}
                                />
                              </Dialog>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
