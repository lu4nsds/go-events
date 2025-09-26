export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum Permission {
  // Event permissions
  VIEW_EVENTS = "VIEW_EVENTS",
  CREATE_EVENTS = "CREATE_EVENTS",
  EDIT_EVENTS = "EDIT_EVENTS",
  DELETE_EVENTS = "DELETE_EVENTS",

  // Registration permissions
  VIEW_OWN_REGISTRATIONS = "VIEW_OWN_REGISTRATIONS",
  CREATE_REGISTRATIONS = "CREATE_REGISTRATIONS",
  VIEW_ALL_REGISTRATIONS = "VIEW_ALL_REGISTRATIONS",

  // Admin permissions
  ACCESS_ADMIN_PANEL = "ACCESS_ADMIN_PANEL",
}

// Define what permissions each role has
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.USER]: [
    Permission.VIEW_EVENTS,
    Permission.VIEW_OWN_REGISTRATIONS,
    Permission.CREATE_REGISTRATIONS,
  ],
  [UserRole.ADMIN]: [
    Permission.VIEW_EVENTS,
    Permission.CREATE_EVENTS,
    Permission.EDIT_EVENTS,
    Permission.DELETE_EVENTS,
    Permission.VIEW_ALL_REGISTRATIONS,
    Permission.ACCESS_ADMIN_PANEL,
  ],
};

// Routes that each role can access
export const ROLE_ROUTES: Record<UserRole, string[]> = {
  [UserRole.USER]: [
    "/",
    "/meus-eventos",
    "/api/events", // GET only
    "/api/registrations",
    "/api/payments/simulate",
  ],
  [UserRole.ADMIN]: [
    "/",
    "/admin",
    "/admin/events",
    "/api/events", // All methods
    "/api/registrations", // View all
  ],
};

// Routes that are restricted for certain roles
export const RESTRICTED_ROUTES: Record<UserRole, string[]> = {
  [UserRole.USER]: ["/admin", "/admin/events"],
  [UserRole.ADMIN]: ["/meus-eventos"],
};

export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  // Check if route is explicitly restricted
  if (
    RESTRICTED_ROUTES[userRole]?.some((restrictedRoute) =>
      route.startsWith(restrictedRoute)
    )
  ) {
    return false;
  }

  // Check if route is allowed
  return (
    ROLE_ROUTES[userRole]?.some((allowedRoute) =>
      route.startsWith(allowedRoute)
    ) ?? false
  );
}

export function getRedirectRoute(
  userRole: UserRole,
  attemptedRoute: string
): string {
  // If admin tries to access user-only routes, redirect to admin panel
  if (
    userRole === UserRole.ADMIN &&
    RESTRICTED_ROUTES[userRole].some((route) =>
      attemptedRoute.startsWith(route)
    )
  ) {
    return "/admin/events";
  }

  // If user tries to access admin routes, redirect to home
  if (
    userRole === UserRole.USER &&
    RESTRICTED_ROUTES[userRole].some((route) =>
      attemptedRoute.startsWith(route)
    )
  ) {
    return "/";
  }

  // Default redirect to home
  return "/";
}
