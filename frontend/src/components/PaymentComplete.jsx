import ConfettiExplosion from "react-confetti-explosion";

const PaymentComplete = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <ConfettiExplosion
        force={0.8}
        duration={3000}
        particleCount={220}
        width={1500}/>

      <h2 className="mt-6 text-5xl md:text-6xl font-extrabold text-red-600 tracking-tight">
        Payment Complete!
      </h2>

      <p className="mt-4 text-xl md:text-2xl text-gray-900 dark:text-gray-100">
        Thank you and have a nice day!
      </p>
    </div>
  );
};

export default PaymentComplete;