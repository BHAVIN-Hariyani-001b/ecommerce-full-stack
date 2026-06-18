import { memo, useCallback, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { MdOutlineMail, MdOutlinePhone } from "react-icons/md";
import PageWapper from "./PageWapper";

const Footer = memo(function Footer() {
  const { pathname } = useLocation();
  const isCompact = useMemo(() => pathname === "/search", [pathname]);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const handleNewsletterSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <footer className="mt-10 border-t border-gray-200 bg-white">
      <PageWapper className="mx-auto px-6 max-[1000px]:px-10 max-[600px]:px-6 bg-white">
        {!isCompact && (
          <div className="grid grid-cols-12 gap-8 py-10">
            <div className="col-span-12 md:col-span-5">
              <NavLink to="/" className="inline-flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#8685ef]/15 flex items-center justify-center">
                  <span className="text-[#8685ef] font-bold text-lg">E</span>
                </div>
                <div className="leading-tight">
                  <p className="font-semibold text-[#2b2f3a]">Ecommerce</p>
                  <p className="text-sm text-[#586274]">
                    Fast delivery, best prices, trusted products.
                  </p>
                </div>
              </NavLink>

              <div className="mt-5 flex flex-col gap-2 text-sm text-[#586274]">
                <p className="flex items-center gap-2">
                  <MdOutlineMail className="text-lg" />
                  <span>support@ecommerce.com</span>
                </p>
                <p className="flex items-center gap-2">
                  <MdOutlinePhone className="text-lg" />
                  <span>+91 00000 00000</span>
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-[#586274] hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-[#586274] hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-[#586274] hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  aria-label="Twitter"
                >
                  <FaTwitter />
                </a>
              </div>
            </div>

            <div className="col-span-6 md:col-span-2">
              <p className="font-semibold text-[#2b2f3a]">Shop</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-[#586274]">
                <NavLink to="/" className="hover:text-[#2b2f3a]">
                  Home
                </NavLink>
                <NavLink to="/search" className="hover:text-[#2b2f3a]">
                  Search
                </NavLink>
              </div>
            </div>

            <div className="col-span-6 md:col-span-2">
              <p className="font-semibold text-[#2b2f3a]">Help</p>
              <div className="mt-3 flex flex-col gap-2 text-sm text-[#586274]">
                <a href="#" className="hover:text-[#2b2f3a]">
                  Shipping
                </a>
                <a href="#" className="hover:text-[#2b2f3a]">
                  Returns
                </a>
                <a href="#" className="hover:text-[#2b2f3a]">
                  Support
                </a>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3">
              <p className="font-semibold text-[#2b2f3a]">Get updates</p>
              <p className="mt-3 text-sm text-[#586274]">
                New products and offers in your inbox.
              </p>
              <form className="mt-4 flex gap-2" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#8685ef]/30"
                  placeholder="Email address"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#8685ef] text-white px-4 py-2 font-medium hover:opacity-95 active:opacity-90 transition-opacity"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-[#586274]">
          <p>© {currentYear} Ecommerce. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-[#2b2f3a]">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#2b2f3a]">
              Terms
            </a>
          </div>
        </div>
      </PageWapper>
    </footer>
  );
});

export default Footer;
