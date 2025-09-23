"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RegisterSchema } from "@/lib/validations";

function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setValidationErrors({});

    // Client-side validation
    const validation = RegisterSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // If registering for a specific event, create registration
        if (eventId) {
          const registrationResponse = await fetch("/api/registrations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ eventId }),
          });

          if (registrationResponse.ok) {
            router.push("/meus-eventos");
          } else {
            router.push("/");
          }
        } else {
          router.push("/");
        }
        // Trigger auth state change event
        window.dispatchEvent(new Event("authChange"));
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao criar conta");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className="flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8"
      style={{ height: "calc(100vh - 70px)" }}
    >
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Crie sua conta
            </h2>
            {eventId && (
              <p className="mt-2 text-center text-sm text-blue-600">
                Para se inscrever no evento, crie sua conta primeiro
              </p>
            )}
            <p className="mt-2 text-center text-sm text-gray-600">
              Ou{" "}
              <Link
                href={`/login${eventId ? `?eventId=${eventId}` : ""}`}
                className="font-medium text-violet-600 hover:text-violet-500"
              >
                faça login se já tem uma conta
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-violet-500 focus:border-violet-500 ${
                    validationErrors.name ? "border-red-300" : "border-gray-300"
                  }`}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-violet-500 focus:border-violet-500 ${
                    validationErrors.email
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-violet-500 focus:border-violet-500 ${
                    validationErrors.password
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                />
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {validationErrors.password}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Mínimo de 8 caracteres, 1 número e 1 caractere especial
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8"
          style={{ height: "calc(100vh - 70px)" }}
        >
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-gray-200 p-8 flex items-center justify-center">
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
