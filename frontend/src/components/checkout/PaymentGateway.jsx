import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import BillDetails from "../cart/BillDetails";
import { TbCashBanknote } from "react-icons/tb";
import { useSelector } from "react-redux";

const PaymentGateway = ({ setAction }) => {
  const { finalPrice } = useSelector((state) => state.cart);

  return (
    <div className="space-y-3">
      <div className="overflow-scroll h-130 scrollbar-none grid grid-cols-2 gap-3 p-2 max-[900px]:flex max-[900px]:flex-col max-[900px]:overflow-auto">
        <div className="p-4 bg-gray-100 rounded-2xl space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div>
              <button
                className="hover:bg-gray-300 duration-400 group bg-white cursor-pointer gap-1 flex items-center justify-center px-2 py-1 rounded-full border border-gray-200"
                onClick={() => setAction("order")}
              >
                <IoIosArrowBack
                  size={16}
                  className="group-hover:-translate-x-1 duration-500"
                />
                <span>Back</span>
              </button>
            </div>
            <span className="text-xl">Select Payment Option</span>
          </div>
          <div className="flex flex-col justify-center gap-3">
            <div className="flex gap-2 items-center bg-white border border-gray-300 rounded-full p-5 cursor-pointer">
              <img
                src="../../../public/image/UPI.png"
                alt="upi"
                className="w-10"
              />
              <div className="flex flex-col">
                <span>Pay by any UPI app</span>
              </div>
            </div>
            <div className="flex gap-2 items-center bg-white border border-gray-300 rounded-full p-5 cursor-pointer">
              <div className="flex gap-2">
                <img
                  src="../../../public/image/visa.png"
                  alt="visa"
                  className="w-6 object-contain"
                />
                <img
                  src="../../../public/image/mastercard.png"
                  alt="visa"
                  className="w-6 object-contain"
                />
                <img
                  src="../../../public/image/rupay.png"
                  alt="visa"
                  className="w-6 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span>Card</span>
              </div>
            </div>
            <div className="flex gap-2 items-center bg-white border border-gray-300 rounded-full p-5 cursor-pointer">
              <TbCashBanknote size={25} className="text-gray-600" />
              <div className="flex flex-col">
                <span>Cash On Delivery</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-100 rounded-2xl p-4 space-y-2">
          <p className="text-xl p-2">Price Details</p>
          <BillDetails />
          <div className="flex w-full h-20 p-3">
            <div className="flex p-4 justify-between items-center w-full bg-white rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
              <p>
                <span className="text-gray-800">Order total</span>{" "}
                <span className="font-bold">&#8377;{finalPrice}</span>{" "}
              </p>
              <button
                className="bg-green-600 w-30 rounded-full text-white h-10 cursor-pointer"
                onClick={() => setAction("payment")}
              >
                CheckOut
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
