"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { classNames } from "@/lib/design-tokens";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();

    // Listen for storage events (useful for sync across tabs)
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);

    // Listen for custom events
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      // Trigger auth state change event
      window.dispatchEvent(new Event("authChange"));
      toast.success("Logout realizado com sucesso!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const NavLinks = ({ mobile = false, onLinkClick = () => {} }) => (
    <>
      <Link
        href="/"
        className={`text-gray-700 hover:text-violet-600 transition-colors duration-200 ${
          mobile ? "block py-3 px-4 text-lg" : ""
        }`}
        onClick={onLinkClick}
      >
        Eventos
      </Link>

      {user && (
        <>
          <Link
            href="/meus-eventos"
            className={`text-gray-700 hover:text-violet-600 transition-colors duration-200 ${
              mobile ? "block py-3 px-4 text-lg" : ""
            }`}
            onClick={onLinkClick}
          >
            Meus Eventos
          </Link>

          {user.isAdmin && (
            <Link
              href="/admin/events"
              className={`text-gray-700 hover:text-violet-600 transition-colors duration-200 ${
                mobile ? "block py-3 px-4 text-lg" : ""
              }`}
              onClick={onLinkClick}
            >
              <Settings className="inline-block w-4 h-4 mr-2" />
              Admin
            </Link>
          )}
        </>
      )}
    </>
  );

  if (loading) {
    return (
      <nav className="sticky top-0 bg-white shadow-sm z-50 border-b border-gray-100">
        <div className={classNames.container.xl}>
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Go Events
              </div>
            </div>
            <div className="animate-pulse">
              <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 bg-white shadow-sm z-50 border-b border-gray-100">
      <div className={classNames.container.xl}>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hover:from-violet-700 hover:to-indigo-700 transition-all duration-200"
            >
              Go Events
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-violet-100 text-violet-700 text-sm font-medium">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-700 font-medium">
                    Olá, {user.name.split(" ")[0]}
                  </span>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <Link href="/register">Cadastrar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      Go Events
                    </div>
                    <DrawerClose asChild>
                      <Button variant="ghost" size="sm" className="p-2">
                        <X className="h-5 w-5" />
                      </Button>
                    </DrawerClose>
                  </div>

                  <div className="space-y-2">
                    <NavLinks
                      mobile
                      onLinkClick={() => setIsMobileMenuOpen(false)}
                    />
                  </div>

                  {user ? (
                    <div className="pt-6 border-t border-gray-200">
                      <div className="flex items-center space-x-3 mb-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-violet-100 text-violet-700 font-medium">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sair
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-6 border-t border-gray-200 space-y-3">
                      <Button variant="ghost" className="w-full" asChild>
                        <Link
                          href="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Login
                        </Link>
                      </Button>
                      <Button className="w-full rounded-full" asChild>
                        <Link
                          href="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Cadastrar
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </nav>
  );
}
