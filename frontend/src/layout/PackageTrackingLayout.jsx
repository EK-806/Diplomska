import { useToast } from "@/hooks/useToast";
import axiosApiCall from "@/lib/axiosApiCall";
import formatDate from "@/lib/formatDate";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check, Truck, Clock, XCircle, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import Template from "@/components/Template";
import { motion } from "framer-motion";

const safeFormatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? formatDate(d) : "—";
};

const StatusControl = ({ status }) => {
  const controls = [
    { id: "Pending", icon: <Clock className="w-5 h-5" />, label: "Pending" },
    { id: "On The Way", icon: <Truck className="w-5 h-5" />, label: "On The Way" },
    { id: "Cancelled", icon: <XCircle className="w-5 h-5" />, label: "Cancelled" },
    { id: "Returned", icon: <RefreshCw className="w-5 h-5" />, label: "Returned" },
    { id: "Delivered", icon: <Check className="w-5 h-5" />, label: "Delivered" },
  ];

  const controlIndex = controls.findIndex((c) => c.id === status);

  return (
    <div className="flex mobile-lg:flex-col items-start justify-between gap-3">
      {controls.map((control, index) => {
        const isCurrent = index === controlIndex;

        return (
          <motion.div
            key={control.id}
            className="flex items-center space-x-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                isCurrent
                  ? "bg-yellow-400 text-red-600 shadow-lg"
                  : "bg-yellow-400 text-gray-900"
              }`}>
              {control.icon}
            </div>

            <span
              className={`text-sm font-medium ${
                isCurrent
                  ? "text-red-600"
                  : "text-gray-900 dark:text-gray-100"
              }`}>
              {control.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function PackageTrackingLayout() {
  const { toast } = useToast();
  const { packageId } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchPackageData = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        const response = await axiosApiCall.get(
          `/api/v1/package/package/${encodeURIComponent(packageId)}`
        );

        if (!mounted) return;
        setPackageData(response?.data?.data ?? null);
      } catch (error) {
        if (!mounted) return;

        setIsError(true);
        toast({
          title: "Error",
          description: "Failed to fetch package data.",
          variant: "destructive",
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (packageId) fetchPackageData();
    else {
      setIsLoading(false);
      setIsError(true);
    }

    return () => {
      mounted = false;
    };
  }, [packageId, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error loading package data.
      </div>
    );
  }

  return (
    <Layout>
      <Template>
        <motion.div
          className="
            max-w-2xl mx-auto
            bg-card dark:bg-dark-card
            shadow-lg rounded-lg overflow-hidden
            border-2 border-black dark:border-white
            mb-16 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}>
        
          <div className="p-4">
            <div className="border-2 border-gray-900 dark:border-gray-100 rounded-lg overflow-hidden">
              <div className="h-[45vh] w-full overflow-hidden">
                <img
                  src="/ontheway.gif"
                  alt="On The Way"
                  className="h-full w-full object-cover object-[center_45%] scale-125 block"/>
              </div>
            </div>
          </div>

          <div className="p-6 pt-2">
            <h1 className="text-2xl font-bold mb-6">
              Package Tracking
            </h1>

            <p className="mb-4">
              <span className="font-semibold">Package ID:</span> {packageId}
            </p>

            {packageData && (
              <>
                <div className="mb-6">
                  <StatusControl status={packageData.status}/>
                </div>

                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">Sender:</span>{" "}
                    {packageData.senderFirstName} {packageData.senderLastName}
                  </p>

                  <p>
                    <span className="font-semibold">Receiver:</span>{" "}
                    {packageData.receiverFirstName} {packageData.receiverLastName}
                  </p>

                  <p>
                    <span className="font-semibold">Delivery Address:</span>{" "}
                    {packageData.deliveryAddress}
                  </p>

                  <p>
                    <span className="font-semibold">Requested Delivery Date:</span>{" "}
                    {safeFormatDate(packageData.requestedDeliveryDate)}
                  </p>

                  <p>
                    <span className="font-semibold">Estimated Delivery Date:</span>{" "}
                    {safeFormatDate(packageData.approximateDeliveryDate)}
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </Template>
    </Layout>
  );
}