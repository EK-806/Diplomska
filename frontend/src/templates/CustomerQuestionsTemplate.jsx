import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import Template from "@/components/Template";

export default function CustomerQuestionsTemplate() {
  return (
    <Template className="pt-12 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-10">
          Customer Questions
        </h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-3xl font-semibold">
              How does DHL&apos;s delivery system work?
            </AccordionTrigger>
            <AccordionContent>
              We offer fast and secure delivery services where you can place an order
              and we pick it up from the sender and deliver it to the reciver. In regards
              to the current whereabouts of the package our tracking system keeps you updated
              at every step.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-3xl font-semibold">
              How can I track my package?
            </AccordionTrigger>
            <AccordionContent>
              You can track your package by inputing in your tracking ID on our website.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-3xl font-semibold">
              How long does it take to deliver a package?
            </AccordionTrigger>
            <AccordionContent>
              Standard delivery service takes about 2-3 business days, while our express
              delivery service takes 12-24 hours, depending on the location.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-3xl font-semibold">
              Does DHL deliver internationally?
            </AccordionTrigger>
            <AccordionContent>
              Yes, we provide international deliveries services across all of Europe,
              South America, the USA, Australia and New Zeland and some parts of Asia.
              We only stopped deliveries for Russia and Belarus due to the sanctions.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-3xl font-semibold">
              What should I do if my package is delayed?
            </AccordionTrigger>
            <AccordionContent>
              If that happens, please contact our customer support team for assistance.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Template>
  );
}