import { IoBagHandle } from "react-icons/io5";
import { RiFileList2Fill } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { useSelector } from "react-redux";

const BillDetails = () => {
  const { basePrice, totalPrice, finalPrice, deliveryCharge, handlingCharge } =
    useSelector((state) => state.cart);
  return (
    <div>
      <div className="bg-white mx-2 p-3 rounded-xl shadow-xl">
        <div>
          <h3 className="font-semibold text-[18px] py-2">Bill Details</h3>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <div className="flex justify-center gap-2 items-center text-[14px]">
              <RiFileList2Fill size={14} />
              <div className="flex justify-center items-center space-x-2">
                <span>items total</span>
              </div>
            </div>
            <div className="space-x-2">
              <span>&#8377;{totalPrice}</span>
              <span className="line-through text-gray-400">
                &#8377;{basePrice}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex justify-center gap-2 items-center text-[14px]">
              <TbTruckDelivery size={14} />
              <div className="flex justify-center items-center space-x-2">
                <span>Delivery charge</span>
              </div>
            </div>
            <div className="space-x-2">
              <span className="text-blue-600">FREE</span>
              <span className="line-through text-gray-400">
                &#8377;{deliveryCharge}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex justify-center gap-2 items-center text-[14px]">
              <IoBagHandle size={14} />
              <div className="flex justify-center items-center space-x-2">
                <span>Handling charge</span>
              </div>
            </div>
            <div className="space-x-2">
              <span>&#8377;{handlingCharge}</span>
            </div>
          </div>
        </div>
        <div className="border-t border-dashed border-gray-200 mt-2 pt-2">
          <div className="flex justify-between">
            <span>Total</span>
            <span>&#8377;{finalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillDetails;
