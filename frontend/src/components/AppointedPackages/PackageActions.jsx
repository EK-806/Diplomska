import { Button } from "@/components/ui/Button";
import { XCircle, Euro } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/Tooltip";
import RatingDialog from "@/components/AppointedPackages/RatingDialog";
import axiosApiCall from "@/lib/axiosApiCall";
import { useToast } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";

const PackageActions = ({ packageData, setPackages }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const CancelAppointedPackages = async (packageId) => {
    try {
      const response = await axiosApiCall.delete(
        `/api/v1/package/cancel-package/${packageId}`
      );

      if (response.status === 200) {
        setPackages((prev) =>
          prev.map((p) =>
            p._id === packageId ? { ...p, status: "Cancelled" } : p
          )
        );

        toast({
          title: "Package Cancelled",
          description: "Successfully Cancelled.",
        });
      }
    } catch (error) {
      console.error("Error cancelling package:", error);
      toast({
        title: "Error",
        description: "Failed to cancel package. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handlePay = () => {
    if (isPayDisabled) return;

    navigate("/payment", {
      state: {
        packageId: packageData?._id,
        paymentAmount: packageData?.cost ?? 0,
      },
    });
  };

  const status = String(packageData?.status || "");
  const paymentStatus = String(packageData?.paymentStatus || "");

  const isPayDisabled =
    paymentStatus === "Completed" ||
    ["Returned", "Cancelled", "Delivered", "On The Way"].includes(status);

  const isCancelDisabled =
    ["Delivered", "Cancelled", "Returned"].includes(status);

  return (
    <div className="flex gap-2 flex-col">
      {status === "Delivered" && (
        <RatingDialog packageData={packageData}/>
      )}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              onClick={handlePay}
              disabled={isPayDisabled}
              className="
                border-2 border-gray-900 dark:border-gray-100
                bg-red-600 text-white
                hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700
                disabled:bg-red-600 disabled:dark:bg-red-600
                disabled:text-gray-100 disabled:dark:text-gray-100
                disabled:border-gray-900 disabled:dark:border-gray-100
                disabled:cursor-not-allowed">
              <Euro/>
              Pay
            </Button>
          </TooltipTrigger>

          <TooltipContent
            className="
              bg-white text-gray-900
              dark:bg-zinc-900 dark:text-white
              border-2 border-gray-900 dark:border-gray-100
              shadow-md">
            {isPayDisabled
              ? "Payment not available for this package"
              : "Pay for the package"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        type="button"
        className="
          border-2 border-gray-900 dark:border-gray-100
          bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 hover:bg-red-700 text-white"
        onClick={() =>
          navigate(`/dashboard/update-appointed-package/${packageData?._id}`)
        }
        disabled={status !== "Pending"}>
        Update
      </Button>

      <Button
        type="button"
        variant="destructive"
        className="
          border-2 border-gray-900 dark:border-gray-100
          bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 text-white"
        onClick={() => CancelAppointedPackages(packageData?._id)}
        disabled={isCancelDisabled}>
        <XCircle/>
        Cancel
      </Button>
    </div>
  );
};

export default PackageActions;