import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import axiosApiCall from "@/lib/axiosApiCall";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/Table";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/Dialog";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/Popover";
import formatDate from "@/lib/formatDate";
import ReactMapGL, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const DeliveriesLayout = () => {
  const [packages, setPackages] = useState([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isVisible: false,
    packageId: null,
    status: "",
  });

  const [mapState, setMapState] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 14,
  });

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axiosApiCall.get("/api/v1/package/deliveries");
      setPackages(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to load packages.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const updatePackageStatus = async (id, status) => {
    try {
      await axiosApiCall.patch(`/api/v1/package/${id}/status`, { status });

      toast({
        title: `Updated to ${status}`,
        description: `The package status has been updated to ${status}.`,
      });

      fetchPackages();
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);

      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        `Failed to update package status to ${status}.`;

      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    }
  };

  const openConfirmDialog = (packageId, status) => {
    setConfirmDialog({ isVisible: true, packageId, status });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ isVisible: false, packageId: null, status: "" });
  };

  const handleConfirmStatusUpdate = () => {
    updatePackageStatus(confirmDialog.packageId, confirmDialog.status);
    closeConfirmDialog();
  };

  const openMapModal = (latitude, longitude) => {
    setMapState({
      latitude: Number(latitude) || 0,
      longitude: Number(longitude) || 0,
      zoom: 14,
    });
    setIsMapModalOpen(true);
  };

  const closeMapModal = () => setIsMapModalOpen(false);

  const isActionDisabled = (status) =>
    ["Delivered", "Cancelled", "Returned"].includes(String(status || ""));

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto my-8">
      <h2 className="text-2xl font-bold mb-4 ml-4">Delivery List</h2>

      <Table className="text-foreground dark:text-dark-foreground">
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-900 dark:text-gray-100">Sender First Name</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Sender Last Name</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Receiver First Name</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Receiver Last Name</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Sender Phone Number</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Requested Delivery Date</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Approximate Delivery Date</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Receiver Phone Number</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Receiver Address</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Functions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {packages?.length > 0 ? (
            packages.map((packageData) => {
              const disabled = isActionDisabled(packageData.status);
              const canShowLocation =
                packageData?.deliveryLat != null &&
                packageData?.deliveryLng != null;

              return (
                <TableRow key={packageData._id}>
                  <TableCell>{packageData.senderFirstName}</TableCell>
                  <TableCell>{packageData.senderLastName}</TableCell>
                  <TableCell>{packageData.receiverFirstName}</TableCell>
                  <TableCell>{packageData.receiverLastName}</TableCell>
                  <TableCell>{packageData.senderPhone}</TableCell>
                  <TableCell>
                    {formatDate(packageData.requestedDeliveryDate)}
                  </TableCell>
                  <TableCell>
                    {formatDate(packageData.approximateDeliveryDate)}
                  </TableCell>
                  <TableCell>{packageData.receiverPhone}</TableCell>
                  <TableCell>{packageData.deliveryAddress}</TableCell>

                  <TableCell className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          className="
    h-10 px-4 rounded-lg border-2 
    border-gray-900 dark:border-gray-100
    bg-transparent text-gray-100 
    dark:text-gray-100 bg-red-600 
    dark:bg-red-600 hover:bg-red-700 
    dark:hover:bg-red-700 font-medium transition">
                          Manage
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        align="end"
                        sideOffset={8}
                        className="
                          w-56 p-3 bg-white dark:bg-zinc-900
                          border-2 border-gray-900 dark:border-gray-100
                          shadow-xl rounded-xl">
                        <div className="flex flex-col gap-2">
                          <Button
                            className="
    w-full !bg-red-600 hover:!bg-red-700 !text-gray-100 
    border-[2px] dark:border-gray-100 border-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              openConfirmDialog(packageData._id, "Delivered")
                            }
                            disabled={disabled}>
                            Deliver
                          </Button>

                          <Button
                            className="
    w-full !bg-red-600 hover:!bg-red-700 !text-gray-100 
    border-[2px] dark:border-gray-100 border-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              openConfirmDialog(packageData._id, "Returned")
                            }
                            disabled={disabled}>
                            Return
                          </Button>

                          <Button
                            className=" 
    border-[2px] dark:border-gray-100 border-gray-900
    w-full !bg-red-600 hover:!bg-red-700 !text-gray-100 
    font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              openMapModal(
                                packageData.deliveryLat,
                                packageData.deliveryLng
                              )
                            }
                            disabled={!canShowLocation}>
                            See Location
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-6">
                No deliveries found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={confirmDialog.isVisible} onOpenChange={closeConfirmDialog}>
        <DialogContent>
          <h3 className="text-2xl font-bold">Confirm Status Update</h3>
          <p className="text-lg">
            Are you sure you want to update the status to{" "}
            <strong>{confirmDialog.status}</strong>?
          </p>
          <p></p>

          <DialogFooter className="flex justify-end gap-4">
            <Button
              className=" border-[2px] border-gray-900 dark:border-gray-100
            !bg-red-600 hover:!bg-red-700 !text-gray-100 dark:bg-red-600 dark:hover:!bg-red-700 dark:!text-gray-100 "
              variant="outline"
              onClick={closeConfirmDialog}>
              Close
            </Button>
            <Button
              className=" border-[2px] border-gray-900 dark:border-gray-100
            !bg-red-600 hover:!bg-red-700 !text-gray-100 dark:bg-red-600 
            dark:hover:!bg-red-700 dark:!text-gray-100"
              variant="primary"
              onClick={handleConfirmStatusUpdate}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isMapModalOpen && (
        <Dialog open={isMapModalOpen} onOpenChange={closeMapModal}>
          <DialogContent>
            <h3 className="text-lg font-medium">Delivery Location</h3>

            <div className="w-full h-[300px] overflow-hidden rounded-lg">
              <ReactMapGL
                mapboxAccessToken="pk.eyJ1IjoiZWs4MDYiLCJhIjoiY21rcHZpYW82MG5mYjNjczlnZ3ExNXVpeCJ9.TS8uMuRObWgDROEmV1KqPQ"
                latitude={mapState.latitude}
                longitude={mapState.longitude}
                zoom={mapState.zoom}
                onMove={(evt) =>
                  setMapState((prev) => ({
                    ...prev,
                    zoom: evt.viewState.zoom,
                  }))
                }
                mapStyle="mapbox://styles/mapbox/streets-v12"
                style={{ width: "100%", height: "100%" }}>
                <Marker
                  latitude={mapState.latitude}
                  longitude={mapState.longitude}
                  anchor="bottom">
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      borderRadius: "999px",
                      background: "#dc2626",
                      border: "2px solid white",
                      boxShadow: "0 0 6px rgba(0,0,0,0.45)",
                      transform: "translateY(-2px)",
                    }}/>
                </Marker>
              </ReactMapGL>
            </div>

            <DialogFooter className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={closeMapModal}
                className="
    h-10 px-5 dark:!bg-red-600 dark:hover:!bg-red-700
    !bg-red-600 hover:!bg-red-700 !text-gray-100
    border-2 border-gray-900 dark:border-gray-100 
    rounded-md shadow-md focus-visible:outline-none 
    focus-visible:ring-2 focus-visible:ring-black
    focus-visible:ring-offset-2 ring-offset-background 
    dark:ring-offset-dark-background">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DeliveriesLayout;