import { useState, useEffect, useCallback } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/InputArea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/Select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/Dialog";
import { useToast } from "@/hooks/useToast";
import axiosApiCall from "@/lib/axiosApiCall";
import formatDate from "@/lib/formatDate";

const PackagesLayout = () => {
  const [packages, setPackages] = useState([]);
  const [deliveryDrivers, setDeliveryDrivers] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [filters, setFilters] = useState({ dateFrom: "", dateTo: "" });
  const [loading, setLoading] = useState(true);
  const [appointData, setAppointData] = useState({ deliveryDriverId: "", deliveryDate: "" });
  const { toast } = useToast();

  const findFirstArray = (obj) => {
    if (Array.isArray(obj)) return obj;
    if (!obj || typeof obj !== "object") return null;

    for (const key of Object.keys(obj)) {
      const found = findFirstArray(obj[key]);
      if (Array.isArray(found)) return found;
    }
    return null;
  };

  const isStatusManageDisabled = (status) =>
    ["delivered", "returned", "cancelled"].includes(
      String(status || "").toLowerCase()
    );

  const isPaymentCompleted = (p) =>
    String(p?.paymentStatus || "").toLowerCase() === "completed";

  const isManageDisabled = (p) => {
    if (!p) return true;
    if (isStatusManageDisabled(p.status)) return true;
    if (!isPaymentCompleted(p)) return true;
    return false;
  };

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosApiCall.get("/api/v1/package/all-packages");
      setPackages(res.data?.data || []);
    } catch (err) {
      console.error("fetchPackages error:", err);
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch packages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    const fetchDeliveryDrivers = async () => {
      try {
        const res = await axiosApiCall.get("/api/v1/user/deliverydrivers");
        const arr = findFirstArray(res.data) || [];
        setDeliveryDrivers(Array.isArray(arr) ? arr : []);
      } catch (err) {
        console.error("fetchDeliveryDrivers error:", err);
        toast({
          title: "Error",
          description:
            err?.response?.data?.message ||
            err?.message ||
            "Failed to fetch Delivery Drivers.",
          variant: "destructive",
        });
        setDeliveryDrivers([]);
      }
    };

    fetchDeliveryDrivers();
  }, [toast]);

  const handleSearch = async () => {
    try {
      const { dateFrom, dateTo } = filters;

      if (!dateFrom || !dateTo) {
        toast({
          title: "Error",
          description: "Please select both Date From and Date To.",
          variant: "destructive",
        });
        return;
      }

      if (dateFrom > dateTo) {
        toast({
          title: "Error",
          description: "dateFrom cannot be after dateTo.",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);

      const res = await axiosApiCall.get("/api/v1/package/filter-by-date", {
        params: { dateFrom, dateTo },
      });

      setPackages(res.data?.data || []);
    } catch (err) {
      console.error("handleSearch error:", err);
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to filter packages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setFilters({ dateFrom: "", dateTo: "" });
    await fetchPackages();
  };

  const openManage = (packageData) => {
    if (isManageDisabled(packageData)) return;
    setSelectedPackage(packageData);
    setAppointData({ deliveryDriverId: "", deliveryDate: "" });
  };

  const handleAppointedPackages = async () => {
    try {
      if (!selectedPackage?._id) return;

      if (!appointData.deliveryDriverId || !appointData.deliveryDate) {
        toast({
          title: "Error",
          description: "Please fill all fields.",
          variant: "destructive",
        });
        return;
      }

      const res = await axiosApiCall.patch(
        `/api/v1/package/assign-delivery/${selectedPackage._id}`,
        appointData
      );

      if (res.status === 200) {
        setPackages((prev) =>
          prev.map((packageData) =>
            packageData._id === selectedPackage._id
              ? { ...packageData, status: "On The Way" }
              : packageData
          )
        );

        toast({
          title: "Success",
          description: "Package updated successfully.",
        });

        setSelectedPackage(null);
        setAppointData({ deliveryDriverId: "", deliveryDate: "" });
      }
    } catch (err) {
      console.error("handleAppointedPackages error:", err);
      toast({
        title: "Error",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to appoint Delivery Driver.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">All Packages</h2>

      <div className="flex items-center gap-4 mb-6 w-full max-w-full overflow-x-hidden md:flex-nowrap">
        <Input
          className="
      min-w-0 bg-gray-200 dark:bg-zinc-700
      border border-gray-900 dark:border-gray-100
      w-[185px] pr-10
      md:w-auto md:flex-1 md:pr-3"
          type="date"
          value={filters.dateFrom}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
          }/>

        <Input
          className="
      min-w-0 bg-gray-200  dark:bg-zinc-700 
      border border-gray-900 dark:border-gray-100
      w-[185px] pr-10
      md:w-auto md:flex-1 md:pr-3"
          type="date"
          value={filters.dateTo}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
          }/>

        <Button
          className="shrink-0 whitespace-nowrap border-2 border-gray-900 dark:border-gray-100 dark:bg-red-600 dark:hover:bg-red-700 bg-red-600 hover:bg-red-700 text-white px-6"
          onClick={handleSearch}>
          Search
        </Button>

        <Button
          className="shrink-0 whitespace-nowrap border-2 border-gray-900 dark:border-gray-100 bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 text-white px-6"
          onClick={handleClear}>
          Clear
        </Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table className="text-foreground dark:text-dark-foreground w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-900 dark:text-gray-100">Sender First Name</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Sender Last Name</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Sender Email</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Appointed Date</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Requested Delivery Date</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Cost</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Status</TableHead>
              <TableHead className="text-gray-900 dark:text-gray-100">Functions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {packages.length ? (
              packages.map((p) => {
                const disabled = isManageDisabled(p);

                return (
                  <TableRow key={p._id}>
                    <TableCell>
                      {p.senderFirstName ||
                        p.sender?.firstName ||
                        p.user?.firstName ||
                        "-"}
                    </TableCell>
                    <TableCell>
                      {p.senderLastName ||
                        p.sender?.lastName ||
                        p.user?.lastName ||
                        "-"}
                    </TableCell>
                    <TableCell>
                      {p.senderEmail || p.sender?.email || p.user?.email || "-"}
                    </TableCell>

                    <TableCell>{formatDate(p.appointedDate)}</TableCell>
                    <TableCell>{formatDate(p.requestedDeliveryDate)}</TableCell>
                    <TableCell>€{p.cost}</TableCell>
                    <TableCell>{p.status}</TableCell>

                    <TableCell>
                      {disabled ? (
                        <Button
                          disabled
                          className="
                            border-2 dark:border-gray-100 border-gray-900
                            bg-red-600 opacity-50 cursor-not-allowed
                            dark:bg-red-600 text-white"
                          title={
                            !isPaymentCompleted(p)
                              ? "Payment must be completed before managing this package."
                              : "This package can’t be managed anymore."
                          }>
                          Manage
                        </Button>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="border-2 dark:border-gray-100 border-gray-900 dark:bg-red-600 dark:hover:bg-red-700 bg-red-600 hover:bg-red-700 text-white"
                              onClick={() => openManage(p)}>
                              Manage
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Manage Package</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                              <Select
                                value={appointData.deliveryDriverId}
                                onValueChange={(value) =>
                                  setAppointData((prev) => ({
                                    ...prev,
                                    deliveryDriverId: value,
                                  }))
                                }>
                                <SelectTrigger className="hover:text-gray-100 dark:hover:text-gray-100 hover:bg-red-600 dark:hover:bg-red-600 border-gray-900 dark:border-gray-100 bg-gray-200 dark:bg-zinc-700">
                                  <SelectValue placeholder="Select Delivery Driver" />
                                </SelectTrigger>

                                <SelectContent className="bg-gray-200 text-black dark:bg-zinc-700 dark:text-white dark:border-gray-100 border-gray-900">
                                  {deliveryDrivers.length ? (
                                    deliveryDrivers.map((d, idx) => {
                                      const id = String(d._id || d.id || idx);
                                      const label =
                                        d.name ||
                                        `${d.firstName || ""} ${
                                          d.lastName || ""
                                        }`.trim() ||
                                        d.email ||
                                        d.username ||
                                        "Delivery Driver";

                                      return (
                                        <SelectItem
                                          key={id}
                                          value={id}
                                          className="
                                            text-black dark:text-white
                                            focus:bg-red-600 focus:text-white
                                            data-[highlighted]:bg-red-600 data-[highlighted]:text-white
                                            data-[state=checked]:text-red-600 dark:data-[state=checked]:text-red-500">
                                          {label}
                                        </SelectItem>
                                      );
                                    })
                                  ) : (
                                    <div className="px-3 py-2 text-sm text-gray-700 dark:text-zinc-200">
                                      No delivery drivers found
                                    </div>
                                  )}
                                </SelectContent>
                              </Select>

                              <Input
                                className="hover:text-gray-100 dark:hover:text-gray-100 hover:bg-red-600 dark:hover:bg-red-600 border-gray-900 dark:border-gray-100 bg-gray-200 dark:bg-zinc-700"
                                type="date"
                                value={appointData.deliveryDate}
                                onChange={(e) =>
                                  setAppointData((prev) => ({
                                    ...prev,
                                    deliveryDate: e.target.value,
                                  }))
                                }/>
                            </div>

                            <DialogFooter>
                              <Button
                                className="border-2 border-gray-900 dark:border-gray-100 text-white dark:bg-red-600 dark:hover:bg-red-700 bg-red-600 hover:bg-red-700"
                                onClick={handleAppointedPackages}>
                                Appoint
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No packages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default PackagesLayout;