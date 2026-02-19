import { ShieldCheck, Truck, MapPin, CheckCircle, Euro, Headset, Plane } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Template from '@/components/Template';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from '@/components/ui/Carousel';
import GradientEffect from '@/components/helpers/GradientEffect';

export default function FeaturesTemplate() {
    const features = [
        {
            icon: <ShieldCheck size={32} className="text-icon"/>,
            title: 'Package Safety',
            description: 'Packages are handled with great care and security.',
        },
        {
            icon: <Truck size={32} className="text-icon"/>,
            title: 'Fast Delivery',
            description: 'Express delivery with optimized logistics.',
        },
        {
            icon: <MapPin size={32} className="text-icon"/>,
            title: 'Real Time Package Tracking',
            description: 'Package Tracking in real-time from pickup to delivery.',
        },
        {
            icon: <CheckCircle size={32} className="text-icon"/>,
            title: 'Reliable Service',
            description: 'We ensure consistent and intact delivery.',
        },
        {
            icon: <Euro size={32} className="text-icon"/>,
            title: 'Cheap Prices',
            description: 'Cheap and cost effective delivery prices without charging fees.',
        },
        {
            icon: <Headset size={32} className="text-icon"/>,
            title: '24/7 Customer Support',
            description: 'Our team is available 24/7 to answer any questions you might have.',
        },
        {
            icon: <Plane size={32} className="text-icon"/>,
            title: 'International Deliveries',
            description: 'We deliver around 78 countries.',
        },
    ];

    return (
        <Template className={'relative'}>
            <div className="container mx-auto text-center">
                <div className="bg-card/20 dark:bg-dark-card/20 p-8 rounded-xl border-2 border-gray-900 dark:border-border shadow-lg backdrop-blur-md">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                        <div className="text-left max-w-lg">
                            <div className="border-2 border-gray-900 dark:border-gray-100 text-primary dark:text-primary bg-primary/20 inline-block rounded-xl brightness-125 p-3 font-bold uppercase mb-1">
                            Features
                            </div>
                            <h2 className="text-3xl font-bold mt-3">What we provide</h2>
                            <p className="mt-2 text-gray-900 dark:text-gray-100">
                                We offer top notch secure package delivery with real 
                                time package tracking and express delivery worldwide.
                            </p>
                        </div>
                    </div>

                    <div className="relative">
                        <Carousel>
                            <CarouselContent>
                                {features.map((feature, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="basis-1/3 mobile-lg:basis-1/2 mobile-sm:basis-full">
                                        <Card
                                        className="shadow-md hover:shadow-lg transition p-6 text-foreground dark:text-dark-foreground border-2 dark:border-gray-100 border-gray-900 h-full bg-yellow-400/40 dark:bg-yellow-400/40 opacity-85">

                                            <CardHeader className="flex items-center justify-center flex-col text-center">
                                                <div className="bg-feature dark:bg-red-600 p-4 rounded-full flex justify-center items-center border-2 border-gray-900 dark:border-border">
                                                    {feature.icon}
                                                </div>
                                                <CardTitle className="mt-4 text-lg font-semibold">
                                                    {feature.title}
                                                </CardTitle>
                                                <CardDescription className="mt-2 text-gray-900 dark:text-gray-100">
                                                    {feature.description}
                                                </CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </CarouselItem>
                                ))}
                                
                            </CarouselContent>
                            <div className="absolute -top-10 right-10">
                                <CarouselPrevious/>
                                <CarouselNext/>
                            </div>
                        </Carousel>
                    </div>
                </div>
            </div>
            <GradientEffect/>
        </Template>
    );
}