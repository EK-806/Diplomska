import { useState } from "react";
import FormHeader from "./helpers/FormHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/Button";
import { Input } from "./ui/InputArea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/FormArea";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/CheckBox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import axiosApiCall from "@/lib/axiosApiCall";
import { useToast } from "@/hooks/useToast";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const formSchema = z
  .object({
    firstName: z.string().min(2, { message: "Your first name must be at least 2 characters long" }),
    lastName: z.string().min(2, { message: "Your last name must be at least 5 characters long" }),
    email: z
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
        {
          message: "Not a valid email adress",
        }
      ),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message:
          "Password must contain at least one special character (symbol)",
      }),
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, {
      message: "You must accept the terms and conditions",
    }),
    role: z.enum(["User", "DeliveryDriver"], { message: "Please select a role",
    }),
    profilePicture: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
        message: "File size should be less than 5MB",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match" });

export default function Register() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      role: "",
      profilePicture: null,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { fetchUser } = useAuth();
  const navigate = useNavigate();
  const togglePasswordVisibility = () => setShowPassword((s) => !s);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword((s) => !s);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      formData.append("acceptTerms", String(data.acceptTerms));

      if (data.profilePicture) {
        formData.append("profilePicture", data.profilePicture);
      }

      const response = await axiosApiCall.post(
        "/api/v1/user/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Response:", response.data);

      const accessToken = response.data?.accessToken;
      const updateToken = response.data?.updateToken;

      if (accessToken && updateToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("updateToken", updateToken);
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("updateToken");
        throw new Error(
          "Backend did not return accessToken/updateToken. Check sendToken()."
        );
      }

      form.reset();

      const result = await fetchUser();
      if (result.meta.requestStatus !== "fulfilled") {
        throw new Error(
          result.payload || "Registered but failed to fetch user."
        );
      }

      toast({
        title: "Registration Successful",
        description: "Welcome aboard!",
      });

      navigate("/", { replace: true });
    } catch (error) {
      console.error(
        "Error during registration:",
        error.response?.data || error.message
      );

      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <FormHeader
        heading={
          <span className="text-[2.5rem] leading-[3rem] font-semibold tracking-wide">
            Register
          </span>}/>
      <div className="px-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        className="dark:border-gray-100 border-gray-900 bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-900 dark:placeholder:text-gray-100"
                        placeholder="First Name"
                        {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        className="dark:border-gray-100 border-gray-900 bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-900 dark:placeholder:text-gray-100"
                        placeholder="Last Name"
                        {...field}/>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="dark:border-gray-100 border-gray-900 bg-gray-200 dark:bg-zinc-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-900 dark:placeholder:text-gray-100"
                      placeholder="Email"
                      {...field}/>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div
                      className="
            flex items-stretch overflow-hidden rounded-md
            border border-gray-900 dark:border-gray-100
            bg-gray-200 dark:bg-zinc-700
            focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2
            focus-within:ring-offset-background dark:focus-within:ring-offset-dark-background">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                        className="
              flex-1 border-0 rounded-none bg-transparent
              text-gray-900 dark:text-gray-100 dark:bg-zinc-700
              placeholder:text-gray-900 dark:placeholder:text-gray-100
              focus-visible:ring-0 focus-visible:ring-offset-0"/>
                      <Button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="
              px-4 bg-red-600 hover:bg-red-700 dark:bg-red-600 
              dark:hover:bg-red-700 text-white
              border-l border-gray-900 dark:border-gray-100
              flex items-center justify-center"
                        aria-label={ showPassword ? "Hide password" : "Show password" }>
                        {showPassword ? (
                          <EyeOff className="h-5 w-5"/>
                        ) : (
                          <Eye className="h-5 w-5"/>
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div
                      className="
            flex items-stretch overflow-hidden rounded-md border 
            border-gray-900 dark:border-gray-100 bg-gray-200 dark:bg-zinc-700
            focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2
            focus-within:ring-offset-background dark:focus-within:ring-offset-dark-background">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        {...field}
                        className="
              flex-1 border-0 rounded-none bg-transparent
              text-gray-900 dark:text-gray-100 dark:bg-zinc-700
              placeholder:text-gray-900 dark:placeholder:text-gray-100
              focus-visible:ring-0 focus-visible:ring-offset-0"/>
                      <Button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="
              px-4 bg-red-600 hover:bg-red-700 dark:bg-red-600 
              dark:hover:bg-red-700 text-white border-l border-gray-900 
              dark:border-gray-100 flex items-center justify-center"
                        aria-label={ showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5"/>
                        ) : (
                          <Eye className="h-5 w-5"/>
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )}/>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Register as</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}>
                        <SelectTrigger
                          className="
      w-full text-gray-900 dark:text-gray-100
      border-gray-900 dark:border-gray-100
      bg-gray-200 dark:bg-zinc-700
      hover:bg-red-600 hover:text-white
      dark:hover:bg-red-600 dark:hover:text-white">
                          <SelectValue placeholder="Select Role"/>
                        </SelectTrigger>
                        <SelectContent
                          className="
      bg-gray-200 dark:bg-zinc-800 border 
      border-gray-900 dark:border-gray-100
      text-gray-900 dark:text-gray-100 shadow-lg">
                          <SelectItem
                            value="User"
                            className=" cursor-pointer hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white">
                            User
                          </SelectItem>
                          <SelectItem
                            value="DeliveryDriver"
                            className="cursor-pointer hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white">
                            Delivery Driver
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}/>

              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => {
                  const fileName = field.value?.name || "No file chosen";

                  return (
                    <FormItem>
                      <FormLabel>Profile Picture</FormLabel>
                      <FormControl>
                        <label
                          className="
              group flex items-center w-full h-10 px-3 gap-3
              rounded-md border border-gray-900 dark:border-gray-100
              bg-gray-200 dark:bg-zinc-700
              text-gray-900 dark:text-gray-100
              cursor-pointer overflow-hidden transition-colors
              hover:bg-red-600 dark:hover:bg-red-600">
                          <span className="font-medium shrink-0 group-hover:text-white">Choose File</span>
                          <span
                            className="truncate text-gray-900 dark:text-gray-100 group-hover:text-white">
                            {fileName}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              field.onChange(e.target.files?.[0])
                            }/>
                        </label>
                      </FormControl>
                      <FormMessage/>
                    </FormItem>
                  );
                }}/>
            </div>

            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}/>
                    <FormLabel htmlFor="acceptTerms" className="text-sm">
                      I accept the terms and conditions
                    </FormLabel>
                  </div>
                  <FormMessage/>
                </FormItem>
              )}/>

            <Button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-gray-900 dark:border-gray-100 bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 transition-colors">
              {loading ? <LoaderCircle className="animate-spin"/> : "Register"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}