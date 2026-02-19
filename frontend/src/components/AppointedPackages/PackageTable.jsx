import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import PackageActions from "@/components/AppointedPackages/PackageActions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { SquarePen } from "lucide-react";
import formatDate from "@/lib/formatDate";

const safeFormatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isFinite(d.getTime()) ? formatDate(d) : "—";
};

const PackageTable = ({ packageData = [], setPackages }) => {
  const safePackageData = Array.isArray(packageData) ? packageData : [];

  return (
    <div className="overflow-x-auto">
      <Table className="text-foreground dark:text-dark-foreground w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-gray-900 dark:text-gray-100">Package Type</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Package Id</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Requested Delivery Date</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Approximate Delivery Date</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Appointed Date</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Delivery Driver ID</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Appointed Status</TableHead>
            <TableHead className="text-gray-900 dark:text-gray-100">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {safePackageData.length > 0 ? (
            safePackageData.map((packageData) => (
              <TableRow key={packageData?._id}>
                <TableCell>{packageData?.packageType || "—"}</TableCell>
                <TableCell>{packageData?._id || "—"}</TableCell>
                <TableCell>
                  {safeFormatDate(packageData?.requestedDeliveryDate)}
                </TableCell>
                <TableCell>
                  {safeFormatDate(packageData?.approximateDeliveryDate)}
                </TableCell>
                <TableCell>
                  {safeFormatDate(packageData?.appointedDate)}
                </TableCell>
                <TableCell>
                  {packageData?.deliveryDriverId || "Not Assigned"}
                </TableCell>
                <TableCell>{packageData?.status || "—"}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className=" border-2 border-gray-900 dark:border-gray-100
                         inline-flex items-center justify-center
                         h-9 w-9 rounded-lg
                         transition bg-red-600
                         hover:bg-red-700 text-white">
                        <SquarePen/>
                      </button>
                    </PopoverTrigger>

                    <PopoverContent
                      className="
                        bg-white dark:bg-zinc-900
                        border-2 dark:border-gray-100 border-gray-900
                        shadow-xl rounded-xl p-4">
                      <PackageActions
                      
                        packageData={packageData}
                        setPackages={setPackages}/>
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No Package Found!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PackageTable;