import Template from "../components/Template";
import TrackPackage from "../components/PackageTracking";
import GradientEffect from "../components/helpers/GradientEffect";
import { TypeAnimation } from "react-type-animation";

export default function HighlightsTemplate() {
  return (
    <Template className="!my-10 relative">
      <div className="flex flex-col tablet-lg:flex-col-reverse lg:flex-row items-center lg:items-stretch gap-10">
        <div className="w-full lg:basis-1/2 flex flex-col justify-center gap-5 px-4 sm:px-10">
          <h1 className="text-[34px] sm:text-[45px] font-semibold leading-tight text-gray-900 dark:text-gray-100">
            Manage Packages With Ease
          </h1>

          <h5 className="text-[16px] sm:text-[18px] leading-relaxed text-gray-900 dark:text-gray-100 max-w-[720px]">
            Simplify package tracking, accelerate and manage deliveries effortlessly with us.
            DHL – Connecting people around the world.
          </h5>

          <TypeAnimation
            sequence={[
              "Track your deliveries in real time.",
              1000,
              "Improve delivery management.",
              1000,
              "Deliver with confidence.",
              1000,
            ]}
            wrapper="h5"
            speed={50}
            repeat={Infinity}
            className="text-[16px] sm:text-[18px] font-semibold !text-gray-900 dark:!text-gray-100"/>

          <div className="mt-2 w-full max-w-[760px]">
            <TrackPackage/>
          </div>
        </div>

        <div className="w-full lg:basis-1/2 px-4 sm:px-10 flex justify-center lg:justify-end">
          <img
            src="/highlights.png"
            alt="Highlights Image"
            className="
              w-full max-w-[520px] sm:max-w-[620px]
              object-contain
              scale-100 sm:scale-[1.05] lg:scale-[1.10]
              translate-x-0 lg:translate-x-[10%]"/>
        </div>
      </div>

      <GradientEffect/>
    </Template>
  );
}