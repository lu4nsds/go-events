import EventCard from "@/components/EventCard";
import { FeaturedEventsCarousel } from "@/components/FeaturedEventsCarousel";
import { Event } from "@/types";
import { prisma } from "@/lib/prisma";
import { classNames } from "@/lib/design-tokens";
import { HeroSection } from "@/components/HeroSection";

async function getEvents(): Promise<Event[]> {
  try {
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // Convert dates to strings for client compatibility
    return events.map((event) => ({
      ...event,
      date: event.date.toISOString(),
      createdAt: event.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

async function getFeaturedEvents(): Promise<Event[]> {
  try {
    // Get featured events (first 5 events for now, could be based on criteria)
    const events = await prisma.event.findMany({
      include: {
        _count: {
          select: {
            registrations: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

    return events.map((event) => ({
      ...event,
      date: event.date.toISOString(),
      createdAt: event.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching featured events:", error);
    return [];
  }
}

export default async function HomePage() {
  const [events, featuredEvents] = await Promise.all([
    getEvents(),
    getFeaturedEvents(),
  ]);

  return (
    <div>
      {/* Hero Section with Featured Events Carousel */}
      <section className="bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 py-4">
        <div className="w-full ">
          <HeroSection />
          {featuredEvents.length > 0 && (
            <div className="mb-8">
              <FeaturedEventsCarousel events={featuredEvents} />
            </div>
          )}
        </div>
      </section>

      {/* All Events Section */}
      <section className="py-16 lg:py-20">
        <div className={classNames.container.xl}>
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Todos os Eventos
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto">
              Explore nossa seleção completa de eventos disponíveis
            </p>
          </div>

          {events.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum evento disponível
                </h3>
                <p className="text-gray-500 mb-6">
                  Não há eventos cadastrados no momento. Volte em breve para
                  descobrir novos eventos!
                </p>
              </div>
            </div>
          ) : (
            <div className={classNames.grid.responsive}>
              {events.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
