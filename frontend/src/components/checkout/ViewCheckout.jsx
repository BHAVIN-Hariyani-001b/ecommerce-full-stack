import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import CheckOutOrderItem from "./CheckOutOrderItem";

const ViewCheckOut = ({ checkOut, setCheckOut }) => {
  const address = useSelector((state) => state?.address?.Address[0]);
  const user = useSelector((state) => state.auth.user);
  const { items } = useSelector((state) => state.cart);
  const [showAddress, setShowAddress] = useState(false);
  const [showOrder, setshowOrder] = useState(false);
  console.log(items);

  useEffect(() => {
    if (!checkOut) return;
  }, [checkOut]);

  const capitalized = (item) => item.charAt(0).toUpperCase() + item.slice(1);

  return (
    <div className="overflow-scroll h-130 scrollbar-none grid grid-cols-2 gap-3 p-2 max-[900px]:flex max-[900px]:flex-col">
      <div className="max-[900px] space-y-5">
        <div className="space-y-3 w-full bg-gray-100 p-4 rounded-2xl">
          <div
            className="text-xl flex items-center justify-between cursor-pointer duration-200 ease-in-out "
            onClick={() => setShowAddress(!showAddress)}
          >
            <h1 className="">Delivery Address</h1>
            <IoIosArrowDown
              className={`duration-200 ${showAddress ? "rotate-180" : "rotate-360"}`}
            />
          </div>

          {showAddress && (
            <div className="space-y-2">
              <p>Delivery To : </p>
              <div className="space-x-3">
                <span>{capitalized(address?.userfullname)}</span>
                <span className="bg-white px-2 py-0.5 rounded">
                  {address?.location_type.toUpperCase()}
                </span>
              </div>
              <p>{`${address?.street_area}, ${address?.city}, ${address?.state}, ${address?.pin_code}`}</p>
              <p>{user?.phone}</p>
            </div>
          )}
        </div>
        <div className="space-y-3 w-full bg-gray-100 p-4 rounded-2xl">
          <div
            className="text-xl flex items-center justify-between cursor-pointer duration-400 ease-in-out "
            onClick={() => setshowOrder(!showOrder)}
          >
            <h1 className="">Product Order</h1>
            <IoIosArrowDown
              className={`duration-200 ${showOrder ? "rotate-180" : "rotate-360"}`}
            />
          </div>

          {showOrder &&
            items.map((item) => (
              <CheckOutOrderItem key={item.id} item={item} />
            ))}
        </div>
        <div className="space-y-3 w-full bg-gray-100 p-4 rounded-2xl">
          <div className="text-xl flex items-center justify-between cursor-pointer duration-200 ease-in-out">
            <h1 className="">Payment Methods</h1>
          </div>
          <div>

          </div>
        </div>
      </div>
      <div>
        
      </div>
    </div>
  );
};

export default ViewCheckOut;
