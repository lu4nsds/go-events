"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-user-menu]")) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserMenuOpen]);

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
          mobile
            ? "flex items-center py-4 px-4 text-lg font-medium hover:bg-gray-100 rounded-md"
            : ""
        }`}
        onClick={onLinkClick}
      >
        {mobile && <Menu className="w-5 h-5 mr-3" />}
        Eventos
      </Link>

      {user && !user.isAdmin && (
        <Link
          href="/meus-eventos"
          className={`text-gray-700 hover:text-violet-600 transition-colors duration-200 ${
            mobile
              ? "flex items-center py-4 px-4 text-lg font-medium hover:bg-gray-100 rounded-md"
              : ""
          }`}
          onClick={onLinkClick}
        >
          {mobile && <User className="w-5 h-5 mr-3" />}
          Meus Eventos
        </Link>
      )}

      {user && user.isAdmin && mobile && (
        <Link
          href="/admin/events"
          className={`text-gray-700 hover:text-violet-600 transition-colors duration-200 ${
            mobile
              ? "flex items-center py-4 px-4 text-lg font-medium hover:bg-gray-100 rounded-md"
              : ""
          }`}
          onClick={onLinkClick}
        >
          <Settings className={`w-5 h-5 ${mobile ? "mr-3" : "mr-2"}`} />
          Admin
        </Link>
      )}
    </>
  );

  if (loading) {
    return (
      <nav className="sticky top-0 bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 z-50">
        <div className={classNames.container.xl}>
          <div className="flex justify-between items-center h-[70px]">
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
    <nav className="sticky top-0 z-50 bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50">
      <div className={classNames.container.xl}>
        <div className="flex justify-between items-center h-[70px]">
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
              <div className="relative" data-user-menu>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-violet-100 text-violet-700 text-sm font-medium">
                      {getUserInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-700 font-medium">
                    Olá, {user.name.split(" ")[0]}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserMenuOpen && (
                  <ul
                    role="menu"
                    className="absolute right-0 top-full mt-2 z-10 min-w-[180px] overflow-auto rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg focus:outline-none"
                  >
                    {user.isAdmin && (
                      <li role="menuitem">
                        <Link
                          href="/admin/events"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="cursor-pointer text-gray-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100"
                        >
                          <Settings className="w-5 h-5 text-gray-400" />
                          <p className="text-gray-800 font-medium ml-2">
                            Admin
                          </p>
                        </Link>
                      </li>
                    )}

                    <hr className="my-2 border-gray-200" role="menuitem" />

                    <li role="menuitem">
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="cursor-pointer text-gray-800 flex w-full text-sm items-center rounded-md p-3 transition-all hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100"
                      >
                        <LogOut className="w-5 h-5 text-gray-400" />
                        <p className="text-gray-800 font-medium ml-2">Sair</p>
                      </button>
                    </li>
                  </ul>
                )}
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
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-6 w-6 text-gray-700" />
                  <span className="sr-only">Abrir menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="left"
                className="w-[80%] max-w-sm bg-white shadow-lg border-r border-gray-200 p-0"
              >
                <SheetHeader className="p-6 border-b border-gray-100">
                  <SheetTitle>
                    <div className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                      Go Events
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full">
                  {/* Navigation Links */}
                  <div className="flex-1 py-4">
                    <nav className="space-y-1">
                      <NavLinks
                        mobile
                        onLinkClick={() => setIsMobileMenuOpen(false)}
                      />
                    </nav>
                  </div>

                  {/* User Section */}
                  <div className="border-t border-gray-100 p-6">
                    {user ? (
                      <div className="space-y-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-violet-100 text-violet-700 font-medium">
                              {getUserInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {user.email}
                            </div>
                          </div>
                        </div>

                        {/* Logout Button */}
                        <Button
                          onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sair
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Login
                          </Link>
                        </Button>

                        <Button
                          className="w-full rounded-full bg-violet-600 hover:bg-violet-700"
                          asChild
                        >
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
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
