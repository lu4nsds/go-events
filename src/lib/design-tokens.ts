/**
 * Design System Tokens for go-events
 * Centralized configuration for consistent UI
 */

export const tokens = {
  // Color palette
  colors: {
    primary: "#5b21b6", // violet-600
    primaryHover: "#4c1d95", // violet-700
    secondary: "#f3f4f6", // gray-100
    accent: "#6366f1", // indigo-500
    background: "#ffffff",
    foreground: "#1f2937", // gray-800
    muted: "#6b7280", // gray-500
    mutedForeground: "#9ca3af", // gray-400
    border: "#e5e7eb", // gray-200
    destructive: "#ef4444", // red-500
    success: "#10b981", // emerald-500
    warning: "#f59e0b", // amber-500
    info: "#3b82f6", // blue-500
  },

  // Spacing scale
  spacing: {
    xs: "0.5rem", // 8px
    sm: "0.75rem", // 12px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
  },

  // Border radius
  radius: {
    sm: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "2rem", // 32px
    full: "9999px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  // Typography
  typography: {
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: "1.25",
      normal: "1.5",
      relaxed: "1.625",
    },
  },

  // Transitions
  transitions: {
    default: "all 200ms ease-in-out",
    slow: "all 300ms ease-in-out",
    fast: "all 150ms ease-in-out",
  },

  // Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    toast: 9999,
    tooltip: 1070,
  },
} as const;

// CSS class utilities for common patterns
export const classNames = {
  // Card patterns
  card: {
    base: "bg-white rounded-2xl shadow-md overflow-hidden",
    hover: "transform transition-all duration-200 hover:scale-105 motion-safe:transition-transform",
    interactive: "bg-white rounded-2xl shadow-md overflow-hidden transform transition-all duration-200 hover:scale-105 motion-safe:transition-transform cursor-pointer",
  },

  // Button patterns
  button: {
    primary: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-600 text-white shadow-sm hover:bg-violet-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500",
    secondary: "inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500",
    ghost: "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500",
  },

  // Input patterns
  input: {
    base: "w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors duration-200",
    error: "w-full px-4 py-3 rounded-lg border border-red-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors duration-200",
  },

  // Layout patterns
  container: {
    sm: "max-w-sm mx-auto px-4",
    md: "max-w-4xl mx-auto px-4",
    lg: "max-w-6xl mx-auto px-4",
    xl: "max-w-7xl mx-auto px-4",
  },

  // Grid patterns
  grid: {
    responsive: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    form: "grid grid-cols-1 md:grid-cols-2 gap-4",
  },

  // Badge patterns
  badge: {
    primary: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-600",
    success: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600",
    warning: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-600",
    error: "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600",
  },
} as const;

// Animation utilities
export const animations = {
  fadeIn: "animate-in fade-in duration-200",
  slideIn: "animate-in slide-in-from-bottom-2 duration-200",
  scaleIn: "animate-in zoom-in duration-200",
  fadeOut: "animate-out fade-out duration-150",
  slideOut: "animate-out slide-out-to-bottom-2 duration-150",
  scaleOut: "animate-out zoom-out duration-150",
} as const;

export type Tokens = typeof tokens;
export type ClassNames = typeof classNames;
export type Animations = typeof animations;