import { useState } from "react";
import FormHeader from "./helpers/FormHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "./ui/Button";
import { Input } from "./ui/InputArea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/FormArea";
import { Eye, EyeOff } from "lucide-react";
import axiosApiCall from "@/lib/axiosApiCall";
import useAuth from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().nonempty({ message: "Password required" }),
});

export default function Login() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loadingLogIn, setLoadingLogIn] = useState(false);
  const { fetchUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const togglePasswordVisibility = () => setShowPassword((s) => !s);

  const onSubmit = async (data) => {
    setLoadingLogIn(true);

    try {
      const res = await axiosApiCall.post("/api/v1/user/login", data);

      if (!res.data?.accessToken || !res.data?.updateToken) {
        throw new Error("Backend did not return accessToken/updateToken.");
      }

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("updateToken", res.data.updateToken);

      form.reset();

      const result = await fetchUser();
      if (result.meta.requestStatus !== "fulfilled") {
        throw new Error(result.payload || "Failed to fetch user after login.");
      }

      toast({ title: "Login Successful", description: "Welcome back!" });
      navigate("/", { replace: true });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingLogIn(false);
    }
  };

  return (
    <div className="p-4">
      <FormHeader
        heading={<span className="text-[2.5rem] leading-[3rem] font-semibold tracking-wide">Login</span>}/>

      <div className="px-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        px-4 bg-red-600 hover:bg-red-700 text-white
        dark:bg-red-600 dark:hover:bg-red-700 dark:text-white
        border-l border-gray-900 dark:border-gray-100
        flex items-center justify-center"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"}>
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

            <Button
              type="submit"
              disabled={loadingLogIn}
              className="w-full border-2 border-gray-900 dark:border-gray-100 bg-red-600 text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 transition-colors">
              {loadingLogIn ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}