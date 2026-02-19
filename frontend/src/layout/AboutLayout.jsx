const AboutLayout = () => {
  return (
    <div>
      <div className="border-b border-gray-900 dark:border-gray-100 relative bg-primary py-20 text-center text-primary-foreground dark:text-dark-primary-foreground">
        <h1 className="text-5xl font-bold mb-4">About DHL</h1>
        <p className="text-xl max-w-2xl mx-auto">
          Delivering trust, speed, and reliability to every doorstep.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-semibold mb-6">About The Company</h2>
        <p className="mt-4 text-lg">
          DHL is a German based delivery company dedicated to providing{" "}
          <span className="font-semibold">fast, secure, and cost effective</span>{" "}
          package deliveries. Whether you're an individual or private business,
          we ensure <span className="font-semibold">safe and secure delivery</span>{" "}
          with real time tracking.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-4 pb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-foreground border-2 border-gray-900 dark:border-gray-100 shadow-2xl p-8 rounded-xl hover:shadow-3xl transition">
          <h2 className="text-2xl font-semibold mb-4">Ideals</h2>
          <p className="mt-2 text-gray-900 dark:text-gray-100">
            Revolutionizing package delivery with{" "}
            <span className="font-semibold">real time tracking</span>,{" "}
            <span className="font-semibold">secure handling</span>, and{" "}
            <span className="font-semibold">cheap prices</span>. We believe in
            affordable delivery with{" "}
            <span className="font-semibold">efficient and reliable</span> packaging.
          </p>
        </div>

        <div className="bg-white dark:bg-foreground border-2 border-gray-900 dark:border-gray-100 shadow-2xl p-8 rounded-xl hover:shadow-3xl transition">
          <h2 className="text-2xl font-semibold mb-4">Company Values</h2>
          <ul className="mt-2 space-y-3 text-gray-900 dark:text-gray-100">
            <li>✅ <span className="font-semibold">Speed & Efficiency</span> - Timely deliveries.</li>
            <li>✅ <span className="font-semibold">Customer Priority</span> - Best experience.</li>
            <li>✅ <span className="font-semibold">Secure Deliveries</span> - Careful handling.</li>
            <li>✅ <span className="font-semibold">Guaranteed Arrival</span> - Reliable logistics.</li>
          </ul>
        </div>
      </div>
    <div className="h-[0.5px] w-full bg-gray-900 dark:bg-gray-100"/>
      <div className="bg-primary py-16 border-b border-gray-900 dark:border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-semibold mb-10 text-primary-foreground">
            Why Choose DHL?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
            {[
              { icon: "🚚", title: "Fast Deliveries", text: "Express deliveries with real time tracking." },
              { icon: "📦", title: "Secure Handling", text: "Packages handled with maximum safety." },
              { icon: "💶", title: "Cheap Prices", text: "Affordable worldwide shipping." },
            ].map((item, i) => (
              <div
                key={i}
                className="
                  bg-yellow-400 dark:bg-yellow-400
                  border-[3px] border-gray-100
                  p-8 rounded-xl dark:border-gray-100
                  shadow-[0_15px_40px_rgba(0,0,0,0.4)]
                  hover:shadow-[0_25px_60px_rgba(0,0,0,0.55)]
                  hover:-translate-y-1
                  transition">
                    
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center text-2xl shadow-lg">
                    {item.icon}
                  </div>
                </div>

                <h3 className="text-xl font-extrabold text-red-700">
                  {item.title}
                </h3>

                <p className="mt-2 text-red-700 font-semibold">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl font-semibold mb-6">The Team</h2>
        <p className="mt-4 text-lg">
          We are a team of{" "}
          <span className="font-semibold">
            expert tech innovators with customer service experience
          </span>
          , working together to simplify secure package delivery.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { img: "ceo.jpg", firstName: "Michael", lastName: "Myers", role: "Founder - CEO" },
            { img: "manager.jpg", firstName: "Jason", lastName: "Voorhees", role: "Operations Manager" },
            { img: "webdev.jpg", firstName: "Freddy", lastName: "Krueger", role: "Website Developer" },
          ].map((member, i) => (
            <div
              key={i}
              className="bg-white dark:bg-foreground border-2 border-gray-900 dark:border-gray-100 shadow-2xl p-6 rounded-xl hover:shadow-3xl hover:-translate-y-1 transition">
              <img
                src={member.img}
                alt={`${member.firstName} ${member.lastName}`}
                className="w-32 h-32 mx-auto rounded-full object-cover border-[0.1875rem] border-primary"/>
              <h3 className="mt-6 text-xl font-semibold">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-gray-900 dark:text-gray-100">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
     <div className="h-[1px] w-full bg-gray-900 dark:bg-gray-100"/>
      <div className="bg-primary text-center py-16">
        <h2 className="text-4xl font-semibold text-primary-foreground">
          Have packages that need delivering?
        </h2>
        <p className="mt-4 text-lg text-primary-foreground">
          Get started today with{" "}
          <span className="font-semibold">fast, secure and cheap</span> deliveries.
        </p>
      </div>
    </div>
  );
};

export default AboutLayout;