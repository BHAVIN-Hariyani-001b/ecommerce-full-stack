import { memo } from "react";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { MdOutlineMail, MdOutlinePhone } from "react-icons/md";
import PageWapper from "./PageWapper";

const Footer = memo(function Footer() {
  // const currentYear = useMemo(() => new Date().getFullYear(), []);

  // const handleNewsletterSubmit = useCallback((e) => {
  //   e.preventDefault();
  // }, []);

  return (
    <footer className="mt-10 border-t border-gray-200 bg-white max-[600px]:hidden">
      <PageWapper className="mx-auto px-6 max-[1000px]:px-10 max-[600px]:px-6 bg-white">
        <div className="grid grid-cols-12 gap-8 py-10">
          <div className="col-span-12 md:col-span-5">
            <NavLink to="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8685ef]/15 flex items-center justify-center">
                <span className="text-[#8685ef] font-bold text-lg">V</span>
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-[#2b2f3a]">Venture</p>
                <p className="text-sm text-[#586274]">
                  Fast delivery, best prices, trusted products.
                </p>
              </div>
            </NavLink>

            <div className="mt-5 flex flex-col gap-2 text-sm text-[#586274] max-w-fit">
              <div className="flex items-center gap-2 max-w-fit">
                <MdOutlineMail className="text-lg" />
                <span>venture@ecommerce.com</span>
              </div>
              <div className="flex items-center gap-2 max-w-fit">
                <MdOutlinePhone className="text-lg" />
                <span>+91 9724372117</span>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 max-w-fit">
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

          <div className="col-span-6 md:col-span-2 max-w-fit">
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

          <div className="col-span-6 md:col-span-2 max-w-fit">
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
        </div>
      </PageWapper>
    </footer>
  );
});

export default Footer;
