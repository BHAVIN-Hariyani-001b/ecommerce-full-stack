import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  AddUserAddress,
  UpdateUserAddress,
} from "../../features/userAddress/userAddressThunk";

const AddressDetails = () => {
  const user = useSelector((state) => state.auth.user);
  const initialAddress = {
    name: user?.username ?? "",
    address: "",
    city: "",
    state: "",
    pin: "",
    phone: user?.phone ?? "",
  };

  const isUpdate = useSelector((state) => state.address?.isUpdate);

  const dispatch = useDispatch();

  const [adressInfo, setAddressInfo] = useState(initialAddress);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setAddressInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnClick = async () => {
    try {
      if (isUpdate?.id) {
        await dispatch(
          UpdateUserAddress({ id: isUpdate?.id, AddressData: adressInfo }),
        ).unwrap();
        toast.success("User Address Update Successfully");
      } else {
        await dispatch(AddUserAddress({ AddressData: adressInfo })).unwrap();
        toast.success("User Address Add Successfully");
      }
    } catch {
      toast.error("Please Try again");
    }
  };

  useEffect(() => {
    if (isUpdate?.id) {
      setAddressInfo({
        name: user?.username,
        address: isUpdate?.streetArea,
        city: isUpdate?.city,
        state: isUpdate?.state,
        pin: isUpdate?.pin_code,
        phone: user?.phone,
      });
    } else {
      setAddressInfo(initialAddress);
    }
  }, [isUpdate, user]);

  return (
    <div>
      <div>
        <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="UserName">Enter Your Full Name </label>
            <input
              type="text"
              name="name"
              id="UserName"
              value={adressInfo.name}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="UserAddress">Street address </label>
            <textarea
              type="text"
              name="address"
              id="UserAddress"
              value={adressInfo.address}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md resize-none"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="UserCity">City </label>
            <input
              type="text"
              name="city"
              id="UserCity"
              value={adressInfo.city}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="UserState">State </label>
            <input
              type="text"
              name="state"
              id="UserState"
              value={adressInfo.state}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="UserPin">Pin Code </label>
            <input
              type="number"
              name="pin"
              id="UserPin"
              value={adressInfo.pin}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md"
              onChange={handleOnChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="UserPhone">Phone number </label>
            <input
              type="text"
              name="phone"
              id="UserPhone"
              value={adressInfo.phone}
              className="border px-2 py-2 border-gray-300 outline-none rounded-md"
              onChange={handleOnChange}
            />
          </div>
          <button
            className="w-full bg-blue-500 py-2 text-white rounded-md cursor-pointer"
            onClick={handleOnClick}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressDetails;
