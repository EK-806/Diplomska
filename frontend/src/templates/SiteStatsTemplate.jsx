import { useEffect, useState } from "react";
import CountUp from "react-countup";
import axiosApiCall from "@/lib/axiosApiCall";
import Template from "@/components/Template";
import { Package, Truck, Users } from "lucide-react";

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const SiteStatsTemplate = () => {
  const [siteStats, setSiteStats] = useState({
    totalPackagesAppointed: 0,
    totalPackagesDelivered: 0,
    totalUsers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchSiteStats = async () => {
      try {
        setIsLoading(true);
        setErrorMsg("");

        const response = await axiosApiCall.get("/api/v1/package/site-stats");

        const payload = response?.data?.data ?? response?.data;

        setSiteStats({
          totalPackagesAppointed: toNumber(
            payload?.totalPackages
          ),
          totalPackagesDelivered: toNumber(
            payload?.totalPackagesDelivered
          ),
          totalUsers: toNumber(
            payload?.totalUsers
          ),
        });
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load site stats";

        setErrorMsg(msg);

        setSiteStats({
          totalPackagesAppointed: 0,
          totalPackagesDelivered: 0,
          totalUsers: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteStats();
  }, []);

  return (
    <Template className="w-full">
      <div className="relative flex items-center">
        <div className="w-full">
          {errorMsg && (
            <div className="mb-4 text-center text-red-600 font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center w-full">
            <div className="border-2 border-gray-900 dark:border-border flex flex-col items-center p-5 bg-yellow-400/40 opacity-85 backdrop-blur-lg rounded-xl">
              <Package className="h-10 w-10 text-red-600 dark:text-red-600 mb-2" />
              <h4 className="text-lg font-semibold">
                Total Appointed Packages
              </h4>

              {isLoading ? (
                <div className="h-7 w-7 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mt-2"></div>
              ) : (
                <CountUp
                  start={0}
                  end={siteStats.totalPackagesAppointed}
                  duration={2.5}
                  className="text-3xl font-bold text-red-600 dark:text-red-600"/>
              )}
            </div>

            <div className="border-2 border-gray-900 dark:border-border flex flex-col items-center p-5 bg-yellow-400/40 opacity-85 backdrop-blur-lg rounded-xl">
              <Truck className="h-10 w-10 text-red-600 dark:text-red-600 mb-2" />
              <h4 className="text-lg font-semibold">
                Total Delivered Packages
              </h4>

              {isLoading ? (
                <div className="h-7 w-7 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mt-2"></div>
              ) : (
                <CountUp
                  start={0}
                  end={siteStats.totalPackagesDelivered}
                  duration={2.5}
                  className="text-3xl font-bold text-red-600 dark:text-red-600"/>
              )}
            </div>

            <div className="border-2 border-gray-900 dark:border-border flex flex-col items-center p-5 bg-yellow-400/40 opacity-85 backdrop-blur-lg rounded-xl">
              <Users className="h-10 w-10 text-red-600 dark:text-red-600 mb-2"/>
              <h4 className="text-lg font-semibold">
                Total Users
              </h4>

              {isLoading ? (
                <div className="h-7 w-7 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mt-2"></div>
              ) : (
                <CountUp
                  start={0}
                  end={siteStats.totalUsers}
                  duration={2.5}
                  className="text-3xl font-bold text-red-600 dark:text-red-600"/>
              )}
            </div>
          </div>
        </div>
      </div>
    </Template>
  );
};

export default SiteStatsTemplate;