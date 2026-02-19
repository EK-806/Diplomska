import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import Template from "../components/Template";

export default function Footer() {
  return (
    <Template className="bg-base-200 border-t border-black dark:border-gray-100">
      <div className="flex justify-between py-10 mobile-lg:flex-col mobile-lg:justify-center mobile-lg:gap-10">
        <div className="flex flex-col basis-1/3 items-center gap-2 order-1 mobile-lg:order-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mobile-lg:justify-center">
              <FaPhoneAlt className="text-lg"/>
              <span>+389 77 871 376</span>
            </div>

            <div className="flex items-center gap-2 mobile-lg:justify-center">
              <FaEnvelope className="text-lg"/>
              <span>info@fikt.edu.mk</span>
            </div>

            <div className="flex items-center gap-2 mobile-lg:justify-center mobile-lg:text-center mobile-lg:px-4">
              <FaMapMarkerAlt className="text-lg"/>
              <span>St. Partizanska, nn 7000 Bitola</span>
            </div>
          </div>
        </div>

        <div className="basis-1/3 flex flex-col gap-4 items-center text-center order-2 mobile-lg:order-1">
          <Link to="/">
            <img className="h-16" src="/logo.png" alt="logo"/>
          </Link>
          <h5 className="w-4/5 text-lg font-semibold">
            We offer world wide delivery services
          </h5>
        </div>

        <div className="basis-1/3 flex flex-col gap-4 text-right items-end order-3 mobile-lg:items-center mobile-lg:text-center">
          <strong className="text-xl">Have any questions?</strong>
          <p className="max-w-md text-balance">
            Then please contact us in the contact section and we&apos;ll help
            you out with whatever it is you need.
          </p>
        </div>
      </div>
      <hr className="my-6 h-[2px] bg-gray-900 dark:bg-gray-100 border-0"/>
      <div className="text-center my-5">
        <p>@2026 DHL Diplomska | All Rights Reserved.</p>
      </div>
    </Template>
  );
}