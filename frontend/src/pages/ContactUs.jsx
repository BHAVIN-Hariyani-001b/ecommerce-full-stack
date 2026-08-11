import { useState } from "react";
import { useNavigate,NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import {
  PiEnvelopeSimple,
  PiPhone,
  PiMapPinLine,
  PiClock,
  PiInstagramLogo,
  PiFacebookLogo,
  PiTwitterLogo,
  PiPaperPlaneTilt,
  PiArrowLeft,
} from "react-icons/pi";

// Swap these for your real details.
const CONTACT_INFO = [
  { icon: PiEnvelopeSimple, label: "Email", value: "support@yourbrand.com", href: "mailto:support@yourbrand.com" },
  { icon: PiPhone, label: "Phone", value: "+1 (555) 010-2030", href: "tel:+15550102030" },
  { icon: PiMapPinLine, label: "Address", value: "123 Market Street, San Francisco, CA" },
  { icon: PiClock, label: "Support hours", value: "Mon–Sun, 8am – 10pm" },
];

const SOCIALS = [
  { icon: PiInstagramLogo, href: "#", label: "Instagram" },
  { icon: PiFacebookLogo, href: "#", label: "Facebook" },
  { icon: PiTwitterLogo, href: "#", label: "Twitter" },
];

const initialForm = { name: "", email: "", subject: "", message: "" };

const ContactUs = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setSubmitting(true);
    try {
      // TODO: replace with your actual API call, e.g.
      // await dispatch(sendContactMessageAPI(form)).unwrap();
      await new Promise((resolve) => setTimeout(resolve, 600));
      toast.success("Message sent — we'll get back to you soon.");
      setForm(initialForm);
    } catch (err) {
      toast.error(err?.message || "Couldn't send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <PiArrowLeft className="text-base" />
        <span>Back</span>
      </button>

      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-gray-900">
          Get in touch
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
          Questions about an order, a partnership idea, or just feedback —
          we'd like to hear it.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Info column */}
        <div className="md:col-span-2 space-y-4">
          {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
            <div
              key={label}
              className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Icon className="text-base text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-mono text-gray-400 uppercase tracking-wide">
                  {label}
                </p>
                {href ? (
                  <NavLink
                    href={href}
                    className="text-sm text-gray-800 hover:text-blue-600 transition-colors break-words"
                  >
                    {value}
                  </NavLink>
                ) : (
                  <p className="text-sm text-gray-800">{value}</p>
                )}
              </div>
            </div>
          ))}

          <div className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm">
            <p className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-2">
              Follow us
            </p>
            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <NavLink
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
                >
                  <Icon className="text-base" />
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Form column */}
        <div className="md:col-span-3 border border-gray-200 rounded-2xl p-6 bg-white shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jane@email.com"
                  className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Order issue, partnership, feedback..."
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us what's going on..."
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 text-sm font-medium text-white bg-blue-600 rounded-full px-5 py-2.5 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PiPaperPlaneTilt className="text-base" />
              {submitting ? "Sending..." : "Send message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;