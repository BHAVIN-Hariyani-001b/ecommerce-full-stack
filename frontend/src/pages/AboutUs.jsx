import { NavLink, useNavigate } from "react-router-dom";
import {
  PiTruck,
  PiMapPin,
  PiClock,
  PiStorefront,
  PiHeartStraight,
  PiUsersThree,
  PiTarget,
  PiArrowLeft,
} from "react-icons/pi";

// Single spot to edit — swap in your real brand name.
const BRAND_NAME = "Your Brand";

const STATS = [
  { icon: PiStorefront, value: "1,200+", label: "Partner restaurants" },
  { icon: PiMapPin, value: "40+", label: "Cities served" },
  { icon: PiClock, value: "28 min", label: "Avg. delivery time" },
  { icon: PiTruck, value: "2M+", label: "Orders delivered" },
];

const VALUES = [
  {
    icon: PiTruck,
    title: "Speed you can count on",
    description:
      "We route every order to the nearest available rider so your food arrives while it's still hot — not just fast, but reliably fast.",
  },
  {
    icon: PiHeartStraight,
    title: "Trust, built order by order",
    description:
      "Transparent pricing, real order tracking, and a support team that actually picks up. No surprises between checkout and your door.",
  },
  {
    icon: PiUsersThree,
    title: "Community first",
    description:
      "Every order supports a local kitchen and the rider who brought it to you. Growth here means growth for the people we work with.",
  },
];

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
      >
        <PiArrowLeft className="text-base" />
        <span>Back</span>
      </button>

      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 text-sm font-mono text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
          <PiTarget className="text-base" />
          <span>About {BRAND_NAME}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold text-gray-900 leading-tight">
          Good food, delivered like it matters.
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
          {BRAND_NAME} started with a simple idea: getting a great meal from a
          local kitchen to your table shouldn't be complicated, slow, or
          impersonal. So we built the platform we wished existed.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {STATS.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="border border-gray-200 rounded-2xl p-4 text-center bg-white shadow-sm"
          >
            <Icon className="text-2xl text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-semibold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 bg-white shadow-sm space-y-3">
        <h2 className="text-xl font-serif font-semibold text-gray-900">
          Our story
        </h2>
        <p className="text-gray-600 leading-relaxed">
          We started in a single neighborhood, partnering with the kitchens
          people already trusted and asking one question after every
          delivery: was that fast, fair, and easy? A few years and a few
          thousand answers later, {BRAND_NAME} runs in dozens of cities — but
          the question hasn't changed.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Today that means real-time order tracking, transparent delivery
          fees, and a referral program that rewards the people who've helped
          us grow the most: our customers.
        </p>
      </div>

      {/* Values */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-semibold text-gray-900 text-center">
          What we stand for
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {VALUES.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm space-y-2"
            >
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon className="text-lg text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border border-gray-200 rounded-2xl p-6 sm:p-8 bg-gray-50 text-center space-y-3">
        <h2 className="text-lg font-serif font-semibold text-gray-900">
          Have a question we didn't answer here?
        </h2>
        <p className="text-sm text-gray-500">
          Our team is happy to help — reach out anytime.
        </p>
        <NavLink
          href="/contact"
          className="inline-block text-sm font-medium text-white bg-blue-600 rounded-full px-5 py-2 hover:bg-blue-700 transition-colors"
        >
          Contact us
        </NavLink>
      </div>
    </div>
  );
};

export default AboutUs;