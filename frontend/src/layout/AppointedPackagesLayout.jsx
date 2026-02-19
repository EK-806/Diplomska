import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/useToast";
import useAuth from "@/hooks/useAuth";
import axiosApiCall from "@/lib/axiosApiCall";
import PackageTable from "@/components/AppointedPackages/PackageTable";

const AppointedPackagesLayout = () => {
  const { user } = useAuth();
  const u = useMemo(() => user?.user ?? user ?? null, [user]);

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const id = u?._id;
    if (!id) {
      setLoading(false);
      setPackages([]);
      return;
    }

    const fetchPackages = async () => {
      try {
        setLoading(true);

        const res = await axiosApiCall.get(`/api/v1/package/my-packages/${id}`);

        console.log("My packages API res.data:", res?.data);

        const list = Array.isArray(res?.data?.data) ? res.data.data : [];
        setPackages(list);
      } catch (error) {
        console.error("Error fetching packages:", error);
        toast({
          title: "Error",
          description: error?.response?.data?.message || "Failed to fetch packages.",
          variant: "destructive",
        });
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [u?._id, toast]);

  return (
    <div className="mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">My Packages</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <PackageTable packageData={packages} setPackages={setPackages}/>
      )}
    </div>
  );
};

export default AppointedPackagesLayout; 