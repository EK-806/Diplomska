import Template from "@/components/Template";
import { Card } from "@/components/ui/Card";
import { Truck, Package, Home, BarChart2 } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Enter package details",
    description: "Input sender and receiver information.",
  },
  {
    icon: Truck,
    title: "Choose delivery service",
    description: "Select standard or express delivery.",
  },
  {
    icon: Home,
    title: "Get it delivered",
    description: "We pick up from and deliver to your doorstep.",
  },
  {
    icon: BarChart2,
    title: "Tracking in real time",
    description: "Monitor your delivery status.",
  },
];

export default function WorkflowTemplate() {
  return (
    <Template>
      <div className="py-12 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2">
          <p className="border-2 border-gray-900 dark:border-gray-100 text-primary bg-primary/20 inline-block rounded-xl p-3 font-bold uppercase mb-1">
            Workflow
          </p>

          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 my-4">
            How we operate!
          </h2>

          <p className="text-gray-900 dark:text-gray-100 mb-6">
            Solutions from management to coordination of transporting items from
            one place to another. Ensuring they arrive to the desired
            destination.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {steps.map((step, index) => (
              <Card
                key={index}
                className="border-2 border-gray-900 dark:border-border p-4 flex items-start gap-4 bg-gray-100 shadow-md">
                <step.icon className="w-12 h-12 text-primary"/>
                <div>
                  <h3 className="font-bold text-lg dark:text-gray-100">
                    {step.title}
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100 text-sm">
                    {step.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="relative lg:w-1/2 flex justify-center items-center">
          <img
            src="/howwework.gif"
            alt="How We Work"
            className="
              w-full max-w-xl
              h-auto
              object-contain
              rounded-lg
              translate-x-[10%]"/>

          <div
            className="
  absolute bottom-14 left-6 border-2 
  border-gray-900 dark:border-border
  bg-accent px-4 py-4 rounded-lg
  shadow-md flex items-center gap-3">
            <Package className="w-10 h-10 text-red-500"/>
            <div>
              <p className="text-3xl font-bold text-red-500">911m</p>
              <p className="text-sm font-semibold text-red-500">Delivered Packages</p>
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
}