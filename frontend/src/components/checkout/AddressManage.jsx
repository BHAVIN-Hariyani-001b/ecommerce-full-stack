import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
import Modal from "../common/Modal";
import {
  GetUserAddress,
  UpdateUserAddress,
} from "../../features/userAddress/userAddressThunk";
import { setPrimaryAddress } from "../../features/userAddress/userAddressSlice";
import { MdOutlineAddLocationAlt } from "react-icons/md";

const AddressManage = ({ handeleOpenAddressDetails }) => {
  const dispatch = useDispatch();
  const UserAddress = useSelector((state) => state.address?.Address);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(setPrimaryAddress(UserAddress));
  }, [dispatch, UserAddress]);

  const address = useSelector(
    (state) => state?.address?.PrimaryAddress || state?.address?.Address[0],
  );

  const [showAddress, setShowAddress] = useState(false);
  const [changed, setChanged] = useState(false);
  const capitalized = (item) => item.charAt(0).toUpperCase() + item.slice(1);

  const handleChangeAddressOpen = useCallback((e) => {
    e.stopPropagation();
    setChanged(true);
  }, []);

  const handleChangeAddress = useCallback(
    async (id) => {
      const selectedAddress = UserAddress.find((item) => item.id === id);
      if (selectedAddress) {
        const AddressData = {
          address: selectedAddress.street_area,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pin: selectedAddress.pin_code,
          name: selectedAddress.userfullname,
          isPrimary: true,
          phone: user?.phone,
        };

        await dispatch(
          UpdateUserAddress({
            id: selectedAddress.id,
            AddressData,
            location_type: selectedAddress.location_type,
          }),
        ).unwrap();

        await dispatch(GetUserAddress(user?.id)).unwrap();
      }
    },
    [UserAddress, dispatch, user],
  );

  return (
    <div className="space-y-3 w-full bg-gray-100 p-4 rounded-2xl">
      <div
        className="text-xl flex items-center justify-between gap-2 cursor-pointer duration-200 ease-in-out "
        onClick={() => setShowAddress(!showAddress)}
      >
        <div className="flex items-center justify-between w-full space-x-3">
          <h1 className="">Delivery Address</h1>
          {UserAddress.length != 0 ? (
            <span
              className="text-blue-600 text-[16px]"
              onClick={handleChangeAddressOpen}
            >
              Change
            </span>
          ) : (
            <span
              className="text-blue-600 text-[16px]"
              onClick={handeleOpenAddressDetails}
            >
              Add Address
            </span>
          )}
        </div>
        {UserAddress.length != 0 && (
          <IoIosArrowDown
            className={`duration-200 ${showAddress ? "rotate-180" : "rotate-360"}`}
          />
        )}
      </div>

      {showAddress && UserAddress.length != 0 && (
        <div className="space-y-2">
          <p>Delivery To : </p>
          <div className="space-x-3">
            <span>{capitalized(address?.userfullname)}</span>
            <span className="bg-white px-2 py-0.5 rounded">
              {address?.location_type.toUpperCase()}
            </span>
          </div>
          <p>{`${address?.street_area}, ${address?.city}, ${address?.state}, ${address?.pin_code.slice(0, 3)} ${address?.pin_code.slice(3, 6)}`}</p>
          <p>{`${user?.phone.slice(0, 3)} ${user?.phone.slice(3, 8)} ${user?.phone.slice(8, 13)}`}</p>
        </div>
      )}

      <Modal
        open={changed}
        onClose={() => setChanged(false)}
        title="Change Address"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center group">
            <span className="h-2 w-10 rounded-full bg-gray-200 group-hover:w-0 duration-700"></span>
            <button
              className="cursor-pointer text-right bg-blue-600 hover:scale-102 hover:shadow-lg duration-200 shadow-xl text-white px-3 py-1 rounded-full flex items-center justify-center gap-2"
              onClick={handeleOpenAddressDetails}
            >
              <MdOutlineAddLocationAlt className="inline mr-2" />
              Add Address
            </button>
          </div>
          {UserAddress.map((item) => (
            <div
              key={item.id}
              className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:bg-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="space-x-3">
                  <span className="font-semibold">
                    {capitalized(item?.userfullname)}
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded">
                    {item?.location_type.toUpperCase()}
                  </span>
                </div>
                <span
                  className={`text-green-600 ${item?.isPrimary ? "opacity-100" : "opacity-0"} transition-opacity duration-600`}
                >
                  Primary
                </span>
              </div>
              <p>{`${item?.street_area}, ${item?.city}, ${item?.state}, ${item?.pin_code.slice(0, 3)} ${item?.pin_code.slice(3, 6)}`}</p>
              <div className="flex items-center justify-between">
                <p>{`${user?.phone.slice(0, 3)} ${user?.phone.slice(3, 8)} ${user?.phone.slice(8, 13)}`}</p>
                {!item?.isPrimary && (
                  <input
                    type="checkbox"
                    name="isPrimary"
                    id="UserPrimary"
                    onChange={() => handleChangeAddress(item.id)}
                    className="w-4 h-4 accent-blue-500 cursor-pointer transition-transform duration-300 hover:scale-110"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default AddressManage;
