import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import axiosApiCall from "@/lib/axiosApiCall";

const PAGE_SIZE = 5;

const DeliveryDriversLayout = () => {
  const [deliveryDrivers, setDeliveryDrivers] = useState([]);
  const [currentLayout, setCurrentLayout] = useState(1);
  const [totalDeliveryDrivers, setTotalDeliveryDrivers] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDeliveryDrivers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosApiCall.get("/api/v1/user/deliverydrivers", {
        params: { page, limit: PAGE_SIZE },
      });

      const list = response?.data?.deliveryDriver ?? [];
      const total = Number(response?.data?.total ?? 0);

      setDeliveryDrivers(Array.isArray(list) ? list : []);
      setTotalDeliveryDrivers(Number.isFinite(total) ? total : 0);
    } catch (err) {
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          "An error occurred while fetching the delivery personnel.",
        variant: "destructive",
      });

      setDeliveryDrivers([]);
      setTotalDeliveryDrivers(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryDrivers(currentLayout);
  }, [currentLayout]);

  const totalPages = Math.max(
    1,
    Math.ceil((Number(totalDeliveryDrivers) || 0) / PAGE_SIZE)
  );

  return (
    <div className="mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">All Delivery Personnel</h2>

      {loading ? (
        <div className="flex justify-center my-4">
          <p>Loading...</p>
        </div>
      ) : (
        <>
          <Table className="text-foreground dark:text-dark-foreground w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-900 dark:text-gray-100">Name</TableHead>
                <TableHead className="text-gray-900 dark:text-gray-100">Email</TableHead>
                <TableHead className="text-gray-900 dark:text-gray-100">Number of Deliveries</TableHead>
                <TableHead className="text-gray-900 dark:text-gray-100">Total Earned</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {deliveryDrivers.length > 0 ? (
                deliveryDrivers.map((person) => {
                  const deliveries = Number(person?.deliveries ?? 0);
                  const totalEarned = Number(person?.totalEarned ?? 0);

                  return (
                    <TableRow key={person._id}>
                      <TableCell>
                        {person?.firstName || ""} {person?.lastName || ""}
                      </TableCell>
                      <TableCell>{person?.email || ""}</TableCell>
                      <TableCell>{Number.isFinite(deliveries) ? deliveries : 0}</TableCell>
                      <TableCell>
                        €{Number.isFinite(totalEarned) ? totalEarned.toFixed(2) : "0.00"}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No delivery personnel found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex justify-center mt-4 items-center gap-2">
            <Button
              className="border-2 border-gray-900 dark:border-gray-100 bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 text-white dark:text-white"
              onClick={() => setCurrentLayout((p) => Math.max(1, p - 1))}
              disabled={currentLayout === 1}>
              Previous
            </Button>

            <span>
              Page {currentLayout} of {totalPages}
            </span>

            <Button
              className="border-2 border-gray-900 dark:border-gray-100 bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 text-white dark:text-white"
              onClick={() => setCurrentLayout((p) => Math.min(totalPages, p + 1))}
              disabled={currentLayout === totalPages}>
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryDriversLayout;