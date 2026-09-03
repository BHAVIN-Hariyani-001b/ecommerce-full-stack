import { useCallback, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import CheckOutOrderItem from "./CheckOutOrderItem";
import AddressManage from "./AddressManage";
import BillDetails from "../cart/BillDetails";
import { setIsUpdateAddress } from "../../features/userAddress/userAddressSlice";
import Modal from "../common/Modal";
import AddressDetails from "../profile/AddressDetails";

const ViewCheckOut = ({ checkOut, setCheckOut }) => {
  const { items } = useSelector((state) => state.cart);
  const [showOrder, setshowOrder] = useState(false);
  const { finalPrice } = useSelector((state) => state.cart);
  console.log(items);

  const [addressDetail, setAddressDetail] = useState(false);
  const dispatch = useDispatch();

  const handeleOpenAddressDetails = useCallback(
    () => setAddressDetail(true),
    [],
  );

  const handeleCloseAddressDetails = useCallback(
    () => {
      dispatch(setIsUpdateAddress(false));
      setAddressDetail(false);
    },
    [dispatch],
    [],
  );

  useEffect(() => {
    if (!checkOut) return;
  }, [checkOut]);

  return (
    <div className="overflow-scroll h-130 scrollbar-none grid grid-cols-2 gap-3 p-2 max-[900px]:flex max-[900px]:flex-col max-[900px]:overflow-auto">
      <div className="max-[900px] space-y-5 min-[900px]:overflow-auto scrollbar-none">
        <AddressManage handeleOpenAddressDetails={handeleOpenAddressDetails} />
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
          <div></div>
        </div>
      </div>

      <div className="space-y-3 w-full bg-gray-100 p-4 rounded-2xl">
        <h1 className="text-[18px] font-semibold">Price Details</h1>
        <div className="space-y-3">
          <BillDetails />
          <div className="flex w-full h-20 p-3">
            <div className="flex p-4 justify-between items-center w-full bg-white rounded-xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
              <p>
                <span className="text-gray-800">Order total</span>{" "}
                <span className="font-bold">&#8377;{finalPrice}</span>{" "}
              </p>
              <button className="bg-green-600 w-30 rounded-full text-white h-10 cursor-pointer">
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={addressDetail}
        onClose={handeleCloseAddressDetails}
        title="Address"
        width={"max-[900px]:h-160 overflow-y-auto max-h-190 scrollbar-none"}
      >
        <AddressDetails
          handeleCloseAddressDetails={handeleCloseAddressDetails}
        />
      </Modal>
    </div>
  );
};

export default ViewCheckOut;
