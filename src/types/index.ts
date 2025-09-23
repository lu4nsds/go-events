export interface Event {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  price: number;
  distance: string;
  createdAt: string;
  _count?: {
    registrations: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

export interface Registration {
  id: string;
  userId: string;
  eventId: string;
  status: "pending" | "paid";
  qrCode: string;
  createdAt: string;
  event?: Event;
  user?: User;
}
