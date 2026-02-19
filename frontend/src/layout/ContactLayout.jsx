import { useState } from "react";
import axiosApiCall from "@/lib/axiosApiCall";
import { useToast } from "@/hooks/useToast";

const ALLOWED_EMAIL_DOMAINS = [
  "@yahoo.com",
  "@gmail.com",
  "@hotmail.com",
  "@outlook.com",
  "@uklo.edu.mk",
  "@fikt.edu.mk",
  "@protonmail.com",
  "@proton.me",
];

const isAllowedEmail = (email) => {
  const e = String(email || "").trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(e)) return false;

  return ALLOWED_EMAIL_DOMAINS.some((domain) => e.endsWith(domain));
};

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

const ContactLayout = () => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "+389 7",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: formatMKPhone(value),
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.message.trim()
    ) {
      toast({
        title: "Missing fields",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    if (!isAllowedEmail(formData.email)) {
      toast({
        title: "Invalid email address",
        description:
          "Use Yahoo, Gmail, Hotmail, Outlook, UKLO, FIKT or Proton email.",
        variant: "destructive",
      });
      return;
    }

    if (!MK_PHONE_REGEX.test(formData.phoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: 'Use format: "+389 7X XXX XXX".',
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axiosApiCall.post("/api/v1/user/send", {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        message: formData.message,
      });

      if (!data?.success) {
        throw new Error(data?.message || "Failed to send message.");
      }

      toast({
        title: "Message sent!",
        description: "We will contact you as soon as possible.",
      });

      setFormData({
        name: "",
        email: "",
        phoneNumber: "+389 7",
        message: "",
      });
    } catch (err) {
      toast({
        title: "Failed to send message.",
        description:
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="transform scale-[0.9] origin-top">
        <h1 className="text-4xl font-bold dark:text-gray-100 text-gray-900">
          Contact Us
        </h1>

        <p className="text-lg mt-4 dark:text-gray-100 text-gray-900">
          Do you have any questions? Feel free to reach out, our team is happy to
          help anytime.
        </p>

        <div className="mt-6 text-left">
          <h2 className="text-xl font-semibold dark:text-gray-100 text-gray-900">
            📍 Address
          </h2>
          <p className="dark:text-gray-100 text-gray-900">
            St. Partizanska, nn 7000 Bitola
          </p>

          <h2 className="text-xl font-semibold dark:text-gray-100 text-gray-900 mt-4">
            📞 Phone
          </h2>
          <p className="dark:text-gray-100 text-gray-900">+389 77 871 376</p>

          <h2 className="text-xl font-semibold dark:text-gray-100 text-gray-900 mt-4">
            📧 Email
          </h2>
          <p className="dark:text-gray-100 text-gray-900">contact@fikt.edu.mk</p>
        </div>

        <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3.5 py-3 text-sm rounded-lg
              bg-gray-200 dark:bg-zinc-700
              border border-gray-900 dark:border-gray-100
              text-gray-900 dark:text-white
              placeholder:text-gray-900 dark:placeholder:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"/>

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3.5 py-3 text-sm rounded-lg
              bg-gray-200 dark:bg-zinc-700
              border border-gray-900 dark:border-gray-100
              text-gray-900 dark:text-white
              placeholder:text-gray-900 dark:placeholder:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"/>

          <input
            type="tel"
            name="phoneNumber"
            placeholder="+389 7X XXX XXX"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full px-3.5 py-3 text-sm rounded-lg
              bg-gray-200 dark:bg-zinc-700
              border border-gray-900 dark:border-gray-100
              text-gray-900 dark:text-white
              placeholder:text-gray-900 dark:placeholder:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"/>

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-3.5 py-3 text-sm rounded-lg
              bg-gray-200 dark:bg-zinc-700
              border border-gray-900 dark:border-gray-100
              text-gray-900 dark:text-white
              placeholder:text-gray-900 dark:placeholder:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"/>

          <button
            type="submit"
            disabled={loading}
            className="border-2 dark:border-gray-100 border-gray-900
              w-full bg-primary text-white py-2.5 rounded-lg
              hover:bg-red-700 font-semibold
              disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactLayout;