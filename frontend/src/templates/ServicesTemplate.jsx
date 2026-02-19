import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Truck, Clock, Globe } from "lucide-react";

const services = [
  {
    icon: <Truck size={40} className="text-red-500"/>,
    title: "Express Delivery",
    description: "Package delivery within 24 hours.",
  },
  {
    icon: <Clock size={40} className="text-red-500"/>,
    title: "Standard Delivery",
    description: "Package delivery within 2 to 5 days.",
  },
  {
    icon: <Globe size={40} className="text-red-500"/>,
    title: "International Delivery",
    description:
      "Send packages worldwide with our international service available in 78 countries.",
  },
];

export default function ServicesTemplate() {
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-10">
          Our Services
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="
                p-6 shadow-lg transition-all duration-300
                hover:shadow-xl hover:scale-105
                border-2 border-gray-900 dark:border-border">
              <CardHeader className="flex items-center justify-center">
                {service.icon}
              </CardHeader>

              <CardContent>
                <CardTitle className="text-xl font-semibold text-center">
                  {service.title}
                </CardTitle>
                <p className="text-gray-900 dark:text-gray-100 text-center mt-2">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}