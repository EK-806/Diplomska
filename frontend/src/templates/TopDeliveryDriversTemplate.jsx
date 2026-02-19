import { useEffect, useState } from 'react';
import axiosApiCall from '@/lib/axiosApiCall';
import { User, Package, Star } from 'lucide-react';

const TopDeliveryDriversTemplate = () => {
    const [topDeliveryDrivers, setTopDeliveryDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTopDeliveryDrivers = async () => {
        try {
            const response = await axiosApiCall('/api/v1/package/top-delivery-drivers');
            if (response.data.success) {
                setTopDeliveryDrivers(response.data.data);
            } else {
                setError('Failed to fetch top delivery drivers.');
            }
        } catch {
            setError('An error occurred while fetching data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopDeliveryDrivers();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

  return (
    <section className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-12">
        Top 3 Delivery Drivers
      </h2>

      <div className="flex justify-center gap-8 flex-wrap">
        {topDeliveryDrivers.map((deliveryDriver, index) => (
          <div
            key={index}
            className="border-2 border-gray-900 dark:border-border w-80 bg-yellow-400/40 opacity-85 dark:bg-yellow-400/40 dark:opacity-85 shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 flex flex-col items-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-red-500">
                <img
                  src={
                    deliveryDriver.profilePicture || 'https://via.placeholder.com/150'
                  }
                  alt={`${deliveryDriver.firstName} ${deliveryDriver.lastName}`}
                  className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-foreground/10"></div>
              </div>

              <h3 className="text-xl font-semibold mt-4 flex items-center gap-2">
                <User className="w-5 h-5 text-red-600" />
                {deliveryDriver.firstName} {deliveryDriver.lastName}
              </h3>

              <div className="mt-4 text-center space-y-2">
                <p className="flex items-center justify-center gap-2">
                  <Package className="w-5 h-5 text-red-600"/>
                  <strong>
                    Packages Delivered: {deliveryDriver.totalPackagesDelivered}
                  </strong>
                </p>

                <p className="flex items-center justify-center gap-2">
                  <Star className="w-5 h-5 text-red-600"/>
                  <strong>
                    Average Rating:{' '}
                    {deliveryDriver.averageRating
                      ? deliveryDriver.averageRating.toFixed(1)
                      : '0'}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopDeliveryDriversTemplate;