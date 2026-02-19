import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/InputArea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/FormArea";
import { Calendar } from "@/components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger} from "@/components/ui/Popover";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import axiosApiCall from "@/lib/axiosApiCall";
import { useNavigate, useParams } from "react-router-dom";

const MK_PHONE_REGEX = /^\+389 7\d \d{3} \d{3}$/;

const formatMKPhone = (value) => {
  const raw = String(value ?? "");

  if (!raw.startsWith("+389 7")) {
    return "+389 7";
  }

  const digits = raw.replace(/\D/g, "").replace(/^3897/, "");
  const local = digits.slice(0, 7);
  const a = local.slice(0, 1);
  const b = local.slice(1, 4);
  const c = local.slice(4, 7);

  if (!local) return "+389 7";
  if (local.length <= 1) return `+389 7${a}`;
  if (local.length <= 4) return `+389 7${a} ${b}`;
  return `+389 7${a} ${b} ${c}`;
};

const numFromInput = (v) => {
  if (v === "" || v == null) return NaN;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return n;
};

const formSchema = z.object({
  senderPhone: z.string().regex(MK_PHONE_REGEX, "Sender phone number must be in the +389 7X XXX XXX format"),
  packageType: z.string().min(1, { message: "Package type required" }),
  packageWeight: z.preprocess(numFromInput, z
      .number({ required_error: "Package weight is required" })
      .positive({ message: "Package weight must be positive" })
      .min(1, { message: "Package weight must be at least 1kg" })),
  receiverFirstName: z.string().min(1, { message: "Receiver first name is required" }),
  receiverLastName: z.string().min(1, { message: "Receiver last name is required" }),
  receiverPhone: z
  .string()
  .regex(MK_PHONE_REGEX, "Receiver phone number must be in the +389 7X XXX XXX format"),
  receiverEmail: z
    .string()
    .email({ message: "Invalid email address" })
    .refine(
      (email) =>
        [
          "@yahoo.com",
          "@gmail.com",
          "@hotmail.com",
          "@outlook.com",
          "@uklo.edu.mk",
          "@fikt.edu.mk",
          "@protonmail.com",
          "@proton.me",
        ].some((domain) => email.endsWith(domain)),
      { message: "Not a valid email address" }
    ),
  deliveryAddress: z.string().min(1, { message: "Delivery address is required" }),
  deliveryDate: z.date({ required_error: "Delivery date is required" }),
  deliveryLatitude: z.preprocess(
    numFromInput,
    z
      .number({ required_error: "Latitude is required" })
      .refine(
        (v) => !Number.isNaN(v),
        "Latitude must be a valid decimal number"
      )
  ),
  deliveryLongitude: z.preprocess(
    numFromInput,
    z
      .number({ required_error: "Longitude is required" })
      .refine(
        (v) => !Number.isNaN(v),
        "Longitude must be a valid decimal number"
      )
  ),
});

const calculateCost = (weight) => {
  if (weight <= 0) return 0;

  const pricePerKg = 5;
  return Math.ceil(weight) * pricePerKg;
};

const calculateApproximateDeliveryDate = (deliveryDate) => {
  const date = new Date(deliveryDate);
  date.setDate(date.getDate() + 2);
  return date;
};

export default function UpdateAppointedPackageLayout() {
  const { user } = useAuth();
  const authUser = user?.user ?? user ?? null;
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [packageData, setPackageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      senderPhone: "+389 7",
      packageType: "",
      packageWeight: "",
      receiverFirstName: "",
      receiverLastName: "",
      receiverPhone: "+389 7",
      receiverEmail: "",
      deliveryAddress: "",
      deliveryDate: undefined,
      deliveryLatitude: "",
      deliveryLongitude: "",
    },
    mode: "onSubmit",
  });

  const watchedWeight = useWatch({
    control: form.control,
    name: "packageWeight",
  });

  const cost = useMemo(() => calculateCost(watchedWeight), [watchedWeight]);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        if (!id) throw new Error("Missing package id in the route.");

        setIsLoading(true);
        setIsError(false);
        const res = await axiosApiCall.get(`/api/v1/package/package/${id}`);
        setPackageData(res.data);
      } catch (error) {
        console.error("Error fetching package data:", error);
        setIsError(true);
        toast({
          title: "Error",
          description:
            error?.response?.data?.message ||
            `Failed to fetch package data (${
              error?.response?.status || "no status"
            })`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPackageData();
  }, [id, toast]);

  useEffect(() => {
    const p = packageData?.data;
    if (!p) return;

    form.reset({
      senderPhone: p.senderPhone ? formatMKPhone(p.senderPhone) : "+389 7",
      packageType: p.packageType || "",
      packageWeight: p.packageWeight ?? "",
      receiverFirstName: p.receiverFirstName || "",
      receiverLastName: p.receiverLastName || "",
      receiverPhone: p.receiverPhone
        ? formatMKPhone(p.receiverPhone)
        : "+389 7",
      receiverEmail: p.receiverEmail || "",
      deliveryAddress: p.deliveryAddress || "",
      deliveryDate: p.requestedDeliveryDate
        ? new Date(p.requestedDeliveryDate)
        : undefined,
      deliveryLatitude: p.deliveryLat ?? "",
      deliveryLongitude: p.deliveryLng ?? "",
    });
  }, [packageData, form]);

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      if (!id) throw new Error("Missing package id in the route.");

      const postman = {
        senderPhone: formData.senderPhone,
        packageType: formData.packageType,
        packageWeight: Number(formData.packageWeight),
        receiverFirstName: formData.receiverFirstName,
        receiverLastName: formData.receiverLastName,
        receiverPhone: formData.receiverPhone,
        receiverEmail: formData.receiverEmail,
        deliveryAddress: formData.deliveryAddress,
        deliveryLat: Number(formData.deliveryLatitude),
        deliveryLng: Number(formData.deliveryLongitude),
        cost,
        requestedDeliveryDate: formData.deliveryDate,
        approximateDeliveryDate: calculateApproximateDeliveryDate(formData.deliveryDate),
        userId: authUser?._id,
        senderFirstName: authUser?.firstName,
        senderLastName: authUser?.lastName,
        senderEmail: authUser?.email,
        packageId: id,
      };

      await axiosApiCall.put(`/api/v1/package/update-package/${id}`, postman);

      toast({
        title: "Package Updated",
        description: "Your package information has been successfully updated.",
      });

      const refreshed = await axiosApiCall.get(`/api/v1/package/package/${id}`);
      setPackageData(refreshed.data);
    } catch (error) {
      console.error("Error updating package:", error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message ||
          `Failed to update the package (${
            error?.response?.status || "no status"
          })`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) return <div>Loading user...</div>;
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading package data</div>;

  return (
    <div className="p-4 mobile-lg:p-2 max-w-[700px] w-full mx-auto">
      <h1 className="mb-4">Update Appointed Package</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormItem>
            <FormLabel>Sender First Name</FormLabel>
            <FormControl>
              <Input
                value={authUser?.firstName || ""}
                readOnly
                className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200 cursor-not-allowed"/>
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Sender Last Name</FormLabel>
            <FormControl>
              <Input
                value={authUser?.lastName || ""}
                readOnly
                className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200 cursor-not-allowed"/>
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Sender Email</FormLabel>
            <FormControl>
              <Input
                value={authUser?.email || ""}
                readOnly
                className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200 cursor-not-allowed"/>
            </FormControl>
          </FormItem>

          <FormField
            control={form.control}
            name="senderPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sender Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+389 7X XXX XXX"
                    inputMode="numeric"
                    onChange={(e) => field.onChange(formatMKPhone(e.target.value))}
                    className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200"/>
                </FormControl>
                <FormMessage/>
              </FormItem>)}/>

          <FormField
            control={form.control}
            name="packageType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Type</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter package type"
                    className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200"/>
                </FormControl>
                <FormMessage/>
              </FormItem>)}/>

          <FormField
            control={form.control}
            name="packageWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Weight (kg)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter package weight"
                    className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200"/>
                </FormControl>
                <FormMessage/>
              </FormItem>)}/>

          <FormField
            control={form.control}
            name="receiverFirstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receiver First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter first name"
                    className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200"/>
                </FormControl>
                <FormMessage/>
              </FormItem>)}/>

          <FormField
            control={form.control}
            name="receiverLastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receiver Last Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter last name"
                    className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200"/>
                </FormControl>
                <FormMessage/>
              </FormItem>)}/>

          <FormField
            control={form.control}
            name="receiverPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receiver Phone Number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+389 7X XXX XXX"
                    inputMode="numeric"
                    onChange={(e) =>
                      field.onChange(formatMKPhone(e.target.value))}
                    className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200"/>
                </FormControl>
                <FormMessage/>
              </FormItem>)}/>

          <FormField
            control={form.control}
            name="receiverEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Receiver Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="Enter receiver email"
                    className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200"/>
                </FormControl>
                <FormMessage/>
              </FormItem>)}/>

          <FormField
            control={form.control}
            name="deliveryAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter delivery address"
                    className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200"/>
                </FormControl>
                <FormMessage/>
              </FormItem>)}/>

          <FormField
            control={form.control}
            name="deliveryLatitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Address Latitude</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter latitude"
                    className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200"/>
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}/>

          <FormField
            control={form.control}
            name="deliveryLongitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Address Longitude</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter longitude"
                    className="placeholder:text-gray-900 dark:placeholder:text-gray-100 border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200"/>
                </FormControl>
                <FormMessage/>
              </FormItem>)}/>

          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requested Delivery Date</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className="bg-gray-200 dark:bg-zinc-700 hover:bg-red-600 dark:hover:bg-red-600 w-full justify-start text-left font-normal text-gray-900 dark:hover:text-gray-100 dark:text-gray-100 border border-gray-900 dark:border-gray-100">
                        {field.value ? field.value.toLocaleDateString() : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-xl overflow-hidden border-2 border-gray-900 dark:border-gray-100">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="p-3 bg-background dark:bg-dark-background text-gray-900 dark:text-gray-100"/>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage/>
              </FormItem>)}/>

          <FormItem>
            <FormLabel>Cost (€)</FormLabel>
            <FormControl>
              <Input
                type="text"
                value={cost || ""}
                readOnly
                className="border-gray-900 dark:border-gray-100 dark:bg-zinc-700 bg-gray-200 cursor-not-allowed"/>
            </FormControl>
          </FormItem>

          <Button
            type="submit"
            className="border-2 border-gray-900 dark:border-gray-100 bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 w-full"
            disabled={loading}>
            {loading ? "Updating..." : "Update Package"}
          </Button>
        </form>
      </Form>
    </div>
  );
}