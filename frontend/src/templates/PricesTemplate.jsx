const PricesTemplate = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Our Pricing Plans
        </h2>

        <div className="flex justify-center">
          <div
            className="
              bg-yellow-400/40 dark:bg-yellow-400/40
              opacity-85 dark:opacity-85
              p-6 rounded-lg shadow-lg text-center
              w-full max-w-sm
              border-2 border-gray-900 dark:border-border">
            <h3 className="mb-4 flex items-end justify-center gap-2 font-bold">
              <span className="text-3xl text-red-600">€</span>
              <span className="text-4xl text-red-600 leading-none">14</span>
              <span className="text-2xl text-red-600">.99</span>
              <span className="text-m font-medium text-gray-900 dark:text-gray-100 mb-1">
                / per month
              </span>
            </h3>

            <h4 className="text-xl font-bold text-red-600 mb-4">
              Categories:
            </h4>

            <ul className="mb-6">
              <li className="mb-2 text-black dark:text-white">Basic Packaging</li>
              <li className="mb-2 text-black dark:text-white">Fast Delivery</li>
              <li className="mb-2 text-black dark:text-white">24/7 Support</li>
              <li className="mb-2 text-black dark:text-white">Safe Delivery</li>
              <li className="mb-2 text-black dark:text-white">Deal Of The Month</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricesTemplate;