"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  variant?: "default" | "destructive";
  alertMessage?: string;
  alertType?: "warning" | "error" | "info";
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false,
  variant = "destructive",
  alertMessage,
  alertType = "warning",
}: ConfirmDialogProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  // Definir as cores do alerta com base no tipo
  const alertColors = {
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      icon: "text-amber-500",
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      icon: "text-red-500",
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      icon: "text-blue-500",
    },
  };

  const alertStyle = alertColors[alertType];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border shadow-md">
        <DialogHeader>
          <DialogTitle className="text-center">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center sm:text-left">
            <p className="text-lg font-medium mb-2">{description}</p>

            {alertMessage && (
              <div
                className={`mt-4 p-3 ${alertStyle.bg} border ${alertStyle.border} rounded-md`}
              >
                <div className="flex items-start">
                  <AlertCircle
                    className={`h-5 w-5 ${alertStyle.icon} mr-2 mt-0.5`}
                  />
                  <p className={`text-sm ${alertStyle.text}`}>{alertMessage}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="sm:w-auto w-full"
            >
              {cancelText}
            </Button>
            <Button
              variant={variant}
              onClick={onConfirm}
              className={`sm:w-auto w-full ${
                variant === "destructive"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : variant === "default"
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-0 border-r-0 rounded-full"></span>
                  Processando...
                </span>
              ) : (
                confirmText
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
