import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "@/App";
import HomePageLayout from "@/layout/HomePageLayout";
import LogInRegisterLayout from "@/layout/LogInRegisterLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import AppointPackageLayout from "@/layout/AppointPackageLayout";
import UpdateAppointedPackageLayout from "@/layout/UpdateAppointedPackageLayout";
import AppointedPackagesLayout from "@/layout/AppointedPackagesLayout";
import PackagesLayout from "@/layout/PackagesLayout";
import UsersLayout from "@/layout/UsersLayout";
import DeliveryDriversLayout from "@/layout/DeliveryDriversLayout";
import DeliveriesLayout from "@/layout/DeliveriesLayout";
import PackageStatusLayout from "@/layout/PackageStatusLayout";
import RatingsLayout from "@/layout/RatingsLayout";
import PaymentLayout from "@/layout/PaymentLayout";
import PackageTrackingLayout from "@/layout/PackageTrackingLayout";
import AboutLayout from "@/layout/AboutLayout";
import ContactLayout from "@/layout/ContactLayout";
import PaymentComplete from "@/components/PaymentComplete";
import Private from "@/components/Private";
import useAuth from "@/hooks/useAuth";

function DashboardIndexRedirect() {
  const { user } = useAuth();

  const authUser = user?.user ?? user ?? null;
  const role = authUser?.role;

  if (role === "DeliveryDriver") { return <Navigate to="deliveries" replace/>; }
  if (role === "Agent") { return <Navigate to="all-packages" replace/>; }

  return <Navigate to="appointed-packages" replace/>;
}

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route index element={<HomePageLayout/>}/>
          <Route path="signin-signup" element={<LogInRegisterLayout/>}/>
          <Route path="payment" element={<Private allowedRoles={["User"]}><PaymentLayout/></Private>}/>
          <Route path="payment-complete" element={<Private allowedRoles={["User"]}><PaymentComplete/></Private>}/>
          <Route path="track/:packageId" element={<PackageTrackingLayout/>}/>
          <Route path="about" element={<AboutLayout/>}/>
          <Route path="contact" element={<ContactLayout/>}/>
        </Route>

        <Route path="/dashboard" element={ <Private allowedRoles={["Agent", "User", "DeliveryDriver"]}><DashboardLayout/></Private>}>
          <Route index element={<DashboardIndexRedirect/>}/>
          <Route path="appoint-package" element={<Private allowedRoles={["User"]}><AppointPackageLayout/></Private>}/>
          <Route path="appointed-packages" element={<Private allowedRoles={["User"]}><AppointedPackagesLayout/></Private>}/>
          <Route path="update-appointed-package/:id" element={<Private allowedRoles={["User"]}><UpdateAppointedPackageLayout/></Private>}/>
          
          <Route path="all-packages" element={<Private allowedRoles={["Agent"]}><PackagesLayout/></Private>}/>
          <Route path="all-users" element={<Private allowedRoles={["Agent"]}><UsersLayout/></Private>}/>
          <Route path="all-delivery-drivers" element={<Private allowedRoles={["Agent"]}><DeliveryDriversLayout/></Private>}/>
          <Route path="package-stats" element={<Private allowedRoles={["Agent"]}><PackageStatusLayout/></Private>}/>

          <Route path="deliveries" element={<Private allowedRoles={["DeliveryDriver"]}><DeliveriesLayout/></Private>}/>
          <Route path="ratings" element={<Private allowedRoles={["DeliveryDriver"]}><RatingsLayout/></Private>}/>

          <Route path="*" element={<DashboardIndexRedirect/>}/>
        </Route>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}