"use client";

import { EventsCarousel } from "./EventsCarousel";
import { Event } from "@/types";

interface FeaturedEventsCarouselProps {
  events: Event[];
}

export function FeaturedEventsCarousel({
  events,
}: FeaturedEventsCarouselProps) {
  return <EventsCarousel events={events} />;
}
