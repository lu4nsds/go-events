import EventCard from "@/components/EventCard";
import { Event } from "@/types";

async function getEvents() {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/events`,
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export default async function HomePage() {
  const events = await getEvents();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Descubra Eventos Incríveis
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Encontre e participe dos melhores eventos da sua cidade. Cultura,
          tecnologia, música e muito mais!
        </p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            <p>Nenhum evento disponível no momento.</p>
            <p className="mt-2">Volte em breve para descobrir novos eventos!</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: Event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
